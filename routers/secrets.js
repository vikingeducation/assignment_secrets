const router = require("express").Router();
const { Secret } = require("../models");
const h = require("../helpers");
const { loggedInOnly } = require("../services/Session");

router.get("/", loggedInOnly, async (req, res) => {
  const authored = await Secret.find({ author: req.user._id });
  // console.log(authored);
  res.render("secrets/index", { authored });
});

router.post("/", loggedInOnly, async (req, res) => {
  const body = req.body.secret;
  const author = req.user._id;
  await Secret.create({ author, body });
  res.redirect(h.secretsPath());
});

router.get("/all", async (req, res) => {
  const shared = req.user.sharedSecrets.map(secret => secret._id);

  let secrets = await Secret.find().populate("author");
  secrets = secrets.map(secret => {
    let mappedSecret = {
      id: secret._id,
      author: secret.author,
      body: null,
      requested: false
    };
    if (shared.includes(secret.id)) {
      mappedSecret.body = secret.body;
    } else if (secret.requests.includes(req.user._id)) {
      mappedSecret.requested = true;
    }
    return mappedSecret;
  });

  // console.log(secrets);

  res.render("secrets/all", { secrets });
});

module.exports = router;
