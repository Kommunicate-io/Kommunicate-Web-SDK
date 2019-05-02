import React, { Component } from 'react';
import CommonUtils from '../../utils/CommonUtils';
import { SettingsHeader } from '../../components/SettingsComponent/SettingsComponents';
import { ChromePicker } from 'react-color';
import Notification from '../model/Notification';
import { KmDefaultIcon, KmCustomIcon1, KmCustomIcon2, KmCustomIcon3, AgentIcon, UploadIconButton } from './ChatWidgetCustomizationAssets';
import './ChatWidgetCustomization.css';
import { sendProfileImage, updateAppSetting, getAppSetting } from '../../utils/kommunicateClient';
import LockBadge from '../../components/LockBadge/LockBadge';
import {LiveChatWidget} from '../../components/LiveChatWidget/LiveChatWidget';
import ReactTooltip from 'react-tooltip';
import Banner from '../../components/Banner';
import { ROLE_TYPE } from '../../utils/Constant';
import Button from '../../components/Buttons/Button';
import SliderToggle from '../../components/SliderToggle/SliderToggle';
import { InfoIcon } from '../../assets/svg/svgs';
import AnalyticsTracking from '../../utils/AnalyticsTracking';

class ChatWidgetCustomization extends Component {
    constructor() {
        super();
        this.state = {
            displayColorPicker: false,
            primaryColor: '#5553b7',
            secondaryColor: "",
            currentIcon: <KmDefaultIcon />,
            chatWidgetImagefileObject: "",
            widgetImageLink: "",
            hasCustomImage: false,
            changesMade: false,
            iconIndex: 1,
            currWidgetIcon: "",
            changedLogoUrl: "",
            isTrialPlan: CommonUtils.isTrialPlan(),
            isStartupPlan: CommonUtils.isStartupPlan(),
            loggedInUserRoleType: CommonUtils.getUserSession().roleType,
            toggleSwitchIsOn: true,
            sliderToggleDisabled: true,
            checkPayingCustomer: false,
            showPoweredBy: true,
            widgetThemeObject: {}
        };

    }
    componentWillMount() {
        this.getwidgetSettings();
    }

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChange = (changedColor) => {
        this.setState({ primaryColor: changedColor.hex, changesMade: true });

    };
    changeIcon = () => {
        this.setState.currentIcon = <KmCustomIcon1 />;
        return (
            this.state.currentIcon
        );
    };
    uploadImage = () => {
        if (this.state.checkPayingCustomer) {
            let that = this;
            document.getElementById("km-upload-chatwidget-image").addEventListener("change", function (e) {
                e.stopImmediatePropagation();
                that.setState({
                    chatWidgetImagefileObject: document.getElementById("km-upload-chatwidget-image").files[0]
                });
                document.getElementById("km-upload-chatwidget-image").value = "";
                that.uploadBotProfileImage(that.state.chatWidgetImagefileObject);
            });
        } else {
            Notification.error("Only available in growth plan");
        }

    };
    uploadBotProfileImage = (file) => {
        let that = this;
        if (file) {
            sendProfileImage(file, `${CommonUtils.getUserSession().application.applicationId}-${CommonUtils.getUserSession().userName}.${file.name.split('.').pop()}`)
                .then(response => {
                    if (response.data.code === "SUCCESSFUL_UPLOAD_TO_S3") {
                        that.setState({ widgetImageLink: response.data.profileImageUrl, changedLogoUrl: response.data.profileImageUrl });
                        Notification.info(response.data.message);
                        that.setState({ hasCustomImage: true, iconIndex: "image", changesMade: true });
                    } else if (response.data.code === "FAILED_TO_UPLOAD_TO_S3") {
                        Notification.info(response.data.message)

                    }
                })
                .catch(err => {
                    Notification.info("Error while uploading")
                })
        } else {
            Notification.info("No file to upload")
        }
    };

    updateWidgetSettings = (calledFrom) => {
        if (calledFrom === "submitButton"){
            this.widgetTheme = this.setCurrentWidgetThemeValue()
            this.setState({
                widgetThemeObject : this.widgetTheme
            })    
        }
        else {
            this.widgetTheme = this.state.widgetThemeObject
        }
        var widgetSettingsJson = {
            "widgetTheme": this.widgetTheme
        };
        updateAppSetting(widgetSettingsJson).then(response => {
            this.setState.changesMade = false;
            Notification.success("Chat widget visuals updated successfully");
            AnalyticsTracking.acEventTrigger("widgetCustomization");
            this.setState({ changesMade: false });
        }).catch(err => {
            Notification.info("Could not update chat widget visuals, please try again")
            this.setState.changesMade = false;
        })
    };

