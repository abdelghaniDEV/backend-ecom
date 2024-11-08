const express = require("express");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig.js");
const multer = require("multer");
const { updateTemplate, getTemplates } = require("../controllers/template.controller.js");
const { authenticate, authorize } = require("../middleware/authMiddleware.js");


const router = express.Router()


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "uploads",
      allowedFormats: ["jpg", "png", "jpeg"],
    },
  });

  const upload = multer({ storage: storage });

  router.route("/").patch(
    upload.fields([
        { name: "imgHero", maxCount: 1 },
        { name: "imgBanner", maxCount: 1 },
        { name: "imgShop", maxCount: 1 },
      ]), authenticate , authorize(['admin']) , updateTemplate
  ).get(getTemplates)

  module.exports = router;