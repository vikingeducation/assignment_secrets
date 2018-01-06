const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
  secret: {
    type: Schema.Types.ObjectId,
    ref: 'Secret'
  },
  requester: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  requestee: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Request = mongoose.model('Request', RequestSchema);

module.exports = Request;
