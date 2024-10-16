const express = require("express");
const { getAllProducts, getSingleProduct, createProduct, deleteProduct, updateProduct } = require('../controllers/product.controller.js');
const { body } = require('express-validator');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig.js');
const { authenticate, authorize } = require("../middleware/authMiddleware.js");
const { checkCache } = require("../middleware/cacheMiddleware.js");


const router = express.Router();

const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : {
        folder : 'uploads',
        allowedFormats : ['jpg' , 'png' , 'jpeg']
    }
})

const upload = multer({ storage: storage})

// Get all products
router.route('/').get(getAllProducts).post(authenticate , authorize(['admin']),[
    upload.array('image' , 3),
    body('name').notEmpty().withMessage('Name is required'),
    body('price').notEmpty().withMessage('Price is required'),
    // body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    // body('image').notEmpty().withMessage('Image is required'),

] ,createProduct)
router.route('/:productId').get(getSingleProduct).delete(authenticate,authorize(['admin']) ,deleteProduct).patch(authenticate , authorize(['admin']) , upload.array('image' , 3) ,updateProduct)





module.exports = router
