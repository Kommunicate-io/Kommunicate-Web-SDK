import React, { Component } from "react";
import { getConfig } from "../../.../../../config/config.js";
import isEmail from "validator/lib/isEmail";

import { getJsCode, getJsInstructions } from "../../../utils/customerSetUp";
import { notifyThatEmailIsSent } from "../../../utils/kommunicateClient";
import Notification from "../../model/Notification";

import "./multiple-email.css";

const pluginBaseUrl = getConfig().kommunicateApi.pluginUrl;
class Integration extends Component {
  constructor(props) {
    super(props);
    this.applicationKey = localStorage.getItem("applicationId");
    this.state = {
      copySuccess: "Copy To Clipboard",
      emailInstructions: false,
      multipleEmailAddress: [],
      emailAddress: ""
    };
    this.script = getJsCode();
  }

  copyToClipboard = e => {
    e.preventDefault();
    this.textArea.select();
    document.execCommand("copy");
    e.target.focus();
    this.setState({ copySuccess: "Copied!" });
  };

  showEmailInput = e => {
    e.preventDefault();
    this.setState({ emailInstructions: true });
  };

  sendMail = e => {
    const _this = this;
    e.preventDefault();
    if (this.state.multipleEmailAddress.length >= 1) {
      for (let i = 0; i < this.state.multipleEmailAddress.length; i++) {
        if (!isEmail(this.state.multipleEmailAddress[i])) {
          Notification.warning(
            this.state.multipleEmailAddress[i] + " is an invalid Email"
          );
          return;
        }
      }
      notifyThatEmailIsSent({
        to: this.state.multipleEmailAddress,
        templateName: "SEND_KOMMUNICATE_SCRIPT"
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
          templateName: "SEND_KOMMUNICATE_SCRIPT"
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

  checkForSpace = e => {
    if (
      (e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 13) &&
      this.state.emailAddress.length > 0
    ) {
      this.setState({
        multipleEmailAddress: this.state.multipleEmailAddress.concat([
          this.state.emailAddress
        ])
      });
      this.setState({ emailAddress: "" });
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
      <div className="animated fadeIn">
        <div className="row">
          <div className="col-sm-12 col-md-12">
            <div className="card">
              <div className="row">
                <h4 className="instruction-heading">
                  Add Chat in your product within a minute!
                </h4>
              </div>
              <div className="card-header">
                <div className="card-block">
                  <div>
                    <form>
                      <div className="row">
                        <div className="form-group col-md-5">
                          <textarea
                            className="form-group instruction-text-area"
                            rows="16"
                            value={getJsInstructions()}
                            readOnly
                          />
                        </div>
                        <div className="form-group col-md-7">
                          <textarea
                            className="form-group script-text-area"
                            ref={textarea => (this.textArea = textarea)}
                            rows="16"
                            value={this.script}
                            readOnly
                          />
                        </div>
                      </div>
                      {document.queryCommandSupported("copy") && (
                        <div className="form-group">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={this.copyToClipboard}
                          >
                            {this.state.copySuccess}
                          </button>
                        </div>
                      )}
                      <div className="form-group">
                        <button
                          className="btn btn-sm btn-primary px-4"
                          onClick={this.showEmailInput}
                        >
                          {" "}
                          Email instructions to the team{" "}
                        </button>
                      </div>
                      <div
                        className={
                          this.state.emailInstructions === true
                            ? "form-group row"
                            : "n-vis"
                        }
                        style={{ marginLeft: "0" }}
                      >
                        {/*<div style={{"backgroundColor":"#FFF","border":"0px solid #000","paddingLeft": "0"}} className="form-group col-md-5">
                      {this.state.multipleEmailAddress.map((email, i) => (
                        <div key={i} style={{"display":"inline-block", "border":"2px solid #C0C0C0", "backgroundColor":"#20a8d8", "color":"#FFF", "margin": "5px", "marginTop":"5px", "borderRadius":"15px", "padding":"5px", }}>
                          <span>{email}</span>
                          <span style={{"marginLeft": "3px", "cursor": "pointer"}} onClick={() => {this.removeEmail(email)}}>| X</span>
                        </div>
                      ))}
                      <input style={{"border":"0","width":"232px","margin":"5px"}} value={this.state.emailAddress} onKeyDown={this.checkForSpace} onChange={this.multipleEmailHandler}  placeholder="Enter email here"/>
                    </div>
                    */}
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
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Integration;
