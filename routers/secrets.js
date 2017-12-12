const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const models = require("./../models");
const User = mongoose.model("User");
const Secret = mongoose.model("Secret");
const { loggedInOnly } = require("../services/Session");

router.get("/", loggedInOnly, (req, res) => {
  Secret.ownedByMe(req.user._id).then(secrets => {
    Secret.userHasAccess(req.user._id).then(accessedSecrets => {
      res.render("home", { secrets, accessedSecrets });
    });
  });
});

router.get("/all", (req, res) => {
  Secret.all(req.user._id).then(secrets => {
    Secret.userRequested(req.user._id).then(requestedSecrets => {
      res.render("secrets", { secrets, requestedSecrets });
    });
  });
});

router.post("/new", (req, res) => {
  let userId = req.user._id;
  let newSecret = req.body.newSecret;
  var secret = new Secret({
    ownerId: userId,
    body: newSecret
  });
  secret
    .save()
    .then(() => {
      req.flash("success", "Secret is added!");
      res.redirect("/");
    })
    .catch(e => res.status(500).send(e.stack));
});

router.post("/request", (req, res) => {
  Secret.findByIdAndUpdate(req.body.secretId, {
    $push: { requestedUsers: req.user._id }
  }).then(() => {
    req.flash("success", "Request is sent!");
    res.redirect("/all");
  });
});

router.post("/accept", (req, res) => {
  Secret.findByIdAndUpdate(req.body.secretId, {
    $pull: { requestedUsers: req.body.giveAccessId },
    $push: { authorizedUsers: req.body.giveAccessId }
  }).then(() => {
    req.flash("success", "You accepted the request!");
    res.redirect("/");
  });
});

router.post("/reject", (req, res) => {
  Secret.findByIdAndUpdate(req.body.secretId, {
    $pull: { requestedUsers: req.body.giveAccessId }
  }).then(() => {
    req.flash("success", "You rejected the request!");
    res.redirect("/");
  });
});

module.exports = router;