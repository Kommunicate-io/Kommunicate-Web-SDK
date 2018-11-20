import React, { Component } from 'react';
import './WebhooksAndSecurity.css';
import CommonUtils from '../../utils/CommonUtils';
import Notification from '../../views/model/Notification';
import axios from 'axios';
import { getConfig } from '../../config/config';
import { editApplicationDetails } from '../../utils/kommunicateClient'
import Select from 'react-select';
import {SettingsHeader} from '../../../src/components/SettingsComponent/SettingsComponents';
import { FALLBACK_TYPE, NOTIFY_VIA } from '../../utils/Constant';


const InputFields = (props) => {
    return ( <div className="input-group">
        <input id={props.id} type="url" className="input" autoComplete="off" placeholder=" " value={props.value} onChange={props.onChange} required/>
        <label className="label-for-input email-label">{props.label}</label>
    </div> );
}
const MoreInfoLink = (props) => {
    return ( <p>{props.descriptionLabel}  
        <a href={props.url} target="_blank"> {props.Linklabel} 
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">
                <path fill="none" fillRule="evenodd" stroke="#4831D9" d="M8.111 5.45v2.839A.711.711 0 0 1 7.4 9H1.711A.711.711 0 0 1 1 8.289V2.6c0-.393.318-.711.711-.711H4.58M5.889 1h2.667C8.8 1 9 1.199 9 1.444v2.667m-.222-2.889L4.503 5.497" />
            </svg>
        </a> 
    </p> );
}

