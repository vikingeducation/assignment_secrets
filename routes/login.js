const express = require('express');
const router = express.Router();
const models = require('./../models');
const User = models.User;
const h = require('./../helpers').registered;

// Login routes
router.get("/", h.loggedOutOnly, (req, res) => {
  res.render("login");
});

router.post("/", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (!user) return res.send("NO USER");

    if (user.validatePassword(password)) {
      const sessionId = h.createSignedSessionId(email);
      res.session.id = sessionId;
      // res.cookie("sessionId", sessionId);
      res.redirect("/");
    } else {
      res.send("UNCOOL");
    }
  });
});

module.exports = router;