const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const RequestSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  secret: {
    type: Schema.Types.ObjectId,
    ref: 'Secret',
    required: true
  },
  requester: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  granted: {
    type: Boolean,
    required: true,
    default: false
  },
  rejected: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
});

RequestSchema.plugin(uniqueValidator);


const Request = mongoose.models.Request || mongoose.model('Request', RequestSchema);

module.exports = Request;
