"use strict";
const bcrypt = require("bcrypt");

module.exports = function(sequelize, DataTypes) {
  class User extends sequelize.Model {
    static associate(models) {
      User.hasMany(models.RequestPermission, {
        foreignKey: "userId"
      });
      User.belongsToMany(models.Secret, {
        through: models.RequestPermission,
        as: "requestedUser",
        foreignKey: "userId"
      });
    }
    comparePassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }

  User.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING
    },
    { sequelize }
  );

  // hook
  User.beforeCreate(async user => {
    user.password = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(12),
      null
    );
    await user.save();
  });

  return User;
};
