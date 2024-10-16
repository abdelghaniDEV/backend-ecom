const express = require("express");
const {
  getAllUsers,
  createUser,
  loginUser,
  getSingleUser,
} = require("../controllers/user.controller");
const { body } = require("express-validator");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

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
