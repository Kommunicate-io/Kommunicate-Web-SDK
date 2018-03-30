import React, { Component, PropTypes } from 'react';

export default class PlanView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            planDetailsText: 'See plan details',
            hidePlanDetails: true,
        };

        this.showPlanDetails = this.showPlanDetails.bind(this);
        this.showHideFeatures = this.showHideFeatures.bind(this);
    }

    showPlanDetails(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            hidePlanDetails: !this.state.hidePlanDetails,
            planDetailsText: this.state.planDetailsText === 'See plan details' ? 'Hide plan details' : 'See plan details'
        });
    }

    showHideFeatures = (event) => {
        this.props.showHideFeatures(event);
    }

    render() {

        const { PlanIcon, PlanName, PlanMAU, PlanAmountMonthly, PlanAmountYearly, PricingMonthlyHidden, Subscription, ShowFeatures, HideFeatureList } = this.props;

        return (
            <div className="col-lg-12 col-md-12 col-xs-12">
                <div className="pricing-table">
                    <div className="pricing-table-container growth">
                        <div className="pricing-table-header">
                            <h2 className="pricing-table-plan-title">{PlanName}</h2>
                            <div className="price-image-container">
                                <img src={PlanIcon} alt="Plan Icon" />
                            </div>

                        </div>
                        <div className="pricing-table-body">
                            <div className="pricing-table-body-header">
                                <div className="pricing-value">
                                    <h2 id="early-bird-pricing-monthly" hidden={!PricingMonthlyHidden}>${PlanAmountYearly}<span className="per-month-span">/MO</span>
                                        <p style={{ visibility: 'visible', fontSize: '14px', fontWeight: 400, marginTop: '10px' }}>(Billed Annually)</p></h2>
                                    <h2 id="early-bird-pricing-yearly" hidden={PricingMonthlyHidden}>${PlanAmountMonthly}<span className="per-month-span">/MO</span>
                                        <p style={{ visibility: 'hidden', fontSize: '14px', fontWeight: 400, marginTop: '10px' }}>(Billed Annually)</p></h2>
                                </div>
                                <div className="price-mau">
                                    <h4>{PlanMAU} Chat users /mo</h4>
                                </div>
                            </div>
                            <a href="#/" className="see-plan-details" style={{ marginBottom: '15px', display: 'block' }} onClick={this.showHideFeatures}>{ShowFeatures}</a>
                            <div className="pricing-table-body-footer" hidden={HideFeatureList}>
                                <p>All in Startup</p>
                                <ul>
                                    <li>Unlimited bots</li>
                                    <li>Advanced reporting</li>
                                    <li>CRM integration</li>
                                    <li>Chat &amp; Email Support</li>
                                </ul>
                            </div>
                        </div>
                        <div className="pricing-table-footer">
                            <button hidden={PricingMonthlyHidden} className="checkout chargebee n-vis km-button km-button--primary" data-subscription="early_bird_monthly" data-cb-type="checkout" data-cb-plan-id="early_bird_monthly">
                                {
                                    (Subscription.indexOf({PlanName}) != -1) ? "Current Plan" : "Select Plan"
                                }
                            </button>
                            <button hidden={!PricingMonthlyHidden} className="checkout chargebee n-vis km-button km-button--primary" data-subscription="early_bird_yearly" data-cb-type="checkout" data-cb-plan-id="early_bird_yearly">
                                {
                                    (Subscription.indexOf({PlanName}) != -1) ? "Current Plan" : "Select Plan"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

PlanView.propTypes = {
    PlanIcon: PropTypes.string.isRequired,
    PlanName: PropTypes.string.isRequired,
    PlanAmountMonthly: PropTypes.string.isRequired,
    PlanAmountYearly: PropTypes.string.isRequired,
    PlanMAU: PropTypes.string.isRequired,
    PricingMonthlyHidden: PropTypes.bool.isRequired,
    Subscription: PropTypes.string.isRequired,
    ShowFeatures: PropTypes.string.isRequired,
    HideFeatureList: PropTypes.bool.isRequired
};


