const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Auth
router.post('/auth/login', authController.login);

// Elections
router.get('/elections', authenticateToken, authController.getActiveElections);
router.get('/admin/elections', authenticateToken, isAdmin, authController.getAllElections);
router.post('/admin/elections', authenticateToken, isAdmin, authController.createElection);
router.put('/admin/elections/:id', authenticateToken, isAdmin, authController.updateElection);
router.delete('/admin/elections/:id', authenticateToken, isAdmin, authController.deleteElection);

module.exports = router;
