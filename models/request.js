const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
  requester: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  requestee: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  secret: {
    type: Schema.Types.ObjectId,
    ref: "Secret"
  },
});

const Request = mongoose.model("Request", RequestSchema);

module.exports = Request;