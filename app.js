var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const helmet = require('helmet');
const cors = require('cors');
const options = require('./knexfile.js');
const knex = require('knex')(options);
const swaggerUI =  require('swagger-ui-express'); 
yaml = require('yamljs');
swaggerDocument = yaml.load('./docs/swagger.yaml');  

// import modules
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/user");

// Server initialization imports for https and certification
const fs  =  require('fs' ); 
const https = require('https');  
const privateKey =  fs.readFileSync('/etc/ssl/private/node-selfsigned.key','utf8'); 
const certificate =  fs.readFileSync('/etc/ssl/certs/node-selfsigned.crt','utf8');  
const credentials = { key:    privateKey,    cert: certificate}; 

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(helmet());
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Required the DB
app.use((req, res, next)=>{
  req.db = knex
  next()
})

//use Routes
app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Run the server
const server =  https.createServer(credentials,app);  
server.listen(403);

module.exports = app;
