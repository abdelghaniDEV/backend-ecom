const asyncWrapper = require("../middleware/asyncWrapper");
const { setCache } = require("../middleware/cacheMiddleware");
const customerModel = require("../models/customer.model");

const getAllCustomer = asyncWrapper(async (req, res, next) => {
  const customers = await customerModel.find().sort({ createdAt: -1 }).populate({
    path: "orders",
    populate: {
      path: "products.product", //
      model: "Product", //
    },
  });
  customers.forEach(customer => {
    customer.totalAmount = customer.orders.reduce((acc, order) => {
      return acc + order.totalPrice; // إضافة totalPrice لكل طلب
    }, 0);
  });
  res.json({ status: "SUCCESS", data: { customers: customers } });
});

// delet customer
const DeleteCustomer = asyncWrapper(async (req, res, next) => {
  const customer = await customerModel.findByIdAndDelete(req.params.customerId);
  if (!customer) {
    const err = {
      status: "ERROR",
      message: "Customer not found",
      statusCode: 404,
    };
    return next(err);
  }
  res.status(200).json({ status: "SUCCESS", data: { customer: customer } });
});

// cretae customer
const createCustomer = async (order , req) => {
    let customer = await customerModel.findOne({email : req.body.email})
    if(!customer) {
            customer = new customerModel({
            name: req.body.name,
            email: req.body.email,
            address : req.body.address,
            zipCode : req.body.zipCode,
            orders : []
        })
    }
    customer.orders.push(order)
    await customer.save()
}
  
  
module.exports = {
  getAllCustomer,
  DeleteCustomer,
  createCustomer,
};
