"use strict";
module.exports = function(sequelize, DataTypes) {
  class Secret extends sequelize.Model {
    static associate(models) {
      Secret.hasMany(models.RequestPermission, {
        foreignKey: "secretId"
      });
      Secret.belongsToMany(models.User, {
        through: models.RequestPermission,
        as: "requestedSecret",
        foreignKey: "secretId"
      });
    }
  }

  Secret.init(
    {
      authorid: DataTypes.INTEGER,
      secret: DataTypes.STRING
    },
    { sequelize }
  );

  return Secret;
};
