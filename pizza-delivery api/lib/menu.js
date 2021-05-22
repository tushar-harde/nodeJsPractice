// Dependency
var storage = require("./storage");
var auth = require("./authentication");

_menu = {};

/**
 * creates new user
 * @param {*} userInfo object of  name, email address, and street address all mandatory fields
 * @param {*} callback
 */
_menu.post = (data, callback) => {
  callback(200, { msg: "Comming soon" });
};

/**
 * return the user info
 * @param {*} token token
 * @param {*} callback
 */
_menu.get = (data, callback) => {
  const token = data.headers.authorization;
  if (token) {
    auth
      .authorized(token)
      .then((email) => {
        storage.read("menu", "menu", (error, menu) => {
          if (!error) {
            var menu = JSON.parse(menu);
            callback(200, menu);
          } else {
            callback(500, { msg: "Internal server error" });
          }
        });
      })
      .catch((error) => {
        callback(401, { msg: "Invalid token id." });
      });
  } else {
    callback(403, { msg: "You have to login to see menu." });
  }
};

/**
 * update existing user
 * @param {*} userInfo object of  name, email address, and street address all mandatory fields
 * @param {*} callback
 */
_menu.put = (data, callback) => {
  callback(200, { msg: "comming soon" });
};

/**
 * delete existing user
 * @param {*} token object of token
 * @param {*} callback
 */
_menu.delete = (data, callback) => {
  callback(200, { msg: "comming soon." });
};

module.exports = _menu;
