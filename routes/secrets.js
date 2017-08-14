var express = require("express");
var router = express.Router();
const { User, Secret } = require("../models");
const { loggedInOnly, createSignedSessionId } = require("../services/Session");

/* GET users listing. */
router.get("/:id", async (req, res) => {
  let secret = await Secret.findById(req.params.id);
  console.log(secret);
  if (secret.encryption.includes(req.user._id)) {
    return res.render("secrets/show", { secret });
  } else {
    return res.render("secrets/requestPermission", { secret });
  }
});
router.get("/", loggedInOnly, async (req, res) => {
  let secrets = [];
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).populate(
      "secrets"
    );
    if (!users) throw Error("Fatal error, no users found");
    secrets = users.reduce((acc, user) => {
      return acc.concat(user.secrets);
    }, []);
  } catch (err) {
    return res.status(500).send(err.msg);
  }
  return res.render("secrets/index", { secrets });
});
router.get("/new", loggedInOnly, async (req, res) => {
  res.render("secrets/new");
});
router.post("/new", loggedInOnly, async (req, res) => {
  console.log(req.body);
  try {
    const secret = await Secret.create({
      body: req.body.secret_body,
      encryption: [req.user._id]
    });
    if (!secret) throw Error("Fatal error, no secret created");

    const user = await User.findById(req.user._id);
    if (!user) throw Error("Fatal error, no user found");

    user.secrets.push(secret);
    await user.save();
  } catch (err) {
    return res.status(500).send(err.msg);
  } finally {
    res.redirect(`/users/${req.user._id}`);
  }
});
module.exports = router;
