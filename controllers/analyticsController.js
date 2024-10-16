    // controllers/analyticsController.js
const Order = require('../models/Order.model');
const Product = require('../models/product.model');

// دالة للحصول على التحليل الشهري
exports.getMonthlyAnalytics = async (req, res) => {
  try {
    const { year } = req.query; // استخدم السنة من الاستعلام إذا تم توفيرها
    const selectedYear = year ? parseInt(year) : new Date().getFullYear();

    // تحليل الطلبات الشهرية
    const monthlyOrderAnalytics = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${selectedYear}-01-01`),
            $lt: new Date(`${selectedYear + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' }, // تجميع حسب الشهر
          totalOrders: { $sum: 1 }, // حساب إجمالي عدد الطلبات
          totalRevenue: { $sum: '$totalPrice' }, // حساب إجمالي الإيرادات
        },
      },
      {
        $sort: { _id: 1 }, // ترتيب حسب الشهر
      },
    ]);

    // analytic data for month
    const monthlyProductAnalytics = await Product.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${selectedYear}-01-01`),
            $lt: new Date(`${selectedYear + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' }, // تجميع حسب الشهر
          totalProductsCreated: { $sum: 1 }, // حساب إجمالي عدد المنتجات
        },
      },
      {
        $sort: { _id: 1 }, // ترتيب حسب الشهر
      },
    ]);

    // دمج النتائج
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const mergedAnalytics = monthNames.map((month, index) => {
      const orderData = monthlyOrderAnalytics.find(data => data._id === index + 1) || {};
      const productData = monthlyProductAnalytics.find(data => data._id === index + 1) || {};

      return {
        month: month,
        Orders: orderData.totalOrders || 0,
        Revenue: orderData.totalRevenue || 0,
        Products: productData.totalProductsCreated || 0,
      };
    });

    res.status(200).json({status : 'success' , data : mergedAnalytics});
  } catch (error) {
    console.error('Error fetching monthly analytics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// exports.getOrderCountByCategoryAndMonth = async (req, res) => {



//   try {
//     const results = await Order.aggregate([
//       { $unwind: "$products" },
//       {
//         $lookup: {
//           from: "products",
//           localField: "products.product",
//           foreignField: "_id",
//           as: "productDetails",
//         },
//       },
//       { $unwind: "$productDetails" },
//       {
//         $addFields: {
//           month: { $month: "$createdAt" },
//           year: { $year: "$createdAt" },
//         },
//       },
//       { $unwind: "$productDetails.category" },
//       {
//         $group: {
//           _id: {
//             year: "$year",
//             month: "$month",
//             category: "$productDetails.category",
//           },
//           orderCount: { $sum: 1 },
//         },
//       },
//       { $sort: { "_id.year": 1, "_id.month": 1 } }
//     ]);

//     // إرسال النتائج إلى المستجيب بصيغة JSON
//     res.status(200).json({
//       success: true,
//       data: results,
//     });
//   } catch (error) {
//     console.error("Error fetching order count by category and month:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch order count.",
//       error: error.message,
//     });
//   }
// };

// exports.getOrderCountByCategoryAndMonth = async (req, res) => {
//   try {
//     const results = await Order.aggregate([
//       { $unwind: "$products" },
//       {
//         $lookup: {
//           from: "products",
//           localField: "products.product",
//           foreignField: "_id",
//           as: "productDetails",
//         },
//       },
//       { $unwind: "$productDetails" },
//       {
//         $addFields: {
//           month: { $month: "$createdAt" },
//           year: { $year: "$createdAt" },
//         },
//       },
//       { $unwind: "$productDetails.category" },
//       {
//         $group: {
//           _id: {
//             year: "$year",
//             month: "$month",
//             category: "$productDetails.category",
//           },
//           orderCount: { $sum: 1 },
//         },
//       },
//       { $sort: { "_id.year": 1, "_id.month": 1 } }
//     ]);

//     res.status(200).json({
//       success: true,
//       data: results,
//     });
//   } catch (error) {
//     console.error("Error fetching order count by category and month:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch order count.",
//       error: error.message,
//     });
//   }
// };

// controllers/orderController.js
exports.getMonthlyCategoryData = async (req, res) => {
  try {
    const results = await Order.aggregate([
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $addFields: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
      },
      {
        $group: {
          _id: {
            year: "$year",
            month: "$month",
            category: { $arrayElemAt: ["$productDetails.category", 0] }
          },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // تحويل الأشهر إلى أسماء كاملة
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // إعادة تشكيل البيانات بالشكل المطلوب
    const formattedData = monthNames.map((month, index) => {
      const monthData = results.filter(
        item => item._id.month === index + 1
      );

      const dataObject = {
        month,
        Accessories: 0,
        Shoes: 0,
        Women: 0,
        Men: 0
      };

      monthData.forEach(item => {
        const category = item._id.category;
        if (dataObject[category] !== undefined) {
          dataObject[category] = item.totalOrders;
        }
      });

      return dataObject;
    });

    res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error fetching monthly category data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch monthly category data.",
      error: error.message,
    });
  }
};
