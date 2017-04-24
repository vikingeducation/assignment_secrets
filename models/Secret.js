const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const SecretSchema = mongoose.Schema({
  author: { type: Schema.ObjectId, required: true },
  body: { type: String, required: true },
  viewers: [{ type: Schema.ObjectId, ref: "User" }]
});

const Secret = mongoose.model("Secret", SecretSchema);

module.exports = Secret;
