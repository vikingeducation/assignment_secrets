const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  requests: [{
    type: Schema.Types.ObjectId,
    ref: "Request"
  }]
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
