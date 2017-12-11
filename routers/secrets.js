var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var models = require("./../models");
var Secret = models.Secret;


// new secret 
router.post("/", async function(req, res) {
  try {

    let secret = new Secret({
      text: req.body.secret,
      author: req.user._id
    });
    await secret.save();
    res.redirect('/')
  } catch (e) {
    console.log(e);
  }
});

router.get("/", async function(req, res) {
  try {
    let secrets = await Secret.find();
    res.render('secretsIndex', { secrets });
  } catch (e) {

  }
})


module.exports = router;