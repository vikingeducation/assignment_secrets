const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const SecretSchema = mongoose.Schema({
  author: { type: Schema.ObjectId, required: true, ref: "User" },
  body: { type: String, required: true },
  viewers: [{ type: Schema.ObjectId, ref: "User" }],
  requests: [{ type: Schema.ObjectId, ref: "User" }],
  cipher: Boolean
});

const Secret = mongoose.model("Secret", SecretSchema);

module.exports = Secret;
