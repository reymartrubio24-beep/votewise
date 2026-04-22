const prisma = require('../config/prisma');

// POSITION
exports.createPosition = async (req, res) => {
  const { electionId, title } = req.body;
  try {
    const position = await prisma.position.create({
      data: { electionId: parseInt(electionId), title },
      include: { candidates: true }
    });
    res.json(position);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePosition = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.$transaction([
      prisma.vote.deleteMany({ where: { positionId: parseInt(id) } }),
      prisma.participation.deleteMany({ where: { positionId: parseInt(id) } }),
      prisma.candidate.deleteMany({ where: { positionId: parseInt(id) } }),
      prisma.position.delete({ where: { id: parseInt(id) } })
    ]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CANDIDATE
exports.createCandidate = async (req, res) => {
  const { positionId, name, party, platform, photoUrl } = req.body;
  try {
    const voter = await prisma.user.findFirst({
      where: { name, role: 'voter' }
    });
    if (!voter) return res.status(400).json({ error: `"${name}" is not a registered student/voter.` });

    // Check if running for another position in the same election
    const position = await prisma.position.findUnique({ where: { id: parseInt(positionId) } });
    const existing = await prisma.candidate.findFirst({
      where: {
        name,
        position: { electionId: position.electionId }
      }
    });
    if (existing) return res.status(400).json({ error: `"${name}" is already running for a position in this election.` });

    const candidate = await prisma.candidate.create({
      data: { positionId: parseInt(positionId), name, party: party || null, platform: platform || null, photoUrl: photoUrl || null }
    });
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCandidate = async (req, res) => {
  const { id } = req.params;
  const { name, party, platform, photoUrl } = req.body;
  try {
    const voter = await prisma.user.findFirst({
      where: { name, role: 'voter' }
    });
    if (!voter) return res.status(400).json({ error: `"${name}" is not a registered student/voter.` });

    // Check if running for another position in the same election (excluding self)
    const currentCandidate = await prisma.candidate.findUnique({ where: { id: parseInt(id) }, include: { position: true } });
    const existing = await prisma.candidate.findFirst({
      where: {
        name,
        position: { electionId: currentCandidate.position.electionId },
        NOT: { id: parseInt(id) }
      }
    });
    if (existing) return res.status(400).json({ error: `"${name}" is already running for another position in this election.` });

    const candidate = await prisma.candidate.update({
      where: { id: parseInt(id) },
      data: { name, party, platform, photoUrl }
    });
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCandidate = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.$transaction([
      prisma.vote.deleteMany({ where: { candidateId: parseInt(id) } }),
      prisma.candidate.delete({ where: { id: parseInt(id) } })
    ]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadPhoto = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ url: `/uploads/${req.file.filename}` });
};
