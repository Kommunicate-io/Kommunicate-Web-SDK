import React, { Component, Fragment } from 'react'
import './TrialDaysLeft.css'
import CommonUtils from '../../utils/CommonUtils';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as SignUpActions from '../../actions/signupAction'
import styled, { css, withTheme } from 'styled-components';
import tinycolor from 'tinycolor2';
import moment from 'moment';
import Colors from '../../assets/theme/colors';
import { TrialDaysLeftImage } from '../../assets/svg/svgs';
import Button from '../Buttons/Button';


class TrialDaysLeft extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showPopupBox: true,
            color: "",
            renderHaveQueriesSection: "",
            trialExpiryBannerMsg: "",
            renderSections: {
                haveQueries: "",
                popupMainBox: ""
            }
        };

        this.showPopup = this.showPopup.bind(this);
        this.hidePopup = this.hidePopup.bind(this);
        this.showPopupContainer = this.showPopupContainer.bind(this);
    }

    componentWillMount = () => {
        this.daysRemaining();
    }

    componentDidMount() {
        this.props.trialDaysLeftOnboardingValue && this.props.closeTrialDaysLeftBanner && this.props.updateStatus(actionType.trailDaysLeftBanner, false);
    }

    showPopup(elem) {
        document.querySelector(".km-trial-days-left-popup-container").removeAttribute("style");
    }

    showPopupContainer(elem) {
        this.props.updateStatus(actionType.trailDaysLeftBanner, false);
    }

    hidePopup(elem) {
        this.props.updateStatus(actionType.trailDaysLeftBanner, true);
        this.props.updateStatus(actionType.onboardingValueForTrialDaysLeft, false);
    }

    renderHaveQueriesSection = (render) => {
        return ( render ? (
                <Fragment>
                    <P>Ready to improve your customer support?</P>
                    <Link to="/settings/billing" className="km-button km-button--primary km-demo-btn">See plans</Link>
                    <ButtonSubText>* We will not start charging you until your trial ends and you can cancel it anytime</ButtonSubText>
                </Fragment> 
            ) : (
                <Fragment>
                    <HaveQueriesText>Have any queries? <br/> Chat with us now or get on a call with us</HaveQueriesText>
                    <ChatNowButton secondary onClick={() => {
                        KommunicateGlobal.document.querySelector(".applozic-launcher").click();
                    }}>Chat now</ChatNowButton>
                    <Button secondary onClick={() => {
                        window.open("https://calendly.com/kommunicate/15min", '_blank');
                    }}>Schedule a call</Button>
                </Fragment>
            )
        )
    }

    renderPopupBoxMainContent = (render) => {
        return ( render ? (
                <Fragment>
                    <img src={trialDaysBannerEmployeeProfile.imageLink} alt="avatar_employee" />
                    <p className="km-person-name">{trialDaysBannerEmployeeProfile.name}</p>
                    <p className="km-person-designation">{trialDaysBannerEmployeeProfile.designation}</p>
                    <QuotesContainer>
                        <FirstQuote>Want to see how you can increase</FirstQuote>
                        <MiddleQuote>your support efficiency by 27%?</MiddleQuote>
                        <LastQuote>Schedule a demo with me!</LastQuote>
                    </QuotesContainer>

                    <Button secondary onClick={() => {
                        window.open("https://calendly.com/kommunicate/15min", '_blank');
                    }}>Get demo</Button>
                    
                </Fragment> 
            ) : (
                <Fragment>
                    <CardPlaceholderImage />
                    <QuotesContainer>
                        <FirstQuote>Subscribe now to continue using all</FirstQuote>
                        <MiddleQuote>features without interruption. We won’t</MiddleQuote>
                        <LastQuote>charge you until your trial ends.</LastQuote>
                    </QuotesContainer>
                    <Link to="/settings/billing" className="km-button km-button--primary km-demo-btn">Subscribe now</Link>
                    <ButtonSubText>* You can cancel anytime</ButtonSubText>
                </Fragment>
            )
        )
    }

    daysRemaining = () => {
        var _this = this;
        let applicationCreatedAtTime = CommonUtils.getUserSession().application.createdAtTime;
        var planDetails = this.checkPlanAndAssignValues(applicationCreatedAtTime);
        let daysRemaining = (planDetails.TOTAL_DAYS+1) - CommonUtils.getDaysCount();
        var trialExpiryDate = moment(applicationCreatedAtTime).add(planDetails.TOTAL_DAYS, 'days').format("DD MMM YYYY");

        this.setState({renderSections: {
                haveQueries: this.renderHaveQueriesSection(daysRemaining > (planDetails.TOTAL_DAYS/2)),
                popupMainBox: this.renderPopupBoxMainContent(daysRemaining > (planDetails.TOTAL_DAYS/2))
            }
        })

        if(daysRemaining <= planDetails.END_PHASE_LENGTH) {
            this.setState({
                color: _this.props.theme.buttons.dangerBG,
                trialExpiryBannerMsg: "Trial ending soon",
            });
        } else if(daysRemaining <= planDetails.MID_PHASE_LENGTH) {
            this.setState({
                color: Colors.ApplozicColors.secondary,
                trialExpiryBannerMsg: "Trial ends on " + trialExpiryDate,
            });
        } else {
            this.setState({
                color: Colors.CommonColors.success,
                trialExpiryBannerMsg: "",
            });
        }

        if(daysRemaining === planDetails.END_PHASE_LENGTH || daysRemaining === planDetails.MID_PHASE_LENGTH) {
            this.props.updateStatus(actionType.trailDaysLeftBanner, false);
            this.props.updateStatus(actionType.onboardingValueForTrialDaysLeft, false);
        }
    }

    checkPlanAndAssignValues = () => {
        if(CommonUtils.isKommunicateDashboard()){
            return (CommonUtils.isOldPlan() ? TRIAL_DAYS_BREAKDOWN.OLD_PLAN:TRIAL_DAYS_BREAKDOWN.NEW_PLAN);
        }
        else {
            return  TRIAL_DAYS_BREAKDOWN.OLD_PLAN;
        }
    };



    render() {
        
        let daysLeft;
        if (CommonUtils.isTrialPlan()) {
            daysLeft = ["trial ", <Span key="0" onClick={this.showPopupContainer} color={this.state.color}>{(CommonUtils.maxDaysAsPerPlan()+1) - CommonUtils.getDaysCount()} days</Span>, " left"];
        } else {
            daysLeft = ["", <span key="0">upgrade plan</span>, ""];
        }
        //Note: For Applozic, once pricing is finalized, upgrade will come.
        
        return (
            <div className={CommonUtils.isTrialPlan() || CommonUtils.isExpiredPlan() ? "km-trial-days-left-container" : "n-vis"}
            // onMouseOver={this.showPopup}
            >
                {(CommonUtils.isTrialPlan()) ?
                    <div className="km-trial-days-left">
                        <p>{daysLeft}</p>
                    </div>
                    :
                    <div className={"km-trial-days-left"}>
                        <Link to="/settings/billing" className="km-button km-button--secondary trial-over">{daysLeft}</Link>
                    </div>
                }

                <div id="km-trial-days-left-popup-container" className="km-trial-days-left-popup-container text-center" hidden={this.props.closeTrialDaysLeftBanner} >

                    

                    {
                        (CommonUtils.isTrialPlan() &&  localStorage.getItem("KM_TRIAL_OVER") != "true") ?
                            <div>
                                <TrialDaysCountdownBannerContainer color={this.state.color} hidden={this.state.trialExpiryBannerMsg === ""}>
                                    <TrialDaysCountdownBannerText color={this.state.color}>{this.state.trialExpiryBannerMsg}</TrialDaysCountdownBannerText>
                                </TrialDaysCountdownBannerContainer>
                                { (CommonUtils.isKommunicateDashboard()) ?
                                <div>
                                    <div className="km-trial-days-left-popup-demo">
                                        {this.state.renderSections.popupMainBox}
                                    </div>
                                </div> : ""
                                }

                                <div className="km-trial-days-left-popup-buy-plan">
                                    { (CommonUtils.isKommunicateDashboard()) ?
                                        this.state.renderSections.haveQueries
                                        :
                                        <Fragment>
                                            <P>
                                                Ready to increase user engagement in your platform?
                                            </P>
                                            <Link to="/settings/billing" className="km-button km-button--primary km-demo-btn">See plans</Link>
                                        </Fragment>  
                                    }
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


const commonStyles = css`
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
`;
const trialDaysBannerEmployeeProfile = {
    name: "Devashish Mamgain",
    imageLink:"https://kommunicate.s3.ap-south-1.amazonaws.com/profile_pic/154591304350622823b4a764f9944ad7913ddb3e43cae1-reytum%40live.com.image.jpg",
    designation:"CEO"
}

const TRIAL_DAYS_BREAKDOWN = {
    NEW_PLAN:{
        END_PHASE_LENGTH:3,
        MID_PHASE_LENGTH:4,
        TOTAL_DAYS:14
    },
    OLD_PLAN:{
        END_PHASE_LENGTH:7,
        MID_PHASE_LENGTH:15,
        TOTAL_DAYS:30
    }
};

const TrialDaysCountdownBannerContainer = styled.div`
    background-color: ${props => tinycolor(props.color).setAlpha(0.18).toRgbString()};
    padding: 6px 10px;
    position: absolute;
    top: 35px;
    left: 10px;
`;
const TrialDaysCountdownBannerText = styled.div`
    font-size: 13px;
    ${commonStyles}
    letter-spacing: 0.1px;
    color: ${props => props.color};
`;
const Span = styled.span`
    font-size: 16px;
    ${commonStyles}
    letter-spacing: 1.2px;
    color: ${props => props.color};
    text-transform: uppercase;
    padding-bottom: 2px;
    border-bottom: 1.5px dashed;
    margin-bottom: 0px;
    cursor: pointer;
    -webkit-backface-visibility: hidden;
`;
const ChatNowButton = styled(Button)`
    margin-right: 15px;
`;
const P = styled.p`
    font-size: 20px;
    ${commonStyles}
    color: #848383;
    text-align: center;
`;
const HaveQueriesText = styled(P)`
    font-size: 18px;
    font-style: italic;
    line-height: 1.72;
    letter-spacing: 0.3px;
    color: #474747;
`;
const ButtonSubText = styled(P)`
    font-size: 13px;
    font-weight: 300;
    font-style: italic;
    line-height: 1.15;
    letter-spacing: 0.2px;
    color: #555252;
    max-width: 80%;
    margin: 12px auto 0;
`;

const QuotesContainer = styled.div`
    margin-bottom: 20px;
`;
const FirstQuote = styled(P)`
    display: inline-block;
    font-size: 20px;
    ${commonStyles}
    font-style: italic;
    line-height: 1.55;
    letter-spacing: 0.4px;
    color: #474747;
    margin-bottom: 4px;
    border-radius: 1px;
    background-color: #e6e6e6;
    margin: 0px auto 4px;
    padding: 0 10px;
`;
const MiddleQuote = styled(FirstQuote)``;
const LastQuote = styled(FirstQuote)``;

const CardPlaceholderImage = styled(TrialDaysLeftImage)`
    margin-top: 15px;
`;

const actionType = {
    trailDaysLeftBanner: "UPDATE_TRIAL_DAYS_LEFT_BANNER_STATUS",
    onboardingValueForTrialDaysLeft: "UPDATE_KM_TRIAL_DAYS_LEFT_ON_BOARDING_STATUS"
}

// export default KmDashboard;
const mapStateToProps = state => ({
    trialDaysLeftOnboardingValue: state.signUp.trialDaysLeftOnboardingValue,
    closeTrialDaysLeftBanner: state.signUp.closeTrialDaysLeftBanner
});
const mapDispatchToProps = dispatch => {
    return {
        updateStatus: (type, payload) => dispatch(SignUpActions.updateDetailsOnSignup(type, payload))
    }
  }

export default withTheme(connect(mapStateToProps, mapDispatchToProps) (TrialDaysLeft));
// withTheme is being is used for themeing Applozic and Kommunicate Dashboard.