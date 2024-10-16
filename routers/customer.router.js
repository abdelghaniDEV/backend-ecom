const express = require('express');
const { getAllCustomer, DeleteCustomer } = require('../controllers/customer.controler');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { checkCache } = require('../middleware/cacheMiddleware');

const router = express.Router();

router.route('/').get(authenticate,getAllCustomer)
router.route('/:customerId').delete(authenticate,authorize(['admin']),DeleteCustomer)


module.exports = router;