    getwidgetSettings = () => {
        this.checkCustomerPlanActive();
        return Promise.resolve(getAppSetting().then(response => {
            if (response.status == 200) {
                if (response.data.response.widgetTheme === null) {
                    this.setState({
                        widgetThemeObject: this.setCurrentWidgetThemeValue()
                    });
                    return;
                }
                var widgetThemeResponse = response.data.response.widgetTheme;
                this.setState(widgetThemeResponse);
                this.setState({widgetThemeObject:widgetThemeResponse})
                typeof widgetThemeResponse.showPoweredBy !== "undefined" ? this.setState({toggleSwitchIsOn:widgetThemeResponse.showPoweredBy}) : this.setState({toggleSwitchIsOn:true});
                widgetThemeResponse.iconIndex == "image" ? this.setState({ hasCustomImage: true }) : (document.getElementById("icon" + this.state.iconIndex).click());
                this.setState({ changedLogoUrl: widgetThemeResponse.widgetImageLink })
                this.setState({ changesMade: false });
            }
        })).catch(err => {
            Notification.error("Unable to load custom widget settings, please try again.");
        })
    };

    setCurrentWidgetThemeValue = () => {
        return {
            primaryColor: this.state.primaryColor,
            secondaryColor: this.state.secondaryColor,
            widgetImageLink: this.state.widgetImageLink,
            iconIndex: this.state.iconIndex,
            showPoweredBy: this.state.showPoweredBy
        }
    };

    renderSubmitButton = () => {
        if(this.checkAgentorNot()) {
            return <Button disabled={true}>Save Changes</Button>;
        } else {
            return <Button onClick={(event) => this.updateWidgetSettings("submitButton")} disabled={!this.state.changesMade}>Save Changes</Button>;
        } 
    };

    checkAgentorNot = () => {
        return this.state.loggedInUserRoleType == ROLE_TYPE.AGENT;
    };

    checkCustomerPlanActive = () => {
        if (((CommonUtils.isTrialPlan() && CommonUtils.isStartupPlan()) || (!CommonUtils.isTrialPlan() && !CommonUtils.isStartupPlan()))) {
            this.setState({
                sliderToggleDisabled: this.checkAgentorNot(),
                checkPayingCustomer: true
            });
        } else {
            this.setState({
                sliderToggleDisabled: true,
                checkPayingCustomer: false
            })
        }
    };

    handleToggleSwitch = () => {
        var toggleBooleanValue= !this.state.toggleSwitchIsOn;
        this.setState({
            toggleSwitchIsOn: !this.state.toggleSwitchIsOn
        })
        this.handlePoweredByValue(toggleBooleanValue);
    };

    handlePoweredByValue = (toggleBooleanValue) => {
        var updateWidgettheme = this.state.widgetThemeObject;
        updateWidgettheme.showPoweredBy = toggleBooleanValue;
        this.setState({
            widgetThemeObject: updateWidgettheme,
            showPoweredBy: toggleBooleanValue
        })
        this.updateWidgetSettings();
    };

