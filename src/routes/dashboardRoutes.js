const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Accès réservé aux rôles 'admin' et 'resp'. Rôle 'superviseur' non autorisé.
router.get('/stats', authenticateToken, authorizeRoles('admin', 'resp'), dashboardController.getDashboardStats);

module.exports = router;

