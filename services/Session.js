
// secret or salt
const SECRET = process.env["secret"] || "puppies";
const md5 = require("md5");

// Generate our sessionIdSignature (functions)
const generateSignature = username => md5(username + SECRET);

const createSignedSessionId = username => {
  return `${username}:${generateSignature(username)}`;
};


const User = require("../models/User");

const loginMiddleware = (req, res, next) => {
  const sessionId = req.cookies.sessionId;

  // will redirect back to login page
  if (!sessionId) return next();

  // pulling username off sessionId
  const [username, signature] = sessionId.split(":");

  // remake original signature and compare to session returned Id
  User.findOne({ username }, (err, user) => {
    if (signature === generateSignature(username)) {
      req.user = user;
      res.locals.currentUser = user;
      return next();
    } else {
      return res.send("You've tampered with your session!");
    }
  });
};

// only allow logged in users can't access 
const loggedInOnly = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("login");
  }
};

// make sure loggedin users can't acces
const loggedOutOnly = (req, res, next) => {
  if (!req.user) {
    next();
  } else {
    // might need to come back and modify
    res.redirect("/");
  }
};
