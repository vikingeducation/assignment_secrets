const router = require("express").Router();
const User = require("../models").User;
const { loggedInOnly } = require("../services/session");

router.get("/", loggedInOnly, (req, res) => {
	return res.send("WELCOME!");
});

module.exports = router;
