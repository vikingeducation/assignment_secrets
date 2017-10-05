var express = require("express");
var router = express.Router();

//mongoose
const mongoose = require("mongoose");
var models = require("./../models");
var User = mongoose.model("User");
var Secret = mongoose.model("Secret");
var Secretrequest = mongoose.model("Secretrequest");

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
    //check posts for permission
    for (var i = 0; i < posts.length; i++) {
      var keep = false;
      for (var j = 0; j < posts[i].permissions.length; j++) {
        if (posts[i].permissions[j].username === user.username) {
          keep = true;
        }
      }
      if (!keep) {
        posts[i].post = "";
      }
    }
    res.render("secrets/all", { posts });
  });

  router.get("/approval/:reqId", async (req, res) => {
    var requestItem = await Secretrequest.findById(req.params.reqId).populate({
      path: "post",
      model: "Secret"
    });
    console.log(requestItem);
    var updatedPost = requestItem.post;
    updatedPost.permissions.push(requestItem.requesting);
    updatedPost.save(function(err) {
      if (err) {
        console.log("ERRRRR");
      } else {
        Secretrequest.findByIdAndRemove(requestItem.id).then(() => {
          res.redirect("back");
        });
      }
    });
  });

  router.get("/denail/:reqId", (req, res) => {
    res.redirect("back");
  });

  router.get("/request/:postId/:createdById", async (req, res) => {
    var newRequest = new Secretrequest({
      post: req.params.postId,
      postAuthor: req.params.createdById,
      requesting: req.user._id
    });
    newRequest.save(function(err) {
      if (err) {
        console.log("ERRRR");
      } else {
        res.redirect("back");
      }
    });
  });

  return router;
};