    render() {

        return (
            <div className="animated fadeIn km-chat-customization-wrapper">
                <div className="km-settings-banner">
                    <Banner appearance="warning" hidden={this.state.loggedInUserRoleType != ROLE_TYPE.AGENT} heading={"You need admin permissions to change Chat Widget settings."}/>
                </div>
            <SettingsHeader />
            <div className="row">
                <div className="col-md-7">
                    <div className="km-color-picker">
                        <div className="km-customizer-heading">Color:
                            <span className="info-icon">
                                <InfoIcon data-tip="Default chat widget Color code is #5553b7" data-effect="solid" data-place="right" data-multiline="True" />
                            </span>
                        </div>
                        <div className="swatch" onClick={this.handleClick}>
                            <div className="color" style={{ background: this.state.primaryColor }} /> <div >{this.state.primaryColor}</div>
                        </div>
                        {this.state.displayColorPicker ? <div className="popover">
                            <div className="cover" onClick={this.handleClose} />
                            <ChromePicker disableAlpha={true} color={this.state.primaryColor} onChange={this.handleChange} />
                        </div> : null}</div>
                    <div className="km-logo-picker">
                        <div className="km-customizer-heading">Launcher icon:</div>
                        <div className="logo-selection">
                            <div id="icon1" className={this.state.iconIndex === 1 ? "logo-design" : "logo-design km-non-selected"} onClick={() => { this.setState({ currentIcon: <KmDefaultIcon />, hasCustomImage: false, iconIndex: 1, widgetImageLink: "", changesMade: true }) }} style={{ background: this.state.primaryColor }}> <KmDefaultIcon /></div>
                            <div id="icon2" className={this.state.iconIndex === 2 ? "logo-design" : "logo-design km-non-selected"} onClick={() => { this.setState({ currentIcon: <KmCustomIcon1 />, hasCustomImage: false, iconIndex: 2, widgetImageLink: "", changesMade: true }) }} style={{ background: this.state.primaryColor }}> <KmCustomIcon1 /> </div>
                            <div id="icon3" className={this.state.iconIndex === 3 ? "logo-design" : "logo-design km-non-selected"} onClick={() => { this.setState({ currentIcon: <KmCustomIcon2 />, hasCustomImage: false, iconIndex: 3, widgetImageLink: "", changesMade: true }) }} style={{ background: this.state.primaryColor }}> <KmCustomIcon2 /> </div>
                            <div id="icon4" className={this.state.iconIndex === 4 ? "logo-design" : "logo-design km-non-selected"} onClick={() => { this.setState({ currentIcon: <KmCustomIcon3 />, hasCustomImage: false, iconIndex: 4, widgetImageLink: "", changesMade: true }) }} style={{ background: this.state.primaryColor }}> <KmCustomIcon3 /> </div>
                        </div>
                    </div>
                    <div className="km-logo-picker km-img-picker">
                        <div className={(CommonUtils.isTrialPlan() && CommonUtils.isStartupPlan()) || (!CommonUtils.isTrialPlan() && !CommonUtils.isStartupPlan()) ? "n-vis" : "vis"}>
                            <LockBadge className={"lock-with-text"} text={"Available in Growth Plan"} history={this.props.history} onClickGoTo={"/settings/billing"} />
                        </div>
                        <div className={this.state.changedLogoUrl || this.state.widgetImageLink ? "km-chat-icon-img km-chat-icon km-pointer-cursor" : "n-vis"} style={{ background: this.state.primaryColor, float: "none", margin: "0" }} onClick={() => { this.setState({ currWidgetIcon: this.state.changedLogoUrl, widgetImageLink: this.state.changedLogoUrl, hasCustomImage: true, iconIndex: "image" }) }}>
                            <img src={this.state.changedLogoUrl} />
                        </div>
                        <div className="km-custom-icon-upload">Upload your own launcher icon
                            <input className={(this.state.loggedInUserRoleType != ROLE_TYPE.AGENT) ? ((CommonUtils.isTrialPlan() && CommonUtils.isStartupPlan()) || (!CommonUtils.isTrialPlan() && !CommonUtils.isStartupPlan()) ? "km-hide-input-element km-img-upload-input vis" : "n-vis km-cursor-default") : "n-vis km-cursor-default"} onClick={this.uploadImage} type="file" id="km-upload-chatwidget-image" accept="image/png, image/jpeg" />
                            <button className="km-cursor-default"><UploadIconButton /></button>
                        </div>
                    </div>
                    <div className="km-logo-picker">
                        { this.renderSubmitButton() }
                    </div>
                </div>
                <div className="col-md-5">
                    <LiveChatWidget primaryColor={this.state.primaryColor} currentIcon={this.state.currentIcon} hasCustomImage={this.state.hasCustomImage} changedLogoUrl={this.state.changedLogoUrl} hasCustomerMessage={true}/>
                </div>
            </div>
            <hr className = "km-division-between-widget-and-branding-customization"></hr>
                <div disabled = "true">
                    <div className="km-powered-by-customization">
                        <div className = "km-powered-by-customization-heading"> Show Kommunicate branding </div>
                        <SliderToggle checked={this.state.toggleSwitchIsOn} handleOnChange={this.handleToggleSwitch} disabled = {this.state.sliderToggleDisabled} />
                        <div id="km-powered-by-customization-lock-badge" style={(this.state.checkPayingCustomer) ? {visibility:"hidden"}:{visibility:"visible"}}>
                                <LockBadge className={"lock-with-text"} text={"Upgrade to Growth Plan to disable branding"} history={this.props.history} onClickGoTo={"/settings/billing"}/>
                        </div>
                    </div>
                    <div className = "km-powered-by-customization-text"> If this is enabled, then Kommunicate branding will be displayed at the bottom of your chat widget</div>
                    <div className="km-powered-by-logo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="17.5" style={{verticalAlign:"middle"}}><path fill="#513DD8" fillRule="nonzero" d="M7.69879975.54941587L5.81596948 6.3447902l3.87961917.47635733c.13377998.01642612.19891133.17720919.10092463.28401145l-7.24573967 7.4456573c-.05838132.06073652-.1713319.01291556-.14228864-.0853757l1.54838036-5.83643965-3.71239422-.45582469C.11069114 8.15675014.0455598 7.99596707.1435465 7.8891648L7.55445767.48076424c.06043478-.07746063.17133188-.01291553.14434208.06865163z"/></svg>
                        <a className="km-powered-by-link" href="https://www.kommunicate.io" target="_blank"> by Kommunicate.io </a>
                    </div>
                </div>
            <ReactTooltip />
        </div>)
    }
}

export default ChatWidgetCustomization