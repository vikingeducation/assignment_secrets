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
  let secrets = await Secret.find();
  const shared = req.user.sharedSecrets.map( secret=> secret._id)
  secrets = secrets.map( secret => {
    if (shared.includes(secret.id){
      return {
        id: secret._id,
        body: secret.body
      }
    } else {
      if (secret.requests.includes(req.user._id) {
        return {
          id: secret._id,
          body: null,
          requested: true
        }
      } else {
        return {
          id: secret._id,
          body: null,
          requested: false
        }
      }
    }
  })
});

module.exports = router;
