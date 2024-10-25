const asyncWrapper = require("../middleware/asyncWrapper");
const { validationResult } = require("express-validator");
const User = require("../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cloudinary = require("cloudinary").v2;



const JWT_SECRET = process.env.JWT_SECRET;

// get all Users
const getAllUsers = asyncWrapper(async (req, res) => {
  const users = await User.find({},{password : false});

  res.json({ status: "SUCCESS", data: { users: users } });
});
//get single Users 
const getSingleUser = asyncWrapper(async (req, res, next) => {
  const decoded = jwt.verify(req.params.tokenID, JWT_SECRET);
  req.user = decoded;
const user = await User.findOne({_id : req.user.id},{password : false , __v : false});

  if (!user) {
    const err = {
      status: "ERROR",
      message: "User not found",
      statusCode: 404,
    };
    return next(err);
  }

  res.json({ status: "SUCCESS", data: { user: user } });
});
// create a new User
const createUser = asyncWrapper(async (req, res, next) => {
  // validate the request body


  const errors = validationResult(req);

  const createData = {...req.body}
  if(req.file) {
    createData.image = req.file.path;
  }

  if (!errors.isEmpty()) {
    const err = { status: "ERROR", message: errors.array(), statusCode: 500 };
    return next(err);
  }

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const err = {
      status: "ERROR",
      message: "User already exists",
      statusCode: 409,
    };
    return next(err);
  }

  const HashedPassword = await bcrypt.hash(req.body.password, 10);
  createData.password = HashedPassword;

  const newUser = new User(createData);

  await newUser.save();

  res.status(201).json({ status: "SUCCESS", data: { user: newUser } });
});

// login
const loginUser = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = { status: "ERROR", message: errors.array(), statusCode: 500 };
    return next(err);
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    const err = {
      status: "ERROR",
      message: "Incorrect email or password",
      statusCode: 404,
    };
    return next(err);
  }

  const isPassword = await bcrypt.compare(req.body.password, user.password);
  if (!isPassword) {
    const err = {
      status: "ERROR",
      message: "Incorrect email or password",
      statusCode: 404,
    };
    return next(err);
  }

  const token = await jwt.sign({email : user.email , id : user._id} , JWT_SECRET, { expiresIn: '30d' })

  res.json({
    status: "SUCCESS",
    data: { user: user , token: token},
    message: "login is succfuly",
  });
});

// delet user 
const deleteUser = async (req, res , next) => {
  const user = await User.findByIdAndDelete(req.params.userID);
  if (!user) {
    const err = {
      status: "ERROR",
      message: "User not found",
      statusCode: 404,
    };
    return next(err);
  }
  // delete image from cloudinay
  if(user.image) {
    const cleanUrl = user.image.split("?")[0];
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
  })
}

res
    .status(200)
    .json({ status: "SUCCESS", message: "user deleted successfully" });
}

// update user 
const updateUser = asyncWrapper (async (req, res, next) => {

  // Prepare the update object
  const updateData = {...req.body };

  if(req.file) {
    updateData.image = req.file.path;
  }
  
  const user = await User.findByIdAndUpdate(
    {_id : req.params.userID},
    {
      $set: {...updateData },
    },
    { new: true, runValidators: true }
  );

  if (!user) {
    const err = {
      status: "ERROR",
      message: "User not found",
      statusCode: 404,
    };
    return next(err);
  }

  res.json({ status: "SUCCESS", data: { user: user } });
})

module.exports = {
  getAllUsers,
  createUser,
  loginUser,
  getSingleUser,
  deleteUser,
  updateUser,
};
