'use strict';
module.exports = function(sequelize, DataTypes) {
  var Secret = sequelize.define(
    'Secret',
    {
      content: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      userIdsCanView: DataTypes.ARRAY(DataTypes.INTEGER),
      userIdsReqAccess: DataTypes.ARRAY(DataTypes.INTEGER)
    },
    {
      classMethods: {
        associate: function(models) {
          Secret.hasMany(models.Usersecret, {
            foreignKey: 'secretId'
          });

          Secret.belongsToMany(models.User, {
            through: models.Usersecret,
            as: 'Usersecret',
            foreignKey: 'secretId'
          });
        }
      }
    }
  );
  return Secret;
};
