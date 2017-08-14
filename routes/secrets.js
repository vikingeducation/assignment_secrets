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
  return res.render("home");
});

// new secret from home page
router.post("/new", (req, res) => {
  const { username, password } = req.cookies.sessionId;

  User.findOne({ username }, (err, user) => {
    if (!user) return res.send("NO USER");
      return new Secret({
          body: req.body.body,
          owner: user.id,
          requestedViewers: [],
          approvedViewers: [user.id]
      }).save()

    } else {
      return res.send("UNCOOL");
    }
  })
  .then((secret) => {
    return res.redirect('home')
  })
});

module.exports = router;
