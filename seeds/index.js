const models = require('./../models');
var env = process.env.NODE_ENV || 'development';
var config = require('./../config/mongo')[env];
const mongooseeder = require('mongooseeder');
const mongoose = require("mongoose");

const {
  User,
  Secret
} = models;


const seeds = () => {
  // make users first
  console.log('Creating Users');

  let users = [];
  for (let i = 0; i < 5; i++) {
    let user = new User({
      username: `foobar${ i }`,
      password: `foobar`
    });
    users.push(user.save());
  }

 // console.log('Creating Secrets');

 //  let secrets = [];
 //  for (let i = 0; i < 5; i++) {
 //    let secret = new Secret({
 //      body: `foobar${ i }`,
 //      owner: i,
 //      requestedViewers: [],
 //      approvedViewers: []
 //    });
 //    secrets.push(secret.save());
 //  }

  console.log('Saving...');
  return Promise.all(users);


}




const mongodbUrl = process.env.NODE_ENV === 'production' ?
  process.env[config.use_env_variable] :
  `mongodb://${ config.host }/${ config.database }`;

mongooseeder.seed({
  mongodbUrl: mongodbUrl,
  seeds: seeds,
  clean: true,
  models: models,
  mongoose: mongoose
});
