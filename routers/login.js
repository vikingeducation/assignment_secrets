var express = require("express");
var router = express.Router();

// Require our User model and Session helpers
const User = require("./../models/User");
const {
	createSignedSessionId,
	loginMiddleware,
	loggedInOnly,
	loggedOutOnly
} = require("./../services/session");

module.exports = app => {
	// Home route
	router.get("/", loggedInOnly, (req, res) => {
		res.render("home/index");
	});

	// Login routes
	router.get("/login", loggedOutOnly, (req, res) => {
		res.render("home/login");
	});

	router.post("/login", (req, res) => {
		const { email, password } = req.body;
		User.findOne({ email }, (err, user) => {
			if (!user) return res.send("NO USER");

			if (user.validatePassword(password)) {
				const sessionId = createSignedSessionId(email);
				res.cookie("sessionId", sessionId);
				res.redirect("/");
			} else {
				res.send("UNCOOL");
			}
		});
	});

	// Registration Routes
	router.get("/register", loggedOutOnly, (req, res) => {
		res.render("home/register");
	});

	router.post("/register", (req, res) => {
		const { email, password } = req.body;
		const newUser = new User({ email, password });
		newUser.save((err, user) => {
			if (err) return res.send("ERROR");

			const sessionId = createSignedSessionId(email);
			res.cookie("sessionId", sessionId);
			res.redirect("/");
		});
	});

	// Logout route
	router.get("/logout", (req, res) => {
		res.cookie("sessionId", "");
		res.redirect("/");
	});

	return router;
};
