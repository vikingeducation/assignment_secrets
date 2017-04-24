'use strict';
const bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define(
    'User',
    {
      username: { type: DataTypes.STRING, unique: true },
      passHash: DataTypes.STRING,
      password: {
        type: DataTypes.VIRTUAL,
        set: function(val) {
          this.setDataValue('passHash', bcrypt.hashSync(val, 8));
        }
      }
    },
    {
      classMethods: {
        associate: function(models) {
          // associations can be defined here
        }
      }
    }
  );
  return User;
};
