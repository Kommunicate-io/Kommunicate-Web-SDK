import React, { Component } from 'react';
import axios from 'axios';
import { getConfig } from '../.../../../config/config.js';
import { patchCustomerInfo, getCustomerInfo } from '../../utils/kommunicateClient'
import Notification from '../model/Notification';
import { getResource } from '../../config/config.js'
import CommonUtils from '../../utils/CommonUtils';
import './billing.css';
import StartupPlanIcon from './img/Startup-plan-icon.svg';
import LaunchPlanIcon from './img/Launch-plan-icon.svg';
import GrowthPlanIcon from './img/Growth-plan-icon.svg';
import EnterprisePlanIcon from './img/Enterprise-plan-icon.svg';
import EarlyBirdPlanIcon from './img/Growth-plan-icon.svg';
import Modal from 'react-modal';
//import Modal from 'react-responsive-modal';
import SliderToggle from '../.../../../components/SliderToggle/SliderToggle';
import PlanDetails from '../.../../../components/PlanDetails/PlanDetails';
import PlanView from '../.../../../components/PlanDetails/PlanView';
 
import RadioButton from '../../components/RadioButton/RadioButton';
// import {RadioGroup, Radio} from '../../components/Radio/Radio';

class Billing extends Component {

    constructor(props) {
        super(props);

        let subscription = CommonUtils.getUserSession().subscription;
        if (typeof CommonUtils.getUserSession().subscription === 'undefined' || CommonUtils.getUserSession().subscription == '' || CommonUtils.getUserSession().subscription == '0') {
            subscription = 'startup';
        }

        this.state = {
            modalIsOpen: false,
            toggleSlider: true,
            pricingMonthlyHidden: true,
            pricingYearlyHidden: false,
            hideFeatureList: true,
            showFeatures: 'Show Features',
            yearlyChecked: false,
            hideSubscribedSuccess: true,
            subscription: subscription,
            billingCustomerId: CommonUtils.getUserSession().billingCustomerId,
            currentPlan: SUBSCRIPTION_PLANS['startup'],
            trialLeft: 0,
            showPlanSelection: false
        };
        this.showHideFeatures = this.showHideFeatures.bind(this);
        //this.subscriptionPlanStatus = this.subscriptionPlanStatus.bind(this);

        this.onOpenModal = this.onOpenModal.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.selectYearly = this.selectYearly.bind(this);
        this.selectMonthly = this.selectMonthly.bind(this);
        this.onCloseSubscribedSuccess = this.onCloseSubscribedSuccess.bind(this);
        this.buyThisPlanClick = this.buyThisPlanClick.bind(this);
    };

    componentDidMount() {
        
        /*Note: hack to create instance of chargebee by creating a hidden element and triggering click on it.
        Chargebee plugin code is modified to read click*/
        document.getElementById("chargebee-init").click();

        let userSession = CommonUtils.getUserSession();

        this.processSubscriptionPlanStatus();
        let customerId = CommonUtils.getUrlParameter(window.location.href, 'cus_id');

        if (customerId) {
            this.updateSubscription(userSession.subscription, customerId);
            this.setState({hideSubscribedSuccess: false});
        }

        document.getElementById("portal").addEventListener("click", function (event) {
            if (event.target.classList.contains('n-vis')) {
                event.target.classList.remove('n-vis');
                return;
            }
        });

        this.chargebeeInit();
    }

    buyThisPlanClick = () => {
        this.setState({showPlanSelection: !this.state.showPlanSelection}, () => this.chargebeeInit());
    }

    onOpenModal = () => {
        this.setState({ modalIsOpen: true });
    };

    afterOpenModal = () => {
        this.chargebeeInit();
    }

    onCloseModal = () => {
        this.setState({ modalIsOpen: false });
    };

    chargebeeInit() {
        let that = this;

        var checkouts = document.getElementsByClassName("checkout");
        for (var i = 0; i < checkouts.length; i++) {
            checkouts[i].addEventListener('click', function (event) {
                that.checkoutSubscription(event, that);
            }, false);
        }

        let subscribeElems = document.getElementsByClassName("chargebee");
        for (var i = 0; i < subscribeElems.length; i++) {

            if (subscribeElems[i].classList.contains('n-vis')) {
                subscribeElems[i].click();
            }
            if (subscribeElems[i].getAttribute('data-subscription') == that.state.subscription) {
                subscribeElems[i].disabled = true;
            }
        }
    }

