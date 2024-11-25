const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true},
  zipCode : { type: Number, required: true},
  number: { type : String , required: false},
  products: [
    { 
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number, required: true },
      sizeSelector: { type: String, required: false},
      colorSelector:{type: String, required: false}
    }
  ],
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  invoiceNumber: { type: String, required: true, unique: true },
  shipping : { type: String, required: true}
});

module.exports = mongoose.model('Order', orderSchema);
