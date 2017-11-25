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

	secrets.forEach(secret => {
		// for eaach secret check if current User is premitted to see
		var permitted = secret.permission.map(el => el.username);
		if (!permitted.includes(req.user.username)) {
			secret.text = null;
		}

		// check if user has already requested to see
		var pendingRequest = secret.requests.map(el => el.username);
		if (pendingRequest.includes(req.user.username)) {
			secret.alreadyreq = true;
		}
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

// accept a requests
router.get("/accept/:secretid/:requestid", (req, res) => {
	Secret.update(
		{ _id: req.params.secretid },
		{
			$push: { permission: req.params.requestid },
			$pull: { requests: req.params.requestid }
		},
		err => {
			if (err) throw err;
		}
	);
	res.redirect("/");
});

// Deny a requests
router.get("/decline/:secretid/:requestid", (req, res) => {
	Secret.update(
		{ _id: req.params.secretid },
		{
			$pull: { requests: req.params.requestid }
		},
		err => {
			if (err) throw err;
		}
	);
	res.redirect("/");
});

module.exports = router;
