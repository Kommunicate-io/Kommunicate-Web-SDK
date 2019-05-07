import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { getConfig } from '../.../../../config/config.js';
import { patchCustomerInfo, getCustomerInfo, getUsersByType, getSubscriptionDetail, getCustomerByApplicationId, updateKommunicateCustomerSubscription, getIntegratedBots } from '../../utils/kommunicateClient'
import Notification from '../model/Notification';
import { getResource } from '../../config/config.js'
import CommonUtils from '../../utils/CommonUtils';
import DateTimeUtils from '../../utils/DateTimeUtils';
import './billing.css';
import StartupPlanIcon from './img/Startup-plan-icon.svg';
import LaunchPlanIcon from './img/Launch-plan-icon.svg';
import GrowthPlanIcon from './img/Growth-plan-icon.svg';
import EnterprisePlanIcon from './img/Enterprise-plan-icon.svg';
import EarlyBirdPlanIcon from './img/Growth-plan-icon.svg';
import Modal from 'react-modal';
import SliderToggle from '../.../../../components/SliderToggle/SliderToggle';
import PlanDetails from '../.../../../components/PlanDetails/PlanDetails';
import PlanView from '../.../../../components/PlanDetails/PlanView';
import AnalyticsTracking from '../../utils/AnalyticsTracking';
 
import RadioButton from '../../components/RadioButton/RadioButton';
import CloseButton from '../../components/Modal/CloseButton';
import { Link } from 'react-router-dom';
import { USER_TYPE, USER_STATUS } from '../../utils/Constant';
import {SettingsHeader} from '../../../src/components/SettingsComponent/SettingsComponents';
import moment  from 'moment';
import {FreePlanBullets} from '../../assets/svg/svgs';
import Banner from '../../components/Banner';

const MissingOutOnFreePlanBox = (props) => (
     <div className="km-missing-out">
     <p>MAJOR FEATURES YOU WILL MISS OUT ON:</p>
     {
         props.missingOut && props.missingOut.map((data, index) => (
             <div className="km-missing-out-info" key={index}>
                 <div className="km-missing-out-img"><FreePlanBullets /></div>
                 <div className="km-missing-out-content">{ props.missingOut &&  props.missingOut[index]}</div>
             </div>
         ))
     }
     </div>
    )


class BillingKommunicate extends Component {

    constructor(props) {
        super(props);

        let subscription = CommonUtils.getUserSession().subscription;
        if (typeof CommonUtils.getUserSession().subscription === 'undefined' || CommonUtils.getUserSession().subscription == '' || CommonUtils.getUserSession().subscription == '0') {
            subscription = 'startup';
        }

        this.state = {
            modalIsOpen: false,
            seatSelectionModalIsOpen: false,
            toggleSlider: false,
            pricingMonthlyHidden: false,
            pricingYearlyHidden: true,
            hideFeatureList: true,
            showFeatures: 'See plan details',
            yearlyChecked: false,
            hideSubscribedSuccess: true,
            subscription: subscription,
            billingCustomerId: CommonUtils.getUserSession().billingCustomerId,
            currentPlan: SUBSCRIPTION_PLANS['startup'],
            trialLeft: 0,
            showPlanSelection: false,
            currentPlanDetailsText: "Trial period plan details",
            seatsBillable: "",
            planHeading: "",
            boughtSubscription: "",
            kmActiveUsers: 0,
            boughtQuantity: 0,
            totalPlanQuantity: 0,
            nextBillingDate: 0,
            totalPlanAmount: 0,
            disableSelectedPlanButton: false,
            clickedPlan:  'startup',
            currentModal: "",
            numberOfIntegratedBots:0,
            disabledUsers: [],
            missingOutOnFreePlan : ["Bot integrations","Lead collection","Conversation history beyond 30 days","Third party integrations","Mobile SDKs","Mailbox","Quick replies","FAQ Centre","Away messages","Automatic conversation assignment","Whitelabel chat widget","Chat widget icon customization"]
        };
        this.showHideFeatures = this.showHideFeatures.bind(this);
        //this.subscriptionPlanStatus = this.subscriptionPlanStatus.bind(this);

        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.selectYearly = this.selectYearly.bind(this);
        this.selectMonthly = this.selectMonthly.bind(this);
        this.onCloseSubscribedSuccess = this.onCloseSubscribedSuccess.bind(this);
        this.buyThisPlanClick = this.buyThisPlanClick.bind(this);
        this.seatSelectionModal = this.seatSelectionModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getPlanDetails = this.getPlanDetails.bind(this);
        this.keyPress = this.keyPress.bind(this);
        this.openChargebeeModal = this.openChargebeeModal.bind(this);
    };

