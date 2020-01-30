// Stripe Server
// TODO: host this on firebase maybe?

const app = require('express')();
const stripe = require('stripe')('sk_test_iKDj5WxPhlc4Dz1JJUhDmosi0052mQo2A7');

app.use(require('body-parser').text());

app.post('/charge', async (req, res) => {
  console.log(req.body);
  let source = req.body.split(' amount: ')[0];
  let amount = req.body.split(' amount: ')[1].split(' description: ')[0];
  let description = req.body.split(' amount: ')[1].split(' description: ')[1];
  try {
    let { status } = await stripe.charges.create({
      amount: amount,
      currency: 'usd',
      description: description,
      source: source,
    }, {
      stripeAccount: 'acct_1G5OvkF10BCBL4io',
    }).then(function (charge) {
      // asynchronously called
    });

    res.json({ status });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

app.post('/create', async (req, res) => {
  console.log('request code ' + req.body);
  try {
    let { status } = await stripe.oauth.token({
      grant_type: 'authorization_code',
      code: req.body,
    }).then(function (response) {
      // asynchronously called
      var connected_account_id = response.stripe_user_id;
    });
    
    res.json({ status });
  } catch (err) {
    console.log(err)
    res.status(500).end
  }
})

app.listen(9000, () => console.log('Listening on port 9000'));