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
class Install extends Component {
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
                {
                   (currentPath.includes('setUpPage')) ? " " : <h5>
                   Follow the steps below to install Kommunicate Chat in your product
                 </h5>
                }
                  {
                    ((currentPath.includes('installation')) || (currentPath.includes('setUpPage')) ) ? " " : <h3>Want help from your team members? <span className="multi-email-span-container"><MultiEmail template="SEND_KOMMUNICATE_SCRIPT" />
                    </span> </h3>
                  }
                </div>
                {
                   (currentPath.includes('setUpPage')) ? " " : <div className="app-id-container col-md-10">
                   <div className="app-id-div">
                     <span className="app-id-sub-text">
                       Your App ID:
                     </span>
                     <span className="app-id-main-text">
                       {this.yourApplicationId}
                     </span>
                   </div>
                 </div>
                }
                

                <div className="code-container javascript col-md-10">
                  <a href="#" className="outer-box col-md-12 integration-font javascript-card">
                    <div className="card-heading">
                    <div className="image-svg-container">
                      <svg xmlns="http://www.w3.org/2000/svg" width="522.468" height="522.469" viewBox="0 0 522.468 522.469">
                        <path fill="#5C5AA7" d="M325.762 70.513l-17.706-4.854c-2.279-.76-4.524-.521-6.707.715-2.19 1.237-3.669 3.094-4.429 5.568L190.426 440.53c-.76 2.475-.522 4.809.715 6.995 1.237 2.19 3.09 3.665 5.568 4.425l17.701 4.856c2.284.766 4.521.526 6.71-.712 2.19-1.243 3.666-3.094 4.425-5.564L332.042 81.936c.759-2.474.523-4.808-.716-6.999-1.238-2.19-3.089-3.665-5.564-4.424zm-159.595 71.952c0-2.474-.953-4.665-2.856-6.567l-14.277-14.276c-1.903-1.903-4.093-2.857-6.567-2.857s-4.665.955-6.567 2.857L2.856 254.666C.95 256.569 0 258.759 0 261.233s.953 4.664 2.856 6.566l133.043 133.044c1.902 1.906 4.089 2.854 6.567 2.854s4.665-.951 6.567-2.854l14.277-14.268c1.903-1.902 2.856-4.093 2.856-6.57 0-2.471-.953-4.661-2.856-6.563L51.107 261.233l112.204-112.201c1.906-1.902 2.856-4.093 2.856-6.567zm353.447 112.198L386.567 121.619c-1.902-1.902-4.093-2.857-6.563-2.857-2.478 0-4.661.955-6.57 2.857l-14.271 14.275c-1.902 1.903-2.851 4.09-2.851 6.567s.948 4.665 2.851 6.567l112.206 112.204-112.206 112.21c-1.902 1.902-2.851 4.093-2.851 6.563 0 2.478.948 4.668 2.851 6.57l14.271 14.268c1.909 1.906 4.093 2.854 6.57 2.854 2.471 0 4.661-.951 6.563-2.854L519.614 267.8c1.903-1.902 2.854-4.096 2.854-6.57 0-2.475-.951-4.665-2.854-6.567z" />
                      </svg>
                      </div>
                      <span>Website</span>
                    </div>
                  </a>
                  <div id="javascript-code-div" className="code-div col-md-12 animated fadeIn">
                    <p style={{ fontSize: "16px", color: "#878585", letterSpacing: "normal", marginTop: "20px" }}>Copy the Javascript code from below and paste it just above the <b>&lt;/head&gt;</b> tag on every page you want the chat widget to appear </p>
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
                  </div>
                </div>

