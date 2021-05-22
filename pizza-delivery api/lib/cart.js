// Dependency
var storage = require("./storage");
var auth = require("./authentication");

_cart = {};

_cart.post = (data, callback) => {
  const token = data.headers.authorization;
  const cartData = data.payload;
  if (token) {
    auth
      .authorized(token)
      .then((user) => {
        try {
          if (cartData.menuItem.length > 0) {
            var menu;
            const userCart = {
              email: user.email,
              menuItem: [],
            };
            storage.read("menu", "menu", async (error, response) => {
              if (!error) {
                menu = JSON.parse(response);
                for (const [index, item] of cartData.menuItem.entries()) {
                  const itemDetail = menu.find((el) => el.id == item);
                  if (itemDetail) {
                    userCart.menuItem.push(itemDetail);
                    if (index === cartData.menuItem.length - 1) {
                      storage.create("cart", user.email, userCart, (error) => {
                        if (!error) {
                          callback(200, userCart);
                        } else {
                          callback(500, { msg: "Failed to create cart. May be cart for this user already exists." });
                        }
                      });
                    }
                  } else {
                    callback(200, {
                      msg: "Invalid menuItemID " + item + ". Cart not created.",
                    });
                    break;
                  }
                }
              } else {
                callback(500, "Failed to read menu");
              }
            });
          } else {
            callback(400, { msg: "Cart must have one item." });
          }
        } catch (error) {
          callback(500, { error: error.toString() });
        }
      })
      .catch((error) => {
        callback(401, { msg: "Invalid token id." });
      });
  } else {
    callback(403, { msg: "You have to login to add cart." });
  }
};

_cart.get = (data, callback) => {
  const token = data.headers.authorization;
  if (token) {
    auth
      .authorized(token)
      .then((user) => {
        storage.read("cart", user.email, (error, cart) => {
          if (!error) {
            callback(200, JSON.parse(cart));
          } else {
            callback(200, { msg: "No item in cart." });
          }
        });
      })
      .catch((error) => {
        callback(401, { msg: "Invalid token id." });
      });
  } else {
    callback(403, { msg: "You have to login to see cart." });
  }
};

_cart.put = (data, callback) => {
  const token = data.headers.authorization;
  const cartData = data.payload;
  if (token) {
    auth
      .authorized(token)
      .then((user) => {
        var menu;
        const userCart = {
          email: user.email,
          menuItem: [],
        };
        if (cartData.menuItem.length > 0) {
         try {
          storage.read("menu", "menu", (error, response) => {
            if (!error) {
              menu = JSON.parse(response);
              for (const [index, item] of cartData.menuItem.entries()) {
                const itemDetail = menu.find((el) => el.id == item);
                if (itemDetail) {
                  userCart.menuItem.push(itemDetail);
                  if (index === cartData.menuItem.length - 1) {
                    storage.update("cart", user.email, userCart, (error) => {
                      if (!error) {
                        callback(200, userCart);
                      } else {
                        callback(500, { msg: "Failed to update cart." });
                      }
                    });
                  }
                } else {
                  callback(200, {
                    msg: "Invalid menuItemID" + item + "Cart not updated.",
                  });
                  break;
                }
              }
            } else {
              callback(500, "Failed to read menu");
            }
          });
         } catch (error) {
           callback(500, {error: error.toString()});
         }          
        } else {
          storage.update("cart", user.email, userCart, (error) => {
            if (!error) {
              callback(200, userCart);
            } else {
              callback(500, { msg: "Failed to update cart." });
            }
          });
        }
      })
      .catch((error) => {
        callback(401, { msg: "Invalid token id." });
      });
  } else {
    callback(403, { msg: "You have to login to add cart." });
  }
};

_cart.delete = (data, callback) => {
  const token = data.headers.authorization;
  if (token) {
    auth
      .authorized(token)
      .then((user) => {
        storage.delete("cart", user.email, (error, cart) => {
          if (!error) {
            callback(200, { msg: "Cart deleted successfully." });
          } else {
            callback(200, {
              msg: "Failed to delete cart. Maybe cart not exists.",
            });
          }
        });
      })
      .catch((error) => {
        callback(401, { msg: "Invalid token id." });
      });
  } else {
    callback(403, { msg: "You have to login to delete cart." });
  }
};

module.exports = _cart;
