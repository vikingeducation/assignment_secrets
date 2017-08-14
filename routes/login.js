const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, Secret } = require("./../models");
const { beginSession, verifySession } = require("../services/session");

router.get("/", (req, res) => {
	if (req.user) {
		return res.redirect("/")
	} else {
		res.render("login");
	}
});

router.post("/", beginSession);

module.exports = router;
