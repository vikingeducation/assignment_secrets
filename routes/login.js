const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, Secret} = require("./../models");

router.get("/", (req, res) => {
	res.render("login");
});

router.post("/", (req, res) => {
	User.find({username: req.body.username}).then((user) => {
		if (bcrypt.compare(req.body.password, user.passwordHash)) {
			req.session.sessionToken = bcrypt.hashSync(user.username, 12);
			return res.redirect("/");
		} else {
			res.redirect("/login");
		}
	});
});

// /services/Session.js
// const SECRET = process.env["secret"] || "puppies";
// const md5 = require("md5");

// const createSignedSessionId = email => {
//   return `${email}:${generateSignature(email)}`;
// };

// const generateSignature = email => md5(email + SECRET);


module.exports = router;