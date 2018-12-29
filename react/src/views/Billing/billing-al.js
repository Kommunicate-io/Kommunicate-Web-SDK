import React, { Component, Fragment } from 'react';
import CommonUtils from '../../utils/CommonUtils';
import './billing.css';
import AnalyticsTracking from '../../utils/AnalyticsTracking';
import ApplozicClient, {SUBSCRIPTION_PACKAGES, PRICING_PLANS} from '../../utils/applozicClient';
import { getConfig } from '../../config/config';

class BillingApplozic extends Component {

    constructor(props) {
        super(props);

        let subscription = CommonUtils.getUserSession().subscription;
        if (typeof CommonUtils.getUserSession().subscription === 'undefined' || CommonUtils.getUserSession().subscription == '' || CommonUtils.getUserSession().subscription == '0') {
            subscription = 'startup';
        }

        let that = this;
        let handler = StripeCheckout.configure({
            key: getConfig().applozic.stripe,
            image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
            locale: 'auto',
            token: function(token) {
              that.subscribe(token);
            }
          });

        this.state = {
            handler: handler,
            modalIsOpen: false,
            subscription: subscription,
            currentPlan: '',
            trialLeft: 0,
            showPlanSelection: false,
            currentPlanDetailsText: "Trial period plan details",
            seatsBillable: "",
            planHeading: "",
            nextBillingDate: 0,
            totalPlanAmount: 0,
            disableSelectedPlanButton: false,
            clickedPlan:  'startup',
            currentModal: "",
        };

        this.buy = this.buy.bind(this);

    };

    componentDidMount() {
          // Close Checkout on page navigation:
          window.addEventListener('popstate', function() {
            this.state.handler.close();
          });
    }

    subscribe(token) {

        let value = 2; //index selected from the pricing slider;
        let pricingPackage = PRICING_PLANS[value].package;
        let quantity = 5; //selected number of MAU/1000
   
        ApplozicClient.subscribe(token, pricingPackage, quantity);
    }

    buy(e) {
        this.state.handler.open({
            name: 'Applozic, Inc',
            description: 'Chat SDK',
            amount: 12900
          });
        
        AnalyticsTracking.acEventTrigger("ac-choose-plan");  
    }

    render() {
        let status = SUBSCRIPTION_PACKAGES[CommonUtils.getUserSession().application.pricingPackage];
        let planMAU = CommonUtils.getUserSession().application.supportedMAU;

        return (
            <div className="animated fadeIn billings-section">
            Current plan: {status} | MAU: {planMAU}
               <button type="submit" value="Buy" onClick={this.buy}>Buy</button>
            </div>
        );
    }
}

export default BillingApplozic;
