const express = require('express');
const router = express.Router();
const { loggedInOnly } = require('../services/session');
const models = require('../models');
const { User, Secret } = models;
const ModelFinder = require('../lib/modelFinder');

router.get('/', loggedInOnly, (req, res) => {
  ModelFinder.populateSecrets({})
    .then(secrets => {
      secrets = secrets.map(s => s.toJSON());
      res.render('secrets', { secrets });
    })
    .catch(e => res.status(500).send(e.stack));
});

router.post('/', loggedInOnly, async (req, res) => {
  const { body } = req.body.secret;

  let user = await User.findById(res.locals.currentUser.id);

  new Secret({ body, user: user }).save()
    .then(secret => {
      secret = secret.toJSON();
      user.secrets.push(secret);
      return user.save();
    })
    .then(() => {
      res.redirect('/home');
    })
    .catch(e => res.status(500).send(e.stack));
});

module.exports = router;
