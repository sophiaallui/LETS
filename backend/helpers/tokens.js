const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");

function createToken(user) {
  console.assert(user.isAdmin !== undefined,
    "createToken passed user without isAdmin property");
  let payload = {
    username : user.username,
    isAdmin : user.isAdmin || false
  };
  return jwt.sign(payload, SECRET)
};

module.exports = { createToken }