import React, { Component, Fragment } from 'react';
import CommonUtils from '../../utils/CommonUtils';
import CloseButton from '../../components/Modal/CloseButton';
import { OnBoardingSVG } from '../../views/Faq/LizSVG';
import { Link } from 'react-router-dom';
import styled, { withTheme } from 'styled-components';

class Onboarding extends Component {

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
            <Fragment>
                {!this.state.hideOnboardingBanner && <OnboardingContainer>
                    <H3>Hi {firstName}, let’s get you started!</H3>
                    <OnboardingBlock className="km-onboarding--block">
                        <OnboardingTextBlock className="km-onboarding--text-block">
                            {CommonUtils.isProductApplozic() ? 
                                <ul>
                                    <li><Link to="/settings/install">Install</Link> Applozic chat in your Mobile and Web apps</li>
                                    <li>Invite your <Link to="/settings/team">Teammates</Link></li>
                                </ul>
                                :
                                <ul>
                                    <li><Link to="/settings/install">Install</Link> Kommunicate live chat in your website or app</li>
                                    <li><a href="https://www.kommunicate.io/blog/how-to-integrate-bot-using-dialogflow-in-kommunicate-1ac32911a7d0/" target="_blank">Read</a> how to set up a chat bot in Kommunicate</li>
                                    <li>Setup <Link to="/settings/mailbox">Mailbox</Link> to manage support emails from Kommunicate</li>
                                    <li>Customize your <Link to="/settings/chat-widget-customization">Chat Widget</Link></li>
                                    <li>Invite your <Link to="/settings/team">Teammates</Link></li>
                                </ul>
                            }
                        </OnboardingTextBlock>
                        <div className="km-onboarding--image-block">
                            <OnBoardingSVG />
                        </div>
                    </OnboardingBlock>
                    <CloseButton className="onboarding-close-button" onClick={this.closeOnboadringBanner} />
                </OnboardingContainer>}
            </Fragment>
        );
    }
}

// Styles
const OnboardingContainer = styled.div`
    position: relative;
    border-radius: 4px;
    border: solid 1px #dfdbdb;
    background-color: #ffffff;
    margin: 50px 0 30px;
    padding: 25px 30px;

    & .onboarding-close-button--km-close-modal-wrapper .onboarding-close-button--km-modal-close-text {
        color: #a4a2a2;
    }
    & .onboarding-close-button--km-close-modal-wrapper .onboarding-close-button--km-modal-close-icon-wrapper svg {
        fill: #a4a2a2;
    }
`;
const H3 = styled.h3`
    font-weight: normal;
    margin-bottom: 20px;
`;
const OnboardingBlock = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
`;
const OnboardingTextBlock = styled.div`
    & ul {
        margin: 0 0 0 26px;
        padding: 0;
        list-style: none;
    }
    & ul li {
        font-size: 17px;
        letter-spacing: 0.6px;
        color: #88878b;
        margin: 17px 0px;
    }
    & ul li:before {
        content:"";
        height: 19px;
        width: 17px;
        position: relative;
        top: 2.5px;
        display:block;
        margin-left:-1.5em;
        background-repeat:no-repeat;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' %3E%3Cpath fill='${props => props.theme.primary.replace('#', '%23')}' fill-rule='nonzero' d='M8 16c-4.418278 0-8-3.581722-8-8s3.581722-8 8-8 8 3.581722 8 8-3.581722 8-8 8zM4.34054084 8.81386757c-.15082379-.14005067-.38662408-.13131732-.52667474.01950647-.14005066.15082379-.13131731.38662408.01950648.52667474l2.60869433 2.42235902c.16022445.1487798.41351514.1282979.54775251-.044293l5.21738868-6.70807113c.1263615-.16246471.097094-.39660457-.0653707-.522966-.1624648-.12636146-.3966046-.09709396-.522966.06537075L6.65118861 10.9594691 4.34054084 8.81386757z'/%3E%3C/svg%3E");
        background-size:90%;
        background-position:center;
        float: left;
        transition: background-size 0.3s;
    }
    & ul li>a {
        color: ${props => props.theme.primary};
        text-decoration: none;
    }
    & ul li>a:hover {
        text-decoration: none;
    }
`;

export default withTheme(Onboarding);