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
            setSession(req, responseData.expiresIn)
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
        console.log("*********Session***********" +req.session.email)
        if (req.session.email == req.body.email) {
            console.log("*********Session***********" +req.session.email)
            console.log(req.body)
            console.log(httpUtils.hostURL)
            // getAccountFromDB (req).then(function(res){
            //     console.log(":::::::::::"+res);
            // });
            const response =    getAccountFromDB (req,reply);
            console.log("%%%%%%%%%%%%%%%%%%%%%%"+response)
            // if (response) {
            //     reply.status(StatusCodes.OK).send(response)
            // } else  {
            //     reply.status(StatusCodes.NOT_FOUND).send({"message":"not found"})
            // }
        } else{
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
        if (response.status == StatusCodes.OK) {
            setSession(req, 3600)
            reply.status(response.status).send(responseData)
        }
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

 function setSession(req,expireIn) {
    console.log(expireIn)
    req.session.email=req.body.email
    // var hour = parseInt(expireIn)
    // req.session.cookie.expires = new Date(Date.now() + hour);

    // req.session.cookie.maxAge = hour

 
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

  const getAccountFromDB = (request,reply) => {
    try{
        var accountData;
         let uniqueId = dbConnection.executeSQL("SELECT  id,firstName,lastName,title,phone,company,email,created_at FROM [dbo].[customer_master] where email='"+request.body.email+"'", (err, data,rows,jsonArray) => {
            if (err){
              console.error(err);
            }
           
            data.rows.forEach((column) => {
                if (column.value === null) {
                    console.log('NULL');
                    // reply.status(StatusCodes.NOT_FOUND).send({"message":"not ***found"})
                } else {
                     var accountId = JSON.stringify(column[0].value)
                       
                     accountData ={
                             "firstName":column[1].value,
                            "lastName":column[2].value,
                            "title":column[3].value,
                            "phone":column[4].value,
                            "company":column[5].value,
                            "email": column[6].value,
                            "accountId":"otc"+(("0000" + accountId).slice()),
                            "created_at":column[7].value
                        }  
                        console.log("---------"+JSON.stringify(accountData))
                        if (accountData) {
                            reply.status(StatusCodes.OK).send(accountData)
                        } else  {
                            reply.status(StatusCodes.NOT_FOUND).send({"message":"not found"})
                        }
                    }
                });
                 
         });
        //  reply.status(StatusCodes.NOT_FOUND).send({"message":"not found"})
        console.log("Outside")
        }catch(error) {
            console.log(error)
        }
        console.log("++++++++++"+accountData)
        // return JSON.stringify(accountData)
 }

 
 exports.getInfo = async (req, reply) => { 
    reply.send("Welcome to get")                                                                
 }

