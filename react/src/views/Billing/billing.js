import React, { Component } from 'react';
import axios from 'axios';
import {getConfig} from '../.../../../config/config.js';
import {patchCustomerInfo, getCustomerInfo} from '../../utils/kommunicateClient'
import Notification from '../model/Notification';
import { getResource } from '../../config/config.js'
import CommonUtils from '../../utils/CommonUtils';
import './billing.css';
import StartupPlanIcon from './img/Startup-plan-icon.svg';
import LaunchPlanIcon from './img/Launch-plan-icon.svg';
import GrowthPlanIcon from './img/Growth-plan-icon.svg';
import EnterprisePlanIcon from './img/Enterprise-plan-icon.svg';
import Modal from 'react-responsive-modal';
import SliderToggle from '../.../../../components/SliderToggle/SliderToggle';
import PlanDetails from '../.../../../components/PlanDetails/PlanDetails';

class Billing extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            modalIsOpen: false,
            toggleSlider: true,
            pricingMonthlyHidden: true,
            pricingYearlyHidden: false,
            hideFeatureList: true,
            showFeatures:'Show Features',
            subscription: CommonUtils.getUserSession().subscription,
            billingCustomerId: CommonUtils.getUserSession().billingCustomerId,
            currentPlan: SUBSCRIPTION_PLANS[0],
            trialLeft: 0
        };
        this.showHideFeatures = this.showHideFeatures.bind(this);
        //this.subscriptionPlanStatus = this.subscriptionPlanStatus.bind(this);
        };

    componentDidMount() {
      let that = this;
      this.processSubscriptionPlanStatus();

      document.getElementById("portal").addEventListener("click", function(event){
        if(event.target.classList.contains('n-vis')) {
          event.target.classList.remove('n-vis');
          return;
        }
      });

      var checkouts = document.getElementsByClassName("checkout");
      console.log("#found checkouts: " + checkouts.length);
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

    onOpenModal = () => {
        this.setState({ modalIsOpen: true });
      };
    
      onCloseModal = () => {
        this.setState({ modalIsOpen: false });
      };

    showHideFeatures(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
          hideFeatureList: !this.state.hideFeatureList,
          showFeatures: this.state.showFeatures === 'Show Features' ? 'Hide Features' : 'Show Features'
        });
    }
    handleToggleSliderChange = () => {
         this.setState({toggleSlider: !this.state.toggleSlider}, () => {
            if(this.state.toggleSlider) {
                this.setState({pricingMonthlyHidden: true, pricingYearlyHidden: false});
            } else {
                this.setState({pricingMonthlyHidden: false, pricingYearlyHidden: true});
            }
         });
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

    updateSubscription(subscription, billingCustomerId) {
        let that = this;
        let userSession = CommonUtils.getUserSession();

        const customerInfo = {
            applicationId: userSession.application.applicationId,
            subscription: subscription
        };

        if (typeof billingCustomerId !== "undefined") {
            customerInfo.billingCustomerId = billingCustomerId;
            userSession.billingCustomerId = billingCustomerId;
        }
            
        that.updateCustomerSubscription(customerInfo, userSession.userName)
            .then(response => {
                console.log(response)
                if (response.data.code === 'SUCCESS') {
                    userSession.subscription=subscription;
                    CommonUtils.setUserSession(userSession);
                    that.state.subscription = subscription;
                    if (typeof billingCustomerId !== "undefined") {
                        that.state.billingCustomerId = billingCustomerId;
                    }
                    Notification.info(response.data.message);
                }
            }).catch(err => {
                console.log(err);
                alert(err);
            });     
    }

    processSubscriptionPlanStatus() {
        if (this.state.subscription > 0) {
            this.setState({ currentPlan: SUBSCRIPTION_PLANS[this.state.subscription] });
        } else {
            var now = new Date();
            var trialStarted = new Date(CommonUtils.getUserSession().application.createdAtTime);
            var timeDiff = now.getTime() - trialStarted.getTime();
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (diffDays < 31) {
                this.setState({ trialLeft: (31 - diffDays) });
                this.setState({ currentPlan: SUBSCRIPTION_PLANS[2] });
            } else {
                this.setState({ currentPlan: SUBSCRIPTION_PLANS[0] });
            }
        }

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
        const { modalIsOpen } = this.state;
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-10">
                        <div className="card">
                            <div className="card-block">
                            {this.state.subscription == 0 ?
                                ( this.state.trialLeft > 0 && this.trialLeft <= 30 ?  
                                    (<div className="info-bar-container">
                                        <p className="info-bar-text"><strong>{this.state.trialLeft} days trial left.</strong> If no plan is chosen, you will be subscribed to the Startup Plan (FREE) at the end of the trial period.</p>
                                    </div>
                                    ) 
                                    : (
                                        <div className="info-bar-container info-bar--error">
                                        <p className="info-bar-text"><strong>Trial period over.</strong> You have been subscribed to the Startup Plan.</p>
                                        </div>
                                    ) 
                                )
                                :
                                null
                            }
                                
                                <div className="current-plan-container flexi">
                                    <div className="col-md-6">
                                        <p className="current-plan-details-text">Current plan details</p>
                                    </div>
                                    <div className="col-md-6 text-right">
                                        <button id="buy-plan-btn" className="checkout chargebee n-vis km-button km-button--primary buy-plan-btn" data-subscription="2" data-cb-type="checkout" data-cb-plan-id="growth">Buy this plan</button>

                                        <button id="change-plan-btn" className="km-button km-button--secondary change-plan-btn" onClick={this.onOpenModal}>Change plan</button>
                                    </div>
                                </div>

                                {/* Plan Name should be either of these : Startup, Launch, Growth, Enterprise */}
                                <PlanDetails PlanIcon={this.state.currentPlan.icon} PlanName={this.state.currentPlan.name} PlanMAU={this.state.currentPlan.mau} PlanAmount={this.state.currentPlan.amount} />

                                <div className="download-link-image-container">
                                    <div className="download-link-container">
                                      Your plan details
                                    
                                      <a className="checkout chargebee n-vis" href="javascript:void(0)" data-subscription="1" data-cb-type="checkout" data-cb-plan-id="launch">Launch</a>
                                      <a className="checkout chargebee n-vis" href="javascript:void(0)" data-subscription="2" data-cb-type="checkout" data-cb-plan-id="growth">Growth</a>

                                      <a id="portal" className="n-vis" href="javascript:void(0)" data-cb-type="portal">Manage account</a>

                                  </div>
                                </div>
                            </div>

                            {/* Change Plan Modal */}
                            <Modal open={modalIsOpen} onClose={this.onCloseModal}>

                                <div className="row text-center">
                                <h1 className="change-plan-text">Change Plan</h1>
                                <hr/>

                                {/* <!-- Pricing Toggle --> */}
                                <div className="pricing-toggle">
                                    <label className={this.state.toggleSlider === true ? "toggler" : "toggler toggler--is-active"} id="filt-monthly" onClick={this.handleToggleSliderChange}>Monthly</label>
                                    <div className="toggle">
                                        <input type="checkbox" id="switcher" className="check" checked={this.state.toggleSlider} onChange={this.handleToggleSliderChange} />
                                        <b className="b switch"></b>
                                    </div>
                                    <label className={this.state.toggleSlider === true ? "toggler toggler--is-active" : "toggler"} id="filt-yearly" onClick={this.handleToggleSliderChange}>Yearly</label>
                                </div>

                                <div className="col-lg-3 col-md-3 col-xs-12">
                                    <div className="pricing-table">
                                        <div className="pricing-table-container">
                                            <div className="pricing-table-header">
                                                <h2 className="pricing-table-plan-title">Startup</h2>
                                                <div className="price-image-container">
                                                    <img src={StartupPlanIcon} alt="Startup Plan Icon"/>
                                                </div>
                                                
                                            </div>
                                            <div className="pricing-table-body">
                                                <div className="pricing-table-body-header">
                                                    <div className="pricing-value">
                                                        <h2>FREE FOREVER
                                                        <p style={{visibility:'hidden', fontSize: '14px', fontWeight: 400, marginTop: '10px'}}>(Billed Annually)</p>
                                                        </h2>
                                                    </div>
                                                    <div className="price-mau">
                                                        <h4>250 Chat users /mo</h4>
                                                    </div>                              
                                                </div>
                                                <a href="#/" className="see-plan-details" style={{marginBottom:'15px', display:'block'}} onClick={this.showHideFeatures}>{this.state.showFeatures}</a>
                                                <div className="pricing-table-body-footer" hidden={this.state.hideFeatureList}>
                                                    <p style={{opacity:0}}>Includes...</p>
                                                    <ul>
                                                        <li>Messenger</li>
                                                        <li>Team Inbox</li>
                                                        <li>Auto Reply</li>
                                                        <li>Android &amp; iOS Agent app</li>
                                                        <li>1 Bot integration supported</li>
                                                        <li>Data retention: 3 months</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="pricing-table-footer">
                                                <button className="checkout chargebee km-button km-button--primary" data-subscription="0" data-cb-type="checkout" data-cb-plan-id="free">Select Plan</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-3 col-xs-12">
                                    <div className="pricing-table">
                                        <div className="pricing-table-container launch">
                                            <div className="pricing-table-header">
                                                <h2 className="pricing-table-plan-title">Launch</h2>
                                                <div className="price-image-container">
                                                    <img src={LaunchPlanIcon} alt="Launch Plan Icon"/>
                                                </div>
                                                
                                            </div>
                                            <div className="pricing-table-body">
                                                <div className="pricing-table-body-header">
                                                    <div className="pricing-value">
                                                        <h2 id="launch-pricing-monthly" hidden={this.state.pricingMonthlyHidden}>$49<span className="per-month-span">/MO</span>
                                                        <p style={{visibility:'hidden', fontSize: '14px', fontWeight: 400, marginTop: '10px'}}>(Billed Annually)</p></h2>
                                                        <h2 id="launch-pricing-yearly" hidden={this.state.pricingYearlyHidden}>$39<span className="per-month-span">/MO</span>
                                                            <p style={{visibility:'visible', fontSize: '14px', fontWeight: 400, marginTop: '10px'}}>(Billed Annually)</p></h2>
                                                    </div>
                                                    <div className="price-mau">
                                                        <h4>1000 Chat users /mo</h4>
                                                         
                                                    </div>
                                                </div>
                                                <a href="#/" className="see-plan-details" style={{marginBottom:'15px', display:'block'}} onClick={this.showHideFeatures}>{this.state.showFeatures}</a>
                                                <div className="pricing-table-body-footer"hidden={this.state.hideFeatureList}>
                                                        <p>All in Startup</p>
                                                    <ul>
                                                        <li>Unlimited bots</li>
                                                        <li>Advanced reporting</li>
                                                        <li>White label (removed powered by Kommunicate)</li>
                                                        <li>Data retention: Forever</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="pricing-table-footer">
                                                <button className="checkout chargebee km-button km-button--primary" data-subscription="1" data-cb-type="checkout" data-cb-plan-id="launch">Select Plan</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-3 col-xs-12">
                                    <div className="pricing-table">
                                        <div className="pricing-table-container growth">
                                            <div className="pricing-table-header">
                                                <h2 className="pricing-table-plan-title">Growth</h2>
                                                <div className="price-image-container">
                                                    <img src={GrowthPlanIcon} alt="Growth Plan Icon"/>
                                                </div>
                                                
                                            </div>
                                            <div className="pricing-table-body">
                                                <div className="pricing-table-body-header">
                                                    <div className="pricing-value">
                                                        <h2 id="growth-pricing-monthly" hidden={this.state.pricingMonthlyHidden}>$199<span className="per-month-span">/MO</span>
                                                            <p style={{visibility:'hidden', fontSize: '14px', fontWeight: 400, marginTop: '10px'}}>(Billed Annually)</p></h2>
                                                        <h2 id="growth-pricing-yearly" hidden={this.state.pricingYearlyHidden}>$149<span className="per-month-span">/MO</span>
                                                            <p style={{visibility:'visible', fontSize: '14px', fontWeight: 400, marginTop: '10px'}}>(Billed Annually)</p></h2>
                                                    </div>
                                                    <div className="price-mau">
                                                        <h4>5000 Chat users /mo</h4>
                                                         
                                                    </div>
                                                </div>
                                                <a href="#/" className="see-plan-details" style={{marginBottom:'15px', display:'block'}} onClick={this.showHideFeatures}>{this.state.showFeatures}</a>
                                                <div className="pricing-table-body-footer" hidden={this.state.hideFeatureList}>
                                                    <p>All in Launch</p>
                                                    <ul>
                                                        <li>Custom bot integrations</li>
                                                        <li>Priority Email Support</li>
                                                        <li>CRM integration</li>
                                                        <li>Data retention: Forever</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="pricing-table-footer">
                                                <button className="checkout chargebee km-button km-button--primary" data-subscription="2" data-cb-type="checkout" data-cb-plan-id="growth">Select Plan</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-3 col-xs-12">
                                    <div className="pricing-table">
                                        <div className="pricing-table-container enterprise">
                                            <div className="pricing-table-header">
                                                <h2 className="pricing-table-plan-title">Enterprise</h2>
                                                <div className="price-image-container">
                                                    <img src={EnterprisePlanIcon} alt="Enterprise Plan Icon"/>
                                                </div>
                                                
                                            </div>
                                            <div className="pricing-table-body">
                                                <div className="pricing-table-body-header">
                                                    <div className="pricing-value">
                                                        <h2>CUSTOM
                                                        <p style={{visibility:'hidden', fontSize: '14px', fontWeight: 400, marginTop: '10px'}}>(Billed Annually)</p>
                                                        </h2>
                                                    </div>
                                                    <div className="price-mau">
                                                        <h4>Unlimited Chat users /mo</h4>
                                                         
                                                    </div>
                                                </div>
                                                <a href="#/" className="see-plan-details" style={{marginBottom:'15px', display:'block'}} onClick={this.showHideFeatures}>{this.state.showFeatures}</a>
                                                <div className="pricing-table-body-footer" hidden={this.state.hideFeatureList}>
                                                    <p>All in Growth</p>
                                                    <ul>
                                                        <li>Custom bot development</li>
                                                        <li>Personalized support on Phone &amp; Skype</li>
                                                        <li>Customised solution for your specific needs</li>
                                                        
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="pricing-table-footer">
                                                <button className="km-button km-button--primary">Select Plan</button>
                                            </div>  
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </Modal>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const SUBSCRIPTION_PLANS = {
    0: {
        'icon': StartupPlanIcon,
        'name': 'Free',
        'mau': '250',
        'amount' : '0/month'
    },
    1: {
        'icon': LaunchPlanIcon,
        'name': 'Launch',
        'mau': '1000',
        'amount' : '39/month'
    },
    2: {
        'icon': GrowthPlanIcon,
        'name': 'Growth',
        'mau': '5000',
        'amount' : '149/month'
    },
    3: {
        'icon': EnterprisePlanIcon,
        'name': 'Enterprise',
        'mau': 'Custom',
        'amount' : 'Custom'
    }
  };

export default Billing;