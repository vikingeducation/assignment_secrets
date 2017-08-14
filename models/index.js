const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

module.exports({
  users: require("./users"),
  secrets: require("./secrets")
});
