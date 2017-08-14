const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema(
	{
		username: String,
		passwordHash: String,
		email: String
	},
	{
		timestamps: true
	}
);

UserSchema.virtual('password').set(function(val) {
	this.passwordHash = bcrypt.hashSync(val, 10);
});

UserSchema.methods.validatePassword = function(password) {
	return bcrypt.compareSync(password, this.passwordHash);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
