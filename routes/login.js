const express = require('express');
const router = express.Router();
const models = require('./../models');
const User = models.User;
const h = require('./../helpers').registered;


router.get("/", h.loggedOutOnly, (req, res) => {
  res.render("login/index");
});

router.post("/", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        req.flash('error', "Error: User could not be found. Please try again or register a new account.");
        res.redirect("/");
      }

      if (user.validatePassword(password)) {
        const sessionId = h.createSignedSessionId(email);
        req.session.id = sessionId;
        req.flash('success', 'Welcome back.');
        res.redirect("/");
      } else {
        req.flash('error', "Error: Password incorrect. Please try again.");
        res.redirect("/");
      }
    })
    .catch(e => {
      if (e.errors) {
        let errors = Object.keys(e.errors);

        errors.forEach(error => {
          req.flash('error', e.errors[error].message);
          console.log(e.errors[error].message);
        });
        res.redirect('back');
      } else {
        res.status(500).send(e.stack);
      }
    });
});

module.exports = router;