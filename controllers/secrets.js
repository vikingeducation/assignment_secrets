const express = require('express');
const mongoose = require('mongoose');
const models = require('./../models');
const helpers = require('./../helpers').registered;

const router = express.Router();
const User = mongoose.model('User');
const Secret = mongoose.model('Secret');

const _formatSecrets = secrets => {
  secrets.forEach(secret => {
    secret.sharedAt = secret.createdAt.toString().slice(0, 24);
  });
  return secrets;
};

router.get('/', helpers.loggedInOnly, (req, res) => {
  const user = req.user._id;

  const p1 = Secret.find({
    author: user
  }).populate([
    {
      path: 'requests',
      populate: [
        {
          path: 'requester'
        }
      ]
    },
    { path: 'author' }
  ]);
  const p2 = Secret.find({
    confidants: { $in: [user] }
  }).populate('author');

  Promise.all([p1, p2])
    .then(values => {
      const mySecrets = _formatSecrets(values[0]);
      const otherSecrets = _formatSecrets(values[1]);

      res.render('secrets/index', { mySecrets, otherSecrets });
    })
    .catch(e => {
      if (e.error) {
        e.errors.forEach(err => req.flash('error', err.message));
        res.redirect('back');
      } else {
        res.status(500).send(e.stack);
      }
    });
});

router.get('/all', helpers.loggedInOnly, (req, res) => {
  const user = req.user.id;

  Secret.find({
    author: { $ne: user }
  })
    .populate([
      {
        path: 'requests',
        populate: [
          {
            path: 'requester'
          }
        ]
      },
      { path: 'author' }
    ])
    .then(result => {
      const secrets = _formatSecrets(result);

      res.render('secrets/all', { secrets });
    })
    .catch(e => {
      if (e.error) {
        e.errors.forEach(err => req.flash('error', err.message));
        res.redirect('back');
      } else {
        res.status(500).send(e.stack);
      }
    });
});

router.post('/secrets', (req, res) => {
  User.findById(req.user.id).then(user => {
    const secret = new Secret({
      body: req.body.secret.body,
      author: user,
      confidants: [],
      requests: []
    });

    secret
      .save()
      .then(() => {
        res.redirect('/');
      })
      .catch(e => {
        if (e.error) {
          e.errors.forEach(err => req.flash('error', err.message));
          res.redirect('back');
        } else {
          res.status(500).send(e.stack);
        }
      });
  });
});

module.exports = router;
