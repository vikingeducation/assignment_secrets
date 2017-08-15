"use strict";
const models = require("../models");
const faker = require("faker");
const { User, Secret } = models;

require("mongooseeder").seed({
  mongodbUrl: require("../config/mongoUrl"),
  models: models,
  clean: true,
  mongoose: require("mongoose"),
  seeds: seeds
});

function seeds() {
  let users = [];
  for (let i = 0; i < 5; i++) {
    users.push(
      new User({
        username: faker.internet.userName(),
        password: "password"
      })
    );
  }
  let secrets = [];
  for (let i = 0; i < 20; i++) {
    secrets.push(
      new Secret({
        author: users[i % 5],
        body: faker.lorem.paragraph(2),
        requests: [users[(i + 1) % 5]]
      })
    );
  }
  let promises = [];
  [users, secrets].forEach(collection => {
    collection.forEach(instance => {
      promises.push(instance.save());
    });
  });
  return Promise.all(promises);
}
