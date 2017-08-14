const router = require("express").Router();
const { Secret } = require("../models");
const h = require("../helpers");
const { loggedInOnly } = require("../services/Session");

router.get("/", loggedInOnly, async (req, res) => {
  const authored = await Secret.find({ author: req.user._id });
  // console.log(authored);
  res.render("secrets/index", { authored });
});

router.post("/", loggedInOnly, async (req, res) => {
  const body = req.body.secret;
  const author = req.user._id;
  await Secret.create({ author, body });
  res.redirect(h.secretsPath());
});

module.exports = router;
