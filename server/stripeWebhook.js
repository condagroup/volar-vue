// const stripe = require('stripe')('sk_test_cwLTxAia7irYupsgmAYzQv7X');      // Testing key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);   // Live key
const User = require('./models/user');

exports.stripeWebhook = async (req, res) => {
  console.log('Webhook route called');
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET_KEY;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log('Webhook received!');
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === 'invoice.payment_succeeded') {
    const customerId = event.data.object.customer;
    const invoiceId = event.data.object.id;

    try {
      // Find the user in your database by customerId
      const user = await User.findOne({ customerId: customerId });
      console.log(user);

      if (user && !user.invoiceIds.includes(invoiceId)) {
        // Update the user's tokensUsed and add the invoiceId to the invoiceIds array
        await User.updateOne(
          { customerId: customerId },
          {
            $set: { tokensUsed: 0 },
            $push: { invoiceIds: invoiceId },
          }
        );
      }

      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(`Error updating user tokens: ${err.message}`);
    }
  } else if (event.type === 'customer.subscription.deleted') {
    const customerId = event.data.object.customer;

    try {
      // Find the user in your database by customerId and update their subscription status
      await User.updateOne(
        { customerId: customerId },
        {
          $set: { isSubscribed: false },
        }
      );

      console.log(`User with customerId ${customerId} subscription has been set to false`);
      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(`Error updating user subscription status: ${err.message}`);
    }
  } else {
    res.sendStatus(200);
  }
};