const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  secrets: [{
    type: Schema.Types.ObjectId,
    ref: 'Secret'
  }],
  requests: [{
    type: Schema.Types.ObjectId,
    ref: 'Request'
  }]
}, {
  timestamps: true
});

UserSchema.plugin(uniqueValidator);

UserSchema.virtual("password")
  .set(function(value) {
    this.passwordHash = bcrypt.hashSync(value, 8);
  });

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.methods.fullName = function() {
  return `${ this.firstName } ${ this.lastName }`;
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
