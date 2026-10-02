const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Tous les rôles connectés (admin, resp, superviseur) ont accès aux événements
router.get('/', authenticateToken, authorizeRoles('admin', 'resp', 'superviseur'), eventsController.getAllEvents);
router.get('/:id', authenticateToken, authorizeRoles('admin', 'resp', 'superviseur'), eventsController.getEventById);
router.post('/', authenticateToken, authorizeRoles('admin', 'resp', 'superviseur'), eventsController.createEvent);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'resp', 'superviseur'), eventsController.updateEvent);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'resp', 'superviseur'), eventsController.deleteEvent);

// Dispatch Sessions routes
router.post('/:id/sessions', authenticateToken, authorizeRoles('admin', 'resp', 'superviseur'), eventsController.addDispatchSession);
router.delete('/:id/sessions/:sessionId', authenticateToken, authorizeRoles('admin', 'resp', 'superviseur'), eventsController.removeDispatchSession);

module.exports = router;
