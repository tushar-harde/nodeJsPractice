// Dependency
var storage = require("./storage");
var auth = require("./authentication");

_cart = {};


_cart.post = (data, callback) => {
  callback(200, { msg: "Comming soon" });
};


_cart.get = (data, callback) => {
  const bearerHeader = data.headers.authorization;
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    var token = bearer[1];
    token = typeof token === "string" && token.trim().length > 0 ? token : false;
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
      callback(401, { msg: "You have to login to see menu." });
    }
  } else {
    callback(403, { msg: "You have to login to see menu." });
  }
};


_cart.put = (data, callback) => {
  callback(200, { msg: "comming soon" });
};

_cart.delete = (data, callback) => {
  callback(200, { msg: "comming soon." });
};

module.exports = _cart;
