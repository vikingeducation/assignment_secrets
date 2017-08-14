"use strict";
module.exports = function(sequelize, DataTypes) {
  class Secret extends sequelize.Model {
    static associate(models) {
      Secret.hasMany(models.RequestPermission, {
        foreignKey: "userId"
      });
      Secret.belongsToMany(models.User, {
        through: models.RequestPermission,
        as: "requestedSecret",
        foreignKey: "userId"
      });
    }
  }

  Secret.init(
    {
      secret: DataTypes.STRING
    },
    { sequelize }
  );

  return Secret;
};
