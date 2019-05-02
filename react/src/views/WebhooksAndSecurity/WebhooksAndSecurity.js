import React, { Component, Fragment } from 'react';
import './WebhooksAndSecurity.css';
import CommonUtils from '../../utils/CommonUtils';
import Notification from '../../views/model/Notification';
import axios from 'axios';
import { getConfig } from '../../config/config';
import { editApplicationDetails } from '../../utils/kommunicateClient'
import Select from 'react-select';
import {SettingsHeader} from '../../../src/components/SettingsComponent/SettingsComponents';
import { FALLBACK_TYPE, NOTIFY_VIA } from '../../utils/Constant';
import Button from '../../components/Buttons/Button';
import LockBadge from '../../components/LockBadge/LockBadge';
import Banner from '../../components/Banner';
import { ROLE_TYPE } from '../../utils/Constant';
import {MoreInfoLink} from '../../components/MoreInfoLink/MoreInfoLink';
import { withTheme } from 'styled-components';
import AnalyticsTracking from '../../utils/AnalyticsTracking';

const links={
    applozic:{
        accessToken:'https://docs.applozic.com/docs/access-token-url',
        webhook:"https://docs.applozic.com/docs/webhooks"
    },
    kommunicate:{
        accessToken:"https://docs.kommunicate.io/docs/access-token-url-configuration",
        webhook:"https://docs.kommunicate.io/docs/webhooks-configuration"
    }
}
const InputFields = (props) => {
    return ( <div className="input-group">
        <input id={props.id} type="url" className="input" autoComplete="off" placeholder=" " value={props.value} onChange={props.onChange} required/>
        <label className="label-for-input email-label">{props.label}</label>
    </div> );
}


