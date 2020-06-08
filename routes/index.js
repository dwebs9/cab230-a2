const express = require('express');
const mysql = require('mysql');
const router = express.Router();





// Stocks/Symbols Route
router.get("/stocks/symbols", function(req,res){
    var query = "SELECT name, symbol, industry FROM ??";
    var table = ["stocks"];  
    query = mysql.format(query,table);
      req.db.query(query,function(err,rows){
  if(err) {
    res.json({"Error" : true, "Message" : "Error executing MySQL query"});
  } else {
  res.json({"Error" : false, "Message" : "Success", "stocks" : rows});
  }
  });
  console.log("serving Route: /stocks/symbols")
})
// /stocks/{symbol}
router.get("/stocks/:id", function(req,res){
  console.log("serving Route: /stocks/:id")
})

// /stocks/authed/{symbol}
router.get("/stocks/authed/{symbol}", function(req,res){
  console.log("serving Route: /stocks/authed/{symbol}")
})


// /* GET home page. */
// router.get("/api/city",function(req,res){
//   var query = "SELECT name, district FROM ??";
//   var table = ["city"];
//   query = mysql.format(query,table);
//   req.db.query(query,function(err,rows){
//   if(err) {
//     res.json({"Error" : true, "Message" : "Error executing MySQL query"});
//   } else {
//   res.json({"Error" : false, "Message" : "Success", "City" : rows});
//   }
//   });
// });

// router.get("/api/city/:CountryCode",function(req,res){
//   var query = "SELECT * FROM ?? WHERE ??=?";
//   var table = ["city","CountryCode",req.params.CountryCode];
//   query = mysql.format(query,table);
//   req.db.query(query,function(err,rows){
//     if(err) {
//     res.json({"Error" : true, "Message" : "Error executing MySQL query"});
//     } else {
//     res.json({"Error" : false, "Message" : "Success", "Cities" : rows});
//     }
//     });
//    });

module.exports = router;
