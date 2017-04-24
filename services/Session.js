const SECRET = process.env["secret"] || "puppies";
const md5 = require("md5");

const createSignedSessionId = email => {
  return `${email}:${generateSignature(email)}`;
};

module.exports = {
  createSignedSessionId,
  loginMiddleware,
  loggedOutOnly,
  loggedInOnly
};
