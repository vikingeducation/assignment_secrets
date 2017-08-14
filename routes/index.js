var express = require("express");
var router = express.Router();

const User = require("../models");
const { loggedInOnly, loggedOutOnly } = require("../services/Session");

/* GET home page. */
router.get("/", loggedInOnly, function(req, res, next) {
  //console.log(req.cookies);

  res.render("index", { title: "Express" });
});

router.get("/login", loggedOutOnly, function(req, res, next) {
  res.render("login", { title: "Express" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(User);
  const user = await User.find({ email });
  console.log(user);
  if (!user) return res.send("NO USER");

  // 4
  if (user.validatePassword(password)) {
    const sessionId = createSignedSessionId(email);
    res.cookie("sessionId", sessionId);
    console.log(req.sessionId);
    res.redirect("/");
  } else {
    res.send("UNCOOL");
  }
});

module.exports = router;
