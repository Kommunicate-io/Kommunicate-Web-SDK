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
        let response = await getSubscription(req.params.userId);;
        if (typeof response == 'object') {
            return res.status(200).json({ "code": "success", "response": response.subscription })
        } else {
            return res.status(200).json({ "code": "success", "message": response });
        }
    } catch (err) {
        return res.status(500).json({ "code": "error", "response": err.message });
    }
}

exports.updateSubscribedAgentCount = async function (req, res) {
    let addPlanQuantity = req.body.addPlanQuantity;
    try {
        let result = await getSubscription(req.params.userId);
        if (typeof result=='object') {
            let response = await chargebeeService.updateSubscription(result.subscription.customer_id, { "plan_quantity": addPlanQuantity + result.subscription.plan_quantity });
            return res.status(200).json({ "code": "success", "response": response });
        } else {
            return res.status(500).json({ "code": "error", "message": result});
        }
    } catch (err) {
        return res.status(500).json({ "code": "error", "response": err.message });
    }
}

const getSubscription = async function (userId) {
    try {
        let customer = await customerService.getCustomerByUserName(userId);
        if (!customer) {
            return "customer not found";
        }
        if (!customer.billingCustomerId) {
            return "not subscribe";
        }
        let result = await chargebeeService.getSubscriptionDetail(customer.billingCustomerId);
        return result;
    } catch (err) {
        console.log('error while getting subscription detail', err);
        return;
    }
}