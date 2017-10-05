var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const SecretSchema = mongoose.Schema({
  post: { type: String, required: true, unique: true },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  permissions: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  ]
});

var Secret = mongoose.model("Secret", SecretSchema);

module.exports = Secret;
