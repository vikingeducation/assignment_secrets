'use strict';
module.exports = function(sequelize, DataTypes) {
  var Secret = sequelize.define('Secret', {
    content: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Secret;
};