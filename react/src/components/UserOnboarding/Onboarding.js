import React, { Component } from 'react';
import './Onboarding.css';
import CommonUtils from '../../utils/CommonUtils';
import CloseButton from '../../components/Modal/CloseButton';
import { OnBoardingSVG } from '../../views/Faq/LizSVG';
import { Link } from 'react-router-dom';

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
        var firstName = fullName ? fullName.split(" ")[0] : "";
        return (
            <div>
                {!this.state.hideOnboardingBanner && <div className="km-onboarding-container">
                    <h3>Hi {firstName}, let’s get you started!</h3>
                    <div className="km-onboarding--block">
                        <div className="km-onboarding--text-block">
                            <ul>
                                <li><Link to="/settings/install">Install</Link> Kommunicate live chat in your website or app</li>
                                <li><a href="https://www.kommunicate.io/blog/how-to-integrate-bot-using-dialogflow-in-kommunicate-1ac32911a7d0/" target="_blank">Read</a> how to set up a chat bot in Kommunicate</li>
                                <li>Setup <Link to="/settings/mailbox">Mailbox</Link> to manage support emails from Kommunicate</li>
                                <li>Customize your <Link to="/settings/chat-widget-customization">Chat Widget</Link></li>
                                <li>Invite your <Link to="/settings/team">Teammates</Link></li>
                            </ul>
                        </div>
                        <div className="km-onboarding--image-block">
                            <OnBoardingSVG />
                        </div>
                    </div>
                    <CloseButton onClick={this.closeOnboadringBanner} />
                </div>}
            </div>
        );
    }
}
