const express = require('express');
const router = express.Router();
const models = require('./../models');
const User = models.User;
const Secret = models.Secret;
const Request = models.Request;
const h = require('./../helpers').registered;

router.use(h.loggedInOnly);

router.get('/', (req, res) => {
  let allSecrets;
  Secret.find({owner: req.session.user._id})
    .populate([{
      path: 'requests', 
      populate: [{
        path: 'requester'
      }]
    }])
    .sort({createdAt: 'desc'})
    .then(results => {
      allSecrets = results;
      return Secret.find({
        followers: {$in: [req.session.user._id] }
      }).populate('owner')
    })
    .then(results => {
      res.render("secrets/index", { secrets: allSecrets, sharedSecrets: results });
    })
    .catch(e => {
      if (e.errors) {
        let errors = Object.keys(e.errors);

        errors.forEach(error => {
          req.flash('error', e.errors[error].message);
        });
        res.redirect('back');
      } else {
        res.status(500).send(e.stack);
      }
    });
});

router.post('/', (req,res) => {
  let secret = new Secret({
    body: req.body.secret,
    followers: [],
    owner: req.session.user._id,
    requests: []
  });

  secret.save()
    .then(post => {
      req.flash('success', 'Secret saved successfully.');
      res.redirect(h.secretsPath());
    })
    .catch(e => {
      if (e.errors) {
        let errors = Object.keys(e.errors);

        errors.forEach(error => {
          req.flash('error', e.errors[error].message);
        });
        res.redirect('back');
      } else {
        res.status(500).send(e.stack);
      }
    });
});

router.get('/all', (req,res) => {
  Secret.find({})
    .populate('owner')
    .sort({createdAt: 'desc'})
    .then(secrets => {
      res.render('secrets/all', { secrets });
    })
    .catch(e => {
      if (e.errors) {
        let errors = Object.keys(e.errors);

        errors.forEach(error => {
          req.flash('error', e.errors[error].message);
        });
        res.redirect('back');
      } else {
        res.status(500).send(e.stack);
      }
    });
});

module.exports = router;