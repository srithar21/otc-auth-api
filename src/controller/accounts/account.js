const fetch = require('node-fetch');
require('dotenv').config()
const { ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,} = require("http-status-codes");
const dbConnection = require('../db/dbconnect.js')
const httpUtils = require('../../util/httputils');
const redis = require('../../util/redis')



exports.create = async (req, reply) => { 
    try{
        // console.log("********************" +redis.testCache())
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

exports.accountInfo = async (req, reply) => { 
    try{
        // console.log("********************" +redis.testCache())
        console.log(req.body)
        console.log(httpUtils.hostURL)
        const response =  await redis.getAccountInfo(req.body.userId) ;
        console.log("%%%%%%%%%%%%%%%%%%%%%%"+response)
        
       
        if (response) {
            reply.status(StatusCodes.OK).send(response)
        } else  {
            reply.status(StatusCodes.NOT_FOUND).send({"message":"not found"})
        }
    }catch(error) {
	    console.log(error);
    }                                                                               
 }


 

exports.siginWithPassword = async (req, reply) => { 
    try{
        const response = await fetch(httpUtils.hostURL+'/v1/accounts:signInWithPassword?key='+httpUtils.apiKey, {
        method: 'POST',
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' }
    });
        const responseData = await response.json();
        console.log(responseData.localId)
        
        reply.status(response.status).send(responseData)
    }catch(error) {
	    console.log(error);
    }                                                                               
 }


 exports.root = async (req, reply) => { 
    try{        
        let response = {
                 "auth": "/account/auth",
                "newAccount": "/account/create"
         }
        reply.status(StatusCodes.OK).send(response)
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
    try{
        let uniqueId = dbConnection.executeSQL("SELECT TOP (1) id,firstName FROM [dbo].[customer_master] order by created_at DESC", (err, data,rows,jsonArray) => {
            if (err){
              console.error(err);
            }
           
            data.rows.forEach((column) => {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                     var accountId = JSON.stringify(column[0].value)
                     console.log("&&&&&"+JSON.stringify(column[0].value));
                     console.log("&&&&&"+JSON.stringify(column[1].value));
                    let responseData ={
                            "email": body.email,
                            "firstName":body.firstName,
                            "lastName":body.lastName,
                            "title":body.ttile,
                            "phone":body.phone,
                            "company":body.company,
                            "accountId":"otc"+(("0000" + accountId).slice())
                        }  
                        console.log(response.localId) 
                    redis.setAccountInfo(response.localId,JSON.stringify(responseData))
                    }
                });
         });
         console.log("***************"+uniqueId)
        }catch(error) {
            console.log(error)
        }
     ;
 }

 
 exports.getInfo = async (req, reply) => { 
    reply.send("Welcome to get")                                                                
 }

