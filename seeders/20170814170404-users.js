"use strict";
const faker = require("faker");

module.exports = {
  up: function(queryInterface, Sequelize) {
    let users = [];

    for (let i = 1; i <= 3; i++) {
      users.push({
        username: faker.random.words(1),
        password: faker.internet.password(),
        email: faker.internet.email()
      });
    }
    return queryInterface.bulkInsert("Users", users);
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {}, Sequelize.User);
  }
};
