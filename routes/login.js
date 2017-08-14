const router = require("express").Router();
const User = require("../models").User;
const { createSignedSessionId, loggedOutOnly } = require("../services/session");

router.get("/", loggedOutOnly, (req, res) => {
	return res.send("LOGIN!");
});

router.post("/", async (req, res) => {
	const { email, password } = req.body;
	console.log("here?", User);
	let user = await User.findOne({ where: { email: email } });

	if (!user) {
		return res.send("NO USER :(!!!");
	}

	if (user.comparePassword(password)) {
		const sessionId = createSignedSessionId(email);
		req.session["sessionId"] = sessionId;
		res.redirect("/");
	} else {
		return res.send("SHAME!!!");
	}
});

module.exports = router;
