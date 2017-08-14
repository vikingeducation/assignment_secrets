const router = require("express").Router();
const { Secret, User } = require("../models");
const h = require("../helpers");
const { loggedInOnly } = require("../services/Session");

// Display the current users secrets
// and the secrets they have been given access to
router.get("/", loggedInOnly, async (req, res) => {
  try {
    const authored = await Secret.find({ author: req.user._id }).populate({
      path: "requests",
      model: "User",
      populate: { path: "author" }
    });
    res.render("secrets/index", { authored });
  } catch (e) {
    res.status(500).end(e.stack);
  }
});

// Create a new secret
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

// Display all of the secrets, making visible only our own
// and those we have been given access to
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

// Add request access to a secret for the current user
router.get("/:id", loggedInOnly, async (req, res) => {
  try {
    await Secret.update(
      { _id: req.params.id },
      { $push: { requests: req.user._id } }
    );
    res.redirect("back");
  } catch (e) {
    res.status(500).end(e.stack);
  }
});

// Grant a user access to a secret
router.get("/:secret/:user", loggedInOnly, async (req, res) => {
  try {
    await Secret.update(
      { _id: req.params.secret },
      { $pull: { requests: req.params.user } }
    );
    await User.update(
      { _id: req.params.user },
      { $push: { sharedSecrets: req.params.secret } }
    );
    res.redirect("back");
  } catch (e) {
    res.status(500).end(e.stack);
  }
});
module.exports = router;
