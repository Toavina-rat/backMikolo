const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.get('/', authenticateToken, authorizeRoles('admin', 'resp', 'superviseur'), notificationsController.getAllNotifications);
router.post('/', authenticateToken, authorizeRoles('admin', 'resp', 'superviseur'), notificationsController.createNotification);
router.patch('/:id/read', authenticateToken, authorizeRoles('admin', 'resp', 'superviseur'), notificationsController.markAsRead);

module.exports = router;