export default class WebhooksAndSecurity extends Component {

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
        }

        this.handleOnChange = this.handleOnChange.bind(this);
        this.submitWebhooksDetails = this.submitWebhooksDetails.bind(this);
    };

    componentWillMount = () => {
        let userSession = CommonUtils.getUserSession();
        let webhooks = userSession.application.applicationWebhookPxys;
        for(var i = 0 ; i < webhooks.length ; i++) {
            if(webhooks[i].type === 1) {
                this.setState({
                    undeliveredMessages: webhooks[i].url || '',
                    selectUndeliveredMsgTime: {value: webhooks[i].fallbackTime, label: `${webhooks[i].fallbackTime / 60} minutes`}  || ''
                });
            } else if(webhooks[i].type === 2) {
                this.setState({
                    unreadMessages: webhooks[i].url || '',
                    selectUnredMsgTime: {value: webhooks[i].fallbackTime, label: `${webhooks[i].fallbackTime / 60} minutes`} || ''
                });
            } else if(webhooks[i].type === 3) {
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
        let applicationData = userSession;
        delete applicationData.application.adminUser;
        applicationData.applicationWebhookPxys = [];

        let authenticationToken = this.state.authenticationToken;
        let accessTokenUrl = this.state.authorizationUrl;

        if(!securitySectionDetail) {
            // New Messages Input Field Data
            applicationData.applicationWebhookPxys.push(this.createApplicationWebhookPxy(this.state.newMessages, 300, FALLBACK_TYPE.UNANSWERED_MESSAGE, NOTIFY_VIA.MAIL));
                    
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
                } else {   
                    userSession.application.applicationWebhookPxys = response.data.applicationWebhookPxys;
                    userSession.application.webhookAuthentication = response.data.webhookAuthentication;
                    CommonUtils.setUserSession(userSession);                 
                    Notification.info("Webhooks configured successfully");
                }
            }
            console.log(response)
        }).catch((error) => {
            console.log(error);
            Notification.error("Something went wrong");
        })
        console.log(applicationData, typeof applicationData);
    }

    render() {

        return(
            <div className="animated fadeIn webhooks-and-security-div">
                <div className="km-heading-wrapper">
					<SettingsHeader  />
                </div>
                <div className="row">
                    <div className=" col-md-10 col-sm-12">
                        <div className="webhooks-and-security-container">
                            <h3>Webhooks:</h3>


                            <div className="webhooks-input-field-goup">
                                <p>Send a copy of all new messages to your server:</p>
                                <div className="input-dropdown-container">
                                    <div className="input-group">
                                        <InputFields id={"input-new-messages"} value={this.state.newMessages} onChange={this.handleOnChange} label={"Enter your API URL"} />
                                    </div>                            
                                </div>
                                <MoreInfoLink url={"https://docs.applozic.com/docs/webhooks"} descriptionLabel={"For more information, see our "} Linklabel={"Docs"} />
                            </div>


                            <div className="webhooks-input-field-goup">
                                <p>Notify your server for unread incoming messages:</p>
                                <div className="input-dropdown-container">
                                    <div className="input-group">
                                        <InputFields id={"input-unread-messages"} value={this.state.unreadMessages} onChange={this.handleOnChange} label={"Enter your API URL"} />
                                    </div>
                                    <p>if message is unread for more than</p>
                                    <Select
                                        name="email-notifications-select"
                                        clearable={false}
                                        searchable={false}
                                        value={this.state.selectUnredMsgTime}
                                        onChange={selectUnredMsgTime => this.setState({ selectUnredMsgTime }, () => {
                                            console.log(this.state.selectUnredMsgTime)
                                        })}
                                        options={options}
                                    />                                 
                                </div>
                                <MoreInfoLink url={"https://docs.applozic.com/docs/webhooks"} descriptionLabel={"For more information, see our "} Linklabel={"Docs"} />
                            </div>


                            <div className="webhooks-input-field-goup">
                                <p>Notify your server for undelivered messages to user:</p>
                                <div className="input-dropdown-container">
                                    <div className="input-group">
                                        <InputFields id={"input-undelivered-messages"} value={this.state.undeliveredMessages} onChange={this.handleOnChange} label={"Enter your API URL"} />
                                    </div>
                                    <p>if message is undelivered for more than</p>
                                    <Select
                                        name="email-notifications-select"
                                        clearable={false}
                                        searchable={false}
                                        value={this.state.selectUndeliveredMsgTime}
                                        onChange={selectUndeliveredMsgTime => this.setState({ selectUndeliveredMsgTime }, () => {
                                            console.log(this.state.selectUndeliveredMsgTime)
                                        })}
                                        options={options}
                                    />                                 
                                </div>
                                <MoreInfoLink url={"https://docs.applozic.com/docs/webhooks"} descriptionLabel={"For more information, see our "} Linklabel={"Docs"} />
                            </div>


                            <div className="webhooks-input-field-goup">
                                <p>Add an authentication layer for the API calls going from Kommunicate <br/> to your server:</p>
                                <div className="input-dropdown-container">
                                    <div className="input-group">
                                        <InputFields id={"input-authentication-token"} value={this.state.authenticationToken} onChange={this.handleOnChange} label={"Enter your authentication token"} />
                                    </div>                                
                                </div>
                                <MoreInfoLink url={"https://docs.applozic.com/docs/webhooks"} descriptionLabel={"For more information, see our "} Linklabel={"Docs"} />
                            </div>



                            <div className="webhooks-action-buttons-container">
                                <button className="km-button km-button--primary" onClick={() => {this.submitWebhooksDetails(false)}}>Save changes</button>
                                <button className="km-button km-button--secondary n-vis">Cancel</button>
                            </div>

                            <hr/>
                            <h3>Security:</h3>

                            <div className="webhooks-input-field-goup">
                                <p>URL for authorising users from your end:</p>
                                <div className="input-dropdown-container">
                                    <div className="input-group">
                                        <InputFields id={"input-authorization-url"} value={this.state.authorizationUrl} onChange={this.handleOnChange} label={"Enter your API URL"} />
                                    </div>                                
                                </div>
                                <MoreInfoLink url={"https://docs.applozic.com/docs/webhooks"} descriptionLabel={"For more information, see our "} Linklabel={"Docs"} />
                            </div>

                            <div className="security-action-buttons-container">
                                <button className="km-button km-button--primary" onClick={() => {this.submitWebhooksDetails(true)}}>Save changes</button>
                                <button className="km-button km-button--secondary n-vis">Cancel</button>
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