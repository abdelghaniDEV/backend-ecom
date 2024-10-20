const express = require('express');
const { createCategory, getAllCategories, deleteCategory, updateCategory } = require('../controllers/category.controlles');
const { body } = require('express-validator');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig.js');
const multer = require('multer');
const { authenticate, authorize } = require('../middleware/authMiddleware.js');
const { checkCache } = require('../middleware/cacheMiddleware.js');




const router = express.Router();

const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : {
        folder : 'uploads',
        allowedFormats : ['jpg' , 'png' , 'jpeg']
    }
})

const upload = multer({ storage: storage})

// create a new category

router.route('/').post(authenticate,authorize(["admin"]),upload.single('image'),[ body('name').notEmpty().withMessage("Name is required")] ,createCategory).get(authenticate,getAllCategories)
router.route('/:categoryId').delete(authenticate,authorize(['admin']),deleteCategory).patch(authenticate,authorize(['admin']), upload.single('image'),updateCategory)



module.exports = router