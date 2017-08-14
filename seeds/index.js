const models = require("../models");

require("mongooseeder").seed({
  mongodbUrl: require("./config/mongoUrl"),
  models: models,
  clean: true,
  mongoose: require("mongoose"),
  seeds: () => {
    return models.User.create({ email });
    // ...
  }
});
