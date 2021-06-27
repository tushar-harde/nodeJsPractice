// Dependency
var storage = require("./storage");
var auth = require("./authentication");
var payment = require("./payment");

_purchase = {};

_purchase.post = (data, callback) => {
  const token = data.headers.authorization;
  const items = data.payload;
  if (token) {
    auth
      .authorized(token)
      .then((user) => {
        try {
            if (items.length > 0) {
              _purchase.getPurchaseDetails(items)
              .then(amount => {
                payment.purchase(amount.toString(), 'INR', 'Purchase payment', 'tok_visa', user.email)
                  .then(result => {
                    payment.sendReceipt(user.email, amount)
                      .then(res => {
                        callback(200, {
                          msg: 'Payment done successfully!',
                          amount: amount,
                          email: user.email
                        });
                      })
                      .catch(error => {
                        callback(500, {error: error.toString()});
                      });
                  })
                  .catch(error => {
                    callback(500, {error: error.toString()});
                  });
              })
              .catch(error => {
                callback(500, { error: error.toString() });
              });
            } else {
              callback(400, { msg: "No products provided." })
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

// returns the amount for purchase
_purchase.getPurchaseDetails = (items) => {
  return new Promise((resolve, reject) => {
    storage.read('menu', 'menu', async (err, item) => {
      if (!err && item) {
        try {
          const products = JSON.parse(item);
          var amount = 0;
          for (const itemID of items) {
            const productInfo = await products.find(el => el.id == itemID);
            if (productInfo) {
              amount += +productInfo.price
            }
          }
          resolve(amount);
        } catch (error) {
          reject({error: error.toString()});
        }
      } else {
        reject({error: err.toString()});
      }
    });
  });
}

module.exports = _purchase;
