var models = {};

// Load models and attach to models here
models.User = require('./user');
models.Secret = require('./secret');
//... more models

module.exports = models;
