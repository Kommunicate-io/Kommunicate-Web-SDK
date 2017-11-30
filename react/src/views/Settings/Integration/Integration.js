import React, { Component } from "react";
import { getConfig } from "../../.../../../config/config.js";
import MultiEmail from '../../MultiEmail/';
import Accordion from './Accordion';
import {getJsCode,getJsInstructions} from '../../../utils/customerSetUp';


const pluginBaseUrl = getConfig().kommunicateApi.pluginUrl;
class Integration extends Component {
  constructor(props) {
    super(props);
    this.applicationKey = localStorage.getItem("applicationId");
    this.state = {
      copySuccess: "Copy Code to Clipboard "
    };

    this.script = getJsCode();
    this.data={ title: "Some more instructions", 
    content:`<p>Default parameters are pre populated. You can change them as you need.<p><br>
    Parameters: <br>
        <b>appId -</b> your application Id.<br>
        <b>isAnonymousChat -</b> allow your users to chat in Anonymous mode<br>
        <b>groupName -</b> Conversation Title<br> 
        <b>agentId -<b> Support agent Id(registered in Kommunicate) who will reply to the support queries<br>
        <b>agentName -</b> Display name for agent(agentId is default display name)`};
  }

  copyToClipboard = e => {
    e.preventDefault();
    this.textArea.select();
    document.execCommand("copy");
    e.target.focus();
    this.setState({ copySuccess: "Copied!" });
  };

  render() {
    return (
      <div className="animated fadeIn">
        <div className="row">
          <div className="col-md-10">
            <div className="card">
              <div className="intgration-card-header">
                <h5>
                Follow the steps below to add Kommunicate Chat in your product
                </h5>
              </div>
              <div className="card-main">
                  <div>
                    <h6>1. Locate the header or body tags in your code</h6>
                  </div>
                  <div className="outer-box col-md-10 integration-font"> 
                    <p>Find the <b>&lt;head &gt; &lt;/head&gt;</b> or the <b>&lt;body&gt; &lt;/body&gt;</b> tags in your code.</p>
                    <p>You will be requiredto paste the code within either of these tags.</p>
                    <div>
                    <textarea
                            className="script-text-area"
                            rows="7"
                            value={getJsInstructions()}
                            readOnly
                     />
	                  </div>
                  </div>
                  
                  <div>
                    <h6>2.Copy the code from below and paste it as explained in point 1</h6>
                  </div>
                  <div className="outer-box col-md-10 integration-font">
                    <p> Paste the Kommunicate code just above the <b>&lt;/head&gt;</b> or <b> &lt;/body&gt;</b> tags.</p>
                    <div>
                          <textarea
                            className="script-text-area"
                            ref={textarea => (this.textArea = textarea)}
                            rows="16"
                            value={this.script}
                            readOnly
                          />
                    </div>
                  <div>
                  {document.queryCommandSupported("copy") && (
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={this.copyToClipboard}
                          >
                            {this.state.copySuccess}
                          </button>
                      )}
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
                     
                    <Accordion data={this.data}/>
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
