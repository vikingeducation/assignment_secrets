const secret = process.env["secret"] || "puppies";
const md5 = require("md5");
const mongoose = require('mongoose');
const models = require('./../models');
const User = mongoose.model('User');

const createSignedSessionId = email => {
  return `${email}:${generateSignature(email)}`;
};

const generateSignature = email => md5(email + secret);

const loggedInOnly = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

const loggedOutOnly = (req, res, next) => {
  if (!req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
};

const loginMiddleware = (req, res, next) => {
  const sessionId = req.session.id;
  if (!sessionId) return next();

  const [email, signature] = sessionId.split(":");

  User.findOne({ email }, (err, user) => {
    if (signature === generateSignature(email)) {
      req.session.user = user;
      res.locals.currentUser = user;
      next();
    } else {
      req.session.id = "";
      req.session.user = "";
      req.flash('error', 'Session was invalidated. Please login');
      res.redirect("/login");
    }
  });
};

module.exports = {
  createSignedSessionId,
  loginMiddleware,
  loggedOutOnly,
  loggedInOnly
};
