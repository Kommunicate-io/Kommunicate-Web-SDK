import React, { Component } from "react";
import { getConfig } from "../../.../../../config/config.js";
import MultiEmail from '../../MultiEmail/';
import Accordion from './Accordion';
import {getJsCode,getJsInstructions} from '../../../utils/customerSetUp';
import CommonUtils from "../../../utils/CommonUtils";
import Notification from '../../model/Notification';


const pluginBaseUrl = getConfig().kommunicateApi.pluginUrl;
class Integration extends Component {
  static defaultProps = {
   cardSize:10
  }
  constructor(props, defaultProps) {
    super(props, defaultProps);
    this.state = {
      copySuccess: "Copy",
      cardSize:10,
      displayInstructions: true
    };

    this.script = getJsCode();
    this.data={ title: "Some more instructions", 
    subtitle:"Parameters used",
    content:`<p>Default parameters are pre populated. You can change them as you need.<p>
    Parameters: <br>
    <ul>
      <li><strong>appId</strong> - your application Id.</li>
      <li><strong>agentId</strong> - Support agent Id(registered in Kommunicate) who will reply to the support queries.</li>
      <li><strong>groupName</strong> - Conversation Title.</li>
      <li><strong>isAnonymousChat</strong> - allow your users to chat in Anonymous mode.</li>
      <li><strong>userId</strong> - Unique Id for user.</li>
      <li><strong>userName</strong> - Display name of the user. Agents will know users by Display name</li> 
      <li><strong>email</strong> - allow your users to register email id (optional).</li>
    </ul>`};
  }

  componentDidMount(){
    // document.getElementById('instruction-display-area').innerHTML=getJsInstructions();
  }
  
  copyToClipboard = e => {
    e.preventDefault();
    this.textArea.select();
    document.execCommand("copy");
    e.target.focus();
    this.setState({ copySuccess: "Copy" });
    Notification.info("Code copied successfully!");
  };

  hideInstructions = e => {
    e.preventDefault();
    this.setState({displayInstructions: true});
  };
  showInstructions = e => {
    e.preventDefault();
    this.setState({displayInstructions: false});
  };

  render() {
    return (
      <div className="animated fadeIn">
        <div className="row">
          <div className={"col-md-"+this.props.cardSize}>
            <div className="card">
              <div className="intgration-card-header">
                <h5>
                Follow the steps below to install Kommunicate Chat in your website
                </h5>
              </div>
              <div className="card-main">                  
                  <div className="outer-box col-md-10 integration-font">
                    <p style={{fontSize:"16px", color:"#878585", letterSpacing:"normal"}}>Copy the code from below and paste it just above the <b>&lt;/head&gt;</b> or <b> &lt;/body&gt;</b> tags tags on every page you want the chat widget to appear.</p>
                    <div>
                          <textarea
                            className="script-text-area"
                            ref={textarea => (this.textArea = textarea)}
                            rows="12"
                            value={this.script}
                            readOnly
                          />
                    </div>
                  <div className="copy-code-button-div">
                  {document.queryCommandSupported("copy") && (
                          <button
                            type="button"
                            className="copy-code-btn km-button km-button--primary"
                            onClick={this.copyToClipboard}
                          >
                            {this.state.copySuccess}
                          </button>
                      )}
                  </div>
                  <div className="instructions-link-div">
                      <a href="#/" onClick={this.showInstructions}>How to <span><strong>Identify your users</strong></span> or allow them to <span><strong>Chat anonymously?</strong></span></a>
                      <div id="show-instructions" className="show-instructions animated fadeIn" hidden={this.state.displayInstructions}>
                        <p><strong>Default parameters are pre populated. You can change them as you need.</strong></p>
                        <p>Parameters:</p>
                        <ul>
                          <li><strong>appId</strong> - your application Id.</li>
                          <li><strong>isAnonymousChat</strong> - allow your users to chat in Anonymous mode.</li>
                        </ul>
                        <div style={{marginTop:"25px"}}>
                          <button
                            type="button"
                            className="km-button km-button--secondary"
                            onClick={this.hideInstructions}
                          >Close</button>
                        </div>
                      </div>
                  </div>
                  </div>
                  <div id="outer">
                    {/*<div className="inner">
                      {document.queryCommandSupported("copy") && (
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={this.copyToClipboard}
                          >
                            {this.state.copySuccess}
                          </button>
                      )}
                    </div>*/}
        
                      <MultiEmail template="SEND_KOMMUNICATE_SCRIPT" />
                     
                    {/* <Accordion data={this.data}/> */}
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
