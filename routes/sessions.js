var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var models = require("./../models");

var User = mongoose.model("User");
var {
  createSignedSessionId,
  loginMiddleware,
  loggedOutOnly,
  loggedInOnly
} = require("../services/Session");

// Route helpers
var helpers = require("../helpers");
var h = helpers.registered;

router.get("/login", loggedOutOnly, (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  User.create({
    email: email,
    password: password
  })
    .then(user => {
      console.log("New user created: ", user);
      res.cookie("sessionId", createSignedSessionId(user.email));
      res.redirect(h.indexPath());
    })
    .catch(e => res.status(500).send(e.stack));
});

router.get("/logout", (req, res) => {
  res.cookie("sessionId", "", { expires: new Date() });
  res.redirect("/login");
});

module.exports = router;
