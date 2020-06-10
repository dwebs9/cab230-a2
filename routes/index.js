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
        res.json(rows);
    })
    .catch((err) => {
      console.log(err);
      res.json({"Error" : true, "Message" : "Error executing MySQL query"})
    })
 
});

// Route for returning latest entry of a particular stock
router.get("/stocks/:id", function(req,res){
  builder = req.db;
  console.log(req.params.id)
  builder.from('stocks').distinct("timestamp","name", "symbol", "industry", "open","high", "low","close","volumes").where("symbol",req.params.id)
    .then(function (rows) {
  res.json(rows[0]);
})    .catch((err) => {
  console.log(err);
  res.json({"Error" : true, "Message" : "Error executing MySQL query"})
})
});

// Stocks/Symbols with optional filter by industry
router.get("/stocks/authed/:id", function(req,res){
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

// // /stocks/authed/{symbol}
// router.get("/stocks/authed/{symbol}", function(req,res){
//   console.log("serving Route: /stocks/authed/{symbol}")
// });


module.exports = router;
