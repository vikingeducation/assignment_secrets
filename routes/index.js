var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var models = require("./../models");

var User = mongoose.model("User");
var Secret = mongoose.model("Secret");

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
  Secret.find({
    where: { author: req.user._id }
  })
    .then(secretList => {
      res.render("index", secretList);
    })
    .catch(e => res.status(500).send(e.stack));
});

router.post("/secret", loggedInOnly, (req, res) => {
  let secret = req.body.secret;
  console.log(secret);
  Secret.create({
    author: req.user._id,
    body: secret,
    viewers: [req.user._id]
  })
    .then(() => {
      res.redirect(h.indexPath());
    })
    .catch(e => res.status(500).send(e.stack));
});

module.exports = router;
