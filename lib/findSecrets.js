const mongoose = require("mongoose");
const models = require("./../models");
const User = mongoose.model("User");
const Secret = mongoose.model("Secret");

var findSecrets = {};

findSecrets.ownedByMe = function(userId) {
  return Secret.find({
    ownerId: userId
  }).populate("ownerId");
};

module.exports = findSecrets;
