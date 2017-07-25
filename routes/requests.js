const express = require('express');
const router = express.Router();
const models = require('./../models');
const User = models.User;
const Secret = models.Secret;
const Request = models.Request;
const h = require('./../helpers').registered;

router.use(h.loggedInOnly);

router.get('/:id/accept', (req, res) => {
  let request;
  Request.findById(req.params.id)
    .then(results => {
      request = results;
      return Secret.findByIdAndUpdate(request.secret, {
        $push: { followers: request.requester },
        $pull: { requests: request._id }
      });
    })
    .then(() => {
      return User.findByIdAndUpdate(request.requester, {
        $pull: { requests: request._id }
      });
    })
    .then(() => {
      return Request.findByIdAndRemove(request._id);
    })
    .then(() => {
      req.flash('success', 'Follow request successfully accepted!');
      res.redirect('back');
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

router.get('/:id/reject', (req, res) => {
  let request;
  Request.findById(req.params.id)
    .then(results => {
      request = results;
      return Secret.findByIdAndUpdate(request.secret, {
        $pull: { requests: request._id }
      });
    })
    .then(() => {
      return User.findByIdAndUpdate(request.requester, {
        $pull: { requests: request._id }
      });
    })
    .then(() => {
      return Request.findByIdAndRemove(request._id);
    })
    .then(() => {
      req.flash('success', 'Follow request successfully rejected.');
      res.redirect('back');
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

router.post('/:id', (req, res, next) => {
  let request;
  let requestParams = {
    requester: req.session.user._id,
    requestee: req.body.requestee,
    secret: req.params.id
  };

  Request.find(requestParams)
    .then(results => {
      if (results.length === 0) {
        let request = new Request(requestParams);
        return request.save();
      } else {
        next();
      }
    })
    .then(results => {
      // add request to the secret
      if (results) {
        request = results;
        return Secret.findByIdAndUpdate(req.params.id, {
          $push: { requests: request }
        });
      }
    })
    .then(results => {
      // then add request to the user
      if (results) {
        return User.findByIdAndUpdate(req.session.user._id, {
          $push: { requests: request }
        });
      }
    })
    .then(results => {
      req.flash('success', 'User has received your follow request.');
      next();
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
}, (req, res) => {
  res.redirect('back');
});

module.exports = router;