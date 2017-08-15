const router = require("express").Router();
const { User } = require("../models");
const { createSignedSessionId, loggedOutOnly } = require("../services/Session");

// Create session helper
const createSession = (res, username) => {
  const sessionId = createSignedSessionId(username);
  res.cookie("sessionId", sessionId);
  res.redirect("/");
};

// Login routes
router.get("/login", loggedOutOnly, (req, res) => res.render("auth/login"));

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then(user => {
      if (!user) {
        req.flash("error", "No such user");
        res.redirect("back");
      } else if (user.validatePassword(password)) {
        createSession(res, username);
      } else {
        req.flash("error", "Bad password");
        res.redirect("back");
      }
    })
    .catch(e => res.status(500).end(e.stack));
});

// Registration Routes
router.get("/register", loggedOutOnly, (req, res) =>
  res.render("auth/register")
);

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  User.create({ username, password })
    .then(user => createSession(res, username))
    .catch(e => res.status(500).end(e.stack));
});

// Logout route
router.get("/logout", (req, res) => {
  res.cookie("sessionId", "", { expires: new Date() });
  res.redirect("/");
});

module.exports = router;
