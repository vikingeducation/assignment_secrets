const router = require("express").Router();
const User = require("../models").User;
const Secret = require("../models").Secret;
const { loggedInOnly } = require("../services/session");

router.get("/", loggedInOnly, (req, res) => {
	return res.render("index");
});

router.post("/secret", loggedInOnly, async (req, res) => {
	let user = req.user;
	console.log(req.body);

	let secret = await Secret.create(req.body.secret);

	await secret.updateAttributes({
		authorid: user.id
	});

	console.log(secret, "new secret");

	res.redirect("/");
});

module.exports = router;