                <div className="code-container col-md-10">
                  <a href="https://docs.kommunicate.io/docs/android-installation.html" id="android-div" target="_blank" className="outer-box col-md-12 integration-font javascript-card">
                    <div className="card-heading">
                      <div className="image-svg-container">
                        <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 553.048 553.048">
                          <path fill="#a4c639" d="M76.774 179.141c-9.529 0-17.614 3.323-24.26 9.969-6.646 6.646-9.97 14.621-9.97 23.929v142.914c0 9.541 3.323 17.619 9.97 24.266 6.646 6.646 14.731 9.97 24.26 9.97 9.522 0 17.558-3.323 24.101-9.97 6.53-6.646 9.804-14.725 9.804-24.266V213.039c0-9.309-3.323-17.283-9.97-23.929-6.647-6.646-14.627-9.969-23.935-9.969zM351.972 50.847L375.57 7.315c1.549-2.882.998-5.092-1.658-6.646-2.883-1.34-5.098-.661-6.646 1.989l-23.928 43.88c-21.055-9.309-43.324-13.972-66.807-13.972-23.488 0-45.759 4.664-66.806 13.972l-23.929-43.88c-1.555-2.65-3.77-3.323-6.646-1.989-2.662 1.561-3.213 3.764-1.658 6.646l23.599 43.532c-23.929 12.203-42.987 29.198-57.167 51.022-14.18 21.836-21.273 45.698-21.273 71.628h307.426c0-25.924-7.094-49.787-21.273-71.628-14.181-21.824-33.129-38.819-56.832-51.022zm-136.433 63.318c-2.552 2.558-5.6 3.831-9.143 3.831-3.55 0-6.536-1.273-8.972-3.831-2.436-2.546-3.654-5.582-3.654-9.137 0-3.543 1.218-6.585 3.654-9.137 2.436-2.546 5.429-3.819 8.972-3.819s6.591 1.273 9.143 3.819c2.546 2.558 3.825 5.594 3.825 9.137-.007 3.549-1.285 6.591-3.825 9.137zm140.086 0c-2.441 2.558-5.434 3.831-8.971 3.831-3.551 0-6.598-1.273-9.145-3.831-2.551-2.546-3.824-5.582-3.824-9.137 0-3.543 1.273-6.585 3.824-9.137 2.547-2.546 5.594-3.819 9.145-3.819 3.543 0 6.529 1.273 8.971 3.819 2.438 2.558 3.654 5.594 3.654 9.137 0 3.549-1.217 6.591-3.654 9.137zM123.971 406.804c0 10.202 3.543 18.838 10.63 25.925 7.093 7.087 15.729 10.63 25.924 10.63h24.596l.337 75.454c0 9.528 3.323 17.619 9.969 24.266s14.627 9.97 23.929 9.97c9.523 0 17.613-3.323 24.26-9.97s9.97-14.737 9.97-24.266v-75.447h45.864v75.447c0 9.528 3.322 17.619 9.969 24.266s14.73 9.97 24.26 9.97c9.523 0 17.613-3.323 24.26-9.97s9.969-14.737 9.969-24.266v-75.447h24.928c9.969 0 18.494-3.544 25.594-10.631 7.086-7.087 10.631-15.723 10.631-25.924V185.45h-305.09v221.354zm352.304-227.663c-9.309 0-17.283 3.274-23.93 9.804-6.646 6.542-9.969 14.578-9.969 24.094v142.914c0 9.541 3.322 17.619 9.969 24.266s14.627 9.97 23.93 9.97c9.523 0 17.613-3.323 24.26-9.97s9.969-14.725 9.969-24.266V213.039c0-9.517-3.322-17.552-9.969-24.094-6.647-6.53-14.737-9.804-24.26-9.804z"/>
                        </svg>
                      </div>
                      <span>Android</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>External Link</title><path fill="none" stroke="#4A4A4A" strokeLinecap="round" d="M19 13.0117188V19.4c0 .8836556-.7163444 1.6-1.6 1.6H4.6c-.8836556 0-1.6-.7163444-1.6-1.6V6.6C3 5.7163444 3.7163444 5 4.6 5h6.4519531M14 3h6c.5522847 0 1 .44771525 1 1v6m-.5-6.5l-9.617692 9.617692"></path></svg>
                  </a>
                </div>

