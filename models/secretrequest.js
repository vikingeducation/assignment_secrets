var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const SecretrequestSchema = mongoose.Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: "Secret",
    required: true
  },
  postAuthor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  requesting: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

var Secretrequest = mongoose.model("Secretrequest", SecretrequestSchema);

module.exports = Secretrequest;
