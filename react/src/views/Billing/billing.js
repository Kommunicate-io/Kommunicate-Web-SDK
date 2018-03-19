import React, { Component } from 'react';
import axios from 'axios';
import {getConfig} from '../.../../../config/config.js';
import {patchCustomerInfo, getCustomerInfo} from '../../utils/kommunicateClient'
import Notification from '../model/Notification';
import { getResource } from '../../config/config.js'
import CommonUtils from '../../utils/CommonUtils';


class Billing extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            'subscription': CommonUtils.getUserSession().subscription
        };

        this.subscriptionPlanStatus = this.subscriptionPlanStatus.bind(this);
    }

    componentDidMount() {
      let that = this;

      document.getElementById("portal").addEventListener("click", function(event){
        if(event.target.classList.contains('n-vis')) {
          event.target.classList.remove('n-vis');
          return;
        }
      });

      var checkouts = document.getElementsByClassName("checkout");

      for (var i = 0; i < checkouts.length; i++) {
        checkouts[i].addEventListener('click', function(event) {
            that.checkoutSubscription(event, that);
        }, false);
      }

      let subscribeElems = document.getElementsByClassName("chargebee");
      
      for (var i=0, max=subscribeElems.length; i < max; i++) {
        subscribeElems[i].click();
      }
    }

    checkoutSubscription(event, that) {
        if (event.target.classList.contains('n-vis')) {
            event.target.classList.remove('n-vis');
            return;
        }

        var checkouts = document.getElementsByClassName("checkout");

        for (var i = 0; i < checkouts.length; i++) {
          checkouts[i].classList.remove('active');
        }
        event.target.classList.add('active');

        var cbInstance = window.Chargebee.getInstance();
        console.log(cbInstance);

        cbInstance.setCheckoutCallbacks(function (cart) {
            // you can define a custom callbacks based on cart object
            return {
                loaded: function () {
                    console.log("checkout opened");
                },
                close: function () {
                    console.log("checkout closed");
                },
                success: function (hostedPageId) {
                    console.log("success, hostedPageId: " + hostedPageId);
                },
                step: function (value) {
                    // value -> which step in checkout
                    console.log(value);
                    if (value == "thankyou_screen") {
                        let plans = document.getElementsByClassName('checkout active');
                        that.updateSubscription(Number(plans[0].getAttribute('data-subscription')));
                    }
                },
                visit: function (visit) {
                    // Optional
                    // called whenever the customer navigates different sections in portal
                },
                paymentSourceAdd: function () {
                    // Optional
                    // called whenever a new payment source is added in portal
                },
                paymentSourceUpdate: function () {
                    // Optional
                    // called whenever a payment source is updated in portal
                },
                paymentSourceRemove: function () {
                    // Optional
                    // called whenever a payment source is removed in portal.
                }
            }
        });

    }

    updateSubscription(subscription) {
        let that = this;
        let userSession = CommonUtils.getUserSession();

        const customerInfo = {
            applicationId: userSession.application.applicationId,
            subscription: subscription
        };
            
        that.updateCustomerSubscription(customerInfo, CommonUtils.getUserSession().userName)
            .then(response => {
                console.log(response)
                if (response.data.code === 'SUCCESS') {
                    userSession.subscription=subscription;
                    CommonUtils.setUserSession(userSession);
                    that.state.subscription = subscription;
                    Notification.info(response.data.message);
                }
            }).catch(err => {
                console.log(err);
                alert(err);
            });     
    }

    subscriptionPlanStatus() {
        return SUBSCRIPTION_PLANS[this.state.subscription || 0];
    }

    updateCustomerSubscription(customerInfo, customerName) {

        const patchCustomerUrl = getConfig().kommunicateApi.signup + '/' + customerName;
    
        return Promise.resolve(axios({
            method: 'patch',
            url: patchCustomerUrl,
            data: JSON.stringify(customerInfo),
            headers: {
                'Content-Type': 'application/json'
            }
        })).then(function (response) {
            if (response.status === 200 && response.data !== undefined) {
                console.log(response);
                return response;
            }

            if (response.status === 404 && response.data !== undefined) {
                console.log(response)
                return response;
            }
        });

    }

    render() {
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-block">
                                <div className="download-link-image-container">
                                    <div className="download-link-container">
                                      Your plan details
                                    
                                      {this.subscriptionPlanStatus()} #

                                      <a className="checkout chargebee n-vis" href="javascript:void(0)" data-subscription="1" data-cb-type="checkout" data-cb-plan-id="launch">Launch</a>
                                      <a className="checkout chargebee n-vis" href="javascript:void(0)" data-subscription="2" data-cb-type="checkout" data-cb-plan-id="growth">Growth</a>

                                      <a id="portal" className="n-vis" href="javascript:void(0)" data-cb-type="portal">Manage account</a>

                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const SUBSCRIPTION_PLANS = {
    0: "Free",
    1: "Launch",
    2: "Growth",
    3: "Enterprise",
  };

export default Billing;