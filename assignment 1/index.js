/**
 * Assignment 1
 */

// Dependency
var http = require('http');
var url = require('url');
var stringDecoder = require('string_decoder').StringDecoder;

// Instantiate the server
var httpServer = http.createServer((req, res) => {
    // Parse url
    var parseUrl = url.parse(req.url, true);

    // get the path
    var path = parseUrl.path.replace(/^\/+|\/+$/g, '');

    // get the http method
    var method = req.method.toLowerCase();

    // get the query string object
    var queryStringObject = parseUrl.query;

    // get the payload
    var decoder = new stringDecoder('utf-8');
    var buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    req.on('end', () => {
        decoder.end();

        var activeHandler = typeof (routes[path]) !== 'undefined' ? routes[path] : handler.notFound;

        var data = {
            'path': path,
            'method': method,
            'payload': buffer,
            'queryStringObject': queryStringObject,
        };

        activeHandler(data, (statusCode, payload) => {
            statusCode = typeof (statusCode) === 'number' ? statusCode : 200;
            payload = typeof (payload) === 'object' ? payload : {};

            // close the request
            res.writeHead(statusCode);
            res.end(JSON.stringify(payload));
        });
    });
});

// Start the listen the port 80
httpServer.listen(8080, () => {
    console.log('I am listening!');
});

// router handler
handler = {};

handler.hello = (data, callback) => {
    callback(200, {'message': 'welcome'});
};

handler.notFound = (data, callback) => {
    callback(404);
};

// routes
var routes = {
    'hello': handler.hello,
}