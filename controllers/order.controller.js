const { request } = require("express");
const asyncWrapper = require("../middleware/asyncWrapper");
const customerModel = require("../models/customer.model");
const OrderModel = require("../models/Order.model");
const { createCustomer } = require("./customer.controler");
const { setCache, deleteCash, deleteCache } = require("../middleware/cacheMiddleware");

// get all orders
const getAllOrders = async (req, res) => {
  const orders = await OrderModel.find().sort({ createdAt: -1 }).populate("products.product");
   
      const ordersData = orders.map(order => order.toJSON());
    
      // 
      setCache(req.originalUrl, ordersData);
  
  res.json({ status: "SUCCESS", data: { orders: ordersData } });
};

// // create a new order
const createOrder = asyncWrapper(async (req, res) => {
  console.log(req.body)
  const { name, email, products, totalPrice, address, zipCode , number , shipping } = req.body;

  // التحقق من صحة الحقول المطلوبة
  if (!email || !name || !products || !totalPrice || !address || !zipCode || !number) {
    return res.status(400).json({ status: "FAILURE", message: "جميع الحقول مطلوبة." });
  }

  const getNextInvoiceNumber = async () => {
    const lastOrder = await OrderModel.findOne().sort({ createdAt: -1 }).exec();
    if (!lastOrder) {
      return "INV001";
    }
    const lastInvoiceNumber = lastOrder.invoiceNumber;
    const lastInvoiceNumberNumber = parseInt(lastInvoiceNumber.replace("INV", ""));
    const newInvoiceNumber = `INV${String(lastInvoiceNumberNumber + 1).padStart(3, "0")}`;
    return newInvoiceNumber;
  };

  const invoiceNumber = await getNextInvoiceNumber();

  const order = new OrderModel({
    name,
    email,
    address,
    zipCode,
    products,
    totalPrice,
    invoiceNumber,
    number,
    shipping,
  });

  await order.save();

  createCustomer(order , req)
  res.status(201).json({ status: "SUCCESS", data: { order: order } });
});



// update an existing order
const updateOrder = asyncWrapper(async (req, res) => {
  const updateData = { ...req.body };

  const updatedOrder = await OrderModel.findByIdAndUpdate(
    req.params.orderId,
    updateData,
    { new: true }
  );
  if (!updateOrder) {
    return res
      .status(404)
      .json({ status: "ERROR", message: "order not found" });
  }
  res.json({
    status: "SUCCESS",
    message: "Order updated successfully",
    data: { order: updatedOrder },
  });
});

// delete an existing order
const deleteOrder = asyncWrapper(async (req, res) => {
  const order = await OrderModel.findByIdAndDelete(req.params.orderId);
  if (!order) {
    const err = {
      status: "ERROR",
      message: "Order not found",
      statusCode: 404,
    };
    return next(err);
  }
  deleteCache(req.originalUrl.slice(5,'/'))
  res.json({ status: "SUCCESS", message: "Order deleted successfully" });
    
});

module.exports = {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
};
