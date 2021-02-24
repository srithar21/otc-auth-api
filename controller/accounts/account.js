const fetch = require('node-fetch');
require('dotenv').config()
const { ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,} = require("http-status-codes");
const dbConnection = require('../db/dbconnect.js')
const httpUtils = require('../../util/httputils');


exports.create = async (req, reply) => { 
    try{
        console.log("********************")
        console.log(req.body)
        console.log(httpUtils.hostURL)
        const response = await fetch(httpUtils.hostURL+'/v1/accounts:signUp?key='+httpUtils.apiKey, {
        method: 'POST',
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json', "Origin": "http:localhost:3000",
        "Access-Control-Request-Method": "*",
        "withCredentials": "true" }
    });
        const responseData = await response.json();
        console.log(responseData.localId)
        if (response.status == StatusCodes.OK) {
            console.log("Inside db insert")
            insertCustomerData(req.body,responseData)
        }
        reply.status(response.status).send(responseData)
    }catch(error) {
	    console.log(error);
    }                                                                               
 }

 function insertCustomerData(body, response) {
     try{
    dbConnection.executeSQL("Insert into customer_master(localId, firstName, lastName, title, company, email, phone) values("
    +"'"+response.localId + "'," 
    +"'"+ body.firstName + "'," 
    +"'"+body.lastName + "'," 
    +"'"+body.title + "'," 
    +"'"+body.company + "'," 
    +"'"+body.email + "'," 
    +"'"+body.phone +"')", (err, data) => {
        if (err)
          console.error(err);
              });
    }catch(error) {
        console.log(error)
    }
 }
 
 exports.getInfo = async (req, reply) => { 
    reply.send("Welcome to get")                                                                
 }

