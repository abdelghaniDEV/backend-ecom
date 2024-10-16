// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// تعريف route لتحليل البيانات الشهرية
router.get('/monthly', analyticsController.getMonthlyAnalytics);
router.get('/orders', analyticsController.getMonthlyCategoryData)

module.exports = router;
