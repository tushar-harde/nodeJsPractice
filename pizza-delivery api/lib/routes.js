// Dependency
var _user = require("./user");
var _token = require("./token");
var _menu = require("./menu");

// router handler
handler = {};

handler.notFound = (data, callback) => {
  callback(404, { message: "URL not found!" });
};

handler.user = (data, callback) => {
  var methods = ["get", "post", "put", "delete"];

  if (methods.indexOf(data.method.toLowerCase()) >= 0) {
    // call the _user function according to the request method
    const method = data.method.toLowerCase();
    _user[method](data, callback);
  } else {
    callback(405, { error: "Method not allowed." });
  }
};

handler.token = (data, callback) => {
  var methods = ["get", "post", "put", "delete"];

  if (methods.indexOf(data.method.toLowerCase()) >= 0) {
    const method = data.method.toLowerCase();
    _token[method](data, callback);
  } else {
    callback(405, { error: "Method not allowed." });
  }
};

handler.menu = (data, callback) => {
  var methods = ["get", "post", "put", "delete"];

  if (methods.indexOf(data.method.toLowerCase()) >= 0) {
    const method = data.method.toLowerCase();
    _menu[method](data, callback);
  } else {
    callback(405, { error: "Method not allowed." });
  }
};

// routes
var routes = {
  "*": handler.notFound,
  user: handler.user,
  token: handler.token,
  menu: handler.menu,
};

module.exports = routes;
