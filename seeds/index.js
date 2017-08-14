const models = require("../models");
const faker = require("faker.js");
const { User, Secret } = models;

require("mongooseeder").seed({
  mongodbUrl: require("./config/mongoUrl"),
  models: models,
  clean: true,
  mongoose: require("mongoose"),
  seeds: seeds
});

function seeds() {
  let users = [];
  for (let i = 0; i < 5; i++) {
    user.push(
      new User({
        username: faker.internet.username(),
        password: "password"
      })
    );
  }
  let secrets = [];
  for (let i = 0; i < 20; i++) {
    secrets.push(
      new Secret({
        author: user[i % 5],
        body: faker.lorem.paragraph(2),
        requests: [user[(i + 1) % 5]]
      })
    );
  }
  let promises = [];
}
