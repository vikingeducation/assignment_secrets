const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, Secret } = require("./../models");
const { beginSession } = require("../services/session");

router.get("/", (req, res) => {
  res.render("login");
});

router.post("/", (req, res) => {
  beginSession();
});

module.exports = router;
