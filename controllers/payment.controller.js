const Stripe = require('stripe');

const stripe = Stripe('sk_test_51Px9ITFcvwzdK8OALJ3UGM4BrQi5Smg1Lv790ITXPHa2BjT9aBSXGIeJSpGhve6z4gfwpk7YfoIBpwimNhFrtRGE00fT3pwtk2')

const createCheckoutSession = async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: req.body.cart.map((item) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              images: item.image
            },
            unit_amount: Math.round(item.price * 100), // السعر بالمليم (على سبيل المثال 2000 يمثل $20.00)
          },
          quantity: item.amount,
        })),
        mode: 'payment',
        success_url: `http://localhost:3000/ecommerce-demo/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:3000/ecommerce-demo/cancel`,
      });
  
      res.json({ id: session.id });
      console.log(session.id)
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  module.exports = {
    createCheckoutSession,
  };



  