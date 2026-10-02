const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticateToken, authController.getMe);
router.get('/users', authenticateToken, authorizeRoles('admin', 'resp', 'superviseur'), authController.getAllUsers);

// Création de compte protégée — seuls admin et resp peuvent créer de nouveaux comptes
router.post('/create-user', authenticateToken, authorizeRoles('admin', 'resp'), authController.createUserByResp);

// Suppression de compte — réservée aux admin et resp
router.delete('/users/:id', authenticateToken, authorizeRoles('admin', 'resp'), authController.deleteUser);

module.exports = router;

