const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const SecretSchema = mongoose.Schema(
	{
		text: { type: String, required: true },
		createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
		permission: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
		requests: [{ type: Schema.Types.ObjectId, ref: "User" }]
	},
	{ timestamps: true }
);

const Secret = mongoose.model("Secret", SecretSchema);

module.exports = Secret;
