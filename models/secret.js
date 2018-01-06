const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SecretSchema = new Schema(
  {
    body: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    confidants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    requests: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Request'
      }
    ]
  },
  {
    timestamps: true
  }
);

const Secret = mongoose.model('Secret', SecretSchema);

module.exports = Secret;
