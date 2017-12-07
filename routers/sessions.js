const express = require('express');
const router = express.Router();
const { loggedOutOnly, createSignedSessionId } = require('../services/session');
const models = require('../models');
const { User } = models;

const loginAction = ((req, res) => {
  res.render('login');
});

router.get('/', loggedOutOnly, loginAction);
router.get('/login', loggedOutOnly, loginAction);

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then(user => {
      if (!user) throw "invalid";

      if (user.validatePassword(password)) {
        loginUser(res, email);
      } else {
        throw "invalid";
      }
    })
    .catch(e => {
      if (e == "invalid") {
        req.flash('error', "There was something wrong with your email or password");
        res.redirect('/login');
      } else {
        res.status(500).send(e.stack);
      }
    });
});

router.post('/logout', (req, res) => {
  res.cookie("sessionId", "", {expires: new Date()});
  res.redirect("/");
});

router.get('/register', loggedOutOnly, (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const newUser = new User({ firstName, lastName, email, password });

  newUser.save()
    .then(() => {
      loginUser(res, email);
    })
    .catch(e => {
      if (e.message) {
        req.flash('error', e.message);
        res.redirect('/register');
      } else {
        res.status(500).send(e.stack);
      }
    });
});

const loginUser = (res, email) => {
  const sessionId = createSignedSessionId(email);
  res.cookie("sessionId", sessionId);
  res.redirect("/home");
};

module.exports = router;
