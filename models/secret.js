const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");
var Schema = mongoose.Schema;

// 2
const SecretSchema = mongoose.Schema({
  text: { type: String, required: true },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  requestedUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  approvedUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

// 5
const Secret = mongoose.model("Secret", SecretSchema);

module.exports = Secret;
