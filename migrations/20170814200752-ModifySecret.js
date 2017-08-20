"use strict";

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      'ALTER TABLE "Secrets" ADD authorId INTEGER'
    );
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable("Secrets");
  }
};
