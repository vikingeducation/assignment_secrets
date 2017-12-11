var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var models = require("./../models");
var Secret = models.Secret;
var User = models.User;

// new secret
router.post("/", async function(req, res) {
  try {
    let secret = new Secret({
      text: req.body.secret,
      author: req.user._id,
      approvedUsers: [req.user._id]
    });
    await secret.save();
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

router.get("/", async function(req, res) {
  console.log("inside get");
  try {
    let user = await User.find({ _id: req.user._id });
    console.log("inside find");
    let secrets = await Secret.find();
    let authSecretsIds = [];
    let authSecrets = [];
    console.log(user);
    user.authorizedSecrets.forEach(secretObj => {
      authSecretsIds.push(secretObj["_id"]);
    });
    let unauthSecrets = [];
    secrets.forEach(secret => {
      if (!authSecretsIds.includes(secret._id)) {
        unauthSecrets.push(secret);
      } else {
        authSecrets.push(secret);
      }
    });
    console.log("authSecrets");
    console.log(authSecrets);
    console.log("unauthSecrets");
    console.log(unauthSecrets);
    console.log("authSecretsIds");
    console.log(authSecretsIds);
    console.log("secrets");
    console.log(secrets);
    res.render("secretsIndex", { authSecrets, unauthSecrets });
  } catch (e) {}
});

module.exports = router;
