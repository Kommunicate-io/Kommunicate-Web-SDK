/**
 * Chargebee API's
 * @reference: https://apidocs.chargebee.com/docs/api/ 
 */
var chargebee = require('chargebee');
const chargebeeSite = require('../../conf/config').getProperties().chargebeeSite;
const chargebeeApiKey = require('../../conf/config').getProperties().chargebeeApiKey;

const getSubscriptionList = () => {
    return new Promise(function (resolve, reject) {
        chargebee.configure({
            site: chargebeeSite,
            api_key: chargebeeApiKey
        });
        chargebee.subscription.list({
            limit: 100,
            "plan_id[starts_with]": "early_bird",
            "status[is]": "active",
            "sort_by[asc]": "created_at"
        }).request(function (error, result) {
            if (error) {
                return reject(error);
            } else {
                return resolve(result);
            }
        });
    })
}

const getSubscriptionDetail = subscriptionId => {
    return new Promise(function (resolve, reject) {
        chargebee.configure({ site: chargebeeSite, api_key: chargebeeApiKey });
        chargebee.subscription.retrieve(subscriptionId).
            request(function (error, result) {
                if (error) {
                    return reject(error);
                } else {
                    console.log(result);
                    return resolve(result);
                }
            });
    })
}

const updateSubscription = (subscriptionId, options) => {
    return new Promise(function (resolve, reject) {
        chargebee.configure({ site: chargebeeSite, api_key: chargebeeApiKey });
        chargebee.subscription.update(subscriptionId, options).
            request(function (error, result) {
                if (error) {
                    return reject(error);
                } else {
                    return resolve(result);
                }
            });
    })
}

const updateSubscriptionQuantity = (subscriptionId, addPlanQuantity) => {
    return getSubscriptionDetail(subscriptionId).then(result => {
        return updateSubscription(result.subscription.customer_id, { "plan_quantity": addPlanQuantity + result.subscription.plan_quantity });
    })

}
module.exports = {
    getSubscriptionDetail,
    getSubscriptionList,
    updateSubscription,
    updateSubscriptionQuantity
}