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

    let savedSecret = await secret.save();
    let user = await User.findOne(req.user._id);
    console.log(user);
    user.authorizedSecrets.push(savedSecret._id);
    await user.save();
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

router.get("/", async function(req, res) {
  try {
    let user = await User.findOne({ _id: req.user._id });
    let secrets = await Secret.find();


    let authSecrets = [];
    console.log(user.authorizedSecrets);

    let unauthSecrets = [];
    secrets.forEach(secret => {
      console.log(typeof secret._id);
      console.log(typeof user.authorizedSecrets[0]);
      if (user.authorizedSecrets.includes(secret._id)) {
        authSecrets.push(secret);
      } else {
        unauthSecrets.push(secret);
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