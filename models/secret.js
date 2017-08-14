const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SecretSchema = new Schema(
  {
    body: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: true
  }
);

const Secret = mongoose.model("Secret", SecretSchema);

module.exports = Secret;
