const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const SecretSchema = mongoose.Schema({
  body: { type: String, required: true, unique: true },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  requestedViewers: [
    { type: Schema.Types.ObjectId, ref: "User" }
  ],
  approvedViewers: [
    { type: Schema.Types.ObjectId, ref: "User"}
  ]
});


const Secret = mongoose.model("Secret", SecretSchema);

module.exports = Secret;
