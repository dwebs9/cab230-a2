const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const options = require('../knexfile');
const knex = require('knex')(options);

// Knex test
// router.get('/knex', function(req,res,next) {
//   req.db.raw(   "SELECT VERSION()").then(
//     (version) => console.log (( version[0][ 0]))
//     ).catch((err) => {  console.log( err );  throw err }) 
//     res.send("Version Logged successfully");  
//     }); 

// http://131.181.190.87:3005/stocks/symbols?industry=Health
// Stocks/Symbols Route
router.get("/stocks/symbols", function(req,res){
  builder = req.db;
  console.log("builder's value is:");
  console.log(req.query.industry);

   builder.from('stocks').distinct("name", "symbol", "industry")
    .modify(function (builder){
        if(req.query.industry){
          console.log("industry queried");
          console.log(req.query.industry);
          builder.where('industry','like', req.query.industry);

        }
      }).then(function (rows) {
        console.log(rows);
        res.json(rows);
    })
    .catch((err) => {
      console.log(err);
      res.json({"Error" : true, "Message" : "Error executing MySQL query"})
    })
    

    
    //  req.db.distinct().from('stocks').select("name", "symbol", "industry")
    // .then((rows)=>{
    //   res.json({"Error" : false, "Message" : "Success", "stocks" : rows})
    // })

  
 
});


router.get("/stocks/:id", function(req,res){
  var query = "SELECT DISTINCT name, symbol, industry FROM ?? where ??=?"; 
  // console.log("req.params.id value is:")
  // console.log(req.params.id)
  var table =['stocks','symbol',req.params.id];
  query = mysql.format(query, table);
    req.db.query(query,function(err,rows){
  if(err) {
    res.json({"Error" : true, "Message" : "Error executing MySQL query"});
  } else {
  res.json({"Error" : false, "Message" : "Success", "stocks" : rows});
   console.log(rows);
  }
   });

});

// /stocks/authed/{symbol}
router.get("/stocks/authed/{symbol}", function(req,res){
  console.log("serving Route: /stocks/authed/{symbol}")
});


module.exports = router;
