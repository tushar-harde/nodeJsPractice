/**
 * Pizza delivery API
 */

// Dependency
var server = require('./lib/server');

server.init((err) => {
    if (err) {
        console.log('Failed to start server!');
    }
});