const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const SecretSchema = new Schema({
  body: { type: String, required: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requests: [{
    type: Schema.Types.ObjectId,
    ref: 'Request'
  }]
}, {
  timestamps: true
});

SecretSchema.plugin(uniqueValidator);


const Secret = mongoose.models.Secret || mongoose.model('Secret', SecretSchema);

module.exports = Secret;
