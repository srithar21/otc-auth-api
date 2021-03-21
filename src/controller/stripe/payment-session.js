const fetch = require('node-fetch');
require('dotenv').config()
const { ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,} = require("http-status-codes");
const httpUtils = require('../../util/httputils');

const stripe = require('stripe')('sk_test_51IL9i5FzfcjDT1x8NKOn12BKxKRxttlWBHaAzkDdxjZydQLWglGFQM3NNBkcSCm67NImEn60i1kFaCDp2nNQ8bTE00PFJVtZfp');
// const YOUR_DOMAIN = 'http://localhost:3000';
const YOUR_DOMAIN = 'https://auth-qa-service.azurewebsites.net';


exports.createSession = async (req, res) => { 
    try {
        console.log(req.body)
        console.log(req.body.price)
        // res.send("Sample service")

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
              {
                price_data: {
                    currency: 'usd',
                    product_data: {
                      name: 'Stubborn Attachments',
                      images: ['https://i.imgur.com/EHyR2nP.png'],
                    },
                    unit_amount: 2000,
                },
                  quantity: 1,
            }],
            mode: 'payment',
            customer_email:req.body.email,
            locale:'en',

            success_url: `${YOUR_DOMAIN}/success.html`,
            cancel_url: `${YOUR_DOMAIN}/cancel.html`,
          });
        
          res.json({ id: session.id });
    } catch (error) {
        console.log(error)
    }
}