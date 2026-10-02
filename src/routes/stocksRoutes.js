const express = require('express');
const router = express.Router();
const stocksController = require('../controllers/stocksController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.get('/', authenticateToken, authorizeRoles('admin', 'resp', 'superviseur'), stocksController.getAllStocks);
router.get('/:id', authenticateToken, authorizeRoles('admin', 'resp', 'superviseur'), stocksController.getStockById);
router.post('/', authenticateToken, authorizeRoles('admin', 'resp', 'superviseur'), stocksController.createStock);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'resp', 'superviseur'), stocksController.updateStock);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'resp', 'superviseur'), stocksController.deleteStock);

module.exports = router;
