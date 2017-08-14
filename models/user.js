const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema(
	{
		username: String,
		passwordHash: String,
		secrets: [{
			author: Boolean,
			secret: {
				type: Schema.Types.ObjectId,
				ref: "Secret"
			}
		}]
		
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

// personSchema.virtual('fullName').get(function () {
//   return this.name.first + ' ' + this.name.last;
// });

UserSchema.virtual("password").set(function(password) {
	this.passwordHash = bcrypt.hash(password, 10)
});

// Create the model with a defined schema
const User = mongoose.model("User", UserSchema);

module.exports = User;