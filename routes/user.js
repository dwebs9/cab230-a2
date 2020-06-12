const express = require('express');
const router = express.Router();
const options = require('../knexfile');
const knex = require('knex')(options);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')



/* GET users listing. */
router.post('/register', function(req, res, next) {
  console.log("Route hit");
  console.log("email");
  console.log(req.body.email);
  const email = req.body.email
  const password = req.body.password
  console.log(email);



  // Verify body
  if(!email || !password){
    console.log("body verified");
    res.status(400).json({
      error: true,
      message: "Request body incomplete - email and password needed"
    })
    return
  }

 const queryUsers = req.db.from("users").select("*").where("email", "=", email);

    queryUsers
      .then((users) => {
        if(users.length > 0){
          console.log("Users already exists");
          return;
          
        }
        console.log("Hashing password");
        // Insert user into DB
        const saltRounds = 10
        const hash = bcrypt.hashSync(password, saltRounds)
        return req.db.from("users").insert({email,hash})
       
      })
      .then(() => {
        res.status(201).json({success: true, message: "User created "})
      })
     
    return

});

router.post("/login", function(req, res, next){
  const email = req.body.email
  const password = req.body.password

  // Verify body
  if(!email || !password){
    console.log("body verified");
    res.status(400).json({
      error: true,
      message: "Request body incomplete - email and password needed"
    })
    return
  }
  const queryUsers = req.db.from("users").select("*").where("email", "=", email);

    queryUsers
      .then((users) => {
        if(users.length == 0){
          res.status(401).json({
            error: true,
            message: "Created"
          })
          return;
        }

       const user = users[0]
       return bcrypt.compare(password, user.hash)
       
      })
      .then((match) => {
        if(!match){
          res.status(401).json({
            error: true,
            message: "Created"
          })
          return
        }
        // Create and return JWT token
        const secretKey = "secret key"
        const expires_in = 60 * 60 * 24
        const exp = Date.now() + expires_in * 1000
        const token = jwt.sign({email,exp}, secretKey)
        res.json({token_type: "Bearer", token, expires_in})
        console.log("Passwords match")
      })
     
    return

});

module.exports = router;
