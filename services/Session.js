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
    res.redirect('login');
  }
};

const loggedOutOnly = (req, res, next) => {
  if (!req.user) {
    next();
  } else {
    res.redirect('/');
  }
};

const loginMiddleware = (req, res, next) => {
  console.log(req);
  const sessionId = req.cookies.sessionId;
  if (!sessionId) return next();

  const [username, signature] = sessionId.split(':');

  User.find({ where: { username: username } }).then(user => {
    if (signature === generateSignature(username)) {
      req.user = user;
      res.locals.currentUser = user;
      next();
    }
  });
  // if (signature === generateSignature(username)) {
  //   console.log("Search matched");
  //   req.user = user;
  //   res.locals.currentUser = user;
  //   next();
  // } else {
  //   res.send("You've tampered with your session!");
  // }
};

module.exports = {
  createSignedSessionId,
  loginMiddleware,
  loggedOutOnly,
  loggedInOnly
};
