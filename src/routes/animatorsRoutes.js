const express = require('express');
const router = express.Router();
const animatorsController = require('../controllers/animatorsController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.get('/', authenticateToken, authorizeRoles('admin', 'resp', 'superviseur'), animatorsController.getAllAnimators);
router.get('/:id', authenticateToken, authorizeRoles('admin', 'resp', 'superviseur'), animatorsController.getAnimatorById);
router.post('/', authenticateToken, authorizeRoles('admin', 'resp', 'superviseur'), animatorsController.createAnimator);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'resp', 'superviseur'), animatorsController.updateAnimator);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'resp', 'superviseur'), animatorsController.deleteAnimator);

module.exports = router;
