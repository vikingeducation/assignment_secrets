var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
//var models = require("./../models");
//var User = mongoose.model("User");

router.get("/", (req, res) => {
  res.render("login/index");
});

router.post("/", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
});

module.exports = router;
