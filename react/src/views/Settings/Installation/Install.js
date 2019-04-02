import React, { Component } from "react";
import MultiEmail from '../../MultiEmail/';
import { getJsCode, getApplozicScript, getDocsLink } from '../../../utils/customerSetUp';
import CommonUtils from "../../../utils/CommonUtils";
import Notification from '../../model/Notification';
import AnalyticsTracking from '../../../utils/AnalyticsTracking';
import { SettingsHeader } from '../../../../src/components/SettingsComponent/SettingsComponents';
import { ReactNative, NativeScript, Squarspace, Wordpress, WixIcon, Cordova, IOS, AndroidIcon, WebIcon } from '../../../../src/assets/svg/svgs';
import Button from '../../../components/Buttons/Button';
import './Accordion.css'; 


const DocsLink = (props, WrappedComponent) => {
  return (
    <div className="code-container col-md-12">
      <a href={props.linkUrl} target="_blank" className="outer-box col-md-12 integration-font javascript-card">
        <div className="card-heading">
          <div className="image-svg-container">
            <WrappedComponent />
          </div>
          <span>{props.title}</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>External Link</title><path fill="none" stroke="#4A4A4A" strokeLinecap="round" d="M19 13.0117188V19.4c0 .8836556-.7163444 1.6-1.6 1.6H4.6c-.8836556 0-1.6-.7163444-1.6-1.6V6.6C3 5.7163444 3.7163444 5 4.6 5h6.4519531M14 3h6c.5522847 0 1 .44771525 1 1v6m-.5-6.5l-9.617692 9.617692"></path></svg>
      </a>
    </div>
  )
}
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
      displayiOSInstructions: true,
      script: getApplozicScript(),
      yourApplicationId: '',
      docsLink: {},
      showApplozicDashboard: false,
      brand: "Kommunicate"
    };
  }

  componentDidMount() {
    if (CommonUtils.isProductApplozic()) {
      this.setState({
        script: getApplozicScript(),
        yourApplicationId: getJsCode()[1],
        docsLink: getDocsLink('applozic'),
        showApplozicDashboard: true,
        brand: 'Applozic'
      })
    } else {
      this.setState({
        script: getJsCode()[0],
        yourApplicationId: getJsCode()[1],
        docsLink: getDocsLink('kommunicate')
      })
    }
  }

  copyToClipboard = e => {
    e.preventDefault();
    this.textArea.select();
    document.execCommand("copy");
    e.target.focus();
    this.setState({ copySuccess: "Copy code" });
    Notification.info("Code copied successfully!");
    AnalyticsTracking.acEventTrigger("integration.instructions.copycode");
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
  getApiKey() {
    let apiKey = CommonUtils.getUserSession().apiKey;
    return apiKey ? apiKey : "Please contact " + CommonUtils.getProductName() + " support to get API key";
  }

  render() {
    const currentPath = window.location.pathname;
    return (
      <div className="animated fadeIn install-section-wrapper">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-block" style={{ marginTop: "-15px" }}  >
                <SettingsHeader applozicDashboard={this.state.showApplozicDashboard} />
                <div className="intgration-card-header">
                  {
                    ((currentPath.includes('installation')) || (currentPath.includes('setUpPage'))) ? " " : <h3 style={{color:"#616366"}}>Want help from your team members? <span className="multi-email-span-container"><MultiEmail template="INSTALLATION_INSTRUCTIONS" />
                    </span> </h3>
                  }
                </div>
                {
                  (currentPath.includes('setUpPage')) ? " " : <div className="app-id-container">
                    <div className="app-id-div">
                      <span className="app-id-sub-text">
                        Your App ID:
                     </span>
                     <span className="app-id-main-text" >
                     {this.state.yourApplicationId}
                     </span>
                   </div>
                   {CommonUtils.isKommunicateDashboard() && (!(currentPath.includes('installation')) || (currentPath.includes('setUpPage'))) &&
                   <div   className = {typeof this.getApiKey() === 'undefined' ? "n-vis" : "app-id-div" } >
                     <span className="app-id-sub-text">
                       API Key:
                     </span>

                     <span className="app-id-main-text" >
                     {this.getApiKey()}

                     </span>
                   </div>}
                 </div>
                }


                {
                  CommonUtils.isKommunicateDashboard() &&

                  <div className="code-container javascript col-md-12">
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
                          value={this.state.script}
                          readOnly
                        />
                      </div>
                      
                      <div className="copy-code-button-div">
                        {document.queryCommandSupported("copy") && (
                          <Button type="button" className="copy-code-btn" onClick={this.copyToClipboard}>
                            {this.state.copySuccess}
                          </Button>
                        )}
                        { CommonUtils.isKommunicateDashboard() ? <span className="identify-users">Want to identify your users? <a href={this.state.docsLink.installation} className="brand-color" target="_blank">Read more here</a></span> : ""}
                      </div>
                    </div>
                  </div>
              }

                {/* Android */
                  CommonUtils.isProductApplozic() &&
                  DocsLink({ linkUrl: this.state.docsLink.web, title: "Web" }, WebIcon)
                }
                {/* Android */
                  DocsLink({ linkUrl: this.state.docsLink.android, title: "Android" }, AndroidIcon)
                }
                {/* iOS */
                  DocsLink({ linkUrl: this.state.docsLink.ios, title: "iOS" }, IOS)
                }
                {/* Cordova */
                  DocsLink({ linkUrl: this.state.docsLink.cordova, title: "Cordova/Phonegap/Ionic" }, Cordova)
                }
                {/* Wordpress */
                  this.state.showApplozicDashboard ? null : DocsLink({ linkUrl: this.state.docsLink.wordpress, title: "Wordpress" }, Wordpress)
                }
                {/* Wix */
                  this.state.showApplozicDashboard ? null : DocsLink({ linkUrl: this.state.docsLink.wix, title: "Wix" }, WixIcon)
                }
                {/* Squarespace */
                  this.state.showApplozicDashboard ? null : DocsLink({ linkUrl: this.state.docsLink.squareSpace, title: "Squarespace" }, Squarspace)
                }
                {/** react native */
                  this.state.showApplozicDashboard ? DocsLink({ linkUrl: this.state.docsLink.reactNative, title: "React Native" }, ReactNative) : null
                }
                {/** native script */
                  this.state.showApplozicDashboard ? DocsLink({ linkUrl: this.state.docsLink.nativeScript, title: "Native Script" }, NativeScript) : null
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Install;
