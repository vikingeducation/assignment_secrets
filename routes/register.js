const express = require('express');
const router = express.Router();
const models = require('./../models');
const User = models.User;
const h = require('./../helpers').registered;

// Registration Routes
router.get("/", h.loggedOutOnly, (req, res) => {
  res.render("register");
});

router.post("/", (req, res) => {
  const { email, password } = req.body;
  const newUser = new User({ email, password });
  newUser.save((err, user) => {
    if (err) return res.send("ERROR");

    const sessionId = h.createSignedSessionId(email);
    res.session.id = sessionId;
    // res.cookie("sessionId", sessionId);
    res.redirect("/");
  });
});

module.exports = router;