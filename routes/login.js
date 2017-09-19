const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, Secret } = require("./../models");
const { beginSession, verifySession } = require("../services/session");
const { loggedOutOnly } = require("../services/session");

router.get("/", loggedOutOnly, (req, res) => {
  res.render("login");
});

router.post("/", beginSession);

module.exports = router;
