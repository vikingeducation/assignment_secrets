const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		username: String,
		passwordHash: String,
		secrets: [
			{
				type: Schema.Types.ObjectId,
				ref: "Secret"
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
const User = mongoose.model("User", UserSchema);

module.exports = User;