    componentDidMount() {        
        /*Note: hack to create instance of chargebee by creating a hidden element and triggering click on it.
        Chargebee plugin code is modified to read click*/
        document.getElementById("chargebee-init").click();
        document.getElementById("chargebee-portal") && document.getElementById("chargebee-portal").click();

        this.processSubscriptionPlanStatus();
        let customerId = CommonUtils.getUrlParameter(window.location.href, 'cus_id');

        if (customerId) {
            let subscription = CommonUtils.getUrlParameter(window.location.href, 'plan_id');
            let quantity = CommonUtils.getUrlParameter(window.location.href, 'quantity');
            this.updateSubscription(subscription, customerId);
            this.setState({hideSubscribedSuccess: false, boughtSubscription: subscription, boughtQuantity: quantity});
            // console.log(this.state.boughtSubscription);
            this.sendSubscriptionInfo(this.state.subscription);
        } 

        document.getElementById("chargebee-portal") && document.getElementById("chargebee-portal").addEventListener("click", function (event) {
            if (event.target.classList.contains('n-vis')) {
                event.target.classList.remove('n-vis');
                return;
            }
        });

        this.chargebeeInit();
        this.getAgents();
        this.getPlanDetails(); 
    }

    sendSubscriptionInfo = (subscription)=>{
        AnalyticsTracking.acEventTrigger(subscription);
    }

    buyThisPlanClick = () => {
        this.setState({showPlanSelection: !this.state.showPlanSelection, currentPlanDetailsText: "Select your billing cycle and enter the number of agents in the next window"}, () => this.chargebeeInit());
    }

    cancelThisPlan = () => {
        this.setState({
            currentPlanDetailsText: "Trial period plan details"
        })
    } 

    afterOpenModal = () => {
        this.chargebeeInit();
        var elements = document.querySelectorAll('.km-subscription-buttons-container button');
        for(var i = 0; i < elements.length; i++) {
            elements[i].cbProduct.planQuantity = this.state.seatsBillable;
        }
    }

    chargebeeInit() {
        let that = this;

        var checkouts = document.getElementsByClassName("checkout");
        for (var i = 0; i < checkouts.length; i++) {
            checkouts[i].addEventListener('click', function (event) {
                that.checkoutSubscription(event, that);
            }, false);
        }

        let subscribeElems = document.getElementsByClassName("chargebee");
        let currentPlanElems = document.querySelectorAll(".pricing-table-body button");
        for (var i = 0; i < subscribeElems.length; i++) {

            if (subscribeElems[i].classList.contains('n-vis')) {
                subscribeElems[i].click();
            }
            if (subscribeElems[i].getAttribute('data-subscription') == that.state.subscription) {
                    subscribeElems[i].value = "Current Plan";
            }
            // if(that.state.subscription.indexOf('per_agent') > -1 && subscribeElems[i].getAttribute('data-subscription') == "startup") {
            //     subscribeElems[i].disabled = true;
            // }
        }
        for(var j = 0; j < currentPlanElems.length; j++) {
            if(that.state.subscription !== "startup") {
                if(that.state.subscription.includes("enterprise") && currentPlanElems[j].getAttribute('data-choose-plan').includes('enterprise')) {
                    currentPlanElems[j].textContent = "Current Plan";
                    currentPlanElems[j].disabled = true;         
                    currentPlanElems[j].setAttribute("data-plan","enterprise");
                } else if(that.state.subscription.includes("per_agent") && currentPlanElems[j].getAttribute('data-choose-plan').includes('per_agent')) {  
                    currentPlanElems[j].textContent = "Current Plan";
                    currentPlanElems[j].disabled = true;  
                    currentPlanElems[j].setAttribute("data-plan","growth");    
                }
            }
        } 

    }

