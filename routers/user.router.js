const express = require("express");
const {
  getAllUsers,
  createUser,
  loginUser,
  getSingleUser,
} = require("../controllers/user.controller");
const { body } = require("express-validator");
const { authenticate } = require("../middleware/authMiddleware");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig.js');
const multer = require('multer');

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary : cloudinary,
  params : {
      folder : 'uploads',
      allowedFormats : ['jpg' , 'png' , 'jpeg']
  }
})

const upload = multer({ storage: storage})

router.route("/").get(authenticate,getAllUsers);
router.route("/:tokenID").get(authenticate, getSingleUser)
router
  .route("/register")
  .post( 
    [
      body("firstName").notEmpty().withMessage("firstName is required"),
      body("lastName").notEmpty().withMessage("lastName is required"),
      body("email").isEmail().withMessage("Invalid email"),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    ],
    upload.single('image'),
    createUser
  );
router
  .route("/login")
  .post(
    [
      body("email").notEmpty().withMessage("email is not found"),
      body("password").notEmpty().withMessage("password is not found"),
    ],
    loginUser
  );

module.exports = router;
