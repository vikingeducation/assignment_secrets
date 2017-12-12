const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const models = require("./../models");
const User = mongoose.model("User");
const {
  createSignedSessionId,
  loginMiddleware,
  loggedInOnly,
  loggedOutOnly
} = require("../services/Session");

router.get("/login", loggedOutOnly, (req, res) => {
  res.render("login");
});

router.get("/register", loggedOutOnly, (req, res) => {
  res.render("register");
});

router.get("/logout", (req, res) => {
  res.cookie("sessionId", "", { expires: new Date() });
  res.redirect("/");
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (!user) {
      return res.redirect("/register");
    }

    if (user.validatePassword(password)) {
      const sessionId = createSignedSessionId(email);
      res.cookie("sessionId", sessionId);
      res.redirect("/");
    } else {
      req.flash("danger", "Incorrect password!");
      res.redirect("/");
    }
  });
});

router.post("/register", (req, res) => {
  const { email, password, username } = req.body;

  const newUser = new User({ email, password, username });
  newUser.save((err, user) => {
    if (err) return res.send("ERROR");

    const sessionId = createSignedSessionId(email);
    res.cookie("sessionId", sessionId);
    req.flash("success", "New user is created!");
    res.redirect("/");
  });
});

module.exports = router;