"use strict";
module.exports = function(sequelize, DataTypes) {
  class Secret extends sequelize.Model {
    static associate(models) {
      Secret.belongsTo(models.User, {
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
