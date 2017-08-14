const bcrypt = require("bcrypt");
const { User, Secret } = require("./../models");

beginSession = (req, res) => {
  User.find({ username: req.body.username }).then(user => {
    if (bcrypt.compareSync(req.body.password, user[0].passwordHash)) {
      console.log("I made it in here!!!");
      res.cookie(
        "sessionId",
        user[0].username + ":" + bcrypt.hashSync(user[0].username, 12)
      );
      return res.redirect("/");
    } else {
      res.redirect("/login");
    }
  });
};

verifySession = (req, res, next) => {
  if (req.cookies.sessionId) {
    console.log(req.cookies.sessionId);
    const [username, signature] = req.cookies.sessionId.split(":");
    User.find({ username: username}).then(user => {
      console.log(user);
      if (
        bcrypt.compare(
          signature,
          bcrypt.hashSync(user[0].username, 12)
        )
      ) {
        console.log("Session matched!")
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

module.exports = { beginSession, verifySession };
