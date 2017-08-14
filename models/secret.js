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
    // orderItems: [
    // 	{
    // 		type: Schema.Types.ObjectId,
    // 		ref: "OrderItem"
    // 	}
    // ],
  },
  {
    timestamps: true
  }
);

// Create the model with a defined schema
const Secret = mongoose.model("Secret", SecretSchema);

module.exports = Secret;
