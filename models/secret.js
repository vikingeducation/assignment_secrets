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
          // Secrets belong to one user
        }
      }
    }
  );
  return Secret;
};
