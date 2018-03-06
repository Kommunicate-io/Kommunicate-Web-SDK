import React, { Component } from 'react';
import axios from 'axios';
import isEmail from "validator/lib/isEmail";
import ValidationUtils from '../../utils/validationUtils'
import { notifyThatEmailIsSent } from '../../utils/kommunicateClient';
import Notification from '../model/Notification';

import "./multiple-email.css";

class MultiEmail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            emailInstructions: false,
            multipleEmailAddress: [],
            emailAddress: "",
            template: this.props.template,
            instructionButtonShow:true
        
        };
    }

    showEmailInput = e => {
        e.preventDefault();
        this.setState({ emailInstructions: true,
            instructionButtonShow:false});
    };

    sendMail = e => {
        const _this = this;
        e.preventDefault();
        let multipleEmailAddress = this.state.multipleEmailAddress;
        if(isEmail(this.state.emailAddress)) {
            multipleEmailAddress = multipleEmailAddress.concat([this.state.emailAddress]);
            this.setState({ multipleEmailAddress: this.state.multipleEmailAddress.concat([this.state.emailAddress]) })
            this.setState({ emailAddress: '' });
        }
        if (multipleEmailAddress.length >= 1) {
            for (let i = 0; i < multipleEmailAddress.length; i++) {
                if (!isEmail(multipleEmailAddress[i])) {
                    Notification.warning(
                        multipleEmailAddress[i] + " is an invalid Email"
                    );
                    return;
                }
            }
            notifyThatEmailIsSent({
                to: multipleEmailAddress,
                templateName: this.state.template
            }).then(data => {
                _this.setState({ multipleEmailAddress: [], emailAddress: "" });
            });
        } else {
            if (!isEmail(this.state.emailAddress)) {
                Notification.warning(this.state.emailAddress + " is an invalid Email");
                return;
            } else {
                notifyThatEmailIsSent({
                    to: this.state.emailAddress,
                    templateName: this.state.template
                }).then(data => {
                    _this.setState({ multipleEmailAddress: [], emailAddress: "" });
                });
            }
        }
    };

    multipleEmailHandler = e => {
        if (e.target.value.includes(" ")) {
            this.setState({ emailAddress: "" });
        } else {
            this.setState({ emailAddress: e.target.value });
        }
    };

    checkForSpace = (e) => {
        if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 13) && ValidationUtils.isValidEmail(this.state.emailAddress)) {
            this.setState({ multipleEmailAddress: this.state.multipleEmailAddress.concat([this.state.emailAddress]) })
            this.setState({ emailAddress: '' });
        }
    };

    removeEmail = removeEmail => {
        const filteredEmails = this.state.multipleEmailAddress.filter(
            email => email !== removeEmail
        );
        this.setState({ multipleEmailAddress: filteredEmails });
    };

    render() {
        const currentPath = window.location.pathname;
        return (
            <div>
                {<div className="form-group multi-email-install-link">
                {((currentPath.includes('installation')) || (currentPath.includes('setUpPage'))) ?  <button
                        className={this.state.instructionButtonShow === true ?"km-button km-button--primary":"n-vis"}
                        onClick={this.showEmailInput}
                    >
                        {" "}
                        Send instructions to team{" "}
                    </button> : <a href="#/" className={this.state.instructionButtonShow === true ?"multiemail-button-link":"n-vis"}
                        onClick={this.showEmailInput}>Send instructions to team </a>}
                    
                    
                </div>}
                <div className={
                    ((this.state.emailInstructions === true) && (currentPath.includes('install')))
                        ? "form-group m-top-10 row" : ((this.state.emailInstructions === true) && (currentPath.includes('setUpPage')))
                        ? "form-group flex-center row" : "n-vis"
                }
                    style={{ marginLeft: "0" }}>
                    <div className="form-group group multiple-email-container">
                    <input
                            className="input"
                            value={this.state.emailAddress}
                            onKeyDown={this.checkForSpace}
                            onChange={this.multipleEmailHandler}
                            placeholder="Enter email here"
                        />
                        {this.state.multipleEmailAddress.map((email, i) => (
                            <div className="single-email-container" key={i}>
                                <span>{email}</span>
                                <span
                                    className="remove-email"
                                    onClick={() => {
                                        this.removeEmail(email);
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" height="16" viewBox="0 0 24 24" width="16">
                                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                        <path d="M0 0h24v24H0z" fill="none"/>
                                    </svg>
                              </span>
                            </div>
                        ))}
                        <div className="tip-enter-m tip-text-style"><p>Tip: You can enter multiple email IDs, separated by Space </p></div>
                    </div> 
                    <div>
                        <button
                            className="btn btn-primary px-5 btn-primary-custom br-custom"
                            onClick={this.sendMail}
                        >
                            {" "}
                            Send{" "}
                        </button>
                    </div>
                    {/* <div className="tip-enter-m tip-text-style"><p>Tip: You can enter multiple email IDs, separated by Space </p></div> */}
                </div>
            </div>
        );
    }
}


export default MultiEmail;
