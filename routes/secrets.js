const express = require("express");
const router = express.Router();

// import models
const {User, Secret} = require("./../models");

//import custom middleware
const {
  createSignedSessionId,
  loginMiddleware,
  loggedInOnly,
  loggedOutOnly
} = require("./../services/Session");

// Secrets routes

//home
router.get("/", loggedInOnly, (req, res) => {
  res.render("home");
});

// new secret from home page
router.post("/new", (req, res) => {

  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (!user) return res.send("NO USER");

    if (user.validatePassword(password)) {
      const sessionId = createSignedSessionId(username);
      res.cookie("sessionId", sessionId);

      Secret.insert

      res.redirect('home')
    } else {
      res.send("UNCOOL");
    }
  });
});

module.exports = router;