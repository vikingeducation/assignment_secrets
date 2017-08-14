const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const SecretSchema = new Schema(
	{
		encryption: Array,
		body: String
	},
	{
		timestamps: true
	}
);

const Secret = mongoose.model('Secret', SecretSchema);
Secret.schema = SecretSchema;
module.exports = Secret;
