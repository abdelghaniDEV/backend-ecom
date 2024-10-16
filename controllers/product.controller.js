const { validationResult } = require("express-validator");
const Product = require("../models/product.model");
const { runAllChains } = require("express-validator/lib/utils");
const { image } = require("../config/cloudinaryConfig");
const asyncWrapper = require("../middleware/asyncWrapper");
const { setCache } = require("../middleware/cacheMiddleware");
const cloudinary = require("cloudinary").v2;

// Get all products
const getAllProducts = async (req, res) => {
  const products = await Product.find({}, { __v: false }).sort({ createdAt: -1 });
  
  setCache(req.originalUrl, products);

  res.json({ status: "SUCCESS", data: { products: products } });
};

// Get single product by ID
const getSingleProduct = asyncWrapper(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);

  // check if product is already available
  if (!product) {
    const err = {
      status: "ERROR",
      message: "Product not found",
      statusCode: 404,
    };
    return next(err);
  }
  console.log(product.image.length);
  res.json({ status: "SUCCESS", data: { product: product } });
});
// Create a new product
const createProduct = asyncWrapper(async (req, res, next) => {
  console.log(req.body)
  // check if files exist
  if (req.files.lenght === 0) {
    const err = {
      status: "ERROR",
      message: "File not uploaded",
      statusCode: 400,
    };
    return next(err);
  }
  // Assuming you want to store multiple image paths
  const imagesPath = req.files.map((file) => file.path); // get all images paths from the request.files object

  const error = validationResult(req);

  if (!error.isEmpty()) {
    const err = { status: "ERROR", message: error.array(), statusCode: 400 };
    return next(err);
  }
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
    image: imagesPath,
    size : req.body.size,
    stock: req.body.stock,
    colors : req.body.colors,
    PriceDiscount : req.body.PriceDescount,
    ShortDescription: req.body.ShortDescription,
    details: req.body.details,
    better: req.body.better
  });
  await product.save();
  res.status(201).json({ status: "SUCCESS", data: { product: product } });
});

// Delete a product
const deleteProduct = asyncWrapper(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.productId);

  // check if product is found
  if (!product) {
    const err = {
      status: "ERROR",
      message: "Product not found",
      statusCode: 404,
    };
    return next(err);
  }
  // delete images from cloudinary
  if (product.image.length > 0) {
    product.image.forEach((imageUrl) => {
      const cleanUrl = imageUrl.split("?")[0];
      const parts = cleanUrl.split("/");
      const publicId = parts
        .slice(parts.length - 2)
        .join("/")
        .split(".")[0];
      cloudinary.uploader.destroy(publicId, (err, result) => {
        if (err) {
          console.log("Error deleting image from Cloudinary:", err);
        } else {
          console.log("Image deleted from cloudinary", result);
        }
      });
    });
  }

  res.json({ status: "SUCCESS", message: "Product deleted successfully" });
});

// Update a product
const updateProduct = async (req, res) => {
  const imagesPath = req.files.map((file) => file.path);

  // Prepare the update object
  const updateData = { ...req.body };


  // If there are images, include them in the update object
  if (imagesPath.length > 0) {
    updateData.image = imagesPath;
    console.log(updateData) // Assuming 'images' is the field for image paths
  }
  const updateProduct = await Product.findByIdAndUpdate(
    { _id: req.params.productId },
    {
      $set: {...updateData },
    },
    { new: true, runValidators: true }
  );

  if (!updateProduct) {
    return res
      .status(404)
      .json({ status: "ERROR", message: "Product not found" });
  }

  res.json({
    status: "SUCCESS",
    message: "Product updated successfully",
    data: { product: updateProduct },
  });
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  deleteProduct,
  updateProduct,
};
