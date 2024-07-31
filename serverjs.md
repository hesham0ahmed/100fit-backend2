const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51NqzFzGR0qiHEMczUfzPtMDasaxfuRHwVzpmDH52nou7i04binIIbgK7D7Ia8m1rz6hSguvnqd2Ni6uoERhpLgWk00IOD3fyWE');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/checkout', async (req, res) => {
  const items = req.body.items;
  try {
    if (!items || !Array.isArray(items)) {
      throw new Error('Invalid items data');
    }

    const line_items = items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          images: ['https://raw.githubusercontent.com/hesham0ahmed/201FiftyFour/main/assets/delte1.jpg'],
          name: `Package ${item.package}`,
          description: `||BENEFITS||: ${item.healthy.join(', ')} ||PROTEINS||: ${item.proteins.join(', ')} ||TOPPINGS||: ${item.toppings.join(', ')} ||FLAVOURS||: ${item.flavours.join(', ')} ||TEXTURE||: ${item.texture}`
        },
        unit_amount: item.price * 100, // Convert price to cents
      },
      quantity: 1,
    }));

    if (line_items.length === 0) {
      throw new Error('No line items provided');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['AT', 'DE', 'US'],
      },
      line_items: line_items,
      success_url: 'https://hesham0ahmed.github.io/201FiftyFour/#/',
      cancel_url: 'https://hesham0ahmed.github.io/201FiftyFour/#/',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Checkout error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Use environment-provided port or default to 4242
const port = process.env.PORT || 4242;
app.listen(port, () => console.log(`Server running on port ${port}`));
