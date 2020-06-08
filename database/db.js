const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Cab230!",
  database: "world",
});


connection.connect(function (err) {
    
  if (err) throw err;
  console.log("A CONNECTION HAS BEEN MADE")
});

module.exports = (req, res, next) => {
    console.log("Modlue exported")
  req.db = connection;
  next();
};
