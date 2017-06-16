const express = require('express');
const router = express.Router();
const models = require('./../models');
const User = models.User;
const h = require('./../helpers').registered;

router.get("/", h.loggedOutOnly, (req, res) => {
  res.render("register/index");
});

router.post("/", (req, res) => {
  const { email, password } = req.body;
  const newUser = new User({ email, password, requests: [] });
  newUser.save()
    .then(user => {
      const sessionId = h.createSignedSessionId(email);
      req.session.id = sessionId;
      req.flash('success', "Welcome!");
      res.redirect("/");
    })
    .catch(e => {
      if (e.errors) {
        let errors = Object.keys(e.errors);

        errors.forEach(error => {
          req.flash('error', e.errors[error].message);
        });
        res.redirect('back');
      } else {
        res.status(500).send(e.stack);
      }
    });
});

module.exports = router;