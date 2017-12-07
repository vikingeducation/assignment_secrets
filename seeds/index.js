const mongoose = require('mongoose');
const mongooseeder = require('mongooseeder');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/mongo')[env];

const envUrl = process.env[config.use_env_variable];
const localUrl = `mongodb://${ config.host }/${ config.database }`;
const mongodbUrl =  envUrl ? envUrl : localUrl;

const models = require('../models');
const { User, Secret, Request } = models;

const faker = require('faker');

mongooseeder.seed({
  mongodbUrl: mongodbUrl,
  models: models,
  clean: true,
  mongoose: mongoose,
  seeds: () => {

    const users = [];
    for (let i = 0; i < 11; i++) {
      let user = new User ({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: 'secret',
        secrets: [],
        requests: []
      });
      users.push(user);
    }

    const secrets = [];
    for (let user of users) {
      let secret = new Secret({
        body: faker.lorem.sentence(),
        user: user,
        requests: []
      });
      user.secrets.push(secret);
      secrets.push(secret);
    }

    const requests = [];
    for (var i = 0; i < 10; i++) {
      let request = new Request({
        user: users[i],
        secret: secrets[i],
        requester: users[i + 1]
      });
      secrets[i].requests.push(request);
      users[i + 1].requests.push(request);
      requests.push(request);
    }

    var promises = [];

    [users, secrets, requests].forEach(models => {
      for (let model of models) {
        promises.push(model.save());
      }
    });

    return Promise.all(promises);
  }
});
