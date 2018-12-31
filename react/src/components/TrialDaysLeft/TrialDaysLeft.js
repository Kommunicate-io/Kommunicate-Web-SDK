import React, { Component } from 'react'
import './TrialDaysLeft.css'
import CommonUtils from '../../utils/CommonUtils';
import { Link } from 'react-router-dom';

const trialDaysBannerEmployeeProfile = {
    name: "Devashish Mamgain",
    imageLink:"https://kommunicate.s3.ap-south-1.amazonaws.com/profile_pic/154591304350622823b4a764f9944ad7913ddb3e43cae1-reytum%40live.com.image.jpg",
    designation:"CEO"
}
export default class TrialDaysLeft extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showPopupBox: true
        };

        this.showPopup = this.showPopup.bind(this);
        this.hidePopup = this.hidePopup.bind(this);
        this.showPopupContainer = this.showPopupContainer.bind(this);
    }

    componentDidMount() {
        if (typeof (Storage) !== "undefined") {
            (localStorage.getItem("KM_TRIAL_OVER") === null) ?
                this.setState({ showPopupBox: false }) : this.setState({ showPopupBox: true })
        } else {
            console.log("Please update your browser.");
        }
    }

    showPopup(elem) {
        document.querySelector(".km-trial-days-left-popup-container").removeAttribute("style");
    }

    showPopupContainer(elem) {
        this.setState({
            showPopupBox: false
        })
        localStorage.setItem("KM_TRIAL_OVER", null);
    }

    hidePopup(elem) {
        if (typeof (Storage) !== "undefined") {
            if (localStorage.getItem("KM_TRIAL_OVER") === null) {
                localStorage.setItem("KM_TRIAL_OVER", "true");
                // document.querySelector(".km-trial-days-left-popup-container").style.display = "none";
                this.setState({ showPopupBox: true })
            }
            else {
                // document.querySelector(".km-trial-days-left-popup-container").style.display = "none";
                this.setState({ showPopupBox: true })
            }
        } else {
            console.log("Please update your browser.");
        }
    }


    render() {
        let currentPath = window.location.pathname;
        let daysLeft;
        if (CommonUtils.isTrialPlan()) {
            daysLeft = ["trial ", <span key="0" onClick={this.showPopupContainer}>{31 - CommonUtils.getDaysCount()} days</span>, " left"];
        } else {
            daysLeft = ["", <span key="0">upgrade plan</span>, ""];
        }

        return (
            <div className={(CommonUtils.isTrialPlan() || CommonUtils.isStartupPlan()) ? "km-trial-days-left-container" : "n-vis"}
            // onMouseOver={this.showPopup}
            >
                {(CommonUtils.isTrialPlan()) ?
                    <div className="km-trial-days-left">
                        <p>{daysLeft}</p>
                    </div>
                    :
                    <div className="km-trial-days-left">
                        <Link to="/settings/billing" className="km-button km-button--secondary trial-over">{daysLeft}</Link>
                    </div>
                }

                <div id="km-trial-days-left-popup-container" className="km-trial-days-left-popup-container text-center" hidden={this.state.showPopupBox}>
                    {
                        (CommonUtils.isTrialPlan() &&  localStorage.getItem("KM_TRIAL_OVER") != "true") ?
                            <div>
                                { (CommonUtils.isKommunicateDashboard()) ?
                                <div>
                                    <div className="km-trial-days-left-popup-demo">
                                        <img src={trialDaysBannerEmployeeProfile.imageLink} alt="avatar_employee" />
                                        <p className="km-person-name">
                                            {trialDaysBannerEmployeeProfile.name}
                                    </p>
                                        <p className="km-person-designation">
                                        {trialDaysBannerEmployeeProfile.designation}
                                    </p>
                                        <p className="km-quote first">Want to see how you can increase</p>
                                        <p className="km-quote mid">your support efficiency by 27%?</p>
                                        <p className="km-quote last">Schedule a demo with me!</p>

                                        <a href="https://calendly.com/kommunicate/15min" target="_blank" className="km-button km-button--secondary km-demo-btn" rel="noopener noreferrer">Get demo</a>
                                    </div>
                                </div> : ""
                                }

                                <div className="km-trial-days-left-popup-buy-plan">
                                    { (CommonUtils.isKommunicateDashboard()) ?
                                        <p>
                                            Ready to improve your customer support?
                                        </p>
                                        :
                                        <p>
                                            Ready to increase user engagement in your platform?
                                        </p>
                                    }
                                    <Link to="/settings/billing" className="km-button km-button--primary km-demo-btn">See plans</Link>
                                </div>

                                <div className="km-trial-days-left-close-btn" onClick={this.hidePopup}>
                                    <svg className="km-modal-close-icon" xmlns="http://www.w3.org/2000/svg" fill="#8d8888" height="24" viewBox="0 0 24 24" width="24">
                                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                        <path d="M0 0h24v24H0z" fill="none" />
                                    </svg>
                                </div>
                                <div className="triangle-before"></div>
                                <div className="triangle-after"></div>
                            </div>
                            : ""
                    }
                </div>

            </div>
        )
    }
}