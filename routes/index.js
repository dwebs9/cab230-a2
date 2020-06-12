const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const options = require('../knexfile');
const knex = require('knex')(options);
const jwt = require('jsonwebtoken');
const { BadRequest } = require('http-errors');
const { query } = require('express');
const secretKey = "secret key"

function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}
// Stocks/Symbols with optional filter by industry
router.get("/stocks/symbols", function(req,res){
  builder = req.db;
   builder.from('stocks').distinct("name", "symbol", "industry")
    .modify(function (builder){
        console.log("undefined ?");
        console.log(typeof req.query);
        // there was no query, proceed to all industries
        if(isEmpty(req.query)){
          console.log("noquery");
      
          return;

        }

        if(typeof req.query.industry !='undefined'){
          console.log("valid query industry is:");
          console.log(req.query.industry);

          builder.where('industry','like', '%' + req.query.industry + '%');
         

          return;

        }

        res.status(400).json({"error" : true, "message" : 'Bad Request'})
        // throw 400;

      }).then(function (rows) {
          console.log("then")
        if(rows == 0){
          console.log("Not found")
          res.status(404).json({"error" : true, "message" : 'Not Found'})
          return 
        }
        res.json(rows);
    })
    .catch((err) => {
      console.log("catch")
      // res.status(400).json({"error" : true, "message" : "Invalid query parameter: only 'industry' is permitted"})
    })
 
});

// Route for returning latest entry of a particular stock
router.get("/stocks/:id", function(req,res){
  builder = req.db;
  console.log(req.query);
  console.log(isEmpty(req.query));
  builder.from('stocks').distinct("timestamp","name", "symbol", "industry", "open","high", "low","close","volumes").where("symbol",req.params.id)
    .then(function (rows) {
      console.log("then")
      console.log(rows.length);
      if(rows.length==0){
        res.status(404).json({"error" : true, "message" : "No entry for symbol in stocks database"})
      
      }
      if(!isEmpty(req.query)){
        res.status(400).json({"Error" : true, "message" : "Bad Request"})
        return
      }
  res.json(rows[0]);
    }).catch((err) => {
      console.log("catch")
  res.status(404).json({"Error" : true, "message" : "Error executing MySQL query"})
})
});

const authorize = (req, res, next ) =>{
  const authorization = req.headers.authorization
  let token = null;


  // Retrieve token
  if(authorization && authorization.split(" ").length == 2){
    token = authorization.split(" ")[1]
    console.log("Token: ", token)

  }else{
    console.log("Unauthroized user")
    return
  }
  try{
    const decoded = jwt.verify(token, secretKey)

    if(decoded.exp < Date.now()){
      console.log("Token has expired")
      return
    }
    next()
  }catch(err){
    console.log("Token is not valid: ", err)
  }
}

// Authed route and filter by timestamps range
router.get("/stocks/authed/:id", authorize, function(req,res){
  console.log("Authed route");
  builder = req.db;
  builder.from('stocks').distinct("timestamp","name", "symbol", "industry", "open","high", "low","close","volumes").where("symbol",req.params.id)
    .modify(function (builder){
      console.log("Ready to modify");
      console.log(req.query);
        if(req.query.from){
          console.log(req.query.from);
          builder.whereBetween('timestamp', [req.query.from, req.query.to]);
        }
      }).then(function (rows) {
        res.json(rows);
    })
    .catch((err) => {
      console.log(err);
      res.json({"Error" : true, "message" : "Error executing MySQL query"});
    })
 
});




module.exports = router;
