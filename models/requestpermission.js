"use strict";
module.exports = function(sequelize, DataTypes) {
  class RequestPermission extends sequelize.Model {
    static associate(models) {
      RequestPermission.belongsTo(models.User, {
        foreignKey: "userId"
      });
      RequestPermission.belongsTo(models.Secret, {
        foreignKey: "secretId"
      });
    }
  }

  RequestPermission.init(
    {
      userId: DataTypes.INTEGER,
      secretId: DataTypes.INTEGER,
      pending: DataTypes.BOOLEAN,
      accessible: DataTypes.BOOLEAN
    },
    { sequelize }
  );

  return RequestPermission;
};
