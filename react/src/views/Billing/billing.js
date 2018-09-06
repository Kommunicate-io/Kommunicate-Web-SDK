import React, { Component } from 'react';
import axios from 'axios';
import { getConfig } from '../.../../../config/config.js';
import { patchCustomerInfo, getCustomerInfo, getUsersByType, getSubscriptionDetail, getCustomerByApplicationId } from '../../utils/kommunicateClient'
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
import CloseButton from '../../components/Modal/CloseButton';
import { Link } from 'react-router-dom';
import { USER_TYPE, USER_STATUS } from '../../utils/Constant';

class Billing extends Component {

    constructor(props) {
        super(props);

        let subscription = CommonUtils.getUserSession().subscription;
        if (typeof CommonUtils.getUserSession().subscription === 'undefined' || CommonUtils.getUserSession().subscription == '' || CommonUtils.getUserSession().subscription == '0') {
            subscription = 'startup';
        }

        this.state = {
            modalIsOpen: false,
            seatSelectionModalIsOpen: false,
            toggleSlider: true,
            pricingMonthlyHidden: true,
            pricingYearlyHidden: false,
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
            choosePlan: "per_agent_yearly",
            boughtSubscription: "",
            kmActiveUsers: 0,
            boughtQuantity: 0,
            totalPlanQuantity: 0,
            nextBillingDate: 0
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
        this.seatSelectionModal = this.seatSelectionModal.bind(this);
        this.closeSeatSelectionModal = this.closeSeatSelectionModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getPlanDetails = this.getPlanDetails.bind(this);
        this.keyPress = this.keyPress.bind(this);

        window.addEventListener("openBillingModal",this.onOpenModal,true);
    };

    componentDidMount() {
        const search = this.props.location.search;
        const earlyBirdOffer = CommonUtils.getUrlParameter(search, 'offer');

        if(earlyBirdOffer === 'early-bird') {
            this.onOpenModal();
        }
        
        /*Note: hack to create instance of chargebee by creating a hidden element and triggering click on it.
        Chargebee plugin code is modified to read click*/
        document.getElementById("chargebee-init").click();

        let userSession = CommonUtils.getUserSession();

        this.processSubscriptionPlanStatus();
        let customerId = CommonUtils.getUrlParameter(window.location.href, 'cus_id');

        if (customerId) {
            let subscription = CommonUtils.getUrlParameter(window.location.href, 'plan_id');
            let quantity = CommonUtils.getUrlParameter(window.location.href, 'quantity');
            this.updateSubscription(subscription, customerId);
            this.setState({hideSubscribedSuccess: false, boughtSubscription: subscription, boughtQuantity: quantity});
            // console.log(this.state.boughtSubscription);
        }

        document.getElementById("portal").addEventListener("click", function (event) {
            if (event.target.classList.contains('n-vis')) {
                event.target.classList.remove('n-vis');
                return;
            }
        });

        this.chargebeeInit();
        this.getAgents();
        this.getPlanDetails();
    }

    buyThisPlanClick = () => {
        this.setState({showPlanSelection: !this.state.showPlanSelection, currentPlanDetailsText: "Select your billing cycle and enter the number of agents in the next window"}, () => this.chargebeeInit());
    }

    cancelThisPlan = () => {
        this.setState({
            currentPlanDetailsText: "Trial period plan details"
        })
    } 

    onOpenModal = () => {
        this.setState({ modalIsOpen: true });
    };

    afterOpenModal = () => {
        this.chargebeeInit();
        if(this.state.choosePlan === "per_agent_monthly") {
            var elem = document.getElementById('checkout-monthly');
            elem.cbProduct.planQuantity = this.state.seatsBillable;
        } else {
            var elem = document.getElementById('checkout-yearly');
            elem.cbProduct.planQuantity = this.state.seatsBillable;
        }
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
        let currentPlanElems = document.querySelectorAll(".pricing-table-body button");
        for (var i = 0; i < subscribeElems.length; i++) {

            if (subscribeElems[i].classList.contains('n-vis')) {
                subscribeElems[i].click();
            }
            if (subscribeElems[i].getAttribute('data-subscription') == that.state.subscription) {
                    subscribeElems[i].value = "Current Plan";
            }
            if(currentPlanElems[i].getAttribute('data-choose-plan') == that.state.subscription) {
                currentPlanElems[i].textContent = "Current Plan";
                currentPlanElems[i].disabled = true;
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

        that.setState({subscription: subscription});
        this.setState({ currentPlan: SUBSCRIPTION_PLANS[subscription] });

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
                        that.setState({billingCustomerId: billingCustomerId});
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
            var trialStarted = new Date(CommonUtils.getUserSession().applicationCreatedAt);
            var timeDiff = now.getTime() - trialStarted.getTime();
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (diffDays < 31) {
                this.setState({ trialLeft: (31 - diffDays) });
                this.setState({ currentPlan: SUBSCRIPTION_PLANS['per_agent_monthly'] });
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


    seatSelectionModal(e) {
        this.setState({
            choosePlan: e.target.getAttribute("data-choose-plan"),
            seatSelectionModalIsOpen: true,
            modalIsOpen: false
        }, () => this.chargebeeInit())
    }

    closeSeatSelectionModal() {
        this.setState({
            seatSelectionModalIsOpen: false,
        });

    }

    handleChange(states, e) {
        this.setState({
            seatsBillable: e.target.value
        })
        if(states === "per_agent_monthly") {
            var elem = document.getElementById('checkout-monthly');
            if(e.target.value <= 0 ) {
                elem.disabled = true;
            } else {
                elem.parentNode.removeChild(elem);
                elem.disabled = false;
                elem.setAttribute("data-cb-plan-quantity", e.target.value);
                elem.cbProduct.planQuantity = e.target.value;
                document.querySelector(".seat-selection-modal--footer").appendChild(elem);
            }
           
            
        } else {
            var elem = document.getElementById('checkout-yearly');
            if(e.target.value <= 0 ) {
                elem.disabled = true;
            } else {
                elem.disabled = false;
                elem.parentNode.removeChild(elem);
                elem.setAttribute("data-cb-plan-quantity", e.target.value);
                elem.cbProduct.planQuantity = e.target.value;
                document.querySelector(".seat-selection-modal--footer").appendChild(elem);
            }
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
        let disabledUsers = this.state.disabledUsers;
        let kmActiveUsers =[];
        return Promise.resolve(getUsersByType(CommonUtils.getUserSession().application.applicationId, users)).then(data => {
          let usersList = data;
          data.map((user => {
            user.status == USER_STATUS.EXPIRED && disabledUsers.push(user);
            (user.status == USER_STATUS.AWAY || user.status == USER_STATUS.ONLINE) && kmActiveUsers.push(user);
          }))
          this.setState({
            kmActiveUsers: kmActiveUsers.length,
            seatsBillable: kmActiveUsers.length
          });
        }).catch(err => {
           console.log("err while fetching users list");
        });
      }

      getPlanDetails() {
          let currentUserName = CommonUtils.getUserSession().adminUserName;
        return Promise.resolve(getSubscriptionDetail(currentUserName)).then(data => {
            let response = data;
            this.setState({
                totalPlanQuantity: response.plan_quantity,
                nextBillingDate: response.next_billing_at,
                
            })
        }).catch(err => {  
            if(this.state.subscription === "launch_yearly" || this.state.subscription === "launch_monthly") {
                this.setState({
                    totalPlanQuantity: 5
                })
            }        
            console.log("Error while fetching subscription list of user");
        })

      }

    render() {
        //Todo: set this dynamically based on current plan
        let currentPlanElems = document.querySelectorAll(".pricing-table-body button");
        const billedYearly = (
            <div className="radio-content-container">
                <h3>Billed Yearly</h3>
                <p>${SUBSCRIPTION_PLANS['per_agent_yearly'].amount} PER AGENT/MONTH</p>
            </div>
        )
        const billedMonthly = (
            <div className="radio-content-container">
                <h3>Billed Monthly</h3>
                <p>${SUBSCRIPTION_PLANS['per_agent_monthly'].amount} PER AGENT/MONTH</p>
            </div>
        )
        const { modalIsOpen } = this.state;


        for(var i = 0; i < currentPlanElems.length; i++) {
            if(currentPlanElems[i].getAttribute('data-cb-plan-id') == this.state.subscription) {
                if(this.state.trialLeft > 0 && this.state.trialLeft <= 31) {
                    currentPlanElems[i].textContent = "Choose Plan";
                    currentPlanElems[i].disabled = false;
                } else {
                    currentPlanElems[i].textContent = "Current Plan";
                    currentPlanElems[i].disabled = true;
                }
                
            }
        }

        return (
            <div className="animated fadeIn billings-section">
                <div className="row">
                    <div className="col-md-10">
                        <div className="card">
                            <div className="card-block">

                                <button id="chargebee-init" hidden></button>
                                {this.state.subscription == '' || this.state.subscription == 'startup' ?
                                    (this.state.trialLeft > 0 && this.state.trialLeft <= 31 ?
                                        (<div className="info-bar-container">
                                            <p className="info-bar-text"><strong>{this.state.trialLeft} days trial left.</strong> If no plan is chosen, you will be subscribed to the Free Plan at the end of the trial period.</p>
                                        </div>
                                        )
                                        : (
                                            <div className="info-bar-container info-bar--error">
                                                <p className="info-bar-text"><strong>Trial period over.</strong> You have been subscribed to the Free Plan.</p>
                                            </div>
                                        )
                                    )
                                    :
                                    null
                                }

                                {/* Subscribe successfully box */}

                                <div className={this.state.subscription == '' || this.state.subscription == 'startup' ? (this.state.trialLeft > 0 && this.state.trialLeft <= 31 ? ("n-vis") : ("subscription-complete-container")): "subscription-complete-container"}>
                                {this.state.subscription == '' || this.state.subscription == 'startup' ? "" :
                                    <div className="subscription-current-plan-container">
                                        <div className="subscription-success-checkmark">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 56 56">
                                                <g fill="#2DD35C" fillRule="nonzero">
                                                    <path d="M16.7125 23.275l-2.5375 2.3625 11.9 12.775 27.9125-28-2.45-2.45L26.075 33.425z"/>
                                                    <path d="M.525 28C.525 43.225 12.8625 55.475 28 55.475c15.1375 0 27.475-12.25 27.475-27.475h-3.5c0 13.2125-10.7625 23.975-23.975 23.975C14.7875 51.975 4.025 41.2125 4.025 28 4.025 14.7875 14.7875 4.025 28 4.025v-3.5C12.8625.525.525 12.8625.525 28z"/>
                                                </g>
                                            </svg>
                                        </div>
                                        
                                        <div className="subscription-success-plan-billing">
                                            <div className="subscription-success-purchased-plan-name">
                                                <p>Your plan:</p>
                                                <p><span>{SUBSCRIPTION_PLANS[this.state.subscription].name} - <span style={{textTransform: "lowercase", background:"transparent", paddingLeft: "0px"}}>{this.state.totalPlanQuantity < 2 ? this.state.totalPlanQuantity + " seat" : this.state.totalPlanQuantity + " seats"}</span></span> <span style={{textTransform: "uppercase"}}>{SUBSCRIPTION_PLANS[this.state.subscription].term} BILLING</span></p>
                                            </div>
                                            {this.state.subscription === "launch_yearly" || this.state.subscription === "launch_monthly" ? "" :
                                            <div className="subscription-success-purchased-plan-billing">
                                                <p>Next billing:</p>
                                                <p>You will be charged <strong>${this.state.subscription === "per_agent_yearly" ? this.state.totalPlanQuantity * 96 : this.state.subscription === "per_agent_monthly" ? this.state.totalPlanQuantity * 10 : 0}</strong> on <strong>{this.state.subscription === "per_agent_yearly" ? CommonUtils.countDaysForward(365) : this.state.subscription === "per_agent_monthly" ? CommonUtils.countDaysForward(30) : 0}</strong></p>
                                            </div>
                                            }
                                        </div>
                                        
                                    </div>
                                    }
                                    {  this.state.kmActiveUsers > this.state.totalPlanQuantity ? <div className={this.state.subscription == '' || this.state.subscription == 'startup' ? "n-vis" : "subscription-current-plan-warning-container"}>
                                        <div className="subscription-warning-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="68" height="68" viewBox="0 0 512 512">
                                                <path d="M507.494 426.066L282.864 53.537c-5.677-9.415-15.87-15.172-26.865-15.172s-21.188 5.756-26.865 15.172L4.506 426.066c-5.842 9.689-6.015 21.774-.451 31.625 5.564 9.852 16.001 15.944 27.315 15.944h449.259c11.314 0 21.751-6.093 27.315-15.944 5.564-9.852 5.392-21.936-.45-31.625zM256.167 167.227c12.901 0 23.817 7.278 23.817 20.178 0 39.363-4.631 95.929-4.631 135.292 0 10.255-11.247 14.554-19.186 14.554-10.584 0-19.516-4.3-19.516-14.554 0-39.363-4.63-95.929-4.63-135.292 0-12.9 10.584-20.178 24.146-20.178zm.331 243.791c-14.554 0-25.471-11.908-25.471-25.47 0-13.893 10.916-25.47 25.471-25.47 13.562 0 25.14 11.577 25.14 25.47 0 13.562-11.578 25.47-25.14 25.47z" fill="#f8ba36"/>
                                            </svg>
                                        </div>
                                        <div className="subscription-warning-detail">
                                            <p>You have bought {this.state.seatsBillable - this.state.totalPlanQuantity} seats less than your number of agents</p>
                                            <p>To make sure all the right agents can log in to their Kommunicate account, delete the extra agents from <Link to="/settings/team">Teammates</Link> section.</p>
                                        </div>
                                    </div> : this.state.kmActiveUsers <= this.state.totalPlanQuantity ? <p className="subscription-add-delete-agent-text">Want to <strong>add</strong> or <strong>delete</strong> agents in your current plan? Just invite or delete members from the <Link to="/settings/team">Teammates</Link> section and your bill will be updated automatically.</p> : ""
                                    }
                                    
                                </div>


                                {/* <div className="subscribe-success-error-container text-center" hidden={this.state.hideSubscribedSuccess}>
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
                                </div> */}

                                <h2 className="plan-agent-details upgrade-text">
                                Upgrade to scale your customer support
                                </h2>

                                <div className="current-plan-container flexi" hidden>                              
                                    <div className="col-md-6">
                                    {(CommonUtils.isTrialPlan()) ? <p className="current-plan-details-text">{this.state.currentPlanDetailsText}</p> : <p className="current-plan-details-text">Current plan details</p>
                                        
                                    }
                                    </div>
                                    <div className="col-md-6 text-right">

                                        {this.state.subscription == 'startup' && this.state.trialLeft > 0 && this.state.trialLeft <= 31 && !this.state.showPlanSelection?
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
                                                <button hidden={!this.state.yearlyChecked} className="next-step-btn n-vis checkout chargebee km-button km-button--primary" data-subscription="per_agent_yearly" data-cb-type="checkout" data-cb-plan-id="per_agent_yearly">
                                                    Next
                                                </button>
                                                <button hidden={this.state.yearlyChecked} className="next-step-btn n-vis checkout chargebee km-button km-button--primary" data-subscription="per_agent_monthly" data-cb-type="checkout" data-cb-plan-id="per_agent_monthly">
                                                    Next
                                                </button>
                                                <button id="cancel-step-btn" className="km-button km-button--secondary cancel-step-btn " onClick={() => {this.buyThisPlanClick(); this.cancelThisPlan()}}>Cancel</button>
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
                                {/* <PlanDetails PlanIcon={this.state.currentPlan.icon} PlanName={this.state.currentPlan.name} PlanMAU={this.state.currentPlan.mau} PlanAmount={this.state.currentPlan.amount} /> */}

                                <div className="manage-accountr">
                                    <a id="portal" className="n-vis" href="javascript:void(0)" data-cb-type="portal">Manage account</a>
                                </div>
                            </div>


                            {/* Seat Selection Modal */}
                            <Modal isOpen={this.state.seatSelectionModalIsOpen} onAfterOpen={this.afterOpenModal} onRequestClose={this.closeSeatSelectionModal} style={stylesForSeatSelectionModal} shouldCloseOnOverlayClick={true} ariaHideApp={false}>
                                <div className="seat-selection-modal--header">
                                    <h2>Growth plan</h2>
                                    <hr/>
                                </div>
                                        
                                <div className="seat-selection-modal--body">
                                    <div className="seat-selector-container">
                                        <div className="seat-selector--text">
                                            <p>Number of seats:</p>
                                        </div>
                                        <div className="seat-selector--input">
                                            <input maxLength="4" min="1" max="10000" type="number" value={this.state.seatsBillable} onChange={(e) => this.handleChange(this.state.choosePlan, e)} onKeyPress={this.keyPress}/>
                                            <p>You have {this.state.kmActiveUsers} existing agents. You may still buy lesser number of seats and delete the extra agents later.</p>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="seat-selector--amount-container">
                                        <div className="amount-payable-container flexi">
                                            <p>Amount payable:</p>
                                            <p>${(this.state.choosePlan === "per_agent_monthly") ? this.state.seatsBillable * 10 : (this.state.seatsBillable * 96)} <span hidden={this.state.choosePlan === "per_agent_monthly" ? false : true}>Save ${(this.state.seatsBillable * 10) - (this.state.seatsBillable * 8)} in yearly plan!</span></p>
                                        </div>
                                        <div className="renewal-date-container flexi">
                                            <p>Auto renewal date:</p>
                                            <p>{(this.state.choosePlan === "per_agent_monthly") ?CommonUtils.countDaysForward(30) : CommonUtils.countDaysForward(365)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="seat-selection-modal--footer text-right">
                                    <button className="km-button km-button--secondary" onClick={this.closeSeatSelectionModal}>Cancel</button>
                                    {
                                        (this.state.choosePlan === "per_agent_monthly") ?
                                        <button className="checkout chargebee n-vis km-button km-button--primary" data-subscription="per_agent_monthly" data-cb-type="checkout" data-cb-plan-id="per_agent_monthly" id="checkout-monthly">Continue</button> :
                                        <button className="checkout chargebee n-vis km-button km-button--primary" data-subscription="per_agent_yearly" data-cb-type="checkout" data-cb-plan-id="per_agent_yearly" id="checkout-yearly">Continue</button>
                                    }
                                    
                                </div>
                                <CloseButton onClick={this.closeSeatSelectionModal}/>
                            </Modal>

                                <div className="row text-center" style={{padding:"13px 13px 13px 0px",margin:"0px"}}>

                                    {/* <!-- Pricing Toggle --> */}
                                    <div className="pricing-toggle text-left">
                                        <label className={this.state.toggleSlider === true ? "toggler" : "toggler toggler--is-active"} id="filt-monthly" onClick={this.handleToggleSliderChange}>Monthly</label>
                                        <div className="toggle n-vis">
                                            <input type="checkbox" id="switcher" className="check" checked={this.state.toggleSlider} onChange={this.handleToggleSliderChange} />
                                            <b className="b switch"></b>
                                        </div>
                                        <label className={this.state.toggleSlider === true ? "toggler toggler--is-active" : "toggler"} id="filt-yearly" onClick={this.handleToggleSliderChange}>Annual <span>(Save 20%)</span></label>
                                    </div>

                                    <div className="col-lg-4 col-md-4 col-xs-12">
                                        <div className="pricing-table">
                                            <div className="pricing-table-container startup">
                                                <div className="pricing-table-header">
                                                    <div className="plan-breif-container">
                                                        <span>Basic live chat</span>
                                                    </div>
                                                    <h2 className="pricing-table-plan-title">Free</h2>
                                                    <h4 className="pricing-table-plan-subtitle" style={{visibility: "hidden"}}>Essential Features</h4>
                                                    <div className="price-image-container">
                                                        <div className="pricing-value">
                                                            <div>
                                                                <h2> $0 </h2>
                                                                <p style={{visibility:"visible",marginTop:"30px"}} className="per-month-span">up to 2 agents</p>
                                                                <p style={{visibility:"hidden",marginTop:"5px",marginBottom:"30px",color: "#9b979b"}}>(Billed Annually)</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <p className="plan-agent-details n-vis">Up to 2 agents</p>

                                                </div>
                                                <div className="pricing-table-body">
                                                    
                                                    {
                                                        <button className="checkout chargebee n-vis km-button km-button--secondary" data-subscription="startup" data-cb-type="checkout" data-cb-plan-id="startup">
                                                            Choose Plan
                                                        </button>
                                                    }
                                                </div>
                                                <div className="pricing-table-footer">
                                                    <a href="#/" className="see-plan-details" style={{ marginBottom: '15px', display: 'block' }} onClick={this.showHideFeatures}>{this.state.showFeatures}</a>
                                                    <div className="pricing-table-body-footer" hidden={this.state.hideFeatureList}>
                                                        <p style={{ opacity: 0 }}>Includes...</p>
                                                        <ul>
                                                            <li>Up to 2 agents</li>
                                                            <li>Live Chat</li>
                                                            <li>Web and Mobile SDKs</li>
                                                            <li>Agent apps</li>
                                                            <li>Basic reporting</li>
                                                            <li>Welcome messages</li>
                                                            <li>90 days chat history</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-md-4 col-xs-12">
                                        <div className="pricing-table">
                                            <div className="pricing-table-container launch">
                                                <div className="pricing-table-header">
                                                    <div className="plan-breif-container">
                                                        <span>Advanced support features</span>
                                                    </div>
                                                    <h2 className="pricing-table-plan-title">Growth</h2>
                                                    <h4 className="pricing-table-plan-subtitle">most preferred</h4>
                                                    <div className="price-image-container">
                                                        <div className="pricing-value">
                                                            <div id="growth-pricing-monthly" className="a hidee" hidden={this.state.pricingMonthlyHidden}>
                                                                <h2> $10</h2>
                                                                <p style={{visibility:"visible",marginTop:"30px"}} className="per-month-span">per agent/mo</p>
                                                                <p style={{visibility:"hidden",marginTop:"5px",marginBottom:"30px",color: "#9b979b"}}>(Billed Annually)</p>
                                                            </div>
                                                            <div id="growth-pricing-yearly" className="a " hidden={this.state.pricingYearlyHidden}>
                                                                <h2>$8</h2>
                                                                <p style={{visibility:"visible",marginTop:"30px"}} className="per-month-span">per agent/mo</p>
                                                                <p style={{visibility:"visible",marginTop:"5px",marginBottom:"30px",color: "#9b979b"}}>(Billed Annually)</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="plan-agent-details n-vis">Unlimited agents</p>
                                                </div>
                                                <div className="pricing-table-body">
                                                    <button hidden={this.state.pricingMonthlyHidden} className="km-button km-button--primary" onClick={this.seatSelectionModal} data-choose-plan="per_agent_monthly">
                                                        Choose Plan
                                                     </button>
                                                    <button hidden={!this.state.pricingMonthlyHidden} className="km-button km-button--primary" onClick={this.seatSelectionModal} data-choose-plan="per_agent_yearly">
                                                        Choose Plan
                                                    </button>
                                                </div>
                                                <div className="pricing-table-footer">
                                                    <a href="#/" className="see-plan-details" style={{ marginBottom: '15px', display: 'block' }} onClick={this.showHideFeatures}>{this.state.showFeatures}</a>
                                                    <div className="pricing-table-body-footer" hidden={this.state.hideFeatureList}>
                                                        <p>Everything in <strong>FREE Plan</strong>, plus...</p>
                                                        <ul>
                                                            <li>Bot integrations</li>
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

                                    <div className="col-lg-4 col-md-4 col-xs-12" hidden>
                                        <PlanView showHideFeatures={this.showHideFeatures} PlanIcon={EarlyBirdPlanIcon} PlanName={SUBSCRIPTION_PLANS['early_bird_monthly'].name} PlanMAU={SUBSCRIPTION_PLANS['early_bird_monthly'].mau} 
                                            PlanAmountMonthly={SUBSCRIPTION_PLANS['early_bird_monthly'].amount} PlanAmountYearly={SUBSCRIPTION_PLANS['early_bird_yearly'].amount}
                                            PricingMonthlyHidden={this.state.pricingMonthlyHidden}
                                            Subscription={this.state.subscription} ShowFeatures={this.state.showFeatures} HideFeatureList={this.state.hideFeatureList}/>
                                    </div>
                                    
                                    <div className="col-lg-4 col-md-4 col-xs-12">
                                        <div className="pricing-table">
                                            <div className="pricing-table-container enterprise">
                                                <div className="pricing-table-header">
                                                    <div className="plan-breif-container">
                                                        <span>Full-fledged support solution</span>
                                                    </div>
                                                    <h2 className="pricing-table-plan-title">Enterprise</h2>
                                                    <h4 className="pricing-table-plan-subtitle">for big organisations</h4>
                                                    <div className="price-image-container">
                                                        <div className="pricing-value">
                                                            <div>
                                                                <h2> Custom </h2>
                                                                <p style={{visibility:"hidden",marginTop:"30px"}} className="per-month-span">free forever</p>
                                                                <p style={{visibility:"hidden",marginTop:"5px",marginBottom:"30px",color: "#9b979b"}}>(Billed Annually)</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="plan-agent-details n-vis">Unlimited agents</p>
                                                </div>
                                                <div className="pricing-table-body">
                                                    {
                                                        (this.state.subscription.indexOf('enterprise') != -1) ? 
                                                        <button hidden={this.state.pricingMonthlyHidden} className="checkout chargebee n-vis km-button km-button--secondary" data-subscription="enterprise_monthly" data-cb-type="checkout" data-cb-plan-id="enterprise_monthly">Current Plan</button>
                                                        : 
                                                        <button className="km-button km-button--secondary" onClick={()=> window.open("https://calendly.com/kommunicate/15min", "_blank")}>Contact Us</button>
                                                    }
                                                </div>
                                                <div className="pricing-table-footer">
                                                    <a href="#/" className="see-plan-details" style={{ marginBottom: '15px', display: 'block' }} onClick={this.showHideFeatures}>{this.state.showFeatures}</a>
                                                    <div className="pricing-table-body-footer" hidden={this.state.hideFeatureList}>
                                                    <p>Everything in <strong>GROWTH Plan</strong>, plus...</p>
                                                        <ul>
                                                            <li>Analytics APIs</li>
                                                            <li>Downloadable reports</li>
                                                            <li>Advanced reporting</li>
                                                            <li>Custom bots</li>
                                                            <li>Whitelabel</li>
                                                            <li>Dedicated server</li>
                                                            <li>Premium support</li>
                                                            <li>Custom SLA</li>
                                                            <li>Bot builder</li>
                                                            <li>Routing rules</li>
                                                            <li>CSAT score</li>
                                                            <li>Unlimited scaling</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>

                        {/* FAQs */}
                        <div className="card">
                            <div className="card-block billings-faq-container">
                                <div className="billings-faq-qa">
                                    <h4 className="billings-faq-question">How can I add or delete agents later?</h4>
                                    <p className="billings-faq-answer">You may add or delete agents any time from <Link to="/settings/team">Teammates</Link> section. The number of seats in your plan will be updated accordingly and the bill will be adjusted on a prorated basis.</p>
                                </div>
                                <div className="billings-faq-qa">
                                    <h4 className="billings-faq-question">How many agents can I add in a particular plan?</h4>
                                    <p className="billings-faq-answer">You can add as many agents in Kommunicate as you want in the Growth and Enterprise plans. You will be charged on the basis of the number of agents you have. In the Free plan, you can add a maximum of 2 agents.</p>
                                </div>
                                <div className="billings-faq-qa">
                                    <h4 className="billings-faq-question">How does the 30 day trial work?</h4>
                                    <p className="billings-faq-answer">You can signup for free to avail the benefits of the full-fledged support platform for 30 days. Credit card details are not required for the trial period. Post the 30 days period, you can upgrade to your preferred plan or else you will be automatically downgraded to the free forever plan. We will not terminate the services.</p>
                                </div>
                                <div className="billings-faq-qa">
                                    <h4 className="billings-faq-question">How to upgrade or downgrade the plan?</h4>
                                    <p className="billings-faq-answer">You can upgrade your plan through the dashboard itself. Alternatively, you can drop us a line and we'll be happy to assist you in upgrading or downgrading your plan.</p>
                                </div>
                                <div className="billings-faq-qa">
                                    {/* <h4 className="billings-faq-question">How many agents can I add in a particular plan?</h4> */}
                                    <p className="billings-faq-answer">Have any more questions? Talk to us <a className="applozic-launcher">here</a></p>
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
    'startup': {
        'icon': StartupPlanIcon,
        'name': 'Free',
        'mau': 'Unlimited',
        'amount': '0'
    },
    'launch_monthly': {
        'icon': LaunchPlanIcon,
        'name': 'Launch',
        'mau': 'Unlimited',
        'amount': '49',
        'term': 'monthly'
    },
    'launch_yearly': {
        'icon': LaunchPlanIcon,
        'name': 'Launch',
        'mau': 'Unlimited',
        'amount': '39',
        'term': 'Yearly'
    },
    'growth_monthly': {
        'icon': GrowthPlanIcon,
        'name': 'Growth',
        'mau': 'Unlimited',
        'amount': '199',
        'term': 'Monthly'
    },
    'growth_yearly': {
        'icon': GrowthPlanIcon,
        'name': 'Growth',
        'mau': 'Unlimited',
        'amount': '149',
        'term': 'Yearly'
    },
     'early_bird_monthly': {
        'icon': EarlyBirdPlanIcon,
        'name': 'Early Bird',
        'mau': 'Unlimited',
        'amount': '49',
        'term': 'Monthly'
    },
    'early_bird_yearly': {
        'icon': EarlyBirdPlanIcon,
        'name': 'Early Bird',
        'mau': 'Unlimited',
        'amount': '39',
        'term': 'Yearly'
    },
    'enterprise_monthly': {
        'icon': EnterprisePlanIcon,
        'name': 'Enterprise',
        'mau': 'Unlimited',
        'amount': 'Custom',
        'term': 'Monthly'
    },
    'enterprise_yearly': {
        'icon': EnterprisePlanIcon,
        'name': 'Enterprise',
        'mau': 'Unlimited',
        'amount': 'Custom',
        'term': 'Yearly'
    },
    'per_agent_monthly': {
        'icon': GrowthPlanIcon,
        'name': 'Growth',
        'mau': 'Unlimited',
        'amount': '10',
        'term': 'Monthly'
    },
    'per_agent_yearly': {
        'icon': GrowthPlanIcon,
        'name': 'Growth',
        'mau': 'Unlimited',
        'amount': '8',
        'term': 'Yearly'
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
const stylesForSeatSelectionModal = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '900px',
        overflow: 'unset',
    }
};

export default Billing;