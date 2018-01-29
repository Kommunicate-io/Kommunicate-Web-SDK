import React, { Component } from "react";
import { getConfig } from "../../.../../../config/config.js";
import MultiEmail from '../../MultiEmail/';
import Accordion from './Accordion';
import {getJsCode,getJsInstructions} from '../../../utils/customerSetUp';
import CommonUtils from "../../../utils/CommonUtils";


const pluginBaseUrl = getConfig().kommunicateApi.pluginUrl;
class Integration extends Component {
  static defaultProps = {
   cardSize:10
  }
  constructor(props, defaultProps) {
    super(props, defaultProps);
    this.state = {
      copySuccess: "Copy",
      cardSize:10
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
    document.getElementById('instruction-display-area').innerHTML=getJsInstructions();
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
          <div className={"col-md-"+this.props.cardSize}>
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
                    <p>You will be required to paste the code within either of these tags.</p>
                    <div id="instruction-display-area"/>
                    </div>
                  
                  <div>
                    <h6>2. Copy the code from below and paste it as explained in point 1</h6>
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
                            className="btn btn-primary btn-primary-custom"
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
