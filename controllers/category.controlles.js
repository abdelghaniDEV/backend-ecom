const { validationResult } = require("express-validator");
const Category = require("../models/category.model");
const Product = require("../models/product.model");
const asyncWrapper = require("../middleware/asyncWrapper");
const { setCache } = require("../middleware/cacheMiddleware");

// create a new category
const createCategory = asyncWrapper(async (req, res, next) => {
  // validate the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = { status: "ERROR", message: errors.array(), statusCode: 500 };
    return next(err);
  }
  const dataCreated = {...req.body}
  if(req.file){
    dataCreated.image = req.file
  }
  // validare the category already exists
  const category = await Category.findOne({ name: req.body.name });
  if (category) {
    const err = {
      status: "ERROR",
      message: "Category already exists",
      statusCode: 400,
    };
    
    return next(err);
  }
  const newCategory = new Category(dataCreated);
  await newCategory.save();
  res.status(201).json({ status: "SUCCESS", data: { category: newCategory } });
});

//get all categories
const getAllCategories = asyncWrapper(async (req, res) => {
  const categories = await Category.find();
  setCache(req.originalUrl, categories)
  res.json({ status: "SUCCESS", data: { categories: categories } });
});

// update a category
const updateCategory = asyncWrapper(async (req, res, next) => {

  // check if the category name already exists in the database
  const checkCategory = await Category.findOne({name : req.body.name});
  if(checkCategory){
    const err = {
      status: "ERROR",
      message: "Category name already exists",
      statusCode: 400,
    };
    return next(err);
  }
// //   validate the request body
//   const errors = validationResult(req);
//   if(!errors.isEmpty()) {
//     const err = {status : "ERROR", message : errors.array() , statusCode : 500}
//     return next(err)
//   }

  const updataData = {...req.body}
  if(req.file) {
    updataData.image = req.file.path;
  }
  console.log(req.body)

  // update the category in the database
  const category = await Category.findByIdAndUpdate(
    { _id: req.params.categoryId },
    {
      $set: {...updataData},
    },
    { new: true, runValidators: true }
  );
  if (!category) {
    const err = {
      status: "ERROR",
      message: "Category not found",
      statusCode: 404,
    };
    return next(err);
  }
  res.status(200).json({ status: "SUCCESS", data: { category: category } });
});

// dekey the category
const deleteCategory = asyncWrapper(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.categoryId);
  if (!category) {
    const err = {
      status: "ERROR",
      message: "Category not found",
      statusCode: 404,
    };
    return next(err);
  }
  res
    .status(200)
    .json({ status: "SUCCESS", message: "Category deleted successfully" });
});

module.exports = {
  createCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
};
