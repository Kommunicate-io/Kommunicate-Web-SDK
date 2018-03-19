import React, { Component } from 'react';
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

    componentWillMount() {

    }

    componentDidMount() {

      document.getElementById("portal").addEventListener("click", function(event){
        if(event.target.classList.contains('n-vis')) {
          event.target.classList.remove('n-vis');
          return;
        }
      });
      
      document.getElementById("checkout").addEventListener("click", function(event){
        if(event.target.classList.contains('n-vis')) {
          event.target.classList.remove('n-vis');
          return;
        }
        var cbInstance = window.Chargebee.getInstance();
        console.log(cbInstance);
  
          cbInstance.setCheckoutCallbacks(function(cart) {
              // you can define a custom callbacks based on cart object
              return {
                  loaded: function() {
                      console.log("checkout opened");
                  },
                  close: function() {
                      console.log("checkout closed");
                  },
                  success: function(hostedPageId) {
          
                  },
                  step: function(value) {
                      // value -> which step in checkout
                      console.log(value);
                  }
              }
          });
      });

      let subscribeElems = document.getElementsByClassName("chargebee");
      
      for (var i=0, max=subscribeElems.length; i < max; i++) {
        subscribeElems[i].click();
      }
    }

    updateSubscription(subscription) {
        let that = this;
        let userSession = CommonUtils.getUserSession();

        const customerInfo = {
            "subscription": subscription
        }
            
        patchCustomerInfo(customerInfo, CommonUtils.getUserSession().userName)
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
        console.log("subscription: " + this.state.subscription);
        return SUBSCRIPTION_PLANS[this.state.subscription];
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
                                      <a id="checkout" className="chargebee n-vis" href="javascript:void(0)" data-cb-type="checkout" data-cb-plan-id="cbdemo_hustle">Subscribe</a>

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