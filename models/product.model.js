const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const productShema = mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    PriceDiscount: { type: Number, required : false },
    description: { type: String, required: false}, 
    ShortDescription: { type : String, required: false},
    details : { type: String, required: false},
    category: { type: Array, required: true },
    image : { type: Array , required: true }, 
    better : { type : Boolean , required: false , default: false},
    stock: {
        type: Number, 
        required: [true, 'Product stock is required'],
        min: [0, 'Stock must be a positive number or zero'],
        default: 0,
      },
    size: {
    type: Array, // array of size in product
    required: false, //
  },
  colors: { type: Array, required: false},
  createdAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model("Product", productShema);