    showHideFeatures(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            hideFeatureList: !this.state.hideFeatureList,
            showFeatures: this.state.showFeatures === 'See plan details' ? 'Hide plan details' : 'See plan details'
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
        var cartObject = cbInstance.getCart();
        var customer = {planQuantity: this.state.seatsBillable}
        cartObject.setCustomer(customer);

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

        that.setState({subscription: subscription});
        this.setState({ currentPlan: SUBSCRIPTION_PLANS[subscription] });

        let userSession = CommonUtils.getUserSession();
        const customerInfo = {
            applicationId: userSession.application.applicationId,
            subscription: subscription,
            product: "kommunicate"
        };
        if (typeof billingCustomerId !== "undefined") {
            customerInfo.billingCustomerId = billingCustomerId;
            userSession.billingCustomerId = billingCustomerId;
        }
        // that.updateCustomerSubscription(customerInfo)
        //     .then(response => {
        //         if (response.data.code === 'SUCCESS') {
        //             userSession.subscription = subscription;
        //             CommonUtils.setUserSession(userSession);
        //             that.state.subscription = subscription;

        //             if (typeof billingCustomerId !== "undefined") {
        //                 that.setState({billingCustomerId: billingCustomerId});
        //             }
        //             Notification.info(response.data.message);
        //         }
        //     }).catch(err => {
        //         console.log(err);
        //         alert(err);
        //     });
        updateKommunicateCustomerSubscription (customerInfo)
        .then(response => {
            if (response.data.code === 'SUCCESS') {
                Notification.info("Subscribed successfully");
                that.getPlanDetails()
                userSession.subscription = subscription;
                CommonUtils.setUserSession(userSession);
                that.state.subscription = subscription;

                if (typeof billingCustomerId !== "undefined") {
                    that.setState({billingCustomerId: billingCustomerId});
                }
                
            }
        } ).catch(err => {
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
            var trialStarted = new Date(CommonUtils.getUserSession().applicationCreatedAt);
            var timeDiff = now.getTime() - trialStarted.getTime();
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            var planLimit = CommonUtils.maxDaysAsPerPlan() + 1;
            if (diffDays < planLimit) {
                this.setState({ trialLeft: (planLimit - diffDays) });
                this.setState({ currentPlan: SUBSCRIPTION_PLANS['per_agent_monthly'] });
            } else {
                this.setState({ currentPlan: SUBSCRIPTION_PLANS['startup'] });
            }
        }
    }

    updateCustomerSubscription(customerInfo) {
        let userSession = CommonUtils.getUserSession();

        const patchCustomerUrl = getConfig().kommunicateApi.signup + '/' + userSession.adminUserName;

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


    seatSelectionModal(e) {
        var selectedPlanButton = e.getAttribute("data-choose-plan");
        AnalyticsTracking.acEventTrigger("ac-choose-plan");
        if(selectedPlanButton.includes("enterprise")) {
            this.setState({
                planHeading: "Enterprise",
                modalIsOpen: false
            }, () => this.chargebeeInit());
        } else {
            this.setState({
                planHeading: "Growth",
                modalIsOpen: false
            }, () => this.chargebeeInit());
        }        
    }


    handleChange(e) {
        this.setState({
            seatsBillable: parseInt(e.target.value)
        });
        var elements = document.querySelectorAll('.km-subscription-buttons-container button');
        for(var i = 0; i < elements.length; i++) {
            elements[i].cbProduct.planQuantity = e.target.value;
        }
    }

    keyPress(e) {
        var a = [];
        var k = e.which;
    
        for (var i = 48; i < 58; i++)
            a.push(i);
    
        if (!(a.indexOf(k,a)>=0))
            e.preventDefault();
    }

    getAgents() {
        var that = this;
        let users = [USER_TYPE.AGENT, USER_TYPE.ADMIN];
        let disabledUsers = this.state.disabledUsers || []; // this state is not defined, why are we using disabledUsers ?
        let kmActiveUsers =[];
        return Promise.resolve(getUsersByType(CommonUtils.getUserSession().application.applicationId, users)).then(data => {
          let usersList = data;
          data.map((user => {
            user.status == USER_STATUS.EXPIRED && disabledUsers.push(user);
            (user.status == USER_STATUS.AWAY || user.status == USER_STATUS.ONLINE) && kmActiveUsers.push(user);
          }))
          this.setState({
            kmActiveUsers: kmActiveUsers.length,
            disabledUsers: disabledUsers.length
          }, () => this.getIntegratedBotsNumber());
        }).catch(err => {
           console.log("err while fetching users list", err);
        });
      }

    getPlanDetails() {
        let currentUserName = CommonUtils.getUserSession().adminUserName;
        return Promise.resolve(getSubscriptionDetail(currentUserName)).then(data => {
            let response = data;
            this.setState({
                totalPlanQuantity: response.plan_quantity,
                nextBillingDate: response.next_billing_at,
                totalPlanAmount: response.plan_amount
            })
            if(CommonUtils.isStartupPlan()) {
                this.setState({
                    totalPlanQuantity: 2
                })
            }
        }).catch(err => {  
            if(this.state.subscription === "launch_yearly" || this.state.subscription === "launch_monthly") {
                this.setState({
                    totalPlanQuantity: 5
                })
            } else if(CommonUtils.isStartupPlan()) {
                this.setState({
                    totalPlanQuantity: 2
                })
            }       
            console.log("Error while fetching subscription list of user");
        })

    }

    openChargebeeModal() {
        if(this.state.planHeading.includes("Enterprise")) {
            (!this.state.toggleSlider) ? document.getElementById("checkout-enterprise-monthly").click() : document.getElementById("checkout-enterprise-yearly").click();
        } else {
            (!this.state.toggleSlider) ? document.getElementById("checkout-monthly").click() : document.getElementById("checkout-yearly").click();
        }
        this.openCurrentModal("");
    }

    openCurrentModal = (modal, e) => {
        var event = e && e.target;
        this.setState({
            openCurrentModal: true,
            currentModal: modal
        });
		if(modal === "seatSelection") {
		     this.seatSelectionModal(event);
		} else if(modal === "infoModal") {
            this.setState({
                clickedPlan: event.getAttribute("data-cb-plan-id"),
            });
        }
    }

    getIntegratedBotsNumber = () => {
        getIntegratedBots().then(response => {
          this.setState({
            numberOfIntegratedBots: (response && response.allBots) ? Math.max(response.allBots.length -1, 0): 0
          }, () => this.setBillableSeats());
        });
      }

    setBillableSeats = () =>{
        var totalSeatsBillable = this.state.numberOfIntegratedBots + this.state.kmActiveUsers;
        this.setState({
            seatsBillable:totalSeatsBillable
        })
    }

    changeTotalCount = (count) => {
        if((this.state.seatsBillable + count) == 0) {
            return
        } else {
            this.setState({ seatsBillable: this.state.seatsBillable + count });
        }
    }

    render() {
        //Todo: set this dynamically based on current plan
        let currentPlanElems = document.querySelectorAll(".pricing-table-body button");
        
        const growthPlanAmount = (
            <p>${(!this.state.toggleSlider) ? this.state.seatsBillable * 10 : (this.state.seatsBillable * 96)} <span hidden={!this.state.toggleSlider ? false : true}>Save ${((this.state.seatsBillable * 10) - (this.state.seatsBillable * 8)) * 12} in yearly plan!</span></p>
        )
        const enterprisePlanAmount = (
            <p>${(!this.state.toggleSlider) ? this.state.seatsBillable * 30 : (this.state.seatsBillable * 300)} <span hidden={!this.state.toggleSlider ? false : true}>Save ${((this.state.seatsBillable * 30) - (this.state.seatsBillable * 25)) * 12} in yearly plan!</span></p>
        )

        for(var i = 0; i < currentPlanElems.length; i++) {
            if(currentPlanElems[i].getAttribute('data-cb-plan-id') == this.state.subscription) {
                if(this.state.trialLeft > 0 && this.state.trialLeft <= 31) {
                    currentPlanElems[i].textContent = "Choose Plan";
                    currentPlanElems[i].disabled = false;
                } else {
                    currentPlanElems[i].textContent = "Current Plan";
                    // currentPlanElems[i].disabled = true;
                }
                
            }
        }

        const SeatSelectionModalContent = (
            <Fragment>
                <div className="seat-selection-modal--header">
                    <h2>{this.state.planHeading} plan</h2>
                    <hr/>
                </div>
                        
                <div className="seat-selection-modal--body">

                    <div className="seat-selector--counts-container">
                        <div>Number of humans in your account:</div>
                        <div>{this.state.kmActiveUsers}</div>
                    </div>
                    <div className="seat-selector--counts-container">
                        <div>Number of bots in your account:</div>
                        <div>{this.state.numberOfIntegratedBots}</div>
                    </div>
                    <hr/>
                    <div className="seat-selector-container">

                        <div className="seat-selector--text">
                            <p>Number of licenses:</p>
                        </div>
                        <div className={ (this.state.numberOfIntegratedBots > 0 && this.state.seatsBillable == 1 ) ? "seat-selector--input warning" : "seat-selector--input" }>
                            <div className="seat-selector--input_decrement" onClick={() => this.changeTotalCount(-1)}>-</div>
                            <input maxLength="4" min="1" max="10000" type="number"  value={this.state.seatsBillable} onChange={this.handleChange} onKeyPress={this.keyPress}/>
                            <div className="seat-selector--input_increment" onClick={() => this.changeTotalCount(+1)}>+</div>
                        </div>
                    </div>
                    { (this.state.numberOfIntegratedBots > 0 && this.state.seatsBillable == 1 ) ? <Banner appearance="warning" heading="It is required to buy a minimum of 2 licenses (1 bot and 1 human license for managing the account and fallback)"></Banner> : (this.state.seatsBillable < (this.state.kmActiveUsers + this.state.numberOfIntegratedBots)) ? <Banner appearance="info" heading="You can buy less number of licenses now, but the extra bots/humans will be disabled until you buy them"></Banner> : null
                    }
                    <hr/>


                    {/* <!-- Pricing Toggle --> */}
                    <div className="pricing-toggle text-left">
                        <label className={this.state.toggleSlider ? "toggler" : "toggler toggler--is-active km-custom-bg"} id="filt-monthly" onClick={this.handleToggleSliderChange}>Monthly billing</label>
                        <div className="toggle n-vis">
                            <input type="checkbox" id="switcher" className="check" checked={this.state.toggleSlider} onChange={this.handleToggleSliderChange} />
                            <b className="b switch"></b>
                        </div>
                        <label className={this.state.toggleSlider ? "toggler toggler--is-active km-custom-bg" : "toggler"} id="filt-yearly" onClick={this.handleToggleSliderChange}>Yearly billing</label>
                    </div>


                    <div className="seat-selector--amount-container">
                        <div className="amount-payable-container flexi">
                            <p>Amount payable now:</p>
                            { (this.state.planHeading.includes("Enterprise")) ? (enterprisePlanAmount) : (growthPlanAmount)
                            }
                        </div>
                        <div className="renewal-date-container flexi">
                            <p>Auto renewal date:</p>
                            <p>{(!this.state.toggleSlider) ? DateTimeUtils.countDaysForward(1, "month") : DateTimeUtils.countDaysForward(1, "year")}</p>
                        </div>
                    </div>
                </div>
                <div className="seat-selection-modal--footer text-right">
                    <button className="km-button km-button--secondary" onClick={() => this.openCurrentModal("")}>Cancel</button>
                    
                    <button className="km-button km-button--primary" onClick={this.openChargebeeModal}>Continue</button>                                   
                    
                </div>
            </Fragment>
        );

        const InfoModalContent = (
            <Fragment>
                <div className="info-detail-container">
                    <p>You are currently in <strong><span>{SUBSCRIPTION_PLANS[this.state.subscription].name}</span> Plan.</strong> Your next billing date is on <strong>{DateTimeUtils.countDaysForward(this.state.nextBillingDate, "timestamp")}</strong></p>
                    <br/>
                    <p>If you want to downgrade your plan, just leave us a mail at <strong> support@kommunicate.io</strong> <br/> or start a conversation from the chat widget, and we will get back to you.</p>
                </div>
            </Fragment>
        );

        const BuyFreePlanModalContent = (
            <Fragment>
                <div className="buy-free-plan-modal--header">
                    <h2>Free plan subscription - <span>No credit card required</span></h2>
                    <hr/>
                </div>
                        
                <div className="buy-free-plan-modal--body">
                    <p>You are about to subscribe to the <span>FREE FOREVER plan.</span>
                    <br/>
                    You will have access to basic features and are allowed a maximum of 2 team members.</p>
                    <p><span>Note: </span>You'll now be taken through our payment checkout flow, but we won’t be<br /> charging you </p>
                </div>
                <div className="buy-free-plan-modal--footer text-right">
                    <button className="km-button km-button--secondary" onClick={() => this.openCurrentModal("")}>Cancel</button>
                    
                    <button className="checkout chargebee n-vis km-button km-button--primary" data-subscription="startup" data-cb-type="checkout" data-cb-plan-id="startup" data-choose-plan="startup">Subscribe to free plan</button>                                  
                </div>
            </Fragment>
        );
        const MissingOutModal = (
            <Fragment>
                <div className="seat-selection-modal--header">
                    <h2>FREE plan details</h2>
                    <hr/>
                </div>
                <div className="km-free-plan-modal-text">
                FREE plan comes with the basic live chat features and has a maximum limit of 2 human agents</div>
                <MissingOutOnFreePlanBox missingOut={this.state.missingOutOnFreePlan} />    
                <div className="buy-free-plan-modal--footer text-right">
                    <button className="km-button km-button--primary" onClick={() => this.openCurrentModal("")}>Close</button>                                  
                </div>     
                
            </Fragment>
        );

        let applicationCreatedAtTime = CommonUtils.getUserSession().applicationCreatedAt || CommonUtils.getUserSession().created_at;
        applicationCreatedAtTime = applicationCreatedAtTime.replace('Z','');
        var trialExpiryDate = moment(applicationCreatedAtTime).add(CommonUtils.maxDaysAsPerPlan(), 'days').format("DD MMMM YYYY");

        return (
            <div className="animated fadeIn billings-section">
                <div className="row">
                    <div className="col-md-10">
                        <div className="card">
                            <div className="card-block">

                            <SettingsHeader  />

                                <button id="chargebee-init" hidden></button>
                                {CommonUtils.isStartupPlan() ?
                                    (CommonUtils.isTrialPlan() ?
                                        (<div className="subscription-current-plan-container">
                                            <p className="km-startup-plan-billing-info">
                                            <span>You are in the full-feature trial</span> 
                                            <span>At the end of the trial period ({DateTimeUtils.countDaysForward(this.state.trialLeft, "days")}), you will be downgraded to the Free plan.<a href="javascript:void(0)"  className="km-free-plan-link" onClick={(event) => {this.openCurrentModal("missingOut", event)}}> See free plan details</a>  </span> </p>
                                        </div>
                                        )
                                        : (
                                            <div className="subscription-current-plan-container">
                                            <p className="km-startup-plan-billing-info">
                                            <span>You are on the <strong>FREE PLAN</strong></span> 
                                            <span>Your trial ended on {trialExpiryDate}. <a href="javascript:void(0)" className="km-free-plan-link"  onClick={(event) => {this.openCurrentModal("missingOut", event)}}> See free plan details</a> </span> </p>
                                        </div>
                                        )
                                    )
                                    :
                                    null}
                                
				                      
				                    
                                {/* Subscribe successfully box */}

                                <div className={CommonUtils.isStartupPlan() ? (CommonUtils.isTrialPlan() ? ("n-vis") : ("n-vis")): "subscription-complete-container"}>
                                {CommonUtils.isStartupPlan() ? "" :
                                    <div className="subscription-current-plan-container">
                                        <div className="subscription-success-plan-billing">
                                            <div className="subscription-success-purchased-plan-name">
                                                <p>Your plan:</p>
                                                <p><span>{SUBSCRIPTION_PLANS[this.state.subscription].name} - <span style={{textTransform: "lowercase", background:"transparent", paddingLeft: "0px"}}>{this.state.totalPlanQuantity < 2 ? this.state.totalPlanQuantity + " seat" : this.state.totalPlanQuantity + " seats"}</span></span> <span style={{textTransform: "uppercase"}}>{SUBSCRIPTION_PLANS[this.state.subscription].term} BILLING</span></p>
                                            </div>
                                            {this.state.subscription === "launch_yearly" || this.state.subscription === "launch_monthly" ? "" :
                                                <div>
                                                    <div className="subscription-success-purchased-plan-billing">
                                                        <p>Next billing:</p>
                                                        <p>You will be charged <strong>${this.state.totalPlanAmount / 100}</strong> on <strong>{DateTimeUtils.countDaysForward(this.state.nextBillingDate, "timestamp")}</strong></p>
                                                    </div>

                                                    <div className="subscription-success-purchased-plan-billing-actions">
                                                        <p><a id="chargebee-portal" className="vis" href="javascript:void(0)" data-cb-type="portal">Change Billing Info</a></p>
                                                        <p><a onClick={(event) => {this.openCurrentModal("infoModal", event)}} className="vis" href="javascript:void(0)">Downgrade plan</a></p>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        
                                    </div>
                                    }
                                    {  this.state.seatsBillable > this.state.totalPlanQuantity ? <div className={CommonUtils.isStartupPlan() ? "n-vis" : "subscription-current-plan-warning-container"}>
                                        <div className="subscription-warning-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="68" height="68" viewBox="0 0 512 512">
                                                <path d="M507.494 426.066L282.864 53.537c-5.677-9.415-15.87-15.172-26.865-15.172s-21.188 5.756-26.865 15.172L4.506 426.066c-5.842 9.689-6.015 21.774-.451 31.625 5.564 9.852 16.001 15.944 27.315 15.944h449.259c11.314 0 21.751-6.093 27.315-15.944 5.564-9.852 5.392-21.936-.45-31.625zM256.167 167.227c12.901 0 23.817 7.278 23.817 20.178 0 39.363-4.631 95.929-4.631 135.292 0 10.255-11.247 14.554-19.186 14.554-10.584 0-19.516-4.3-19.516-14.554 0-39.363-4.63-95.929-4.63-135.292 0-12.9 10.584-20.178 24.146-20.178zm.331 243.791c-14.554 0-25.471-11.908-25.471-25.47 0-13.893 10.916-25.47 25.471-25.47 13.562 0 25.14 11.577 25.14 25.47 0 13.562-11.578 25.47-25.14 25.47z" fill="#f8ba36"/>
                                            </svg>
                                        </div>
                                        <div className="subscription-warning-detail">
                                            <p>You have added {this.state.seatsBillable + this.state.disabledUsers} team members (humans + bots) but have bought the plan for only {this.state.totalPlanQuantity} team members</p>
                                            <p>To make sure all the right team members can log in to their Kommunicate account, delete the extra ones from <Link to="/settings/team">Teammates</Link> section.</p>
                                        </div>
                                    </div> : this.state.kmActiveUsers <= this.state.totalPlanQuantity ? <p className={CommonUtils.isStartupPlan() ? (this.state.trialLeft > 0 && this.state.trialLeft <= 31 ? ("n-vis") : ("n-vis")) :"subscription-add-delete-agent-text"}>Want to add or delete agents in your current plan? Go to <Link to="/settings/team">Teammates section</Link></p> : ""
                                    }
                                    
                                </div>

                                <h2 className="plan-agent-details upgrade-text n-vis">
                                Upgrade to scale your customer support
                                </h2>

                            </div>

                                <div className="row text-center pricing-container-wrapper" style={{padding:"13px 13px 13px 0px",margin:"0px"}}>
                                <span className="km-pricing-toggle-heading">Upgrade to one of our paid plans for premium features</span>

                                    {/* <!-- Pricing Toggle --> */}
                                    <div className="pricing-toggle text-center">
                                        <label className={this.state.toggleSlider ? "toggler" : "toggler toggler--is-active km-custom-bg"} id="filt-monthly" onClick={this.handleToggleSliderChange}>Monthly</label>
                                        <div className="toggle n-vis">
                                            <input type="checkbox" id="switcher" className="check" checked={this.state.toggleSlider} onChange={this.handleToggleSliderChange} />
                                            <b className="b switch"></b>
                                        </div>
                                        <label className={this.state.toggleSlider ? "toggler toggler--is-active km-custom-bg" : "toggler"} id="filt-yearly" onClick={this.handleToggleSliderChange}>Yearly <span>(Save 20%)</span></label>
                                    </div>

                                    <div className="col-lg-5 col-md-5 col-xs-12">
                                        <div className="pricing-table">
                                            <div className="pricing-table-container launch">
                                                <div className="pricing-table-header">
                                                    <div className="plan-breif-container">
                                                        <span>Advanced support features</span>
                                                    </div>
                                                    <h2 className="pricing-table-plan-title">Growth</h2>
                                                    <h4 className="pricing-table-plan-subtitle">most popular</h4>
                                                    <div className="price-image-container">
                                                        <div className="pricing-value">
                                                            <div id="growth-pricing-monthly" className="a hidee" hidden={this.state.pricingMonthlyHidden}>
                                                                <h2><sup>$</sup>10</h2>
                                                                <p style={{visibility:"visible",marginTop:"30px"}} className="per-month-span">per human or bot/mo</p>
                                                                <p style={{visibility:"hidden",marginTop:"5px",marginBottom:"8px",color: "#9b979b"}}>(Billed Annually)</p>
                                                            </div>
                                                            <div id="growth-pricing-yearly" className="a " hidden={this.state.pricingYearlyHidden}>
                                                                <h2><sup>$</sup>8</h2>
                                                                <p style={{visibility:"visible",marginTop:"30px"}} className="per-month-span">per human or bot/mo</p>
                                                                <p style={{visibility:"visible",marginTop:"5px",marginBottom:"8px",color: "#9b979b"}}>(Billed Annually)</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="plan-agent-details vis">Unlimited humans & bots</p>
                                                </div>
                                                <div className="pricing-table-body">
                                                {
                                                    (this.state.subscription.includes("enterprise")) ? <div>
                                                        <button  hidden={this.state.pricingMonthlyHidden} className="km-button km-button--primary" data-cb-plan-id="per_agent_monthly" data-choose-plan="per_agent_monthly" onClick={(event) => {this.openCurrentModal("infoModal", event)}}>
                                                            Choose Plan
                                                        </button>
                                                        <button  hidden={!this.state.pricingMonthlyHidden} className="km-button km-button--primary" data-cb-plan-id="per_agent_yearly" data-choose-plan="per_agent_yearly" onClick={(event) => {this.openCurrentModal("infoModal", event)}}>
                                                            Choose Plan
                                                        </button>
                                                    </div> : <div>
                                                        <button className="km-button km-button--primary" onClick={(event) => {this.openCurrentModal("seatSelection", event)}} data-choose-plan="per_agent_monthly">Choose Plan</button>
                                                    </div>
                                                    
                                                }
                                                </div>
                                                <div className="pricing-table-footer">
                                                    <a href="#/" className="see-plan-details" style={{ marginBottom: '15px', display: 'block' }} onClick={this.showHideFeatures}>{this.state.showFeatures}</a>
                                                    <div className="pricing-table-body-footer" hidden={this.state.hideFeatureList}>
                                                        <ul>
                                                            <li>Bot integrations</li>
                                                            <li>Mobile SDKs</li>
                                                            <li>Quick Replies</li>
                                                            <li>Away Messages</li>
                                                            <li>Lead Collection</li>
                                                            <li>Agent reporting</li>
                                                            <li>Support email integration</li>
                                                            <li>Customizations</li>
                                                            <li>Conversation routing</li>
                                                            <li>FAQ</li>
                                                            <li>All integrations</li>
                                                            <li>Standard SLA</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className="col-lg-4 col-md-4 col-xs-12" hidden>
                                        <PlanView showHideFeatures={this.showHideFeatures} PlanIcon={EarlyBirdPlanIcon} PlanName={SUBSCRIPTION_PLANS['early_bird_monthly'].name} PlanMAU={SUBSCRIPTION_PLANS['early_bird_monthly'].mau} 
                                            PlanAmountMonthly={SUBSCRIPTION_PLANS['early_bird_monthly'].amount} PlanAmountYearly={SUBSCRIPTION_PLANS['early_bird_yearly'].amount}
                                            PricingMonthlyHidden={this.state.pricingMonthlyHidden}
                                            Subscription={this.state.subscription} ShowFeatures={this.state.showFeatures} HideFeatureList={this.state.hideFeatureList}/>
                                    </div> */}
                                    
                                    <div className="col-lg-5 col-md-5 col-xs-12">
                                        <div className="pricing-table">
                                            <div className="pricing-table-container launch">
                                                <div className="pricing-table-header">
                                                    <div className="plan-breif-container">
                                                        <span>Full-fledged support solution</span>
                                                    </div>
                                                    <h2 className="pricing-table-plan-title">Enterprise</h2>
                                                    <h4 className="pricing-table-plan-subtitle">save big</h4>
                                                    <div className="price-image-container">
                                                    <div className="pricing-value">
                                                            <div id="growth-pricing-monthly" className="a hidee" hidden={this.state.pricingMonthlyHidden}>
                                                                <h2><sup>$</sup>30</h2>
                                                                <p style={{visibility:"visible",marginTop:"30px"}} className="per-month-span">per human or bot/mo</p>
                                                                <p style={{visibility:"hidden",marginTop:"5px",marginBottom:"8px",color: "#9b979b"}}>(Billed Annually)</p>
                                                            </div>
                                                            <div id="growth-pricing-yearly" className="a " hidden={this.state.pricingYearlyHidden}>
                                                                <h2><sup>$</sup>25</h2>
                                                                <p style={{visibility:"visible",marginTop:"30px"}} className="per-month-span">per human or bot/mo</p>
                                                                <p style={{visibility:"visible",marginTop:"5px",marginBottom:"8px",color: "#9b979b"}}>(Billed Annually)</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="plan-agent-details vis">Unlimited humans & bots</p>
                                                </div>
                                                <div className="pricing-table-body">
                                                    <button className="km-button km-button--secondary" onClick={(event) => {this.openCurrentModal("seatSelection", event)}} data-choose-plan="enterprise">Choose Plan</button>
                                                </div>
                                                <div className="pricing-table-footer">
                                                    <a href="#/" className="see-plan-details" style={{ marginBottom: '15px', display: 'block' }} onClick={this.showHideFeatures}>{this.state.showFeatures}</a>
                                                    <div className="pricing-table-body-footer" hidden={this.state.hideFeatureList}>
                                                    <p>Everything in <strong>GROWTH Plan</strong>, plus...</p>
                                                        <ul>
                                                            <li>Analytics APIs</li>
                                                            <li>Downloadable reports</li>
                                                            <li>Advanced reporting</li>
                                                            <li>Conversation auto-closing</li>
                                                            <li>Whitelabel</li>
                                                            <li>Dedicated server</li>
                                                            <li>Premium support</li>
                                                            <li>Custom SLA</li>
                                                            <li>Routing rules</li>
                                                            <li>Custom domain mapping</li>
                                                            <li>Unlimited scaling</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>
                                    
                                    
                        {/* Below div "km-subscription-buttons-container n-vis" is a hack to update the number of seats in the chargebee checkout modal. */}
                        <div className="km-subscription-buttons-container n-vis">
                            <button className="checkout chargebee n-vis km-button km-button--primary km-display-none" data-subscription="per_agent_monthly" data-cb-type="checkout" data-cb-plan-id="per_agent_monthly" id="checkout-monthly">Continue</button>
                            <button className="checkout chargebee n-vis km-button km-button--primary km-display-none" data-subscription="per_agent_yearly" data-cb-type="checkout" data-cb-plan-id="per_agent_yearly" id="checkout-yearly">Continue</button>

                            <button className="checkout chargebee n-vis km-button km-button--primary km-display-none" data-subscription="enterprise-per-agent-monthly" data-cb-type="checkout" data-cb-plan-id="enterprise-per-agent-monthly" id="checkout-enterprise-monthly">Continue</button>
                            <button className="checkout chargebee n-vis km-button km-button--primary km-display-none" data-subscription="enterprise" data-cb-type="checkout" data-cb-plan-id="enterprise" id="checkout-enterprise-yearly">Continue</button>
                        </div>
                    </div>
                </div>

                <Modal isOpen={this.state.currentModal !== ""} onAfterOpen={this.afterOpenModal} onRequestClose={() => this.openCurrentModal("")} style={stylesForSeatSelectionModal} shouldCloseOnOverlayClick={true} ariaHideApp={false} >
                    
                    {
                        this.state.currentModal === "seatSelection" ? SeatSelectionModalContent : this.state.currentModal === "infoModal" ? InfoModalContent :  this.state.currentModal === "buyFreePlan" ? BuyFreePlanModalContent : 
                        this.state.currentModal === "missingOut" ? MissingOutModal : ""
                    }

                    <CloseButton onClick={() => this.openCurrentModal("")}/>
                </Modal>

            </div>
        );
    }
}

const SUBSCRIPTION_PLANS = {
    'applozic': {
        'index': '0',
        'icon': StartupPlanIcon,
        'name': 'Free',
        'mau': 'Unlimited',
        'amount': '0'
    },
    'startup': {
        'index': '1',
        'icon': StartupPlanIcon,
        'name': 'Free',
        'mau': 'Unlimited',
        'amount': '0'
    },
    'launch_monthly': {
        'index': '2',
        'icon': LaunchPlanIcon,
        'name': 'Launch',
        'mau': 'Unlimited',
        'amount': '49',
        'term': 'monthly'
    },
    'launch_yearly': {
        'index': '3',
        'icon': LaunchPlanIcon,
        'name': 'Launch',
        'mau': 'Unlimited',
        'amount': '39',
        'term': 'Yearly'
    },
    'growth_monthly': {
        'index': '4',
        'icon': GrowthPlanIcon,
        'name': 'Growth',
        'mau': 'Unlimited',
        'amount': '199',
        'term': 'Monthly'
    },
    'growth_yearly': {
        'index': '5',
        'icon': GrowthPlanIcon,
        'name': 'Growth',
        'mau': 'Unlimited',
        'amount': '149',
        'term': 'Yearly'
    },
     'early_bird_monthly': {
        'index': '6',
        'icon': EarlyBirdPlanIcon,
        'name': 'Early Bird',
        'mau': 'Unlimited',
        'amount': '49',
        'term': 'Monthly'
    },
    'early_bird_yearly': {
        'index': '7',
        'icon': EarlyBirdPlanIcon,
        'name': 'Early Bird',
        'mau': 'Unlimited',
        'amount': '39',
        'term': 'Yearly'
    },
    'per_agent_monthly': {
        'index': '8',
        'icon': GrowthPlanIcon,
        'name': 'Growth',
        'mau': 'Unlimited',
        'amount': '10',
        'term': 'Monthly'
    },
    'per_agent_yearly': {
        'index': '9',
        'icon': GrowthPlanIcon,
        'name': 'Growth',
        'mau': 'Unlimited',
        'amount': '8',
        'term': 'Yearly'
    },
    'enterprise-per-agent-monthly': {
        'index': '10',
        'icon': EnterprisePlanIcon,
        'name': 'Enterprise',
        'mau': 'Unlimited',
        'amount': '30',
        'term': 'Monthly'
    },
    'enterprise': {
        'index': '11',
        'icon': EnterprisePlanIcon,
        'name': 'Enterprise',
        'mau': 'Unlimited',
        'amount': '25',
        'term': 'Yearly'
    }
};

const stylesForSeatSelectionModal = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '900px',
        width: '500px',
        overflow: 'unset',
    }
};

export default BillingKommunicate;