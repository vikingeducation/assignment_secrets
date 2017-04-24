'use strict';

module.exports = function(sequelize, DataTypes) {
  var Usersecret = sequelize.define(
    'Usersecret',
    {
      userId: DataTypes.INTEGER,
      secretId: DataTypes.INTEGER,
      secretRequesterId: DataTypes.INTEGER
    },
    {
      classMethods: {
        associate: function(models) {
          Usersecret.belongsTo(models.Secret, {
            foreignKey: "secretId"
          });

          Usersecret.belongsTo(models.User, {
            foreignKey: "userId"
          });

        }
      }
    }
  );
  return Usersecret;
};
