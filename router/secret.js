var express = require("express");
var router = express.Router();

//mongoose
const mongoose = require("mongoose");
var models = require("./../models");
var User = mongoose.model("User");
var Secret = mongoose.model("Secret");
var Secretrequest = mongoose.model("Secretrequest");
// const {
//   createSignedSessionId,
//   loginMiddleware,
//   loggedInOnly,
//   loggedOutOnly
// } = require("../services/sessions");

module.exports = app => {
  router.get("/", async (req, res) => {
    var user = await User.findOne({ username: req.user.username });
    var selfSecrets = await Secret.find({ createdBy: user.id }).populate({
      path: "createdBy",
      model: "User"
    });
    var otherSecrets = await Secret.find({
      createdBy: { $ne: user.id },
      permissions: user.id
    }).populate({
      path: "createdBy",
      model: "User"
    });
    var requests = await Secretrequest.find({ postAuthor: user.id })
      .populate({ path: "post", model: "Secret" })
      .populate({ path: "requesting", model: "User" });
    res.render("secrets/start", { selfSecrets, otherSecrets, requests });
  });

  router.post("/newSecret", async (req, res) => {
    var user = await User.findOne({ username: req.user.username });
    var newSe = new Secret({
      post: req.body.newSecret,
      createdBy: user.id,
      permissions: [user.id]
    });
    newSe.save();
    res.redirect("/secret");
  });

  router.get("/all", async (req, res) => {
    var user = await User.findOne({ username: req.user.username });
    var posts = await Secret.find()
      .populate({ path: "createdBy", model: "User" })
      .populate({ path: "permissions", model: "User" });
    res.render("secrets/all", { posts });
  });

  return router;
};
