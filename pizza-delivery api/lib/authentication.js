// Dependencies
var storage = require('./storage');

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
                resolve(JSON.parse(data))
            } else {
                rejects(error);
            }
        });
    });
};

module.exports = _auth;