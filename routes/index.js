const router = require("express").Router();
const User = require("../models").User;
const Secret = require("../models").Secret;
const RequestPermission = require("../models").RequestPermission;
const { loggedInOnly } = require("../services/session");

router.get("/", loggedInOnly, async (req, res) => {
  //get all the secrets
  try {
    let user = req.user;
    let pendingSecrets = {};
    let secrets = await Secret.findAll({
      where: { authorid: user.id }
    });

    let result = await RequestPermission.findAll({
      where: { secretId: secrets[0].id }
    });

    // secrets.forEach((secret, i) => {
    // 	RequestPermission.findAll({
    // 		where: { secretId: secret.id }
    // 	}).then(requests => {
    // 		pendingSecrets[i] = requests;
    // 	});
    // });

    // console.log(pendingSecrets, "??");

    return res.render("index", { secrets });
  } catch (e) {
    console.log(`error = `, e.stack);
  }
});

router.get("/secrets", loggedInOnly, async (req, res) => {
  try {
    console.log(`req.user.id = `, req.user.id);
    let secrets = await Secret.findAll({
      where: { authorid: { $ne: req.user.id } }
    });

    let newSecrets = secrets.map(async secret => {
      let author = await User.findById(secret.authorid);
      return (secret["author"] = author);
      // let author = await User.findById(secret.authorid);
    });

    res.render("secrets", { secrets });
  } catch (e) {
    console.error(e.stack);
  }
});

router.post("/secrets", loggedInOnly, async (req, res) => {
  let user = req.user;

  let secret = await Secret.create({
    secret: req.body.secret,
    authorid: user.id
  });

  res.redirect("/");
});

module.exports = router;
