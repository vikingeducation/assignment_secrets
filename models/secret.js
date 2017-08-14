const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const SecretSchema = new Schema(
	{
		owner: Array,
		encryption: Number,
		body: String
	},
	{
		timestamps: true
	}
);

const Secret = mongoose.model('Secret', SecretSchema);

module.exports = Secret;
