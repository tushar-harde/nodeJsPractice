// Dependency
var storage = require("./storage");

_user = {};

/**
 * creates new user
 * @param {*} userInfo object of  name, email address, and street address all mandatory fields
 * @param {*} callback
 */
_user.post = (data, callback) => {
  var userInfo = data.payload;
  var email = typeof userInfo.email === 'string' && userInfo.email.trim().length > 0 ? userInfo.email : false;
  var name = typeof userInfo.name === 'string' && userInfo.name.trim().length > 0 ? userInfo.name : false;
  var address = typeof userInfo.address === 'string' && userInfo.address.trim().length > 0 ? userInfo.address : false;
  var password = typeof userInfo.password === 'string' && userInfo.password.trim().length > 0 ? userInfo.password : false;
  if (name && email && address && password) {
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
    callback(400, { msg: "Missing required fields." });
  }
};

/**
 * return the user info
 * @param {*} token token
 * @param {*} callback
 */
_user.get = (data, callback) => {
  var email = typeof data.queryStringObject.email === 'string' && data.queryStringObject.email.trim().length > 0 ? true : false;
  if (email) {
    storage.read('users', data.queryStringObject.email, (error, user) => {
      if (!error) {
        user = JSON.parse(user);
        delete user.password;
        callback(200, user);
      } else {
        callback(400, {error: 'User may not exist.'});
      }
    });
  } else {
    callback(400, {error: 'Missing required fields.'});
  }
};

/**
 * update existing user
 * @param {*} userInfo object of  name, email address, and street address all mandatory fields
 * @param {*} callback
 */
_user.put = (data, callback) => {
  var userInfo = data.payload;
  var email = typeof userInfo.email === 'string' && userInfo.email.trim().length > 0 ? userInfo.email : false;
  var name = typeof userInfo.name === 'string' && userInfo.name.trim().length > 0 ? userInfo.name : false;
  var address = typeof userInfo.address === 'string' && userInfo.address.trim().length > 0 ? userInfo.address : false;
  var password = typeof userInfo.password === 'string' && userInfo.password.trim().length > 0 ? userInfo.password : false;
  if (email) {
    if (name || address || password) {
      storage.read('users', email, (error, userData) => {        
        if (!error && userData) {
          userData = JSON.parse(userData);
          if (name) {
            userData.name = name;
          }
          if (address) {
            userData.address = address;
          }
          if (password) {
            userData.password = password;
          }
          storage.update('users', email, userData, (error) => {
            if (!error) {
              delete userData.password;
              callback(200, userData);
            } else {
              callback(500, {msg: 'Failed to update user.'});
            }
          });
        } else {
          callback(400, {error: 'User does not exists.'});
        }
      });
    } else {
      callback(200, {msg: 'No fields to update.'});
    }
  } else {
    callback(400, {error: 'Missing required fields.'});
  }
};

/**
 * delete existing user
 * @param {*} token object of token
 * @param {*} callback
 */
_user.delete = (data, callback) => {
  var email = typeof data.queryStringObject.email === 'string' && data.queryStringObject.email.trim().length > 0 ? true : false;
  if (email) {
    storage.delete('users', data.queryStringObject.email, (error) => {
      if (!error) {        
        callback(200, {msg: 'user deleted successfully.'});
      } else {
        callback(400, {error: 'User may not exist.'});
      }
    });
  } else {
    callback(400, {error: 'Missing required fields.'});
  }
};

module.exports = _user;
