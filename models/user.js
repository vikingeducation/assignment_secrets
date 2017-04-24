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
          User.hasMany(model.Usersecret, {
            foreignKey: 'userId'
          });

          User.belongsToMany(models.Secret, {
            through: models.Usersecret,
            as: 'Usersecret',
            foreignKey: 'userId'
          });
        }
      }
    }
  );
  return User;
};
