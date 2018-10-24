import React, { Component } from 'react';
import './Onboarding.css';
import CommonUtils from '../../utils/CommonUtils';
import CloseButton from '../../components/Modal/CloseButton';
import { OnBoardingSVG } from '../../views/Faq/LizSVG';

export default class Onboarding extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hideOnboardingBanner: true
        };
        this.closeOnboadringBanner = this.closeOnboadringBanner.bind(this);
    }

    componentDidMount() {
        let onboarding = localStorage.getItem("KM_ONBOARDING");
        if(typeof (Storage) !== "undefined") {
            this.setState({ hideOnboardingBanner: !(onboarding === "true") });
        } else {
            console.log("Please upgrade your browser.");
        }
    }

    closeOnboadringBanner() {
        let onboarding = localStorage.getItem("KM_ONBOARDING");
        if (onboarding === "true") {
            this.setState({
                hideOnboardingBanner: true
            });
            localStorage.setItem("KM_ONBOARDING", "false");
        }
    }

    render() {
        var fullName = CommonUtils.getUserSession().name;
        var firstName = fullName.split(" ")[0];
        return (
            <div className="km-onboarding-container" hidden={this.state.hideOnboardingBanner}>
                <h3>Hi {firstName}, let’s get you started!</h3>
                <div className="km-onboarding--block">
                    <div className="km-onboarding--text-block">
                        <ul>
                            <li><span>Install</span> Kommunicate live chat in your website or app</li>
                            <li><span>Read</span> how to set up a chat bot in Kommunicate</li>
                            <li>Setup <span>Mailbox</span> to manage support emails from Kommunicate</li>
                            <li>Customise your <span>Chat Widget</span></li>
                            <li>Invite your <span>Teammates</span></li>
                        </ul>
                    </div>
                    <div className="km-onboarding--image-block">
                        <OnBoardingSVG />
                    </div>
                </div>
                <CloseButton onClick={this.closeOnboadringBanner} />
            </div>
        );
    }
}