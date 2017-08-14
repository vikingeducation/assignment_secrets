const bcrypt = require("bcrypt");
const { User, Secret } = require("./../models");

beginSession = (req, res, next) => {
  User.find({ username: req.body.username }).then(user => {
    if (bcrypt.compare(req.body.password, user[0].passwordHash)) {
      res.cookie(
        "sessionId",
        user.username + ":" + bcrypt.hashSync(user[0].username, 12)
      );
      return res.redirect("/");
    } else {
      res.redirect("/login");
    }
  });
};

verifySession = (req, res, next) => {
  if (req.cookies.sessionId) {
    User.find({ username: req.cookies.sessionId.split(":")[0] }).then(user => {
      if (
        bcrypt.compare(
          req.cookies.sessionId.split(":")[1],
          bcrypt.hashSync(user[0].username, 12)
        )
      ) {
        next();
      } else {
        res.cookie("sessionId", "", { expires: new Date() });
        return res.redirect("/login");
      }
    });
  } else {
    return res.render("login");
  }
};

module.exports = { beginSession, verifySession };
