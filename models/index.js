const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

module.exports = {
  User: require("./User"),
  Secret: require("./Secret")
};
