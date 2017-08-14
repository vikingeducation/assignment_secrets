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
// 2
router.get("/", loggedOutOnly, (req, res) => {
  res.render("login");
});

router.post("/", (req, res) => {
  // 3
  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (!user) return res.send("NO USER");

    // 4
    if (user.validatePassword(password)) {
      const sessionId = createSignedSessionId(username);
      res.cookie("sessionId", sessionId);
//      res.redirect("/");
//      req.flash("success", `Login Successful for user ${user.username}`);
      res.send(`Login Successful for user ${user.username}`)
    } else {
      res.send("UNCOOL");
    }
  });
});

module.exports = router;
