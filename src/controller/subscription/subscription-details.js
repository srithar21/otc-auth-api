const fetch = require('node-fetch');
require('dotenv').config()
const { ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,} = require("http-status-codes");
const httpUtils = require('../../util/httputils');

const stripe = require('stripe')('sk_test_51IL9i5FzfcjDT1x8NKOn12BKxKRxttlWBHaAzkDdxjZydQLWglGFQM3NNBkcSCm67NImEn60i1kFaCDp2nNQ8bTE00PFJVtZfp');

exports.details = async (req, res) => { 
    let response = {
        "status":false,
        "card":[],
        "billingAddress":[]
    }
    try {
        res.send(response)
    } catch (error) {
        console.log(error)
    }
}

exports.list = async (req, res) => { 
    try {
        
        const subscriptionList = await stripe.subscriptions.list({
            limit: 3,
            customer: req.query.customer
        });
        
        res.json({ result: subscriptionList });
    } catch (error) {
        console.log(error)
      res.json({ err: error });
        
    }
  }

exports.cancel = async (req, res) => { 
    try {
        console.log(req.body)
        const subscriptionList = await stripe.subscriptions.del(            
            req.body.id
        );
        
        res.json({ result: subscriptionList });
    } catch (error) {
        console.log(error)
        res.json({ err: error });        
    }
}

exports.invoiceList = async (req, res) => { 
    try {
        console.log(req.query.customer);
        const invoiceList = await stripe.invoices.list({             
            customer: req.query.customer
        });
        
        res.json({ result: invoiceList });
    } catch (error) {
        console.log(error)
        res.json({ err: error });        
    }
}

exports.productList = async (req, res) => { 
    try {
        console.log(req.query.customer);
        const productList = await stripe.products.list({});
        
        res.json({ result: productList });
    } catch (error) {
        console.log(error)
        res.json({ err: error });        
    }
}