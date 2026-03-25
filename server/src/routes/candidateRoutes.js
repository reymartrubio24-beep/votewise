const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { authenticateToken, isAdmin, upload } = require('../middleware/auth');

// Positions
router.post('/admin/positions', authenticateToken, isAdmin, candidateController.createPosition);
router.delete('/admin/positions/:id', authenticateToken, isAdmin, candidateController.deletePosition);

// Candidates
router.post('/admin/candidates', authenticateToken, isAdmin, candidateController.createCandidate);
router.put('/admin/candidates/:id', authenticateToken, isAdmin, candidateController.updateCandidate);
router.delete('/admin/candidates/:id', authenticateToken, isAdmin, candidateController.deleteCandidate);
router.post('/admin/candidates/upload', authenticateToken, isAdmin, upload.single('photo'), candidateController.uploadPhoto);

module.exports = router;
