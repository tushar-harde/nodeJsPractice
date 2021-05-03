// Dependency
var _user = require('./user');

// router handler
handler = {};

handler.notFound = (data, callback) => {
    callback(404, {'message': 'URL not found!'});
};

handler.user = (data, callback) => {
    var methods = ['get', 'post', 'put', 'delete'];

    if (methods.indexOf(data.method.toLowerCase()) >= 0) {
        // call the _user function according to the request method
        const method = data.method.toLowerCase();
        _user[method](data.payload, callback);
    } else {
        callback(405, {'error': 'Method not allowed.'})
    }
};

// routes
var routes = {
    '*' : handler.notFound,
    'user' : handler.user
};

module.exports = routes; 