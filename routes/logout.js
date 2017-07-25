const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
  req.session.id = "";
  req.session.user = "";
  res.redirect("/");
});

module.exports = router;