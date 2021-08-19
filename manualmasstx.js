/**
 *  Simple script based on masstx.js.
 *  It allows to send a mass transaction manually. 
 *  The json data payload has to be defined in variable masstransactionpayment.
 */
var masstransactionpayment = JSON.parse('');

var config = {
    payoutfileprefix: 'ltoleaserpayouts',
    node: 'http://localhost:6869',
    apiKey: 'your api key'
};

const debug = true;
const decimalpts = 8

var fs = require('fs');
var request = require('request');
var newpayqueue = []

function doPayment() {
    if (debug) {
        console.log("debug output:");
        console.log("going to send out request with following masstransactionpayment:");
        console.log(JSON.stringify(masstransactionpayment));
    }

    request.post({
        url: config.node + '/transactions/sign',
        json: masstransactionpayment,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "api_key": !debug ? config.apiKey : ''
        }
    }, function(err, res) {
        if (err || res.body.error) {
            const error = err || res.body;

            console.log(error);
            
            if(!debug) {
                return;
            }
        }

        request.post({
            url: config.node + '/transactions/broadcast',
            json: !debug ? res.body : {},
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }, function(err, res) {

            if (err || res.body.error) {
                const error = err || res.body;

                console.log(error);
                if(!debug) {
                    return;
                }
            }

            console.log("masstransfer done")
        });
    });
}

doPayment();
