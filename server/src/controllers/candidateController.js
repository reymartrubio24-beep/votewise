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
