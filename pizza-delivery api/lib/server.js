// Dependency
var http = require("http");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;
var routes = require("./routes");

server = {};

// Instantiate the server
var httpServer = http.createServer((req, res) => {
  // Parse url
  var parseUrl = url.parse(req.url, true);

  // get the path
  var path = parseUrl.pathname.replace(/^\/+|\/+$/g, "");

  // get the http method
  var method = req.method.toLowerCase();

  // get the query string object
  var queryStringObject = parseUrl.query;

  // get the http request headers
  var headers = req.headers;

  // get the payload
  var decoder = new StringDecoder("utf8");
  var buffer = "";
  req.on("data", (data) => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer += decoder.end();

    try {
      var activeHandler =
        typeof routes[path] !== "undefined" ? routes[path] : routes["*"];

      var data = {
        path: path,
        method: method,
        payload: buffer.length > 0 ? JSON.parse(buffer) : {},
        queryStringObject: queryStringObject,
        headers: headers,
      };
      
      activeHandler(data, (statusCode, payload) => {
        statusCode = typeof statusCode === "number" ? statusCode : 200;
        payload = typeof payload === "object" ? payload : {};

        // close the request
        res.setHeader("Content-Type", "application/json");
        res.writeHead(statusCode);
        res.end(JSON.stringify(payload));
      });
    } catch (error) {
      // close the request
      res.writeHead(500);
      res.end(error.toString());
    }
  });
});

server.init = (callback) => {
  // Start the listen the port 80
  httpServer.listen(8080, () => {
    callback(false);
    console.log("Pizza delivery API is listening on port 8080");
  });
};

module.exports = server;