                <div className="code-container col-md-10">
                  <a href="https://docs.kommunicate.io/docs/ios-installation.html" id="ios-div" target="_blank" className="outer-box col-md-12 integration-font javascript-card">
                    <div className="card-heading">
                    <div className="image-svg-container">
                      <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 249.3 305" width="50" height="50">
                        <g fill="#a9a9ac" data-name="Group">
                          <path d="M12.8 112.1C-12.9 156.9 3.4 224.8 32 265.9 46.2 286.5 60.6 305 80.3 305h1.1c9.3-.4 16-3.2 22.5-6s14.8-6.3 26.6-6.3 18.4 3.1 25.3 6.1 13.9 6 24.3 5.8c22.2-.4 35.9-20.4 47.9-37.9a168.2 168.2 0 0 0 21-43v-.3a2.5 2.5 0 0 0-1.3-3.1h-.2c-3.9-1.6-38.3-16.8-38.6-58.4-.3-33.7 25.8-51.6 31-54.8l.2-.2a2.5 2.5 0 0 0 .7-3.5C222.9 77 195.3 73 184.2 72.6l-4.9-.2c-13.1 0-25.6 4.9-35.6 8.9-6.9 2.7-12.9 5.1-17.1 5.1S115.9 84 109 81.2c-9.3-3.7-19.9-7.9-31.1-7.9h-.8c-26.1.3-50.7 15.2-64.3 38.8z" data-name="Path">
                          </path>
                          <path d="M184.2 0c-15.8.6-34.7 10.3-46 23.6-9.6 11.1-19 29.7-16.5 48.4a2.5 2.5 0 0 0 2.3 2.2h3.2c15.4 0 32-8.5 43.4-22.3s18-33.1 16.2-49.8a2.5 2.5 0 0 0-2.6-2.1z" data-name="Path">
                          </path>
                        </g>
                      </svg>
                      </div>
                      <span>iOS</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>External Link</title><path fill="none" stroke="#4A4A4A" strokeLinecap="round" d="M19 13.0117188V19.4c0 .8836556-.7163444 1.6-1.6 1.6H4.6c-.8836556 0-1.6-.7163444-1.6-1.6V6.6C3 5.7163444 3.7163444 5 4.6 5h6.4519531M14 3h6c.5522847 0 1 .44771525 1 1v6m-.5-6.5l-9.617692 9.617692"></path></svg>
                  </a>
                </div>

                {/* Cordova */}
                <div className="code-container col-md-10">
                  <a href="https://docs.kommunicate.io/docs/cordova-installation.html" id="cordova-div" target="_blank" className="outer-box col-md-12 integration-font javascript-card">
                    <div className="card-heading">
                      <div className="image-svg-container">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352.2 335.5">
                          <g fill="#444" data-name="Layer 2">
                            <path d="M80.1 0L0 127.7l32.8 207.8h56.4l-4.6-48.3h28.9l3.7 48.3h118.1l3.7-48.3h28.7l-4.6 48.3h56.7l32.4-207.8L272.1 0zm16.2 63.6h51l-2.8 23.9H208l-3.3-23.9h52l31.7 64.1-15.7 128.2H80.1L63.9 127.7z"/>
                            <ellipse cx="228.3" cy="183.6" rx="7.9" ry="29.5"/>
                            <ellipse cx="127.2" cy="185.9" rx="7.9" ry="29.5"/>
                          </g>
                        </svg>
                      </div>
                      <span>Cordova/Phonegap/Ionic</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>External Link</title><path fill="none" stroke="#4A4A4A" strokeLinecap="round" d="M19 13.0117188V19.4c0 .8836556-.7163444 1.6-1.6 1.6H4.6c-.8836556 0-1.6-.7163444-1.6-1.6V6.6C3 5.7163444 3.7163444 5 4.6 5h6.4519531M14 3h6c.5522847 0 1 .44771525 1 1v6m-.5-6.5l-9.617692 9.617692"></path></svg>
                  </a>
                </div>

