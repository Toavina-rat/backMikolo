const express = require('express');
const router = express.Router();
const planningController = require('../controllers/planningController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.get('/', authenticateToken, authorizeRoles('admin', 'resp', 'superviseur'), planningController.getPlanningItems);

module.exports = router;
