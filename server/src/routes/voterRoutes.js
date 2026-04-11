const express = require('express');
const router = express.Router();
const voterController = require('../controllers/voterController');
const { authenticateToken, isAdmin, upload } = require('../middleware/auth');

// Voting
router.post('/votes', authenticateToken, voterController.submitVote);

// Results
router.get('/results/all', voterController.getPublicResults);
router.get('/election/countdown', voterController.getDashboardElection);
router.get('/admin/export/:id', authenticateToken, isAdmin, voterController.exportResults);

// Voter Management
router.get('/admin/voters', authenticateToken, isAdmin, voterController.getAllVoters);
router.delete('/admin/voters', authenticateToken, isAdmin, voterController.clearAllVoters);
router.delete('/admin/voters/:id', authenticateToken, isAdmin, voterController.deleteVoter);
router.post('/admin/voters/import', authenticateToken, isAdmin, upload.single('file'), voterController.importVoters);

// Admin Stats
router.get('/admin/stats', authenticateToken, isAdmin, voterController.getStats);
router.get('/admin/logs', authenticateToken, isAdmin, voterController.getLogs);
router.delete('/admin/logs', authenticateToken, isAdmin, voterController.clearLogs);

module.exports = router;
