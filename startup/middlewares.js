var cookieParser = require("cookie-parser");
var logger = require("morgan");
var express = require("express");
const cors = require("cors");
var path = require("path");

module.exports = (app) => {
  app.use(logger("dev"));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(cors());
  app.use(express.static(path.join(__dirname, "public")));
};
