const express =  require ("express");
const { createCheckoutSession } = require("../controllers/payment.controller");




const router = express.Router();

router.route('/create-checkout-session').post(createCheckoutSession)



module.exports = router
