const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const options = require('../knexfile');
const knex = require('knex')(options);



/* GET users listing. */
router.get('/user/register', function(req, res, next) {
  if(!req.body.username || !req.body.password ){
    res.status(400).json({message: "Request body incomplete - email and password needed"}));
    console.log (`Error on request body:`,  JSON.stringify(req.body));
  }else{
    const u = ({'username': req.body.username});
    const password = ({'password': req.body.password});
    
    // Some code checking if that usernaem exists
    req.db('stocks')inst.where(username)
  }
});

module.exports = router;
