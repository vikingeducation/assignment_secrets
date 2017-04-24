var express = require("express");
var router = express.Router();
// var mongoose = require("mongoose");
// var models = require("./../models");

// // var User = mongoose.model("User");
var {
  createSignedSessionId,
  loginMiddleware,
  loggedOutOnly,
  loggedInOnly
} = require("../services/Session");

// Route helpers
var helpers = require("../helpers");
var h = helpers.registered;

router.get("/", loggedInOnly, (req, res) => {
  res.render("index");
});

module.exports = router;
