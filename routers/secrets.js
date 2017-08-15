const router = require("express").Router();
const { Secret, User } = require("../models");
const h = require("../helpers");
const { loggedInOnly } = require("../services/Session");

// Display the current user's secrets
// and the secrets they have been given access to
router.get("/", loggedInOnly, async (req, res) => {
  try {
    const opts = { author: req.user._id };
    const pOpts = {
      path: "requests",
      populate: { path: "author" }
    };
    const authored = await Secret.find(opts).populate(pOpts);
    res.render("secrets/index", { authored });
  } catch (e) {
    res.status(500).end(e.stack);
  }
});

// Create a new secret
router.post("/", loggedInOnly, async (req, res) => {
  try {
    await Secret.create({ author: req.user._id, body: req.body.secret });
    res.redirect(h.secretsPath());
  } catch (e) {
    res.status(500).end(e.stack);
  }
});

// Display all of the secrets, making visible only our own
// and those we have been given access to
router.get("/all", loggedInOnly, async (req, res) => {
  try {
    const opts = {
      // all of the secrets we wrote or have been given access to
      access: {
        $or: [{ grants: req.user }, { author: req.user }]
      },
      // all of the secrets we have asked for (only include author and id)
      request: [{ requests: req.user }, { _id: 1, author: 1 }],
      // all of the other requests (only include author and id)
      // (we neither authored nor requested them, nor have we been granted access)
      rest: [
        {
          $nor: [
            { author: req.user },
            { requests: req.user },
            { grants: req.user }
          ]
        },
        { _id: 1, author: 1 }
      ]
    };

    const queries = [
      Secret.find(opts.access).populate("author"),
      Secret.find(...opts.request).populate("author"),
      Secret.find(...opts.rest).populate("author")
    ];

    const [access, requested, rest] = await Promise.all(queries);

    res.render("secrets/all", { access, requested, rest });
  } catch (e) {
    res.status(500).end(e.stack);
  }
});

// Request access to a secret for the current user
router.get("/:id", loggedInOnly, async (req, res) => {
  try {
    await Secret.update(
      { _id: req.params.id },
      // add the current user to the secrets's requests
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
    const opts = {
      secret: [
        { _id: req.params.secret },
        {
          // remove the current user from the secret's requests
          $pull: { requests: req.params.user },
          // add the current user to the secrets's grants
          $push: { grants: req.params.user }
        }
      ],
      user: [
        { _id: req.params.user },
        // add the secret to the current users sharedSecrets
        { $push: { sharedSecrets: req.params.secret } }
      ]
    };

    await Promise.all([
      Secret.update(...opts.secret),
      User.update(...opts.user)
    ]);

    res.redirect("back");
  } catch (e) {
    res.status(500).end(e.stack);
  }
});
module.exports = router;
