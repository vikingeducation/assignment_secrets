const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");
var Schema = mongoose.Schema;

const RequestSchema = mongoose.Schema({
  secret: {
    type: Schema.Types.ObjectId,
    ref: "Secret"
  },
  requestingUser: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

const Request = mongoose.model("Request", RequestSchema);

module.exports = Request;
