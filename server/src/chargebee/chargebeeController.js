var chargebee = require('chargebee');
const chargebeeSite = require('../../conf/config').getProperties().chargebeeSite;
const chargebeeApiKey = require('../../conf/config').getProperties().chargebeeApiKey;

exports.subscriptionCount = function (req, res) {
    chargebee.configure({
        site: chargebeeSite,
        api_key: chargebeeApiKey
    });
    chargebee.subscription.list({
        limit: 1000,
        "plan_id[starts_with]": "early_bird",
        "status[is]": "active",
        "sort_by[asc]": "created_at"
    }).request(function (error, result) {
        if (error) {
            //handle error
            console.log(error);
            res.status(500).json(error);
        } else {
            /*for (var i = 0; i < result.list.length; i++) {
                var entry = result.list[i]
                console.log(entry);
                var subscription = entry.subscription;
                var customer = entry.customer;
                var card = entry.card;
            }*/
            res.status(200).json(new Date().getDate() * 2 + result.list.length);
        }
    });
};