import React, { Component } from 'react';
import './EmailFallback.css';
import CommonUtils from '../../utils/CommonUtils';
import Notification from '../../views/model/Notification';
import { SettingsHeader } from '../../../src/components/SettingsComponent/SettingsComponents';
import SliderToggle from '../../components/SliderToggle/SliderToggle';
import LockBadge from '../../components/LockBadge/LockBadge';
import { editApplicationDetails, sendProfileImage } from '../../utils/kommunicateClient';
import { Link } from 'react-router-dom';

const FallbackEnabled = (props) => {
    return (props.enabled) ? (
        <p className="email-fallback--branding-description">We will send fallback emails to your users and/or your team members if they miss any new messages. The emails will have your logo if you have enabled the company branding option above.</p>
    ) : (
        <p className="email-fallback--branding-description">We will not send fallback emails to your users. Just set up the API URLs from the <Link to="/settings/webhooks-security">Webhook Setup</Link> section to get the relevant data from us and use it to send fallback notifications from your end.</p>
    );
} 

export default class EmailFallback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            switchIsEnabled: true,
            uploadedCompanyLogo: CommonUtils.getUserSession().application.companyLogo || "",
            uploadImageText: "Replace",
            disableUploadBtn: false
        };
        this.handleFileOnChange = this.handleFileOnChange.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.submitEmailFallbackDetails = this.submitEmailFallbackDetails.bind(this);
        this.handleToggleSwitch = this.handleToggleSwitch.bind(this);
    }

    componentDidMount = () => {
        this.setState({
            switchIsEnabled: (!this.checkForFallbackSettings())
        });
    }

    handleFileOnChange(e) {
        var file = e.target.files[0];
        if(file) {
            this.setState({
                uploadImageText: "Uploading...",
                disableUploadBtn: true
            })
        }
        this.uploadImage(file);
    }

    checkForFallbackSettings = () => {
        let userSession = CommonUtils.getUserSession();
        let webhooks = userSession.application.applicationWebhookPxys;
        let result = webhooks.filter(webhooks => webhooks.notifyVia === -1);
        return (result.length == webhooks.length);
    }

    uploadImage = (file) => {
        let that=this;
        if (file) {
            sendProfileImage(file, `${CommonUtils.getUserSession().application.applicationId}-${file.name}`)
            .then(response => {
                if (response.data.code === "SUCCESSFUL_UPLOAD_TO_S3") {
                    that.setState({ uploadedCompanyLogo: response.data.profileImageUrl });
                    Notification.info(response.data.message);
                    let imgTag = document.querySelector("#branding_logo--image-placeholder img");
                    imgTag.src = response.data.profileImageUrl;
                    that.submitEmailFallbackDetails(this.state.uploadedCompanyLogo, false);
                    that.setState({
                        uploadImageText: "Replace",
                        disableUploadBtn: false
                    });
                } else if (response.data.code === "FAILED_TO_UPLOAD_TO_S3") {
                    Notification.info(response.data.message);
                    that.setState({
                        uploadImageText: "Replace",
                        disableUploadBtn: false
                    });
                }
            })
            .catch(err => {
                Notification.info("Error while uploading")
                that.setState({
                    uploadImageText: "Replace",
                    disableUploadBtn: false
                });
            })
        } else {
            Notification.info("No file to upload")
            that.setState({
                uploadImageText: "Replace",
                disableUploadBtn: false
            });
        }
    }

    handleToggleSwitch = () => {
        let userSession = CommonUtils.getUserSession();
        let applicationData = userSession;
        let webhooks = applicationData.application.applicationWebhookPxys;

        this.setState({
            switchIsEnabled: !this.state.switchIsEnabled
        }, () => {
            if(!this.state.switchIsEnabled) {
                for(var i=0; i<webhooks.length; i++) {
                    webhooks[i].notifyVia = -1;
                }
                applicationData.applicationWebhookPxys = webhooks;
                this.submitEmailFallbackDetails(applicationData, true);
            } else {
                for(var i=0; i<webhooks.length; i++) {
                    webhooks[i].notifyVia = 0;
                }
                applicationData.applicationWebhookPxys = webhooks;
                this.submitEmailFallbackDetails(applicationData, true);
            }
        });
    }

    submitEmailFallbackDetails = (fallbackSettingsData, enableFallback) => {
        let userSession = CommonUtils.getUserSession();
        let applicationData = userSession;

        if(!enableFallback) {
            let companyLogo = fallbackSettingsData;
            applicationData.companyLogo = companyLogo;
            this.editApplicationApiCall(applicationData).then(response => {
                userSession.application.companyLogo = response.companyLogo;
                CommonUtils.setUserSession(userSession);
            });   
        } else {
            this.editApplicationApiCall(fallbackSettingsData).then( response => {
                userSession.application.applicationWebhookPxys = response.applicationWebhookPxys;
                CommonUtils.setUserSession(userSession);
                (this.checkForFallbackSettings()) ? Notification.info("Fallback emails disabled succesfully") : Notification.info("Fallback emails enabled succesfully");
            });
        }
    }

    editApplicationApiCall = (details) => {
        return editApplicationDetails(details).then((response) => {
            return response.data;
        }).catch((error) => {
            Notification.info("Something went wrong");
            console.log(error);
        });
    }

    render() {
        let defaultLogoClass = "";
        (this.state.uploadedCompanyLogo.includes('/img/logo02.png')) ? defaultLogoClass = "km-default-logo" : ""

        return (
            <div className="animated fadeIn email-fallback-div">
                <div className="km-heading-wrapper">
                    <SettingsHeader />
                </div>
                <div className="row">
                    <div className=" col-md-8 col-sm-12">

                        <div className="email-fallback--branding-container">
                            <h3>Branding in fallback emails:</h3>
                            <p className="email-fallback--branding-description">We use the {CommonUtils.getProductName()} logo in the fallback emails by default. You can give the fallback emails your brand identity by replacing the below {CommonUtils.getProductName()} logo with your own.</p>
                            <div className="email-fallback--branding_logo-container">
                                <div className="branding_logo--image-upload">
                                    <p className="email-fallback--branding-description">Logo used in fallback mails:</p>
                                    <div id={`branding_logo--image-placeholder`} className={`branding_logo--image-placeholder ${defaultLogoClass}`}>
                                        <img src={this.state.uploadedCompanyLogo} />
                                    </div>
                                    {(CommonUtils.isTrialPlan()) ? <div>
                                        <input type="file" name="file" id="email-fallback-file" className="inputfile" onChange={this.handleFileOnChange} accept=".jpg, .jpeg, .png" disabled={this.state.disableUploadBtn}/>
                                        <label htmlFor="email-fallback-file">{this.state.uploadImageText}</label>
                                    </div> : (CommonUtils.isStartupPlan()) ? <LockBadge className={"lock-with-text"} text={"Available in Growth Plan"} history={this.props.history} onClickGoTo={"/settings/billing"} /> : <div>
                                        <input type="file" name="file" id="email-fallback-file" className="inputfile" onChange={this.handleFileOnChange} accept=".jpg, .jpeg, .png" disabled={this.state.disableUploadBtn}/>
                                        <label htmlFor="email-fallback-file">{this.state.uploadImageText}</label>
                                    </div>}
                                </div>



                            </div>
                            <hr />
                        </div>
                        {/* COMMENTING BELOW CODE BECAUSE THE FUNCTIONALITY IS NOT YET CREATED FROM API SIDE */}
                        <div className="email-fallback--how-to-container">
                            <h3>How to send fallback emails?</h3>
                            <div className="email-fallback--how-to_toggle-switch">
                                <div className="email-fallback--branding-description">
                                    Allow {CommonUtils.getProductName()} to send all fallback emails
                                </div>
                                <div>
                                    <SliderToggle checked={this.state.switchIsEnabled} handleOnChange={this.handleToggleSwitch} />
                                </div>
                            </div>
                            <FallbackEnabled enabled={this.state.switchIsEnabled}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
} 