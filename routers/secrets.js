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
    user.secrets.push(savedSecret._id);
    await user.save();
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

// displaying all secrets

router.get("/", async function(req, res) {
  try {
    let user = await User.findOne({ _id: req.user._id });
    let secrets = await Secret.find().populate("approvedUsers author");

    let authSecrets = [];

    let unauthSecrets = [];
    secrets.forEach(secret => {
      if (
        user.authorizedSecrets.filter(
          el => el.toString() === secret._id.toString()
        ).length > 0
      ) {
        authSecrets.push(secret);
      } else {
        unauthSecrets.push(secret);
      }
    });
    res.render("secretsIndex", {
      authSecrets,
      unauthSecrets,
      userId: req.user._id.toString()
    });
  } catch (e) {}
});

// requesting access to secret

router.post("/request", async (req, res, next) => {
  try {
    let secret = await Secret.findOne({ _id: req.body.secretId });
    let user = await User.findOne({ _id: req.body.userId });
    if (
      !(
        secret.requestedUsers.filter(
          el => el.toString() === user._id.toString()
        ).length > 0
      )
    ) {
      secret.requestedUsers.push(user._id);
      await secret.save();
    }

    res.redirect("back");
  } catch (e) {}
});

// displaying a user's secret

router.get("/yoursecrets", async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.user._id }).populate({
      path: "secrets",
      populate: { path: "requestedUsers", model: "User" }
    });

    res.render("home", { secrets: user.secrets });
  } catch (e) {}
});

// accpeting secret request

router.get("/accept", async (req, res, next) => {
  try {
    let secret = await Secret.findOne({ _id: req.body.secretId });
    let user = await User.findOne({ _id: req.body.userId });
    let index = secret.requestedUsers.findIndex(userObj => {
      return userObj._id.equals(user._id);
    });
    secret.requestedUsers.splice(index, 1);
    secret.approvedUsers.push(user._id);
    user.authorizedSecrets.push(secret._id);
    await secret.save();
    await user.save();

    res.render("home", { secrets: user.secrets });
  } catch (e) {}
});

module.exports = router;
