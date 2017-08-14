const express = require("express");
const router = express.Router();

// import models
const {User, Secret} = require("./../models");

//import custom middleware
const {
  createSignedSessionId,
  loginMiddleware,
  loggedInOnly,
  loggedOutOnly
} = require("./../services/Session");

// Secrets routes

//home
router.get("/", loggedInOnly, (req, res) => {
  let theUser;
  let mySecrets;
  let sharedSecrets;
  let [username, junk] = req.cookies.sessionId.split(":");
  console.log(`username: ${username}`);
  User.findOne({ username: username})
  .then((user) => {
    theUser = user
    return Secret.find({ owner: user._id })
  })
  .then(secrets=>{
    mySecrets = secrets;
    return Secret.find({
      owner: {$ne: theUser._id},
      approvedViewers: theUser._id
      
    })
  })
  .then((secrets) => {
    sharedSecrets = secrets;
 //   console.log()
    return res.render("home", { mySecrets, sharedSecrets });
  })
  .catch(e => res.status(500).send(e.stack));
});


// new secret from home page
router.post("/new", (req, res) => {
  const [ username, signature ] = req.cookies.sessionId.split(":");

  User.findOne({ username }, (err, user) => {
    console.log(user);
    if (!user) {return res.send("NO USER")};
      return new Secret({
          body: req.body.body,
          owner: user._id,
          requestedViewers: [],
          approvedViewers: [user._id]
      }).save()
    })
  .then((secret) => {
    return res.redirect('/secrets')
  })
  .catch(e => res.status(500).send(e.stack));
});

module.exports = router;
