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
    authorizedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    requestedUsers: [
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

SecretSchema.statics.ownedByMe = function(ownerId) {
  return Secret.find({ ownerId }).populate("ownerId requestedUsers");
};
SecretSchema.statics.userHasAccess = function(ownerId) {
  return Secret.find({ authorizedUsers: ownerId }).populate("ownerId");
};
SecretSchema.statics.all = function(ownerId) {
  return Secret.find({ ownerId: { $ne: ownerId } }).populate("ownerId");
};

SecretSchema.statics.userRequested = function(ownerId) {
  return Secret.find({ requestedUsers: ownerId }).lean().distinct("_id");
};

const Secret = mongoose.model("Secret", SecretSchema);

module.exports = Secret;