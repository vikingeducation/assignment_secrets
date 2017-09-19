const express = require("express");
const router = express.Router();
const { User, Secret } = require("./../models");
const { loggedInOnly } = require("../services/session");

router.get("/", loggedInOnly, (req, res) => {
  res.render("secrets");
});

router.get("/all", loggedInOnly, (req, res) => {
	Secret.find({}).populate(["author", "users", "pendingUsers"]).then(secrets => {
		secrets.forEach(secret => {
			let secretUsers = secret.users.map(el => el.id);
			let pendingUsers = secret.pendingUsers.map(el => el.id);


			if (secretUsers.includes(req.user.id) || secret.author.id === req.user.id) {
				secret.hasAccess = true;
			} else if (pendingUsers.includes(req.user.id)) {
				secret.pending = true;
			}
		});

		res.render("allSecrets", { secrets});
	});
	
});

router.post("/new", loggedInOnly, (req, res) => {
	let newSecret = new Secret({
		body: req.body.body,
		author: req.user,
		users: [],
		pendingUsers: []
	});

	req.user.secrets.push({author: true, secret: newSecret})

	req.user.save().then(() => {
		return newSecret.save();
	}).then(() => {
		return res.redirect("/secrets");
	})
})

module.exports = router;
