const secret = process.env['secret'] || 'puppies';
const md5 = require('md5');
const models = require('../models');
const User = models.User;

const createSignedSessionId = username => {
  return `${username}:${generateSignature(username)}`;
};

const generateSignature = username => md5(username + secret);

const loggedInOnly = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/');
  }
};

const loggedOutOnly = (req, res, next) => {
  // If user has never been to page, or has logged out
  if (!req.user) {
    next();
  } else {
    res.redirect('/home');
  }
};

const loginMiddleware = (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) return next();

  const [username, signature] = sessionId.split(':');
  res.locals.username = username;

  User.find({ where: { username: username } }).then(user => {
    if (signature === generateSignature(username)) {
      req.user = user;
      res.locals.currentUser = user;
      next();
    }
  });
};

module.exports = {
  createSignedSessionId,
  loginMiddleware,
  loggedOutOnly,
  loggedInOnly
};
