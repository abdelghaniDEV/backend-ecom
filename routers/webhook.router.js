// routes/webhook.js

const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51Px9ITFcvwzdK8OALJ3UGM4BrQi5Smg1Lv790ITXPHa2BjT9aBSXGIeJSpGhve6z4gfwpk7YfoIBpwimNhFrtRGE00fT3pwtk2'); // تأكد من تعيين المفتاح السري في المتغيرات البيئية
// const Order = require('../models/Order'); // نموذج Order

// Webhook لاستقبال تأكيد الدفع من Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']; // الحصول على توقيع Webhook

  let event;

  try {
    // التحقق من توقيع Webhook لضمان الأمان
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // التعامل مع حدث تأكيد الدفع
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // استخراج البيانات اللازمة من الجلسة
    const { customer_email, amount_total, payment_intent } = session;
    const products = session.metadata.cartItems; // معلومات السلة التي أرسلتها سابقاً

    // إنشاء الطلب بعد تأكيد الدفع
    // const newOrder = new Order({
    //   name: customer_email,
    //   email: customer_email,
    //   products: JSON.parse(products), // تحويل السلة من نص إلى JSON
    //   totalPrice: amount_total / 100, // تحويل السنتات إلى دولارات
    //   paymentStatus: 'Paid',
    //   paymentIntentId: payment_intent,
    //   createdAt: new Date(),
    // });

    try {
      await newOrder.save(); // حفظ الطلب في قاعدة البيانات
      console.log('Order created successfully:', newOrder);
    } catch (error) {
      console.error('Error saving order:', error);
    }
  }

  res.status(200).json({ received: true }); // إرجاع استجابة ناجحة
});

module.exports = router;
