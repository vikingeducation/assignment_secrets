const express = require("express");
const router = express.Router();

// import user model
const User = require("./../models/User");
const {
  createSignedSessionId,
  loginMiddleware,
  loggedInOnly,
  loggedOutOnly
} = require("./../services/Session");

// Login routes

router.get("/", loggedOutOnly, (req, res) => {
  res.render("login");
});

// router.get("/", loggedInOnly, (req, res) => {
//   res.redirect("/home");
// });

router.post("/", (req, res) => {
 
  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (!user) return res.send("NO USER");

    if (user.validatePassword(password)) {
      const sessionId = createSignedSessionId(username);
      console.log(sessionId)
      res.cookie("sessionId", sessionId);

//      res.redirect("/");
//      req.flash("success", `Login Successful for user ${user.username}`);
      res.redirect('/secrets')
    } else {
      res.send("UNCOOL");
    }
  });
});

module.exports = router;
