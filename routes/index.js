const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const options = require('../knexfile');
const knex = require('knex')(options);


// Stocks/Symbols with optional filter by industry
router.get("/stocks/symbols", function(req,res){
  builder = req.db;
   builder.from('stocks').distinct("name", "symbol", "industry")
    .modify(function (builder){
        if(req.query.industry){
          builder.where('industry','like', req.query.industry);
        }
      }).then(function (rows) {
        /// IF the industr
        console.log("Error!")
        console.log(rows == 0)
        if(rows == 0){
        
          res.status(400).json({"error" : true, "message" : 'Bad Request'})
          return 
        }
        res.json(rows);
    })
    .catch((err) => {
      res.status(400).json({"error" : true, "message" : "Invalid query parameter: only 'industry' is permitted"})
    })
 
});

// Route for returning latest entry of a particular stock
router.get("/stocks/:id", function(req,res){
  builder = req.db;
  builder.from('stocks').distinct("timestamp","name", "symbol", "industry", "open","high", "low","close","volumes").where("symbol",req.params.id)
    .then(function (rows) {
      console.log(rows.length);
      if(rows.length==0){
        res.status(404).json({"error" : true, "message" : "No entry for symbol in stocks database"})
      
      }
  res.json(rows[1]);
    }).catch((err) => {

  res.status(404).json({"Error" : true, "Message" : "Error executing MySQL query"})
})
});

const authorize = (req, res, next ) =>{
  const authorization = req.headers.authorization
  let token = null;


  // Retrieve token
  if(authorization && authorization.split(" ").length == 2){
    token = authroization.split(" ")[1]
    console.log("Token: ", token)

  }else{
    console.log("Unauthroized user")
    return
  }
  try{
    const decode = jwt.verify(token, secretKey)

    if(decoded.exp < Date.now()){
      console.log("Token has expired")
      return
    }
    next()
  }catch(e){
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
      res.json({"Error" : true, "Message" : "Error executing MySQL query"});
    })
 
});




module.exports = router;
