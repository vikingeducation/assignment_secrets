"use strict";
const bcrypt = require("bcrypt");

module.exports = function(sequelize, DataTypes) {
  class User extends sequelize.Model {
    static associate(models) {
      User.hasMany(models.Secret, {
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
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
    await user.save();
  });

  return User;
};
