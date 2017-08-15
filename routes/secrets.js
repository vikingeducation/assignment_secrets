const express = require("express");
const router = express.Router();
const { User, Secret } = require("./../models");
const { loggedInOnly } = require("../services/session");

router.get("/", loggedInOnly, (req, res) => {
  res.render("secrets");
});

module.exports = router;
