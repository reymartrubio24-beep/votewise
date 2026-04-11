const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

// AUTH
exports.login = async (req, res) => {
  const { studentId: loginInput, password } = req.body;
  try {
    // Search by studentId OR by name (last name)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { studentId: loginInput },
          { name: { contains: loginInput } }
        ]
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid password' });

    // Restriction for voters: Can only login if there's an active running election
    if (user.role === 'voter') {
      const activeElections = await prisma.election.findMany({
        where: {
          status: 'active',
          endDate: { gte: new Date() }
        }
      });
      if (activeElections.length === 0) {
        return res.status(403).json({ error: 'No active elections are currently running. Voting is closed or not yet started.' });
      }
    }

    const token = jwt.sign({ id: user.id, role: user.role, name: user.name, studentId: user.studentId }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, role: user.role, studentId: user.studentId } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ELECTIONS
exports.getActiveElections = async (req, res) => {
  try {
    const elections = await prisma.election.findMany({
      where: { 
        status: 'active',
        endDate: { gte: new Date() }
      },
      include: {
        positions: {
          include: {
            candidates: true,
            participation: { where: { userId: req.user.id } }
          }
        }
      }
    });
    res.json(elections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllElections = async (req, res) => {
  try {
    const elections = await prisma.election.findMany({
      include: { positions: { include: { candidates: true } } },
      orderBy: { id: 'desc' }
    });
    // Add dynamic 'processed' status
    const processedElections = elections.map(e => {
      let currentStatus = e.status;
      if (e.status === 'active' && new Date() > new Date(e.endDate)) {
        currentStatus = 'done';
      }
      return { ...e, status: currentStatus };
    });
    res.json(processedElections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createElection = async (req, res) => {
  const { title, startDate, endDate, status, positions } = req.body;
  try {
    const election = await prisma.election.create({
      data: {
        title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: status || 'draft',
        positions: positions ? { create: positions.map(p => ({ title: p.title })) } : undefined
      },
      include: { positions: { include: { candidates: true } } }
    });
    res.json(election);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateElection = async (req, res) => {
  const { id } = req.params;
  const { title, startDate, endDate, status } = req.body;
  try {
    const election = await prisma.election.update({
      where: { id: parseInt(id) },
      data: {
        title,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status
      },
      include: { positions: { include: { candidates: true } } }
    });
    res.json(election);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteElection = async (req, res) => {
  const { id } = req.params;
  try {
    const positions = await prisma.position.findMany({ where: { electionId: parseInt(id) } });
    const positionIds = positions.map(p => p.id);
    await prisma.$transaction([
      prisma.vote.deleteMany({ where: { positionId: { in: positionIds } } }),
      prisma.participation.deleteMany({ where: { positionId: { in: positionIds } } }),
      prisma.candidate.deleteMany({ where: { positionId: { in: positionIds } } }),
      prisma.position.deleteMany({ where: { electionId: parseInt(id) } }),
      prisma.election.delete({ where: { id: parseInt(id) } })
    ]);
    res.json({ success: true, message: 'Election deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.changeAdminPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Not authorized' });

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Incorrect current password' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
