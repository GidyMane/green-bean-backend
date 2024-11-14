var createError = require("http-errors");
require("dotenv").config();
var express = require("express");
var path = require("path");
const PORT = process.env.PORT || 8000;

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public/stylesheets')));

// initial startup config
require("./startup/middlewares")(app);
require("./startup/routes")(app);
require("./startup/db");

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

const server = app.listen(PORT,  () =>
  console.log(`Listening on port ${PORT}... `)
);

module.exports = server;

module.exports = app;
