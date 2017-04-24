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
    author: req.user._id
  })
    .populate("viewers")
    .then(secrets => {
      res.render("index", { secrets });
    })
    .catch(e => res.status(500).send(e.stack));
});

router.post("/secret", loggedInOnly, (req, res) => {
  let secret = req.body.secret;
  Secret.create({
    author: req.user._id,
    body: secret,
    viewers: [req.user._id]
  })
    .then(secret => {
      res.redirect(h.indexPath());
    })
    .catch(e => res.status(500).send(e.stack));
});

router.get("/secrets", loggedInOnly, (req, res) => {
  let accessibleSecrets;
  Secret.find(
    { viewers: { $in: [req.user._id] } },
    {
      _id: 0,
      body: 1,
      author: 1,
      viewers: { $elemMatch: { $eq: req.user._id } }
    }
  )
    //  .populate("viewers")
    .then(accessbile => {
      console.log("accessbile secrets", accessbile);
      accessibleSecrets = accessbile;
      return Secret.find(
        { viewers: { $nin: [req.user._id] } },
        {
          _id: 0,
          body: 1,
          author: 1,
          viewers: { $elemMatch: { $ne: req.user._id } }
        }
      );
    })
    .then(unavailableSecrets => {
      console.log("unavailableSecrets: ", unavailableSecrets);
      res.render("secrets/index", { accessibleSecrets, unavailableSecrets });
    })
    .catch(e => res.status(500).send(e.stack));
});

router.post("/share", (req, res) => {
  Secret.update({
    _id: req.body.secretId
  })
    .then()
    .catch(e => res.status(500).send(e.stack));
});

module.exports = router;
