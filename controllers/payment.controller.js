const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_KEY_SECRET)  

// const createCheckoutSession = async (req, res) => {
//       console.log(req.body)
//     try {
//       const session = await stripe.checkout.sessions.create({
       
//         payment_method_types: ['card'],
//         line_items: req.body.cart.map((item) => ({
//           price_data: {
//             currency: 'usd',
//             product_data: {
//               name: item.name,
//               images: item.image
//             },
//             unit_amount: Math.round(item.price * 100), // السعر بالمليم (على سبيل المثال 2000 يمثل $20.00)
//           },
//           quantity: item.amount,
//         })),
//         mode: 'payment',
//         success_url: `${process.env.CLIENT_URL}/success`,
//         cancel_url: `${process.env.CLIENT_URL}`,
//       });
  
//       res.json({ id: session.id });
//       console.log(session.id)
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   };

const createCheckoutSession = async (req, res) => {
  try {
    const { cart, shippingCost } = req.body; // اجلب cart وتكلفة الشحن من الطلب

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        // عناصر السلة
        ...cart.map((item) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              images: item.image,
            },
            unit_amount: Math.round(item.price * 100), // السعر بالمليمات
          },
          quantity: item.amount,
        })),
        // إضافة تكلفة الشحن كعنصر منفصل
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Shipping',
            },
            unit_amount: Math.round(shippingCost * 100), // تحويل الشحن إلى المليمات
          },
          quantity: 1,
        }
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}`,
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


  module.exports = {
    createCheckoutSession,
  };



  