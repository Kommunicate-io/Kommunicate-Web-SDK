const chargebeeService = require('./chargebeeService');
const customerService = require('../customer/customerService');

exports.subscriptionCount = function (req, res) {
    return chargebeeService.getSubscriptionList().then(result => {
        return res.status(200).json(new Date().getDate() * 2 + result.list.length);
    }).catch(err => {
        console.log("error", err);
        return res.status(500).json({ "code": "error", "response": "error" });
    })
};

exports.getSubscriptionDetail = async function (req, res) {
    try {
        let customer = await customerService.getCustomerByUserName(req.params.userId);
        let response = await chargebeeService.getSubscriptionDetail(customer.billingCustomerId);
        return response ? res.status(200).json({ "code": "success", "response": response.subscription })
            : res.status(200).json({ "code": "success", "message": "record not found" });
    } catch (err) {
        return res.status(500).json({ "code": "error", "response": err.message });
    }
}

exports.updateSubscribedAgentCount = async function (req, res) {
    let addPlanQuantity = req.body.addPlanQuantity;
    try {
        let customer = await customerService.getCustomerByUserName(req.params.userId);
        let result = await chargebeeService.getSubscriptionDetail(customer.billingCustomerId);
        let response = await chargebeeService.updateSubscription(customer.billingCustomerId, { "plan_quantity": addPlanQuantity + result.subscription.plan_quantity });
        return response ? res.status(200).json({ "code": "success", "response": response })
            : res.status(500).json({ "code": "error", "message": "updation error" });;

    } catch (err) {
        return res.status(500).json({ "code": "error", "response": err.message });
    }
}
