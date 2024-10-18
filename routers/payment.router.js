const express =  require ("express");
const { createCheckoutSession } = require("../controllers/payment.controller");
const { authenticate } = require("../middleware/authMiddleware.js");


const router = express.Router();

router.route('/create-checkout-session').post(authenticate,createCheckoutSession)



module.exports = router
