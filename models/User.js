const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");
var Schema = mongoose.Schema;
const UserSchema = Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  username: { type: String, required: true }
});

UserSchema.plugin(uniqueValidator);

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 8);
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
