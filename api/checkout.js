const stripe = require('stripe')('sk_test_51NqzFzGR0qiHEMczUfzPtMDasaxfuRHwVzpmDH52nou7i04binIIbgK7D7Ia8m1rz6hSguvnqd2Ni6uoERhpLgWk00IOD3fyWE');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const items = req.body.items;
    try {
      if (!items || !Array.isArray(items)) {
        throw new Error('Invalid items data');
      }

      const line_items = items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            images: ['https://hesham0ahmed.github.io/201FiftyFour/assets/delte1.jpg'], // Corrected image URL
            name: `Package ${item.package}`,
            description: `||BENEFITS||: ${item.healthy.join(', ')} ||PROTEINS||: ${item.proteins.join(', ')} ||TOPPINGS||: ${item.toppings.join(', ')} ||FLAVOURS||: ${item.flavours.join(', ')} ||TEXTURE||: ${item.texture}`
          },
          unit_amount: item.price * 100,
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

      res.status(200).json({ id: session.id });
    } catch (error) {
      console.error('Checkout error:', error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
