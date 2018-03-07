import React, { Component } from "react";
import { getConfig } from "../../.../../../config/config.js";
import MultiEmail from '../../MultiEmail/';
import Accordion from './Accordion';
import { getJsCode, getJsInstructions } from '../../../utils/customerSetUp';
import CommonUtils from "../../../utils/CommonUtils";
import Notification from '../../model/Notification';

const multiEmailLink = {
    backgroundColor: 'transparent',

}
const pluginBaseUrl = getConfig().kommunicateApi.pluginUrl;
class Integration extends Component {
  static defaultProps = {
    cardSize: 10
  }
  constructor(props, defaultProps) {
    super(props, defaultProps);
    this.state = {
      copySuccess: "Copy code",
      cardSize: 10,
      displayJSInstructions: true,
      displayAndroidInstructions: true,
      displayiOSInstructions: true
    };

    this.script = getJsCode()[0];
    this.yourApplicationId = getJsCode()[1];
    this.data = {
      title: "Some more instructions",
      subtitle: "Parameters used",
      content: `<p>Default parameters are pre populated. You can change them as you need.<p>
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

  

  componentDidMount() {
    // document.getElementById('instruction-display-area').innerHTML=getJsInstructions();
  }

  copyToClipboard = e => {
    e.preventDefault();
    this.textArea.select();
    document.execCommand("copy");
    e.target.focus();
    this.setState({ copySuccess: "Copy code" });
    Notification.info("Code copied successfully!");
  };

  hideJSInstructions = e => {
    e.preventDefault();
    this.setState({ displayJSInstructions: true });
  };
  hideAndroidInstructions = e => {
    e.preventDefault();
    this.setState({ displayAndroidInstructions: true });
  };
  hideiOSInstructions = e => {
    e.preventDefault();
    this.setState({ displayiOSInstructions: true });
  };
  showJSInstructions = e => {
    this.setState({ displayJSInstructions: false, displayAndroidInstructions: true, displayiOSInstructions: true });
  };
  showAndroidInstructions = e => {
    this.setState({ displayJSInstructions: true, displayAndroidInstructions: false, displayiOSInstructions: true });
  };
  showiOSInstructions = e => {
    this.setState({ displayJSInstructions: true, displayAndroidInstructions: true, displayiOSInstructions: false });
  };

  render() {
    const currentPath = window.location.pathname;
    return (
      <div className="animated fadeIn">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-block">
                <div className="intgration-card-header">
                  <h5>
                    Follow the steps below to install Kommunicate Chat in your product
                  </h5>
                  {
                    ((currentPath.includes('installation')) || (currentPath.includes('setUpPage')) ) ? " " : <h3>Want help from your team members? <span className="multi-email-span-container"><MultiEmail template="SEND_KOMMUNICATE_SCRIPT" />
                    </span> </h3>
                  }
                </div>
                <div className="app-id-container">
                  <div className="app-id-div">
                    <span className="app-id-sub-text">
                      Your App ID:
                    </span>
                    <span className="app-id-main-text">
                      {this.yourApplicationId}
                    </span>
                  </div>
                </div>

                <div className="code-container col-md-10">
                  <a href="#javascript-code-div" className="outer-box col-md-12 integration-font javascript-card" onClick={this.showJSInstructions}>
                    <div className="card-heading">
                      <svg xmlns="http://www.w3.org/2000/svg" width="522.468" height="522.469" viewBox="0 0 522.468 522.469">
                        <path fill="#5C5AA7" d="M325.762 70.513l-17.706-4.854c-2.279-.76-4.524-.521-6.707.715-2.19 1.237-3.669 3.094-4.429 5.568L190.426 440.53c-.76 2.475-.522 4.809.715 6.995 1.237 2.19 3.09 3.665 5.568 4.425l17.701 4.856c2.284.766 4.521.526 6.71-.712 2.19-1.243 3.666-3.094 4.425-5.564L332.042 81.936c.759-2.474.523-4.808-.716-6.999-1.238-2.19-3.089-3.665-5.564-4.424zm-159.595 71.952c0-2.474-.953-4.665-2.856-6.567l-14.277-14.276c-1.903-1.903-4.093-2.857-6.567-2.857s-4.665.955-6.567 2.857L2.856 254.666C.95 256.569 0 258.759 0 261.233s.953 4.664 2.856 6.566l133.043 133.044c1.902 1.906 4.089 2.854 6.567 2.854s4.665-.951 6.567-2.854l14.277-14.268c1.903-1.902 2.856-4.093 2.856-6.57 0-2.471-.953-4.661-2.856-6.563L51.107 261.233l112.204-112.201c1.906-1.902 2.856-4.093 2.856-6.567zm353.447 112.198L386.567 121.619c-1.902-1.902-4.093-2.857-6.563-2.857-2.478 0-4.661.955-6.57 2.857l-14.271 14.275c-1.902 1.903-2.851 4.09-2.851 6.567s.948 4.665 2.851 6.567l112.206 112.204-112.206 112.21c-1.902 1.902-2.851 4.093-2.851 6.563 0 2.478.948 4.668 2.851 6.57l14.271 14.268c1.909 1.906 4.093 2.854 6.57 2.854 2.471 0 4.661-.951 6.563-2.854L519.614 267.8c1.903-1.902 2.854-4.096 2.854-6.57 0-2.475-.951-4.665-2.854-6.567z" />
                      </svg>
                      <span>Javascript (for web)</span>
                    </div>
                  </a>
                  <div id="javascript-code-div" className="code-div col-md-12 animated fadeIn" hidden={this.state.displayJSInstructions}>

                    <p style={{ fontSize: "16px", color: "#878585", letterSpacing: "normal", marginTop: "20px" }}>Copy the Javascript code from below and paste it just above the <b>&lt;/head&gt;</b> tags on every page you want the chat widget to appear </p>
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
                      <span className="identify-users">Want to identify your users? <a href="https://docs.kommunicate.io/docs/web-installation.html" target="_blank">Read more here</a></span>
                    </div>
                    <div style={{ marginTop: "25px" }}>
                      <button
                        type="button"
                        className="km-button km-button--secondary"
                        onClick={this.hideJSInstructions}
                      >Close</button>
                    </div>
                  </div>
                </div>

                <div className="code-container col-md-10">
                  <a href="#android-code-div" id="android-div" className="outer-box col-md-12 integration-font javascript-card" onClick={this.showAndroidInstructions} >
                    <div className="card-heading">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 495.7 492.9" width="50" height="50">
                        <path fill="#5c5aa7" d="M370.4 77.7l41.4-64A8.82 8.82 0 1 0 397 4.1l-42.9 66.2a284.2 284.2 0 0 0-212.7 0L98.6 4.1a8.82 8.82 0 0 0-14.8 9.6l41.5 64C50.4 114.4 0 183.4 0 262.6c0 3.9.1 150.3.1 207.7A22.7 22.7 0 0 0 22.8 493h450a22.7 22.7 0 0 0 22.7-22.7c0-57.4.2-203.7.2-207.7-.1-79.2-50.5-148.2-125.3-184.9zM133.2 192.3a23.7 23.7 0 1 1 23.8-23.8 23.7 23.7 0 0 1-23.8 23.8zm229.1 0a23.7 23.7 0 1 1 23.8-23.8 23.7 23.7 0 0 1-23.7 23.7z">
                        </path>
                      </svg>
                      <span>Android</span>
                    </div>
                  </a>
                  <div id="android-code-div" className="code-div col-md-12 animated fadeIn" hidden={this.state.displayAndroidInstructions}>
                    <div className="docs-instructions">
                      Clone the repo Kommunicate-Android-Chat-SDK-Customer-Support from github <br/><br/>
                      <div className="code-snippet">git clone https://github.com/Kommunicate-io/Kommunicate-Android-Chat-SDK-Customer-Support.git</div><br/>
                      Then from Android Studio select <span>File -> New ->  Import Module -> Select 'kommunicate'</span> from cloned path. <br/><br/>
                      Check in your app level gradle file, if the dependency for kommunicate doesn’t exist then add it as below <br/><br/>
                      <div className="code-snippet">compile project(':kommunicate')</div>
                    </div>
                    
                    <div style={{ marginTop: "25px" }}>
                    <a href="https://docs.kommunicate.io/docs/android-installation.html" className="km-button km-button--primary see-docs-links" target="_blank">See full documentation</a>
                      <button type="button" className="km-button km-button--secondary" onClick={this.hideAndroidInstructions}>Close</button>
                    </div>
                  </div>
                </div>

                <div className="code-container col-md-10">
                  <a href="#ios-code-div" id="ios-div" className="outer-box col-md-12 integration-font javascript-card" onClick={this.showiOSInstructions}>
                    <div className="card-heading">
                      <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 249.3 305" width="50" height="50">
                        <g fill="#5c5aa7" data-name="Group">
                          <path d="M12.8 112.1C-12.9 156.9 3.4 224.8 32 265.9 46.2 286.5 60.6 305 80.3 305h1.1c9.3-.4 16-3.2 22.5-6s14.8-6.3 26.6-6.3 18.4 3.1 25.3 6.1 13.9 6 24.3 5.8c22.2-.4 35.9-20.4 47.9-37.9a168.2 168.2 0 0 0 21-43v-.3a2.5 2.5 0 0 0-1.3-3.1h-.2c-3.9-1.6-38.3-16.8-38.6-58.4-.3-33.7 25.8-51.6 31-54.8l.2-.2a2.5 2.5 0 0 0 .7-3.5C222.9 77 195.3 73 184.2 72.6l-4.9-.2c-13.1 0-25.6 4.9-35.6 8.9-6.9 2.7-12.9 5.1-17.1 5.1S115.9 84 109 81.2c-9.3-3.7-19.9-7.9-31.1-7.9h-.8c-26.1.3-50.7 15.2-64.3 38.8z" data-name="Path">
                          </path>
                          <path d="M184.2 0c-15.8.6-34.7 10.3-46 23.6-9.6 11.1-19 29.7-16.5 48.4a2.5 2.5 0 0 0 2.3 2.2h3.2c15.4 0 32-8.5 43.4-22.3s18-33.1 16.2-49.8a2.5 2.5 0 0 0-2.6-2.1z" data-name="Path">
                          </path>
                        </g>
                      </svg>
                      <span>iOS</span>
                    </div>
                  </a>
                  <div id="ios-code-div" className="code-div col-md-12 animated fadeIn" hidden={this.state.displayiOSInstructions}>
                    <div className="docs-instructions">
                    Download Kommunicate Chat latest framework here and add it to your project. <br/><br/>

                    Note : Framework folder has two frameworks.
                      
                      <ol>
                        <li>Universal framework: Complied for both simultor and real devices.</li>
                        <li>Archive framework: Complied for real device only. When archiving your app, please use archive framework.</li>
                      </ol>
                      <br/>
                    <strong>Add framework to your project:</strong>
                    <ol style={{listStyleType:"lower-roman"}}>
                        <li>Paste Applozic framework to root folder of your project.</li>
                        <li>Go to Build Phase.</li>
                      </ol>
                    </div>
                    
                    <div style={{ marginTop: "25px" }}>
                    <a href="https://docs.kommunicate.io/docs/ios-installation.html" className="km-button km-button--primary  see-docs-links" target="_blank">See full documentation</a>
                      <button type="button" className="km-button km-button--secondary" onClick={this.hideiOSInstructions}>Close</button>
                    </div>
                  
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
