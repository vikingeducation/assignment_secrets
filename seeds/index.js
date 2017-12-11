const mongoose = require("mongoose");
const mongooseeder = require("mongooseeder");
const models = require("../models");
const { User, Post, Comment } = require("../models");

//for database
var env = process.env.NODE_ENV || "development";
var config = require("./../config/mongo")[env];

// Always use the MongoDB URL to allow
// easy connection in all environments
const mongodbUrl =
  process.env.NODE_ENV === "production"
    ? process.env[config.use_env_variable]
    : `mongodb://${config.host}/${config.database}`;

mongooseeder.seed({
  mongodbUrl: mongodbUrl,
  models: models,
  clean: true,
  mongoose: mongoose,
  seeds: () => {
    let users = [];

    for (var i = 0; i < 10; i++) {
      let p = new User({
        email: `foo${i}@gmail.com`,
        password: `${i}`
      });
      users.push(p);
    }

    const promises = [];
    const collections = [users];

    collections.forEach(collection => {
      collection.forEach(model => {
        const promise = model.save();
        promises.push(promise);
      });
    });

    return Promise.all(promises);

    // come back
  }
});
