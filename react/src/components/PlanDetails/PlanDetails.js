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
                        PlanName === 'Startup' ?
                            <div className="active-plan-feature-list">
                                <ul>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;Messenger</li>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;Team Inbox</li>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;Auto Reply</li>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;Android &amp; iOS Agent app</li>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;1 Bot integration supported</li>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;Data retention: 3 months</li>
                                </ul>
                            </div> 
                        : PlanName === 'Launch' ? 
                            <div> <div className="info-bar-container">
                                <p className="info-bar-text">All features present in <a href="https://www.kommunicate.io/pricing" target="_blank" className="see-plan-details">Startup Plan</a> and… </p>
                            </div>
                                <div className="active-plan-feature-list">
                                    <ul>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Unlimited bots</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Advanced reporting</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;White label (removed powered by Kommunicate)</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Data retention: Forever</li>
                                    </ul>
                                </div> </div> 
                        : PlanName === 'Early Bird' ? 
                        <div> 
                            <div className="info-bar-container">
                                <p className="info-bar-text">All features present in <a href="https://www.kommunicate.io/pricing" target="_blank" className="see-plan-details">Startup Plan</a> and… </p>
                            </div>
                            <div className="active-plan-feature-list">
                                <ul>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;Custom bot integrations</li>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;CRM integrations</li>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;Priority email support</li>
                                    <li><i className="fa fa-check"></i> &nbsp;&nbsp;Data retention: Forever</li>
                                </ul>
                            </div> 
                        </div> 
                        : PlanName === 'Growth' ? 
                            <div> 
                                <div className="info-bar-container">
                                    <p className="info-bar-text">All features present in <a href="https://www.kommunicate.io/pricing" target="_blank" className="see-plan-details">Launch Plan</a> and… </p>
                                </div>
                                <div className="active-plan-feature-list">
                                    <ul>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Custom bot integrations</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;CRM integrations</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Priority email support</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Data retention: Forever</li>
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
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Custom bot development</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Personalized support on Phone &amp; Skype</li>
                                        <li><i className="fa fa-check"></i> &nbsp;&nbsp;Customised solution for your specific needs</li>
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
    PlanMAU: PropTypes.number.isRequired,
};


