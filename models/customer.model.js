
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    zipCode: { type: Number, required: true },
    orders : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        }
    
    ],
    totalAmount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  });
  

module.exports = mongoose.model("Customer", customerSchema);
