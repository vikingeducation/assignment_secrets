const router = require("express").Router();
const { Secret } = require("../models");
const h = require("../helpers");
const { loggedInOnly } = require("../services/Session");

router.get("/", loggedInOnly, async (req, res) => {
  let authored = await Secret.find({ author: req.user._id });
  // console.log(authored);
  res.render("secrets/index", { authored });
});

module.exports = router;
