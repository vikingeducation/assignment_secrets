const express = require('express');
const mongoose = require('mongoose');
const models = require('./../models');
const helpers = require('./../helpers').registered;

const router = express.Router();
const User = mongoose.model('User');

router.get('/login', helpers.loggedOutOnly, (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (!user) {
      req.flash('error', 'No such user. Try again or sign up!');
      return res.redirect('/');
    }

    if (user.validatePassword(password)) {
      const sessionId = helpers.createSignedSessionId(email);
      res.cookie('sessionId', sessionId);
      req.flash('success', 'Welcome back!');
      res.redirect('/');
    } else {
      res.send('tsk tsk');
    }
  });
});

router.get('/register', helpers.loggedOutOnly, (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const { email, password, username } = req.body;
  const newUser = new User({ email, password, username });

  newUser.save((err, user) => {
    if (err) return res.send(err.message);

    const sessionId = helpers.createSignedSessionId(email);
    res.cookie('sessionId', sessionId);
    req.flash('success', `Welcome, ${username}!`);
    res.redirect('/');
  });
});

router.get('/logout', (req, res) => {
  res.cookie('sessionId', '', { expires: new Date() });
  res.redirect('/');
});

module.exports = router;
