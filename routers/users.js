const router = require("express").Router();
const { User } = require("../models");
const h = require("../helpers");
const { loggedInOnly } = require("../services/Session");

// router.get("/", loggedInOnly, (req, res) => {
//   res.render("secrets/index");
// });
module.exports = router;
