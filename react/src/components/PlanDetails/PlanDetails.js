import React, { Component, PropTypes } from 'react';

export default class PlanDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            planDetailsText: 'See plan details',
            hidePlanDetails: true,
        };

        this.showPlanDetails = this.showPlanDetails.bind(this);
    }

    showPlanDetails(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            hidePlanDetails: !this.state.hidePlanDetails,
            planDetailsText: this.state.planDetailsText === 'See plan details' ? 'Hide plan details' : 'See plan details'
        });
    }

    render() {

        const { PlanIcon, PlanName, PlanMAU, PlanAmount } = this.props;

        return (
            <div className="active-plan-container flexi">
                <div className="col-md-6 flexi">
                    <div className="active-plan-img-container">
                        <img src={PlanIcon} alt="Growth Plan Icon" />
                    </div>
                    <div className="active-plan-details">
                        <p className="active-plan-name">{PlanName}</p>
                        <p className="active-plan-mau">{PlanMAU} Chat Users/month</p>
                        <a href="#/" className="see-plan-details" onClick={this.showPlanDetails}>{this.state.planDetailsText}</a>
                    </div>
                </div>
                <div className="col-md-6 text-right">
                    <div className="active-plan-pricing">
                        <p className="active-plan-pricing-text">${PlanAmount}
                        </p>
                        <p className="active-plan-mau">Billed Monthly</p>
                    </div>
                    {/* <div className="active-plan-dropdown">
                        <div className="select-container">
                            <select className="monthly-yearly-select" id="monthly-yearly-select">
                                <option value="monthly">Billed Monthly</option>
                                <option value="yearly">Billed Yearly</option>
                            </select>
                        </div>
                    </div> */}
                </div>

                <div className="col-md-12 active-plan-more-details" hidden={this.state.hidePlanDetails}>
                    {
                        PlanName === 'Free' ?
                            <div className="active-plan-feature-list">
                                <ul>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;Unlimited agents</li>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;Live Chat</li>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;Web and Mobile SDKs</li>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;Agent apps</li>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;Conversations reporting</li>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;Welcome and offline messages</li>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;Bot integrations</li>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;Quick replies</li>
                                </ul>
                            </div> 
                        : PlanName === 'Launch' ? 
                            <div> <div className="info-bar-container">
                                <p className="info-bar-text">All features present in <a href="https://www.kommunicate.io/pricing" target="_blank" className="see-plan-details">Free Plan</a> and… </p>
                            </div>
                                <div className="active-plan-feature-list">
                                    <ul>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Bot integration</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Unlimited bots</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Advanced reporting</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;CRM integration</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Contact Enrichment</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;FAQs</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Chat &amp; Email Support</li>
                                        
                                    </ul>
                                </div> </div> 
                        : PlanName === 'Early Bird' ? 
                        <div> 
                            <div className="info-bar-container">
                                <p className="info-bar-text">All features present in <a href="https://www.kommunicate.io/pricing" target="_blank" className="see-plan-details">Startup Plan</a> and… </p>
                            </div>
                            <div className="active-plan-feature-list">
                                <ul>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;Bot integration</li>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;Unlimited bots</li>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;Advanced reporting</li>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;CRM integration</li>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;Contact Enrichment</li>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;FAQs</li>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;Chat &amp; Email Support</li>
                                </ul>
                            </div> 
                        </div> 
                        : PlanName === 'Growth' ? 
                            <div> 
                                <div className="info-bar-container">
                                    <p className="info-bar-text">All features present in <a href="https://www.kommunicate.io/pricing" target="_blank" className="see-plan-details">Free Plan</a> and… </p>
                                </div>
                                <div className="active-plan-feature-list">
                                    <ul>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Agent reporting</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Conversation routing</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Chat and email support</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Bot builder</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;FAQ</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Liz bot</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;All integrations</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Standard SLA</li>
                                    </ul>
                                </div> 
                            </div> 
                        : PlanName === 'Enterprise' ? 
                            <div> 
                                <div className="info-bar-container">
                                    <p className="info-bar-text">All features present in <a href="https://www.kommunicate.io/pricing" target="_blank" className="see-plan-details">Growth Plan</a> and… </p>
                                </div>
                                <div className="active-plan-feature-list">
                                    <ul>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Analytics APIs</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Downloadable reports</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Advanced reporting</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Custom bots</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Whitelabel</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Dedicated server</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Premium support</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Agreements</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Routing rules: team based, trigger based agent assignment</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;CSAT score</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Unlimited scaling</li>
                                    </ul>
                                </div> 
                            </div> 
                        : <div></div>
                    }
                </div>
            </div>
        );
    }
}

PlanDetails.propTypes = {
    PlanIcon: PropTypes.string.isRequired,
    PlanName: PropTypes.string.isRequired,
    PlanAmount: PropTypes.string.isRequired,
    PlanMAU: PropTypes.string.isRequired,
};


