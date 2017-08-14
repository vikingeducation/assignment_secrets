const router = require("express").Router();
const User = require("../models").User;
const {
	createSignedSessionId,
	loggedInOnly,
	loggedOutOnly
} = require("../services/session");

router.get("/", loggedInOnly, (req, res) => {
	return res.send("WELCOME!");
});

router.get("/login", loggedOutOnly, (req, res) => {
	return res.send("LOGIN!");
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	let user = await User.findOne({ where: { email: email } });

	if (!user) {
		return res.send("NO USER :(!!!");
	}

	if (user.comparePassword(password)) {
		const sessionId = createSignedSessionId(email);
		res.cookie("sessionId", sessionId);
		res.redirect("/");
	} else {
		return res.send("SHAME!!!");
	}
});

module.exports = router;
