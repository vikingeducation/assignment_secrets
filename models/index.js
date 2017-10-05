var mongoose = require("mongoose");
var bluebird = require("bluebird");

// Set bluebird as the promise
// library for mongoose
mongoose.Promise = bluebird;

var models = {};

models.user = require("./user");
models.secret = require("./secrets");
models.secretrequest = require("./secretrequest");

// Load models and attach to models here
//models.User = require('./user');
//... more models

module.exports = models;
