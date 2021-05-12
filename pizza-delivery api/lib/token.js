// Dependency
var storage = require("./storage");
var auth = require("./authentication");

_token = {};

/**
 * 
 * @param {*} payload object of email, password
 * @param {*} callback 
 */
_token.post = (payload, callback) => {
    auth.authenticate(payload)
        .then(data => {
            callback(200, data);
        })
        .catch(error => {
            callback(200, "Invalid username or password.");
        });
};

_token.get = (payload, callback) => {
    callback(200, payload);
};

_token.put = (payload, callback) => {
    callback(200, payload);
};

_token.delete = (payload, callback) => {
    callback(200, payload);
};

module.exports = _token;