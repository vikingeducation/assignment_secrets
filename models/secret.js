const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SecretSchema = new Schema({
  body: String,
  followers: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  requests: {
    type: Schema.Types.ObjectId,
    ref: "Request"
  }
});

const Secret = mongoose.model("Secret", SecretSchema);

module.exports = Secret;
