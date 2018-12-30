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
        let stripeHandler = StripeCheckout.configure({
            key: getConfig().applozic.stripe,
            image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
            locale: 'auto',
            token: function(token) {
                that.state.stripeHandlerCallback(token);
            }
          });

        this.state = {
            stripeHandler: stripeHandler,
            stripeHandlerCallback: that.subscribe,
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

        this.buyClick = this.buyClick.bind(this);
        this.changeCardClick = this.changeCardClick.bind(this);
    };

    componentDidMount() {
          // Close Checkout on page navigation:
          window.addEventListener('popstate', function() {
            this.state.stripeHandler.close();
          });
    }

    buy(token) {
        let value = 2; //index selected from the pricing slider;
        let pricingPackage = PRICING_PLANS[value].package;
        let quantity = 5; //selected number of MAU/1000
   
        ApplozicClient.subscribe(token, pricingPackage, quantity);
    }

    buyClick(e) {
        this.state.stripeHandlerCallback = this.buy;
        this.state.stripeHandler.open({
            name: 'Applozic, Inc',
            description: 'Chat SDK',
            amount: 12900
          });
        
        AnalyticsTracking.acEventTrigger("ac-choose-plan");  
    }

    changeCardClick(e) {
        this.state.stripeHandlerCallback = ApplozicClient.changeCard;
        this.state.stripeHandler.open({
            name: 'Applozic, Inc',
            description: 'Card Update',
          });
    }

    render() {
        let status = SUBSCRIPTION_PACKAGES[CommonUtils.getUserSession().application.pricingPackage];
        let planMAU = CommonUtils.getUserSession().application.supportedMAU;

        return (
            <div className="animated fadeIn billings-section">
            Current plan: {status} | MAU: {planMAU}
                <br></br>
               <button type="submit" value="Buy" onClick={this.buyClick}>Buy</button>
                <br></br>
               <button type="submit" value="Change Card" onClick={this.changeCardClick}>Change Card</button>

            </div>
        );
    }
}

export default BillingApplozic;
