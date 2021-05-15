// Dependency
var storage = require("./storage");
var auth = require("./authentication");
var crypto = require('crypto');

// return random 15 charactors string
function generateToken(callback) {
    try {
        crypto.randomBytes(48, (err, buffer) => {
            var token = buffer.toString('hex');
            callback(false, token);
        });
    } catch (error) {
        callback('Failed to generate token string.');
    }
}

_token = {};

/**
 * 
 * @param {*} payload object of email, password
 * @param {*} callback 
 */
_token.post = (data, callback) => {
    var payload = data.payload;
    var email = typeof data.queryStringObject.email === 'string' && data.queryStringObject.email.trim().length > 0 ? true : false;
    var password = typeof data.queryStringObject.password === 'string' && data.queryStringObject.password.trim().length > 0 ? true : false;
    if (email && password) {
        auth.authenticate(payload)
        .then(user => {
            generateToken((error, tokenString) => {
                if (!error) {
                    user.token = tokenString;
                    storage.create('tokens', tokenString, user, (error) => {
                        if (!error) {
                            callback(200, {token: tokenString});
                        } else {
                            callback(500, {error});
                        }
                    });
                } else {
                    callback(500, {error});
                }
            });
        })
        .catch(error => {
            callback(401, {error});
        });
    } else {
        callback(400, {error: 'Missing required fields.'})
    }    
};

// required data id
_token.get = (data, callback) => {
    if (typeof data.queryStringObject.id === 'string' && data.queryStringObject.id.trim().length > 0) {
        var token = data.queryStringObject.id;
        storage.read('tokens', token, (error, info) => {
            if (!error && info) {
                callback(200, JSON.parse(info));
            } else {
                callback(400, {error: 'Invalid token id.'});
            }
        });
    } else {
        callback(400, {error: 'Missing required fields.'});
    }
};

_token.put = (data, callback) => {
    callback(200, payload);
};

_token.delete = (data, callback) => {
    if (typeof data.queryStringObject.id === 'string' && data.queryStringObject.id.trim().length > 0) {
        var token = data.queryStringObject.id;
        storage.delete('tokens', token, (error, info) => {
            if (!error) {
                callback(200, {msg: 'Token deleted successfully.'});
            } else {
                callback(400, {error: 'Invalid token id.'});
            }
        });
    } else {
        callback(400, {error: 'Missing required fields.'});
    }
};

module.exports = _token;