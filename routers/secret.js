var express = require("express");
var router = express.Router();

const User = require("./../models/User");
const Secret = require("./../models/Secret");

const { loggedInOnly } = require("./../services/session");

// Get homepage
router.get("/", loggedInOnly, async (req, res) => {
	var secrets = await Secret.find({ createdBy: req.user._id }).populate({
		path: "requests",
		model: "User"
	});
	var othersSecrets = await Secret.find({
		createdBy: { $ne: req.body._id },
		permission: { $in: [req.body.id] }
	});
	console.log("secrets", JSON.stringify(secrets, 0, 2));
	res.render("home/index", { secrets, othersSecrets });
});

// Get all Secrets Page
router.get("/all", async (req, res) => {
	var secrets = await Secret.find()
		.populate({ path: "createdBy", model: "User" })
		.populate({ path: "permission", model: "User" })
		.populate({ path: "requests", model: "User" });

	// modify secret objects so only the right people can see
	await secrets.forEach(secret => {
		secret.permission.forEach(permission => {
			if (permission._id != req.user.id) {
				secret.text = null;
			}
		});
	});

	// populate objects temporarily to discern whether
	// a request has been made yet
	await secrets.forEach(secret => {
		secret.requests.forEach(request => {
			if (request._id == req.user.id) {
				secret.alreadyreq = true;
			}
		});
	});

	console.log("secrets", JSON.stringify(secrets, 0, 2));
	res.render("home/all", { secrets });
});

// post a new secret
router.post("/new", (req, res) => {
	var newSecret = new Secret({
		text: req.body.secret,
		createdBy: req.user._id,
		permission: [req.user._id]
	});
	newSecret.save();
	res.redirect("/");
});

// request to view a secrets
router.get("/request/:secretid", (req, res) => {
	Secret.update(
		{ _id: req.params.secretid },
		{ $push: { requests: req.user._id } },
		err => {
			if (err) throw err;
		}
	);
	res.redirect("/all");
});

//

module.exports = router;
