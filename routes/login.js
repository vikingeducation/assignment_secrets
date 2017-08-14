const router = require("express").Router();
const User = require("../models").User;
const { createSignedSessionId, loggedOutOnly } = require("../services/session");

router.get("/", loggedOutOnly, (req, res) => {
	return res.render("login");
});

router.post("/", async (req, res) => {
	const { email, password } = req.body;
	try {
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
	} catch (e) {
		console.error(e.stack);
	}
});

module.exports = router;
