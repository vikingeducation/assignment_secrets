var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var models = require("./../models");

var User = mongoose.model("User");
var Secret = mongoose.model("Secret");

var Cipher = require("../lib/Cipher");

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
    .populate("requests")
    .then(secrets => {
      let requests = secrets.filter(secret => {
        return secret.requests.length > 0;
      });
      res.render("index", { secrets, requests });
    })
    .catch(e => res.status(500).send(e.stack));
});

router.post("/secret", loggedInOnly, (req, res) => {
  let secret = req.body.secret;
  let key = req.body.cipherKey;
  if (key) {
    let encrypted = Cipher.encrypt(secret, key);
    Secret.create({
      author: req.user._id,
      body: encrypted,
      viewers: [req.user._id],
      cipher: true
    })
      .then(secret => {
        res.redirect(h.indexPath());
      })
      .catch(e => res.status(500).send(e.stack));
  } else {
    Secret.create({
      author: req.user._id,
      body: secret,
      viewers: [req.user._id],
      cipher: false
    })
      .then(secret => {
        res.redirect(h.indexPath());
      })
      .catch(e => res.status(500).send(e.stack));
  }
});

router.get("/secrets", loggedInOnly, (req, res) => {
  let accessibleSecrets;
  Secret.find(
    { viewers: { $in: [req.user._id] } },
    {
      _id: 1,
      body: 1,
      author: 1,
      viewers: { $elemMatch: { $eq: req.user._id } }
    }
  )
    .populate("author")
    .then(accessible => {
      accessibleSecrets = accessible;
      return Secret.find(
        { viewers: { $nin: [req.user._id] } },
        {
          _id: 1,
          body: 1,
          author: 1,
          cipher: 1,
          viewers: { $elemMatch: { $ne: req.user._id } }
        }
      ).populate("author");
    })
    .then(unavailableSecrets => {
      console.log("unavailableSecrets: ", unavailableSecrets);
      res.render("secrets/index", { accessibleSecrets, unavailableSecrets });
    })
    .catch(e => res.status(500).send(e.stack));
});

router.post("/share", (req, res) => {
  Secret.findByIdAndUpdate(req.body.secretId, {
    $addToSet: { requests: req.body.currentUserId }
  })
    .then(data => {
      res.redirect("back");
    })
    .catch(e => res.status(500).send(e.stack));
});

router.post("/approve", (req, res) => {
  Secret.findByIdAndUpdate(req.body.secretId, {
    $pull: { requests: req.body.userId },
    $push: { viewers: req.body.userId }
  })
    .then(data => {
      res.redirect("back");
    })
    .catch(e => res.status(500).send(e.stack));
});

router.post("/deny", (req, res) => {
  Secret.findByIdAndUpdate(req.body.secretId, {
    $pull: { requests: req.body.userId }
  })
    .then(data => {
      res.redirect("back");
    })
    .catch(e => res.status(500).send(e.stack));
});

router.post("/guessCipher", (req, res) => {
  let cipher = req.body.cipher;
  let body = req.body.secretBody;
  let decrypted = Cipher.decrypt(body, cipher);
  console.log("-----");
  console.log(decrypted);
  // get the decrypted message and then render a flash
  req.flash("error", decrypted);
  res.redirect("back");
});

module.exports = router;
