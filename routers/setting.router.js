const express = require("express");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig.js");
const multer = require("multer");
const { addSettings, getSettings } = require("../controllers/setting.controller.js");
const { authenticate, authorize } = require("../middleware/authMiddleware.js");

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowedFormats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage: storage });

router.route("/").post(
  upload.fields([
    { name: "storeLogo", maxCount: 1 },
    { name: "storeIcon", maxCount: 1 },
  ]),
   authenticate , authorize(["admin"]),addSettings
).get(getSettings)

module.exports = router;
