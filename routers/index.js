const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const models = require("./../models");
const User = mongoose.model("User");
const Secret = mongoose.model("Secret");
const {
  createSignedSessionId,
  loginMiddleware,
  loggedInOnly,
  loggedOutOnly
} = require("../services/Session");
const findSecrets = require("../lib/findSecrets");

router.get("/", loggedInOnly, (req, res) => {
  findSecrets.ownedByMe(req.user._id).then(secrets => {
    res.render("home", { secrets });
  });
});

router.get("/login", loggedOutOnly, (req, res) => {
  res.render("login");
});

router.get("/register", loggedOutOnly, (req, res) => {
  res.render("register");
});

router.get("/logout", (req, res) => {
  res.cookie("sessionId", "", { expires: Date.now() });
  res.redirect("/");
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (!user) return res.send("NO USER");

    if (user.validatePassword(password)) {
      const sessionId = createSignedSessionId(email);
      res.cookie("sessionId", sessionId);
      res.redirect("/");
    } else {
      res.send("WRONG PASSWORD");
    }
  });
});

router.post("/register", (req, res) => {
  const { email, password, username } = req.body;

  // This virtual password field will automatically hash our password
  const newUser = new User({ email, password, username });
  newUser.save((err, user) => {
    if (err) return res.send("ERROR");

    // Once the user is created, we create the sessionId and redirect, just as
    // we did in the login POST route
    const sessionId = createSignedSessionId(email);
    res.cookie("sessionId", sessionId);
    res.redirect("/");
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
      res.redirect("/");
    })
    .catch(e => res.status(500).send(e.stack));
});

module.exports = router;
