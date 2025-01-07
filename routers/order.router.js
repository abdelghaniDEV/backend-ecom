const express = require('express');
const { getAllOrders, createOrder, updateOrder, deleteOrder } = require('../controllers/order.controller');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { checkCache } = require('../middleware/cacheMiddleware');


const router = express.Router();

router.route('/').get(getAllOrders).post(createOrder);
router.route('/:orderId').post(authenticate,authorize(['admin']),updateOrder).delete(authenticate,authorize(['admin']),deleteOrder)



module.exports = router