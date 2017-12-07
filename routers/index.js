const express = require('express');
const router = express.Router();
const { loggedInOnly } = require('../services/session');
const ModelFinder = require('../lib/modelFinder');

router.get('/', loggedInOnly, (req, res) => {
  ModelFinder.populateUser(res.locals.currentUser.id)
    .then(user => {
      res.render('home', { user });
    })
    .catch(e => res.status(500).send(e.stack));
});

module.exports = router;
