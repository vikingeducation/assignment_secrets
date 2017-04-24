const mongoose = require("mongoose");
const bluebird = require("bluebird");
var Schema = mongoose.Schema;

const SecretSchema = Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    body: { type: String, required: true },
    hasAccess: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    whoRequested: [
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
