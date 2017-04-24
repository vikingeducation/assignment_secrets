'use strict';

module.exports = function(sequelize, DataTypes) {
  var Usersecrets = sequelize.define(
    'Usersecret',
    {
      userId: DataTypes.INTEGER,
      secretId: DataTypes.INTEGER
    },
    {
      classMethods: {
        associate: function(models) {}
      }
    }
  );
  return Usersecret;
};
