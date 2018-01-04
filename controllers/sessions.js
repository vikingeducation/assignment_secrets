const express = require('express');
const mongoose = require('mongoose');
const models = require('./../models');
const {
  createSignedSessionId,
  loginMiddleware,
  loggedInOnly,
  loggedOutOnly
} = require('./services/session');

const router = express.Router();
const User = mongoose.model('User');

module.exports = router;
