var express = require("express");
var router = express.Router();
const { User, Secret } = require("../models");
const { loggedInOnly, createSignedSessionId } = require("../services/Session");

/* GET users listing. */
router.get("/", loggedInOnly, async function(req, res, next) {
  res.render("secrets/new");
});
router.post("/", (req, res) => {
  Secret.create({
    owner: req.user._id,
    body: req.body.secret_body,
    encryption: [req.user._id]
  }).then(() => {
    return res.redirect("/users");
  });
});
module.exports = router;
