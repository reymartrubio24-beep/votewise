const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const csv = require('csv-parser');

// VOTING
exports.submitVote = async (req, res) => {
  const { positionId, candidateId } = req.body;
  const userId = req.user.id;
  try {
    const participation = await prisma.participation.findUnique({
      where: { userId_positionId: { userId, positionId } }
    });
    if (participation) return res.status(400).json({ error: 'Already voted' });
    const ops = [prisma.participation.create({ data: { userId, positionId } })];
    if (candidateId) ops.push(prisma.vote.create({ data: { positionId, candidateId } }));
    await prisma.$transaction(ops);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ADMIN VOTER MGMT
exports.getAllVoters = async (req, res) => {
  try {
    const voters = await prisma.user.findMany({
      where: { role: 'voter' },
      select: { id: true, studentId: true, name: true, email: true, participation: { select: { positionId: true } } }
    });
    res.json(voters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteVoter = async (req, res) => {
  const { id } = req.params;
  try {
    const voter = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!voter || voter.role === 'admin') return res.status(403).json({ error: 'Cannot delete admin' });
    
    // Cleanup votes if any
    await prisma.$transaction([
      prisma.participation.deleteMany({ where: { userId: parseInt(id) } }),
      prisma.user.delete({ where: { id: parseInt(id) } })
    ]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearAllVoters = async (req, res) => {
  try {
    // Only delete users with role 'voter'
    await prisma.$transaction([
      prisma.participation.deleteMany({ where: { user: { role: 'voter' } } }),
      prisma.user.deleteMany({ where: { role: 'voter' } })
    ]);
    res.json({ success: true, message: 'All voters cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.importVoters = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  const results = [];
  const errors = [];
  const defaultPassword = await bcrypt.hash('123', 10);
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => results.push(row))
    .on('end', async () => {
      let imported = 0;
      for (const row of results) {
        const sid = row.studentId || row.student_id;
        if (!sid) { errors.push({ row, error: 'No studentId' }); continue; }
        try {
          // Hash studentId as the default password
          const hashedPassword = await bcrypt.hash(String(sid), 10);
          await prisma.user.upsert({
            where: { studentId: String(sid) },
            update: { name: row.name, email: row.email },
            create: { studentId: String(sid), name: row.name || 'Unknown', email: row.email || `${sid}@std.edu`, password: hashedPassword, role: 'voter' }
          });
          imported++;
        } catch (err) { errors.push({ sid, error: err.message }); }
      }
      fs.unlinkSync(req.file.path);
      res.json({ imported, errors: errors.length });
    });
};

// RESULTS / STATS
exports.getPublicResults = async (req, res) => {
  try {
    const elections = await prisma.election.findMany({
      include: { positions: { include: { candidates: { include: { _count: { select: { votes: true } } } } } } }
    });
    const results = elections.map(e => ({
      ...e,
      positions: e.positions.map(p => ({
        ...p,
        candidates: p.candidates.map(c => ({ ...c, voteCount: c._count.votes }))
      }))
    }));
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const voterCount = await prisma.user.count({ where: { role: 'voter' } });
    const electionCount = await prisma.election.count({ where: { status: 'active' } });
    const totalVotes = await prisma.vote.count();
    const turnoutRaw = await prisma.participation.groupBy({ by: ['userId'] });
    const turnout = voterCount > 0 ? ((turnoutRaw.length / voterCount) * 100).toFixed(1) : '0.0';
    res.json({ voterCount, electionCount, totalVotes, turnout });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({ orderBy: { timestamp: 'desc' }, take: 100 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.exportResults = async (req, res) => {
  const { id } = req.params;
  try {
    const election = await prisma.election.findUnique({
      where: { id: parseInt(id) },
      include: { positions: { include: { candidates: { include: { _count: { select: { votes: true } } } } } } }
    });
    let csvStr = 'Position,Candidate,Votes\n';
    election.positions.forEach(p => p.candidates.forEach(c => {
      csvStr += `"${p.title}","${c.name}",${c._count.votes}\n`;
    }));
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=results.csv');
    res.send(csvStr);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
