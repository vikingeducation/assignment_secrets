const mongoose = require("mongoose");
const { Secret, User } = require("../models");
const models = require("../models");
const bcrypt = require("bcrypt");
const mongooseeder = require("mongooseeder");
const config = require("../config/mongo");

const seeds = () => {
  let users = [];
  for (let i = 0; i < 10; i++) {
    let newUser = new User({
      username: `user${i}`,
      passwordHash: `password${i}`
    });

    users.push(newUser);
  }

  let secrets = [];
  for (let i = 0; i < 20; i++) {
    let newSecret = new Secret({
      body: `I have ${i} cats!`,
      author: users[i % 10],
      users: [users[(i + 1) % 10], users[(i + 2) % 10], users[(i + 3) % 10]]
    });
    secrets.push(newSecret);
    users[i % 10].secrets.push({ author: true, secret: newSecret });
    users[(i + 1) % 10].secrets.push({ author: false, secret: newSecret });
    users[(i + 2) % 10].secrets.push({ author: false, secret: newSecret });
    users[(i + 3) % 10].secrets.push({ author: false, secret: newSecret });
  }

  let promises = [];
  users.forEach(el => promises.push(el.save()));
  secrets.forEach(el => promises.push(el.save()));

  return Promise.all(promises);
};

require("../mongo")();

const mongodbUrl =
  process.env.NODE_ENV === "production"
    ? process.env[config.use_env_variable]
    : `mongodb://${config.host}/${config.database}`;

mongooseeder.seed({
  mongodbUrl: mongodbUrl,
  mongoose: mongoose,
  seeds: seeds,
  models: models,
  clean: true
});
