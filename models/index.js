const mongoose = require('mongoose');
const bluebird = require('bluebird');


mongoose.Promise = bluebird;

const models = {};

models.User = require('./user'); 
models.Request = require('./request'); 
models.Secret = require('./secret'); 

module.exports = models;