                {/* Wordpress */}
                <div className="code-container col-md-10">
                  <a href="http://www.kommunicate.io/blog/how-to-add-live-chat-plugin-in-wordpress-websites-b449f0f5e12f/" id="wordpress-div" target="_blank" className="outer-box col-md-12 integration-font javascript-card">
                    <div className="card-heading">
                      <div className="image-svg-container">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 666.7 666.7">
                          <g data-name="Layer 2">
                            <g fill="#32373c" data-name="W Mark">
                              <path d="M333.3 20a311.8 311.8 0 0 1 175.2 53.5 314.3 314.3 0 0 1 113.6 137.9 312.9 312.9 0 0 1-28.9 297.1 314.3 314.3 0 0 1-137.9 113.6 312.9 312.9 0 0 1-297.1-28.9A314.3 314.3 0 0 1 44.6 455.3a312.9 312.9 0 0 1 28.9-297.1A314.3 314.3 0 0 1 211.4 44.6 311.4 311.4 0 0 1 333.3 20m0-20C149.2 0 0 149.2 0 333.3s149.2 333.4 333.3 333.4 333.4-149.3 333.4-333.4S517.4 0 333.3 0z"/>
                              <path d="M55.6 333.3c0 109.9 63.9 205 156.6 250l-132.6-363a276.7 276.7 0 0 0-24 113zm465.3-14c0-34.3-12.3-58.1-22.9-76.6-14.1-22.9-27.3-42.3-27.3-65.1 0-25.5 19.4-49.3 46.6-49.3l3.6.2a276.7 276.7 0 0 0-187.6-72.9c-97 0-182.4 49.8-232.1 125.2l17.9.3c29 0 74-3.5 74-3.5 15-.9 16.7 21.1 1.8 22.9 0 0-15.1 1.8-31.8 2.6L264.3 504l60.8-182.3-43.3-118.6c-15-.9-29.1-2.6-29.1-2.6-15-.9-13.2-23.8 1.8-22.9 0 0 45.9 3.5 73.2 3.5 29 0 74-3.5 74-3.5 15-.9 16.7 21.1 1.8 22.9 0 0-15.1 1.8-31.8 2.6L472 501.7l28.7-90.8c12.7-39.7 20.2-67.8 20.2-91.6zm-182.7 38.3l-83.3 242.2a277.9 277.9 0 0 0 170.7-4.4 25.3 25.3 0 0 1-2-3.8zm238.9-157.5a213.4 213.4 0 0 1 1.9 28.6c0 28.2-5.3 59.9-21.1 99.5L473 573.4c82.6-48.1 138.1-137.6 138.1-240.1a276.5 276.5 0 0 0-34-133.2z"/>
                            </g>
                          </g>
                        </svg>
                      </div>
                      <span>Wordpress</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>External Link</title><path fill="none" stroke="#4A4A4A" strokeLinecap="round" d="M19 13.0117188V19.4c0 .8836556-.7163444 1.6-1.6 1.6H4.6c-.8836556 0-1.6-.7163444-1.6-1.6V6.6C3 5.7163444 3.7163444 5 4.6 5h6.4519531M14 3h6c.5522847 0 1 .44771525 1 1v6m-.5-6.5l-9.617692 9.617692"></path></svg>
                  </a>
                </div>

