const router = require("express").Router();
const { Secret } = require("../models");
const h = require("../helpers");
const { loggedInOnly } = require("../services/Session");

router.get("/", loggedInOnly, async (req, res) => {
  try {
    const authored = await Secret.find({ author: req.user._id }).populate({
      path: "requests",
      populate: { path: "author" }
    });
    console.log(authored);
    res.render("secrets/index", { authored });
  } catch (e) {
    res.status(500).end(e.stack);
  }
});

router.post("/", loggedInOnly, async (req, res) => {
  try {
    const body = req.body.secret;
    const author = req.user._id;
    await Secret.create({ author, body });
    res.redirect(h.secretsPath());
  } catch (e) {
    res.status(500).end(e.stack);
  }
});

router.get("/all", loggedInOnly, async (req, res) => {
  try {
    const shared = req.user.sharedSecrets.map(secret => secret._id);

    let secrets = await Secret.find().populate("author");
    secrets = secrets.map(secret => {
      let mappedSecret = {
        id: secret._id,
        author: secret.author,
        body: null,
        requested: false
      };
      if (
        shared.includes(secret._id) ||
        secret.author._id.equals(req.user._id)
      ) {
        mappedSecret.body = secret.body;
      }

      for (let request of secret.requests) {
        if (request.equals(req.user._id)) {
          mappedSecret.requested = true;
        }
      }
      return mappedSecret;
    });

    res.render("secrets/all", { secrets });
  } catch (e) {
    res.status(500).end(e.stack);
  }
});

router.get("/:id", loggedInOnly, async (req, res) => {
  try {
    // let secret = await Secret.findById(req.params.id);
    // secret.requests.push(req.user._id);
    // await secret.save();
    await Secret.update(
      { _id: req.params.id },
      { $push: { requests: req.user._id } }
    );
    res.redirect("back");
  } catch (e) {
    res.status(500).end(e.stack);
  }
});
module.exports = router;
