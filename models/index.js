const mongoose = require('mongoose');
const bluebird = require('bluebird');

mongoose.Promise = bluebird;

const models = {};

models.User = require('./user');
models.Secret = require('./secret');
models.Request = require('./request');

module.exports = models;
