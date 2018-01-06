const express = require('express');
const mongoose = require('mongoose');
const models = require('./../models');
const helpers = require('./../helpers').registered;

const router = express.Router();
const User = mongoose.model('User');
const Secret = mongoose.model('Secret');
const Request = mongoose.model('Request');

router.get('/:id/accept', (req, res) => {
  let request;

  Request.findById(req.params.id)
    .then(result => {
      request = result;

      return Secret.findByIdAndUpdate(request.secret, {
        $push: { confidants: request.requester },
        $pull: { requests: request._id }
      });
    })
    .then(() => {
      return Request.findByIdAndRemove(request._id);
    })
    .then(() => {
      req.flash('success', 'Permission accepted!');
      res.redirect('back');
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

router.get('/:id/reject', (req, res) => {
  let request;

  Request.findById(req.params.id)
    .then(result => {
      request = result;

      return Secret.findByIdAndUpdate(request.secret, {
        $pull: { requests: request._id }
      });
    })
    .then(() => {
      return Request.findByIdAndRemove(request._id);
    })
    .then(() => {
      req.flash('success', 'Permission rejected!');
      res.redirect('back');
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

router.post('/:id', (req, res) => {
  let request;

  const newRequest = new Request({
    secret: req.params.id,
    requester: req.user._id,
    requestee: req.body.requestee
  });

  newRequest
    .save()
    .then(result => {
      request = result;

      return Secret.findByIdAndUpdate(req.params.id, {
        $push: { requests: request }
      });
    })
    .then(() => {
      req.flash('info', 'Permission requested');
      res.redirect('back');
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

module.exports = router;