    showHideFeatures(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            hideFeatureList: !this.state.hideFeatureList,
            showFeatures: this.state.showFeatures === 'Show Features' ? 'Hide Features' : 'Show Features'
        });
    }
    handleToggleSliderChange = () => {
        this.setState({ toggleSlider: !this.state.toggleSlider }, () => {
            if (this.state.toggleSlider) {
                this.setState({ pricingMonthlyHidden: true, pricingYearlyHidden: false });
            } else {
                this.setState({ pricingMonthlyHidden: false, pricingYearlyHidden: true });
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
                        that.updateSubscription(plans[0].getAttribute('data-subscription'));
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

        that.updateCustomerSubscription(customerInfo)
            .then(response => {
                if (response.data.code === 'SUCCESS') {
                    userSession.subscription = subscription;
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
        if (this.state.subscription != '' && this.state.subscription != 'startup') {
            this.setState({ currentPlan: SUBSCRIPTION_PLANS[this.state.subscription] });
            if (this.state.subscription.indexOf('yearly') != -1) {
                this.setState({yearlyChecked: true});
            }
        } else {
            var now = new Date();
            var trialStarted = new Date(CommonUtils.getUserSession().application.createdAtTime);
            var timeDiff = now.getTime() - trialStarted.getTime();
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (diffDays < 31) {
                this.setState({ trialLeft: (31 - diffDays) });
                this.setState({ currentPlan: SUBSCRIPTION_PLANS['early_bird_monthly'] });
            } else {
                this.setState({ currentPlan: SUBSCRIPTION_PLANS['startup'] });
            }
        }
    }

    updateCustomerSubscription(customerInfo) {
        let userSession = CommonUtils.getUserSession();

        const patchCustomerUrl = getConfig().kommunicateApi.signup + '/' + userSession.userName;

        return Promise.resolve(axios({
            method: 'patch',
            url: patchCustomerUrl,
            data: JSON.stringify(customerInfo),
            headers: {
                'Content-Type': 'application/json'
            }
        })).then(function (response) {
            if (response.status === 200 && response.data !== undefined) {
                return response;
            }

            if (response.status === 404 && response.data !== undefined) {
                console.log(response)
                return response;
            }
        });

    }

    selectYearly() {
        this.setState({
            yearlyChecked: 1
        })
    }

    selectMonthly() {
        this.setState({
            yearlyChecked: 0
        })
    }

    onCloseSubscribedSuccess() {
        this.setState({ hideSubscribedSuccess: true });
    }

    render() {
        //Todo: set this dynamically based on current plan
        const billedYearly = (
            <div className="radio-content-container">
                <h3>Billed Yearly</h3>
                <p>{SUBSCRIPTION_PLANS['early_bird_yearly'].amount}/month</p>
            </div>
        )
        const billedMonthly = (
            <div className="radio-content-container">
                <h3>Billed Monthly</h3>
                <p>{SUBSCRIPTION_PLANS['early_bird_monthly'].amount}/month</p>
            </div>
        )
        const { modalIsOpen } = this.state;
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-10">
                        <div className="card">
                            <div className="card-block">
                                <button id="chargebee-init" hidden></button>
                                {this.state.subscription == '' || this.state.subscription == 'startup' ?
                                    (this.state.trialLeft > 0 && this.state.trialLeft <= 31 ?
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

                                {/* Subscribe successfully box */}
                                <div className="subscribe-success-error-container text-center" hidden={this.state.hideSubscribedSuccess}>
                                    <div className="subscribe-success_img-container">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56">
                                            <g fill="#2DD35C">
                                                <path d="M16.7125 23.275l-2.5375 2.3625 11.9 12.775 27.9125-28-2.45-2.45L26.075 33.425z" />
                                                <path d="M.525 28C.525 43.225 12.8625 55.475 28 55.475c15.1375 0 27.475-12.25 27.475-27.475h-3.5c0 13.2125-10.7625 23.975-23.975 23.975C14.7875 51.975 4.025 41.2125 4.025 28 4.025 14.7875 14.7875 4.025 28 4.025v-3.5C12.8625.525.525 12.8625.525 28z" />
                                            </g>
                                        </svg>
                                    </div>
                                    <h3 className="subscribe-success-error-text">You have been successfully subscribed</h3>
                                    <button className="close-modal-btn" onClick={this.onCloseSubscribedSuccess}>
                                        CLOSE
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24" viewBox="0 0 24 24" width="24">
                                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                            <path d="M0 0h24v24H0z" fill="none" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="current-plan-container flexi">
                                    <div className="col-md-6">
                                        <p className="current-plan-details-text">Current plan details</p>
                                    </div>
                                    <div className="col-md-6 text-right">

                                        {this.state.trialLeft > 0 && this.state.trialLeft <= 31 && !this.state.showPlanSelection?
                                            (
                                            <button id="buy-plan-btn" className="km-button km-button--primary buy-plan-btn" onClick={this.buyThisPlanClick}>Buy this plan</button>
                                            )
                                            :
                                            null
                                        }
                                        {!this.state.showPlanSelection ?
                                            (<button id="change-plan-btn" className="km-button km-button--secondary change-plan-btn" onClick={this.onOpenModal}>Change plan</button>)
                                            :
                                            null
                                        }

                                    {/* Next and Cancel Buttons */}
                                    {this.state.showPlanSelection ?
                                       (
                                        <div>
                                            <button hidden={!this.state.yearlyChecked} className="next-step-btn n-vis checkout chargebee km-button km-button--primary" data-subscription="early_bird_yearly" data-cb-type="checkout" data-cb-plan-id="early_bird_yearly">
                                                Next
                                            </button>
                                            <button hidden={this.state.yearlyChecked} className="next-step-btn n-vis checkout chargebee km-button km-button--primary" data-subscription="early_bird_monthly" data-cb-type="checkout" data-cb-plan-id="early_bird_monthly">
                                                Next
                                            </button>
                                            <button id="cancel-step-btn" className="km-button km-button--secondary cancel-step-btn " onClick={this.buyThisPlanClick}>Cancel</button>
                                        </div>
                                       ) : null
                                    }

                                    </div>
                                    {this.state.showPlanSelection ?
                                        (
                                        <div className="radio-btn-container">
                                            <form>
                                                <RadioButton idRadioButton={'billed-yearly-radio'} handleOnChange={this.selectYearly} checked={this.state.yearlyChecked} label={billedYearly} />
                                                <RadioButton idRadioButton={'billed-monthly-radio'} handleOnChange={this.selectMonthly} checked={!this.state.yearlyChecked} label={billedMonthly} />
                                            </form>
                                        </div>
                                        ) : null
                                    }
                                </div>

                                {/* Plan Name should be either of these : Startup, Launch, Growth, Enterprise */}
                                <PlanDetails PlanIcon={this.state.currentPlan.icon} PlanName={this.state.currentPlan.name} PlanMAU={this.state.currentPlan.mau} PlanAmount={this.state.currentPlan.amount} />

                                <div className="manage-accountr">
                                    <a id="portal" className="n-vis" href="javascript:void(0)" data-cb-type="portal">Manage account</a>
                                </div>
                            </div>

                            {/* Change Plan Modal */}
                            <Modal isOpen={this.state.modalIsOpen} onAfterOpen={this.afterOpenModal} onRequestClose={this.onCloseModal}
                                style={customStyles} shouldCloseOnOverlayClick={true} ariaHideApp={false}>
                                <div className="row text-center">
                                    <h1 className="change-plan-text">Change Plan</h1>
                                    <hr />
                                    <button className="close-modal-btn" onClick={this.onCloseModal}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24" viewBox="0 0 24 24" width="24">
                                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                            <path d="M0 0h24v24H0z" fill="none" />
                                        </svg>
                                    </button>
                                    <hr />

                                    {/* <!-- Pricing Toggle --> */}
                                    <div className="pricing-toggle">
                                        <label className={this.state.toggleSlider === true ? "toggler" : "toggler toggler--is-active"} id="filt-monthly" onClick={this.handleToggleSliderChange}>Monthly</label>
                                        <div className="toggle">
                                            <input type="checkbox" id="switcher" className="check" checked={this.state.toggleSlider} onChange={this.handleToggleSliderChange} />
                                            <b className="b switch"></b>
                                        </div>
                                        <label className={this.state.toggleSlider === true ? "toggler toggler--is-active" : "toggler"} id="filt-yearly" onClick={this.handleToggleSliderChange}>Yearly</label>
                                    </div>

                                    <div className="col-lg-4 col-md-4 col-xs-12">
                                        <div className="pricing-table">
                                            <div className="pricing-table-container">
                                                <div className="pricing-table-header">
                                                    <h2 className="pricing-table-plan-title">Startup</h2>
                                                    <div className="price-image-container">
                                                        <img src={StartupPlanIcon} alt="Startup Plan Icon" />
                                                    </div>

                                                </div>
                                                <div className="pricing-table-body">
                                                    <div className="pricing-table-body-header">
                                                        <div className="pricing-value">
                                                            <h2>FREE FOREVER
                                                        <p style={{ visibility: 'hidden', fontSize: '14px', fontWeight: 400, marginTop: '10px' }}>(Billed Annually)</p>
                                                            </h2>
                                                        </div>
                                                        <div className="price-mau">
                                                            <h4>250 Chat users /mo</h4>
                                                        </div>
                                                    </div>
                                                    <a href="#/" className="see-plan-details" style={{ marginBottom: '15px', display: 'block' }} onClick={this.showHideFeatures}>{this.state.showFeatures}</a>
                                                    <div className="pricing-table-body-footer" hidden={this.state.hideFeatureList}>
                                                        <p style={{ opacity: 0 }}>Includes...</p>
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
                                                    {
                                                        <button className="checkout chargebee n-vis km-button km-button--primary" data-subscription="startup" data-cb-type="checkout" data-cb-plan-id="startup">
                                                            {
                                                                (this.state.subscription == 'startup') ? "Current Plan" : "Select Plan"
                                                            }
                                                        </button>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-3 col-xs-12" hidden>
                                        <div className="pricing-table">
                                            <div className="pricing-table-container launch">
                                                <div className="pricing-table-header">
                                                    <h2 className="pricing-table-plan-title">Launch</h2>
                                                    <div className="price-image-container">
                                                        <img src={LaunchPlanIcon} alt="Launch Plan Icon" />
                                                    </div>

                                                </div>
                                                <div className="pricing-table-body">
                                                    <div className="pricing-table-body-header">
                                                        <div className="pricing-value">
                                                            <h2 id="launch-pricing-monthly" hidden={this.state.pricingMonthlyHidden}>$49<span className="per-month-span">/MO</span>
                                                                <p style={{ visibility: 'hidden', fontSize: '14px', fontWeight: 400, marginTop: '10px' }}>(Billed Annually)</p></h2>
                                                            <h2 id="launch-pricing-yearly" hidden={this.state.pricingYearlyHidden}>$39<span className="per-month-span">/MO</span>
                                                                <p style={{ visibility: 'visible', fontSize: '14px', fontWeight: 400, marginTop: '10px' }}>(Billed Annually)</p></h2>
                                                        </div>
                                                        <div className="price-mau">
                                                            <h4>1000 Chat users /mo</h4>
                                                        </div>
                                                    </div>
                                                    <a href="#/" className="see-plan-details" style={{ marginBottom: '15px', display: 'block' }} onClick={this.showHideFeatures}>{this.state.showFeatures}</a>
                                                    <div className="pricing-table-body-footer" hidden={this.state.hideFeatureList}>
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
                                                    <button hidden={this.state.pricingMonthlyHidden} className="checkout chargebee n-vis km-button km-button--primary" data-subscription="launch_monthly" data-cb-type="checkout" data-cb-plan-id="launch_monthly">
                                                        {
                                                            (this.state.subscription.indexOf('launch') != -1) ? "Current Plan" : "Select Plan"
                                                        }
                                                     </button>
                                                    <button hidden={!this.state.pricingMonthlyHidden} className="checkout chargebee n-vis km-button km-button--primary" data-subscription="launch_yearly" data-cb-type="checkout" data-cb-plan-id="launch_yearly">
                                                        {
                                                            (this.state.subscription.indexOf('launch') != -1) ? "Current Plan" : "Select Plan"
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-3 col-xs-12" hidden>
                                        <div className="pricing-table">
                                            <div className="pricing-table-container growth">
                                                <div className="pricing-table-header">
                                                    <h2 className="pricing-table-plan-title">Growth</h2>
                                                    <div className="price-image-container">
                                                        <img src={GrowthPlanIcon} alt="Growth Plan Icon" />
                                                    </div>

                                                </div>
                                                <div className="pricing-table-body">
                                                    <div className="pricing-table-body-header">
                                                        <div className="pricing-value">
                                                            <h2 id="growth-pricing-monthly" hidden={this.state.pricingMonthlyHidden}>$199<span className="per-month-span">/MO</span>
                                                                <p style={{ visibility: 'hidden', fontSize: '14px', fontWeight: 400, marginTop: '10px' }}>(Billed Annually)</p></h2>
                                                            <h2 id="growth-pricing-yearly" hidden={this.state.pricingYearlyHidden}>$149<span className="per-month-span">/MO</span>
                                                                <p style={{ visibility: 'visible', fontSize: '14px', fontWeight: 400, marginTop: '10px' }}>(Billed Annually)</p></h2>
                                                        </div>
                                                        <div className="price-mau">
                                                            <h4>5000 Chat users /mo</h4>
                                                        </div>
                                                    </div>
                                                    <a href="#/" className="see-plan-details" style={{ marginBottom: '15px', display: 'block' }} onClick={this.showHideFeatures}>{this.state.showFeatures}</a>
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
                                                    <button hidden={this.state.pricingMonthlyHidden} className="checkout chargebee n-vis km-button km-button--primary" data-subscription="growth_monthly" data-cb-type="checkout" data-cb-plan-id="growth_monthly">
                                                        {
                                                            (this.state.subscription.indexOf('growth') != -1) ? "Current Plan" : "Select Plan"
                                                        }
                                                    </button>
                                                    <button hidden={!this.state.pricingMonthlyHidden} className="checkout chargebee n-vis km-button km-button--primary" data-subscription="growth_yearly" data-cb-type="checkout" data-cb-plan-id="growth_yearly">
                                                        {
                                                            (this.state.subscription.indexOf('growth') != -1) ? "Current Plan" : "Select Plan"
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-md-4 col-xs-12">
                                        <PlanView showHideFeatures={this.showHideFeatures} PlanIcon={EarlyBirdPlanIcon} PlanName={SUBSCRIPTION_PLANS['early_bird_monthly'].name} PlanMAU={SUBSCRIPTION_PLANS['early_bird_monthly'].mau} 
                                            PlanAmountMonthly={SUBSCRIPTION_PLANS['early_bird_monthly'].amount} PlanAmountYearly={SUBSCRIPTION_PLANS['early_bird_yearly'].amount}
                                            PricingMonthlyHidden={this.state.pricingMonthlyHidden}
                                            Subscription={this.state.subscription} ShowFeatures={this.state.showFeatures} HideFeatureList={this.state.hideFeatureList}/>
                                    </div>
                                    

                                    <div className="col-lg-4 col-md-4 col-xs-12">
                                        <div className="pricing-table">
                                            <div className="pricing-table-container enterprise">
                                                <div className="pricing-table-header">
                                                    <h2 className="pricing-table-plan-title">Enterprise</h2>
                                                    <div className="price-image-container">
                                                        <img src={EnterprisePlanIcon} alt="Enterprise Plan Icon" />
                                                    </div>
                                                </div>
                                                <div className="pricing-table-body">
                                                    <div className="pricing-table-body-header">
                                                        <div className="pricing-value">
                                                            <h2>CUSTOM
                                                        <p style={{ visibility: 'hidden', fontSize: '14px', fontWeight: 400, marginTop: '10px' }}>(Billed Annually)</p>
                                                            </h2>
                                                        </div>
                                                        <div className="price-mau">
                                                            <h4>Unlimited Chat users /mo</h4>
                                                        </div>
                                                    </div>
                                                    <a href="#/" className="see-plan-details" style={{ marginBottom: '15px', display: 'block' }} onClick={this.showHideFeatures}>{this.state.showFeatures}</a>
                                                    <div className="pricing-table-body-footer" hidden={this.state.hideFeatureList}>
                                                        <p>All in Early Bird</p>
                                                        <ul>
                                                            <li>Custom bot development</li>
                                                            <li>Personalized support on Phone &amp; Skype</li>
                                                            <li>Customised solution for your specific needs</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="pricing-table-footer">

                                                        {
                                                            (this.state.subscription.indexOf('enterprise') != -1) ? 
                                                                <button hidden={this.state.pricingMonthlyHidden} className="checkout chargebee n-vis km-button km-button--primary" data-subscription="enterprise_monthly" data-cb-type="checkout" data-cb-plan-id="enterprise_monthly">Current Plan</button>
                                                                : 
                                                                <button className="km-button km-button--primary"><a href="https://calendly.com/kommunicate/15min" target="_blank" class="links">Contact Us</a></button>
                                                        }
                                                    {/*
                                                    <button hidden={this.state.pricingMonthlyHidden} className="checkout chargebee n-vis km-button km-button--primary" data-subscription="enterprise_monthly" data-cb-type="checkout" data-cb-plan-id="enterprise_monthly">
                                                        {
                                                            (this.state.subscription.indexOf('enterprise') != -1) ? "Current Plan" : <a href="https://calendly.com/kommunicate/15min" target="_blank" class="links">Contact Us</a>
                                                        }
                                                    </button>
                                                    <button hidden={!this.state.pricingMonthlyHidden} className="checkout chargebee n-vis km-button km-button--primary" data-subscription="enterprise_yearly" data-cb-type="checkout" data-cb-plan-id="enterprise_yearly">
                                                        {
                                                            (this.state.subscription.indexOf('enterprise') != -1) ? "Current Plan" : <a href="https://calendly.com/kommunicate/15min" target="_blank" class="links">Contact Us</a>
                                                        }
                                                    </button>
                                                    */}
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
    'startup': {
        'icon': StartupPlanIcon,
        'name': 'Startup',
        'mau': '250',
        'amount': '0'
    },
    'launch_monthly': {
        'icon': LaunchPlanIcon,
        'name': 'Launch',
        'mau': '1000',
        'amount': '49'
    },
    'launch_yearly': {
        'icon': LaunchPlanIcon,
        'name': 'Launch',
        'mau': '1000',
        'amount': '39'
    },
    'growth_monthly': {
        'icon': GrowthPlanIcon,
        'name': 'Growth',
        'mau': '5000',
        'amount': '199'
    },
    'growth_yearly': {
        'icon': GrowthPlanIcon,
        'name': 'Growth',
        'mau': '5000',
        'amount': '149'
    },
     'early_bird_monthly': {
        'icon': EarlyBirdPlanIcon,
        'name': 'Early Bird',
        'mau': 'Unlimited',
        'amount': '49'
    },
    'early_bird_yearly': {
        'icon': EarlyBirdPlanIcon,
        'name': 'Early Bird',
        'mau': 'Unlimited',
        'amount': '39'
    },
    'enterprise_monthly': {
        'icon': EnterprisePlanIcon,
        'name': 'Enterprise',
        'mau': 'Custom',
        'amount': 'Custom'
    },
    'enterprise_yearly': {
        'icon': EnterprisePlanIcon,
        'name': 'Enterprise',
        'mau': 'Custom',
        'amount': 'Custom'
    }
};

const customStyles = {
    content: {
        top: '55px',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translateX(-50%)',
        maxWidth: '900px',
    }
};

export default Billing;