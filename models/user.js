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
  User.beforeCreate(function(user) {
    user.password = cryptPassword(user.password);
    user.save();
  });
  return User;
};
function cryptPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// function cryptPassword(password, callback) {
//   bcrypt.genSalt(10, (err, salt) => {
//     if (err) throw err;
//     let hashThing = bcrypt.hashSync(password, salt);
//     return hashThing;
//   });
// }
