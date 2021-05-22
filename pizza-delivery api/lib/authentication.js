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
  const bearer = tokenString.split(" ");
  var token = bearer[1];
  token = typeof token === "string" && token.trim().length > 0 ? token : false;
  if (token) {
    return new Promise((resolve, reject) => {
      storage.read("tokens", token, (error, data) => {
        if (!error) {
          data = JSON.parse(data);
          resolve({ email: data.email });
        } else {
          reject({ error: "Invalid token." });
        }
      });
    }); 
  } else {
    reject({ error: "Invalid token." });
  }
};

module.exports = _auth;
