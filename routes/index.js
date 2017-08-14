const router = require("express").Router();
const User = require("../models").User;
const Secret = require("../models").Secret;
const RequestPermission = require("../models").RequestPermission;
const { loggedInOnly } = require("../services/session");

router.get("/", loggedInOnly, async (req, res) => {
  //get all the secrets
  let user = req.user;
  let secrets = await Secret.findAll(
    {
      where: { authorid: user.id }
    },
    {
      include: [{ model: RequestPermission }]
    }
  );
  console.log(`secrets = `, secrets);
  return res.render("index", { secrets });
});

router.post("/secret", loggedInOnly, async (req, res) => {
  let user = req.user;
  console.log(req.body);

  let secret = await Secret.create({
    secret: req.body.secret,
    authorid: user.id
  });

  // console.log(secret, "new secret");

  res.redirect("/");
});

module.exports = router;
