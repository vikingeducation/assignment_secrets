const bcrypt = require("bcrypt");
const { User, Secret } = require("./../models");

beginSession = (req, res) => {
  User.findOne({ username: req.body.username }).then(user => {
    if (bcrypt.compareSync(req.body.password, user.passwordHash)) {
      res.cookie(
        "sessionId",
        user.username + ":" + bcrypt.hashSync(user.username, 12)
      );
      return res.redirect("/");
    } else {
      res.redirect("/login");
    }
  });
};

verifySession = (req, res, next) => {
  if (req.cookies.sessionId) {
    const [username, signature] = req.cookies.sessionId.split(":");
    User.findOne({ username: username })
      .populate({ path: "secrets.secret", populate: { path: "author" } })
      .then(user => {
        console.log(user);
        if (bcrypt.compare(signature, bcrypt.hashSync(user.username, 12))) {
          req.user = user;
          res.locals.currentUser = user;
          next();
        } else {
          res.cookie("sessionId", "", { expires: new Date() });
          return res.redirect("/login");
        }
      });
  } else {
    return next();
  }
};

loggedInOnly = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

loggedOutOnly = (req, res, next) => {
  if (!req.user) {
    next();
  } else {
    res.redirect("/secrets");
  }
};

module.exports = { beginSession, verifySession, loggedInOnly, loggedOutOnly };
