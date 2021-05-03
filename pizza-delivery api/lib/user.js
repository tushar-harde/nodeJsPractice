// Dependency
var storage = require("./storage");

_user = {};

/**
 * creates new user
 * @param {*} userInfo object of  name, email address, and street address all mandatory fields
 * @param {*} callback
 */
_user.post = (userInfo, callback) => {
  if (
    typeof userInfo.name === "string" &&
    typeof userInfo.email === "string" &&
    typeof userInfo.address === "string" &&
    typeof userInfo.password === "string"
  ) {
    storage.create("users", userInfo.email, userInfo, (error) => {
      if (!error) {
        callback(200, {
          name: userInfo.name,
          email: userInfo.email,
          address: userInfo.address,
        });
      } else {
        callback(400, { msg: "User already exists." });
      }
    });
  } else {
    callback(400, { msg: "All fields are mandatory!" });
  }
};

/**
 * return the user info
 * @param {*} token token
 * @param {*} callback
 */
_user.get = (token, callback) => {};

/**
 * update existing user
 * @param {*} userInfo object of  name, email address, and street address all mandatory fields
 * @param {*} callback
 */
_user.put = (userInfo, callback) => {};

/**
 * delete existing user
 * @param {*} token object of token
 * @param {*} callback
 */
_user.delete = (token, callback) => {};

module.exports = _user;
