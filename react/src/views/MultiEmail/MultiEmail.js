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
        };
    }

    showEmailInput = e => {
        e.preventDefault();
        this.setState({ emailInstructions: true });
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
            console.log(this.state.emailAddress);
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
        // console.log(this.state.multipleEmailAddress)
        // console.log(this.state.emailAddress)
    };

    removeEmail = removeEmail => {
        // console.log(this.state.multipleEmailAddress);
        const filteredEmails = this.state.multipleEmailAddress.filter(
            email => email !== removeEmail
        );
        this.setState({ multipleEmailAddress: filteredEmails });
        // console.log(this.state.multipleEmailAddress);
    };

    render() {
        return (
            <div>
                <div className="form-group">
                    <button
                        className="btn btn-sm btn-primary px-4"
                        onClick={this.showEmailInput}
                    >
                        {" "}
                        Email instructions to the team{" "}
                    </button>
                </div>
                <div className={
                    this.state.emailInstructions === true
                        ? "form-group row"
                        : "n-vis"
                }
                    style={{ marginLeft: "0" }}>
                    <div className="form-group col-md-5 multiple-email-container">
                        {this.state.multipleEmailAddress.map((email, i) => (
                            <div className="single-email-container" key={i}>
                                <span>{email}</span>
                                <span
                                    className="remove-email"
                                    onClick={() => {
                                        this.removeEmail(email);
                                    }}
                                >
                                    | X
                              </span>
                            </div>
                        ))}
                        <input
                            className="input-email"
                            value={this.state.emailAddress}
                            onKeyDown={this.checkForSpace}
                            onChange={this.multipleEmailHandler}
                            placeholder="Enter email here"
                        />
                    </div>
                    <div className="col-md-7">
                        <button
                            className="btn btn-sm btn-primary px-4 m-t-1px"
                            onClick={this.sendMail}
                        >
                            {" "}
                            Send{" "}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}


export default MultiEmail;