                {/* Wix */}
                <div className="code-container col-md-10">
                  <a href="http://www.kommunicate.io/blog/how-to-integrate-live-chat-plugin-in-wix-websites-469f155ab314/" id="wix-div" target="_blank" className="outer-box col-md-12 integration-font javascript-card">
                    <div className="card-heading">
                      <div className="image-svg-container">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 261.7 101.9">
                          <g data-name="Layer 2">
                            <path fill="#ffcb29" d="M149.8 2c-5.2 2.8-7.1 7.4-7.1 20a20.3 20.3 0 0 1 6.5-4 25.6 25.6 0 0 0 6.7-3.6c4.4-3.2 5-7.3 5-14.3 0 0-7.2-.2-11.1 1.9z" data-name="svg 3"/>
                            <path fill="#2e3133" d="M119 5c-4.2 3.7-5.5 9.7-5.5 9.7L99.4 68.8 87.8 24.4c-1.1-4.6-3.2-10.6-6.5-14.5S69 4.7 68.1 4.7 58.8 5 54.7 10s-5.3 9.8-6.5 14.5L36.6 68.9 22.7 14.6s-1.2-6-5.5-9.7C10.3-1.1 0 .2 0 .2l26.8 101.5s8.8.7 13.3-1.7 8.6-5.2 12.2-19.1c3.1-12.3 11.8-48.4 12.7-51s.9-4.3 3.1-4.3 2.8 3 3.1 4.3 9.6 38.7 12.8 51c3.5 13.8 6.3 16 12.2 19.1s13.3 1.7 13.3 1.7L136.2.2S125.9-1 119 5zm41.8 11.8a17.2 17.2 0 0 1-5.5 4.8c-2.5 1.4-4.8 2.3-7.3 3.5-4.2 2-5.4 4.3-5.4 7.8v68.9s6.8.8 11.2-1.4 7-5.7 7-18.4zm66.9 34.4l34-50.7s-14.3-2.5-21.4 4c-4.6 4.1-9.7 11.6-9.7 11.6l-12.4 18.1c-.7.9-1.3 2-2.6 2a3.1 3.1 0 0 1-2.6-2l-12.7-18.1s-5-7.4-9.7-11.6c-7-6.5-21.4-4-21.4-4l34 50.5-34 50.5s15 2 22-4.6c4.6-4.1 9-10.9 9-10.9l12.5-18c.7-.9 1.3-2 2.6-2a3.1 3.1 0 0 1 2.6 2l12.5 18a85.5 85.5 0 0 0 9.1 11c7 6.5 21.8 4.6 21.8 4.6z" data-name="svg 4"/>
                          </g>
                        </svg>
                      </div>
                      <span>Wix</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>External Link</title><path fill="none" stroke="#4A4A4A" strokeLinecap="round" d="M19 13.0117188V19.4c0 .8836556-.7163444 1.6-1.6 1.6H4.6c-.8836556 0-1.6-.7163444-1.6-1.6V6.6C3 5.7163444 3.7163444 5 4.6 5h6.4519531M14 3h6c.5522847 0 1 .44771525 1 1v6m-.5-6.5l-9.617692 9.617692"></path></svg>
                  </a>
                </div>

                {/* Squarespace */}
                <div className="code-container col-md-10">
                  <a href="http://www.kommunicate.io/blog/how-to-add-live-chat-plugin-in-squarespace-websites-798de1989487/" id="squarespace-div" target="_blank" className="outer-box col-md-12 integration-font javascript-card">
                    <div className="card-heading">
                      <div className="image-svg-container">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="20" viewBox="0 0 25 20">
                          <path d="M15.649 5.451a.824.824 0 1 0-1.167-1.166l-7.697 7.697a2.807 2.807 0 0 1-3.966.001 2.808 2.808 0 0 1 0-3.966l6.193-6.192A.824.824 0 1 0 7.845.658L1.653 6.851a4.46 4.46 0 0 0 0 6.298 4.458 4.458 0 0 0 6.298 0L15.65 5.45zm-11.43 5.132a.824.824 0 0 0 1.167 0l7.697-7.697a2.807 2.807 0 0 1 3.966 0 .824.824 0 1 0 1.166-1.167 4.458 4.458 0 0 0-6.298 0L4.219 9.417a.824.824 0 0 0 0 1.166zm16.562-1.166a.824.824 0 0 0-1.167 0l-7.697 7.697a2.807 2.807 0 0 1-3.966 0 .824.824 0 1 0-1.166 1.167 4.458 4.458 0 0 0 6.298 0l7.697-7.698a.824.824 0 0 0 0-1.166zM17.049 6.85l-7.699 7.7a.824.824 0 1 0 1.166 1.166l7.698-7.697a2.807 2.807 0 0 1 3.965-.001 2.808 2.808 0 0 1 0 3.966l-6.192 6.192a.824.824 0 1 0 1.166 1.167l6.193-6.193a4.46 4.46 0 0 0 0-6.298 4.459 4.459 0 0 0-6.298 0z"/>
                        </svg>
                      </div>
                      <span>Squarespace</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>External Link</title><path fill="none" stroke="#4A4A4A" strokeLinecap="round" d="M19 13.0117188V19.4c0 .8836556-.7163444 1.6-1.6 1.6H4.6c-.8836556 0-1.6-.7163444-1.6-1.6V6.6C3 5.7163444 3.7163444 5 4.6 5h6.4519531M14 3h6c.5522847 0 1 .44771525 1 1v6m-.5-6.5l-9.617692 9.617692"></path></svg>
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Install;
