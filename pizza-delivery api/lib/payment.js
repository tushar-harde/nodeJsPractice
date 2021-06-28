// Dependancy
var https = require('https');
const { resolve } = require('path');
var querystring = require('querystring');

_payment = {}

_payment.purchase = (amount, currency, description, source, email) => {
    return new Promise((resolve, reject) => {
        amount = typeof amount == 'string' && amount > 0 ? amount : false;
        currency = typeof currency == 'string' && currency.length > 0 ? currency : false;
        description = typeof description == 'string' && description.length > 0 ? description : false;
        source = typeof source == 'string' && source.length > 0 ? source : false;
        email = typeof email == 'string' && email.length > 0 ? email : false;
        if (amount > 0 && currency && description && source && email) {
            try {
                var requestDetails = {
                    'protocol': 'https:',
                    'hostname': 'api.stripe.com',
                    'method': 'POST',
                    'path': '/v1/charges',
                    'headers':
                    {
                        'Authorization': `Bearer sk_test_4eC39HqLyjWDarjtT1zdp7dc`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };
            
                var payload = {
                    'currency': currency,
                    'source': source,
                    'amount': amount,
                    'description': description,
                };
            
                var req = https.request(requestDetails, (res) => {
                    if (200 == res.statusCode || 201 == res.statusCode) {
                        resolve(res);
                    } else {
                        reject('Status code not match');
                    }
                });
                req.on('error', function (error) {
                    reject('Http request error occured.');
                });
                req.write(querystring.stringify(payload));
                req.end();
            } catch (error) {
                reject(error.toString());
            }
        } else {
            reject('All fields are required!');
        }
    });
}

_payment.sendReceipt = (email, amount) => {
    return new Promise((resolve, reject) => {
        var apikey = 'api:xxxx';
        var requestDetails = {
            'protocol': 'https:',
            'hostname': 'api.mailgun.net',
            'method': 'POST',
            'path': '/v3/sandboxxxxx.mailgun.org/messages',
            'headers':
            {
                'Authorization': `Basic ` + Buffer.from(apikey, 'utf8').toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
    
        var payload = {
            from: 'Excited User <mailgun@sandboxxxxx.mailgun.org>',
            to: 'tusharharde55555@gmail.com',
            subject: 'Payment receipt',
            text: 'Your payment for Rs. '+ amount +' has successfully done.'
        };
    
        var req = https.request(requestDetails, (res) => {
            if (200 == res.statusCode || 201 == res.statusCode) {
                resolve(res);
            } else {
                reject('Status code not match');
            }
            res.on('data', d => {
                process.stdout.write(d)
              })
        });
        req.on('error', function (error) {
            reject('Http request error occured.');
        });
        req.write(querystring.stringify(payload));
        req.end();
    });
}

module.exports = _payment;