class WebhooksAndSecurity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newMessages: "",
            unreadMessages: "",
            undeliveredMessages: "",
            authenticationToken: "",
            authorizationUrl: "",
            selectUnredMsgTime: { value: 300, label: '5 minutes' },
            selectUndeliveredMsgTime: { value: 300, label: '5 minutes' },
            links: CommonUtils.isKommunicateDashboard() ? links.kommunicate : links.applozic,
            isTrialPlan: CommonUtils.isTrialPlan(),
            isStartupPlan: CommonUtils.isStartupPlan(),
            loggedInUserRoleType: CommonUtils.getUserSession().roleType
        }

        this.handleOnChange = this.handleOnChange.bind(this);
        this.submitWebhooksDetails = this.submitWebhooksDetails.bind(this);
    };

    componentDidMount = () => {
        let userSession = CommonUtils.getUserSession();
        let webhooks = userSession.application.applicationWebhookPxys;
        for(var i = 0 ; i < webhooks.length ; i++) {
            if(webhooks[i].type === FALLBACK_TYPE.UNDELIVERED_MESSAGE) {
                this.setState({
                    undeliveredMessages: webhooks[i].url || '',
                    selectUndeliveredMsgTime: {value: webhooks[i].fallbackTime, label: `${webhooks[i].fallbackTime / 60} minutes`}  || ''
                });
            } else if(webhooks[i].type === FALLBACK_TYPE.UNREAD_MESSAGE) {
                this.setState({
                    unreadMessages: webhooks[i].url || '',
                    selectUnredMsgTime: {value: webhooks[i].fallbackTime, label: `${webhooks[i].fallbackTime / 60} minutes`} || ''
                });
            } else if(webhooks[i].type === FALLBACK_TYPE.MESSAGE_FORWARDING) {
                this.setState({
                    newMessages: webhooks[i].url || ''
                });
            }
        }
        this.setState({
            authenticationToken: userSession.application.webhookAuthentication || '',
            authorizationUrl: userSession.application.accessTokenUrl || ''
        });
        
    }

    handleOnChange = (e) => {
        let id = e.target.id, 
            value = e.target.value;

        if (id === 'input-new-messages') {
            this.setState({ newMessages: value });
        } else if (id === 'input-unread-messages') {
            this.setState({ unreadMessages: value });
        } else if (id === 'input-undelivered-messages') {
            this.setState({ undeliveredMessages: value });
        } else if (id === 'input-authentication-token') {
            this.setState({ authenticationToken: value});
        } else if (id === 'input-authorization-url') {
            this.setState({ authorizationUrl: value});
        }
    } 

    createApplicationWebhookPxy = (url, fallbackTime, type, notifyVia) => {
        return {
            type: type,
            url: url,
            notifyVia: notifyVia,
            fallbackTime: fallbackTime
        };
    }

    submitWebhooksDetails = (securitySectionDetail) => {
        let userSession = CommonUtils.getUserSession();
        let applicationData = userSession.application;
        delete applicationData.adminUser;
        applicationData.applicationWebhookPxys = [];

        let authenticationToken = this.state.authenticationToken;
        let accessTokenUrl = this.state.authorizationUrl;

        if(!securitySectionDetail) {
            // New Messages Input Field Data
            applicationData.applicationWebhookPxys.push(this.createApplicationWebhookPxy(this.state.newMessages, 300, FALLBACK_TYPE.MESSAGE_FORWARDING, NOTIFY_VIA.MAIL));
                    
            // Unread Messages Input field Data
            applicationData.applicationWebhookPxys.push(this.createApplicationWebhookPxy(this.state.unreadMessages, this.state.selectUnredMsgTime.value, FALLBACK_TYPE.UNREAD_MESSAGE, NOTIFY_VIA.MAIL));

            // Undelivered Messages Input Field Data
            applicationData.applicationWebhookPxys.push(this.createApplicationWebhookPxy(this.state.undeliveredMessages, this.state.selectUndeliveredMsgTime.value, FALLBACK_TYPE.UNDELIVERED_MESSAGE, NOTIFY_VIA.MAIL));

            // Webhook Authentication Token URL and Security URL
            applicationData.webhookAuthentication = authenticationToken;
            applicationData.accessTokenUrl = accessTokenUrl;
        } else {
            // Access Token URL - Security Section
            applicationData.accessTokenUrl = accessTokenUrl;
            applicationData.webhookAuthentication = authenticationToken;
        }
        

        Promise.resolve(editApplicationDetails(applicationData)).then((response) => {
            if(response.data) {
                if(securitySectionDetail) {
                    userSession.application.accessTokenUrl = response.data.accessTokenUrl;
                    CommonUtils.setUserSession(userSession);
                    Notification.info("Security configuration updated successfully");
                    AnalyticsTracking.acEventTrigger('configuredSecurity')
                } else if(response.data !== 'error') {   
                    userSession.application.applicationWebhookPxys = response.data.applicationWebhookPxys;
                    userSession.application.webhookAuthentication = response.data.webhookAuthentication;
                    CommonUtils.setUserSession(userSession);                 
                    Notification.info("Webhooks configured successfully");
                    AnalyticsTracking.acEventTrigger('configuredWebhook')
                }else{
                    Notification.info("Webhooks configure error"); 
                }
            }
        }).catch((error) => {
            console.log(error);
            Notification.error("Something went wrong");
        });
    }


    renderSubmitButton = (value) => {
        if(this.state.loggedInUserRoleType == ROLE_TYPE.AGENT || (!this.state.isTrialPlan && this.state.isStartupPlan)) {
            return <Button disabled>Save changes</Button>;
        } else {
            if(this.state.isTrialPlan || !this.state.isStartupPlan) {
                return <Button onClick={() => {this.submitWebhooksDetails(value)}}>Save changes</Button>;
            }
        } 
    }

    render() {

        return(
            <div className="animated fadeIn webhooks-and-security-div">
                <div className="km-settings-banner">
                    <Banner appearance="warning" hidden={this.state.loggedInUserRoleType != ROLE_TYPE.AGENT} heading={"You need admin permissions to change Webhooks & Security settings."}/>
                </div>
                <div className="km-heading-wrapper">
					<SettingsHeader  />
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="webhooks-and-security-container">
                            <h3>Webhooks: { !this.state.isTrialPlan && this.state.isStartupPlan && <LockBadge className={"lock-with-text"} text={"Available in Growth Plan"} history={this.props.history} onClickGoTo={"/settings/billing"}/> } </h3>


                            <div className="webhooks-input-field-goup">
                                <p>Send a copy of all new messages to your server:</p>
                                <div className="input-dropdown-container">
                                    <div className="input-group">
                                        <InputFields id={"input-new-messages"} value={this.state.newMessages} onChange={this.handleOnChange} label={"Enter your API URL"} />
                                    </div>                            
                                </div>
                                <MoreInfoLink url={this.state.links.webhook} descriptionLabel={"For more information, see our "} Linklabel={"Docs"}  color={this.props.theme.primary}/>
                            </div>


                            <div className="webhooks-input-field-goup">
                                <p>Notify your server for unread incoming messages:</p>
                                <div className="input-dropdown-container">
                                    <div className="input-group">
                                        <InputFields id={"input-unread-messages"} value={this.state.unreadMessages} onChange={this.handleOnChange} label={"Enter your API URL"} />
                                    </div>
                                    <p>if message is unread for more than</p>
                                    <div className="react-select-container">
                                        <Select
                                            name="email-notifications-select"
                                            clearable={false}
                                            searchable={false}
                                            value={this.state.selectUnredMsgTime}
                                            onChange={selectUnredMsgTime => this.setState({ selectUnredMsgTime })}
                                            options={options}
                                        />     
                                    </div>                    
                                </div>
                                <MoreInfoLink url={this.state.links.webhook} descriptionLabel={"For more information, see our "} Linklabel={"Docs"}  color={this.props.theme.primary}/>
                            </div>


                            <div className="webhooks-input-field-goup">
                                <p>Notify your server for undelivered messages to user:</p>
                                <div className="input-dropdown-container">
                                    <div className="input-group">
                                        <InputFields id={"input-undelivered-messages"} value={this.state.undeliveredMessages} onChange={this.handleOnChange} label={"Enter your API URL"} />
                                    </div>
                                    <p>if message is undelivered for more than</p>
                                    <div className="react-select-container">
                                        <Select
                                            name="email-notifications-select"
                                            clearable={false}
                                            searchable={false}
                                            value={this.state.selectUndeliveredMsgTime}
                                            onChange={selectUndeliveredMsgTime => this.setState({ selectUndeliveredMsgTime })}
                                            options={options}
                                        />
                                    </div>                                
                                </div>
                                <MoreInfoLink url={this.state.links.accessToken} descriptionLabel={"For more information, see our "} Linklabel={"Docs"} color={this.props.theme.primary}/>
                            </div>


                            <div className="webhooks-input-field-goup">
                                <p>Add an authentication layer for the API calls going from {CommonUtils.getProductName()} <br/> to your server:</p>
                                <div className="input-dropdown-container">
                                    <div className="input-group">
                                        <InputFields id={"input-authentication-token"} value={this.state.authenticationToken} onChange={this.handleOnChange} label={"Enter your authentication token"} />
                                    </div>                                
                                </div>
                                <MoreInfoLink url={this.state.links.accessToken} descriptionLabel={"For more information, see our "} Linklabel={"Docs"}  color={this.props.theme.primary}/>
                            </div>



                            <div className="webhooks-action-buttons-container">
                            {
                                this.renderSubmitButton(false)
                            }
                                <Button secondary className="n-vis">Cancel</Button>
                            </div>

                            <hr/>
                            <h3>Security: { !this.state.isTrialPlan && this.state.isStartupPlan && <LockBadge className={"lock-with-text"} text={"Available in Growth Plan"} history={this.props.history} onClickGoTo={"/settings/billing"}/> } </h3>

                            <div className="webhooks-input-field-goup">
                                <p>URL for authorising users from your end:</p>
                                <div className="input-dropdown-container">
                                    <div className="input-group">
                                        <InputFields id={"input-authorization-url"} value={this.state.authorizationUrl} onChange={this.handleOnChange} label={"Enter your API URL"} />
                                    </div>                                
                                </div>
                                <MoreInfoLink url={this.state.links.accessToken} descriptionLabel={"For more information, see our "} Linklabel={"Docs"}  color={this.props.theme.primary}/>
                            </div>

                            <div className="security-action-buttons-container">
                            {
                                this.renderSubmitButton(true)
                            }
                                <Button secondary className="n-vis">Cancel</Button>
                            </div>

                        </div>
                    </div>
                </div> 
            </div>
        );
    }
}

const options = [
    { value: 300, label: '5 minutes' },
    { value: 600, label: '10 minutes' },
    { value: 900, label: '15 minutes' },
    { value: 1200, label: '20 minutes' },
    { value: 1800, label: '30 minutes' },
    { value: 3600, label: '60 minutes' }
];

export default withTheme(WebhooksAndSecurity);