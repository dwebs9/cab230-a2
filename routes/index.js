const express = require('express');
const mysql = require('mysql');
const router = express.Router();



/* GET home page. */
router.get("/api/city",function(req,res){
  var query = "SELECT name, district FROM ??";
  var table = ["city"];
  query = mysql.format(query,table);
  req.db.query(query,function(err,rows){
  if(err) {
    res.json({"Error" : true, "Message" : "Error executing MySQL query"});
  } else {
  res.json({"Error" : false, "Message" : "Success", "City" : rows});
  }
  });
});

router.get("/api/city/:CountryCode",function(req,res){
  var query = "SELECT * FROM ?? WHERE ??=?";
  var table = ["city","CountryCode",req.params.CountryCode];
  query = mysql.format(query,table);
  req.db.query(query,function(err,rows){
    if(err) {
    res.json({"Error" : true, "Message" : "Error executing MySQL query"});
    } else {
    res.json({"Error" : false, "Message" : "Success", "Cities" : rows});
    }
    });
   });

module.exports = router;
