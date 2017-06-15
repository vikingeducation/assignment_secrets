const express = require('express');
const router = express.Router();

// Logout route
router.get("/", (req, res) => {
  // res.cookie("sessionId", "");
  res.session.id = "";
  res.redirect("/");
});

module.exports = router;