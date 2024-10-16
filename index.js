const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const app = express();

const port = process.env.PORT;

// Connect to mongoose server
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("connecting to mongoose server");
});

// Middleware
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(express.json());

const productRoute = require("./routers/product.router.js");
const categoryRoute = require("./routers/categories.router.js");
const userRoute = require("./routers/user.router.js");
const paymentRoute = require("./routers/payment.router.js");
const orderRoute = require("./routers/order.router.js")
const customerRoute = require("./routers/customer.router.js")
const analyticsRoutes = require("./routers/analyticsRoutes.js")

app.use("/api/products", productRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/users", userRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/orders", orderRoute)
app.use("/api/customers", customerRoute);
app.use('/api/analytics', analyticsRoutes);

app.use((err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({ status: err.status || "ERROR", message: err.message || err.message , code: err.statusCode || 500 });
});

//listen on port
app.listen(port, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
