'use strict';
module.exports = function(sequelize, DataTypes) {
  var Secret = sequelize.define('Secret', {
    secret: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Secret;
};