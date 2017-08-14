const bcrypt = require("bcrypt");

("use strict");
module.exports = function(sequelize, DataTypes) {
  class User extends sequelize.Model {
    static associate(models) {
      User.hasMany(models.Secret, {
        foreignKey: "userId"
      });
    }
    comparePassword(presumedPassword) {
      return bcrypt.compareSync(presumedPassword, this.password);
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
