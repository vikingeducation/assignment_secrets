const bcrypt = require("bcrypt");

("use strict");
module.exports = function(sequelize, DataTypes) {
  class User extends sequelize.Model {
    static associate(models) {
      User.hasMany(models.Secret, {
        foreignKey: "userId"
      });
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

  return User;
};

function cryptPassword(password, callback) {
  bcrypt.genSalt(10);
}
