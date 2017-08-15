const mongoose = require("mongoose");

const SecretSchema = mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  body: String,
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  grants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

const Secret = mongoose.model("Secret", SecretSchema);

module.exports = Secret;
