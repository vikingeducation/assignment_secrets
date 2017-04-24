const secret = process.env["secret"] || "puppies";
const md5 = require("md5");
const User = require("../models/User");

const createSignedSessionId = username => {
  return `${username}:${generateSignature(username)}`;
};

const generateSignature = username => md5(username + secret);

module.exports = {
  createSignedSessionId
}