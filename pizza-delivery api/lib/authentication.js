// Dependencies
var storage = require("./storage");

var _auth = {};

/**
 * return promise that user creadentials are valid or not
 * @param {*} userInfo
 * @param {*} callback
 */
_auth.authenticate = (userInfo) => {
  return new Promise((resolve, rejects) => {
    storage.read("users", userInfo.email, (error, data) => {
      if (!error) {
        var user = JSON.parse(data);
        if (
          user.email.toString() === userInfo.email.toString() &&
          user.password.toString() === userInfo.password.toString()
        ) {
          resolve(user);
        }
        rejects("Invalid username or password.");
      } else {
        rejects("Email does not exist.");
      }
    });
  });
};

/**
 * return promise that token is valid or not
 * @param {*} tokenString
 */
_auth.authorized = (tokenString) => {
  return new Promise((resolve, rejects) => {
    storage.read("tokens", tokenString, (error, data) => {
      if (!error) {
        data = JSON.parse(data);
        resolve({ user: data.email });
      } else {
        rejects({ error: "Invalid token." });
      }
    });
  });
};

module.exports = _auth;
