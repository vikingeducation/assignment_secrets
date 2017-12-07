const express = require('express');
const router = express.Router();
const { loggedInOnly } = require('../services/session');
const models = require('../models');
const { Request } = models;
const ModelFinder = require('../lib/modelFinder');

router.post('/', loggedInOnly, (req, res) => {
  let secret, request;
  let currentUser = res.locals.currentUser;

  ModelFinder.populateSecrets({ _id: req.body.secretId })
    .then(secretArr => {
      secret = secretArr[0];

      request = new Request({
        user: secret.user,
        secret: secret,
        requester: currentUser
      });

      return request.save();
    })
    .then(request => {
      secret.requests.push(request);
      return secret.save();
    })
    .then(() => {
      currentUser.requests.push(request);
      return currentUser.save();
    })
    .then(() => {
      res.redirect('/secrets');
    })
    .catch(e => res.status(500).send(e.stack));
});

router.post('/modify_permission', loggedInOnly, (req, res) => {
  const currentUser = res.locals.currentUser;
  const { requestId, type } = req.body;
  let updateParams;

  switch (type) {
  case "grant":
    updateParams = { granted: true, rejected: false };
    break;
  case "reject":
    updateParams = { granted: false, rejected: true };
    break;
  default:
    updateParams = { granted: false, rejected: false };
  }

  Request.findById(requestId)
    .populate('user')
    .then(request => {
      if (!request) throw "no request";
      if (!currentUser._id.equals(request.user._id)) throw 'unauthorized';

      return request.update(updateParams);
    })
    .then(() => {
      res.redirect('/home');
    })
    .catch(e => res.status(500).send(e.stack));
});

module.exports = router;
