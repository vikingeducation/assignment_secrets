const express = require('express');
const router = express.Router();
const models = require('./../models');
const User = models.User;
const h = require('./../helpers').registered;

router.use(h.loggedInOnly);

router.get('/', (req, res) => {
  res.render('secrets/index');
});

module.exports = router;