import React, { Component } from 'react';
import CommonUtils from '../../utils/CommonUtils';
import {SettingsHeader} from '../../components/SettingsComponent/SettingsComponents';
import { ChromePicker } from 'react-color';
import Notification from '../model/Notification';
import {KmDefaultIcon , KmCustomIcon1, KmCustomIcon2, KmCustomIcon3, AgentIcon,UploadIconButton} from './ChatWidgetCustomizationAssets';
import './ChatWidgetCustomization.css';
import {sendProfileImage,updateAppSetting,getAppSetting} from '../../utils/kommunicateClient';
import LockBadge from '../../components/LockBadge/LockBadge';
import ReactTooltip from 'react-tooltip'




class ChatWidgetCustomization extends Component{
    constructor() {
        super();
        this.state = {
            displayColorPicker: false,
            primaryColor:'#5553b7',
            secondaryColor:"",
            currentIcon : <KmDefaultIcon />,
            chatWidgetImagefileObject: "",
            widgetImageLink: "",
            hasCustomImage : false,
            changesMade : false,
            iconIndex : 1 ,
            currWidgetIcon: "",
            changedLogoUrl:""
        }
       
    }
    componentWillMount(){
        this.getwidgetSettings();
    }
    componentDidMount() {
        // this.setState(this.widgetTheme);
    }


    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChange = (changedColor) => {
        this.setState({ primaryColor: changedColor.hex , changesMade:true });   
        
    };
    changeIcon = () =>{
        this.setState.currentIcon = <KmCustomIcon1 />;
        return(
            this.state.currentIcon
        );
    };
    uploadImage = () =>{
        if( ( CommonUtils.isTrialPlan() && CommonUtils.isStartupPlan() ) ||  (!CommonUtils.isTrialPlan() && !CommonUtils.isStartupPlan()) ){
        let that=this;
        document.getElementById("km-upload-chatwidget-image").addEventListener("change", function(){
            that.setState({
            chatWidgetImagefileObject: document.getElementById("km-upload-chatwidget-image").files[0]
            });
            document.getElementById("km-upload-chatwidget-image").value="";
            that.uploadBotProfileImage(that.state.chatWidgetImagefileObject);
        });
    }else{
        Notification.error("Only available in growth plan");
    }
        
    };
    uploadBotProfileImage = (file) => {
        let that=this;
        if (file) {
            sendProfileImage(file, `${CommonUtils.getUserSession().application.applicationId}-${CommonUtils.getUserSession().userName}.${file.name.split('.').pop()}`)
            .then(response => {
                if (response.data.code === "SUCCESSFUL_UPLOAD_TO_S3") {
                that.setState({ widgetImageLink: response.data.profileImageUrl  , changedLogoUrl : response.data.profileImageUrl});
                Notification.info(response.data.message);
                that.setState({hasCustomImage : true, iconIndex : "image", changesMade:true});
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
        
    updateWidgetSettings = () => {
        this.widgetTheme = {
            primaryColor : this.state.primaryColor,
            secondaryColor : this.state.secondaryColor,
            widgetImageLink : this.state.widgetImageLink,
            iconIndex : this.state.iconIndex
        }
        var widgetSettingsJson = {
            "widgetTheme":this.widgetTheme
        };
        updateAppSetting("", widgetSettingsJson).then(response => {
            this.setState.changesMade = false;
            Notification.success("Chat widget visuals updated successfully");
            this.setState({changesMade : false});
            }).catch(err => {
            Notification.info("Could not update chat widget visuals, please try again")
            this.setState.changesMade = false;
            })
    };
    
    getwidgetSettings = () => {
        return Promise.resolve(getAppSetting().then(response => {
            if(response.status == 200) {
                if(response.data.response.widgetTheme === null){
                    return;
                }
                var widgetThemeResponse = response.data.response.widgetTheme;
                this.setState(widgetThemeResponse);
                widgetThemeResponse.iconIndex == "image"? this.setState({ hasCustomImage : true }) : (document.getElementById("icon"+this.state.iconIndex).click());
                this.setState({changedLogoUrl : widgetThemeResponse.widgetImageLink})
                this.setState({changesMade : false});
            }
            })).catch(err => {
            Notification.error("Unable to load custom widget settings, please try again.");
            })
    }


    render(){


      return  (<div className = "animated fadeIn km-chat-customization-wrapper">
                <SettingsHeader />
                    <div className="row">
                    <div className="col-md-6">
                        <div className="km-color-picker">
                        <div className="km-customizer-heading">Color: 
                            <span className="info-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" style={{
                                verticalAlign: "middle",
                                marginLeft: "8px",
                                marginBottom: "2px"
                            }} data-tip="Default chat widget Color code is #5553b7" data-effect="solid" data-place="right" data-multiline="True">
                            <g fill="#514E4E" fillRule="nonzero">
                                <path d="M6.6.073c-.014-.002-.026 0-.04 0C2.983.094.073 2.975.073 6.5c0 3.525 2.914 6.409 6.494 6.426a.56.56 0 0 0 .035.002l.001-.002c3.489-.017 6.326-2.9 6.326-6.426 0-3.525-2.837-6.41-6.329-6.427zm.003 12.098l-.03-.001C3.404 12.155.827 9.61.827 6.5S3.405.845 6.598.83c3.073.015 5.574 2.56 5.574 5.67 0 3.108-2.498 5.652-5.569 5.671z"/>
                                <path d="M6.485 5.38H5.84v4.317h1.32V5.38zM6.509 3.306v-.003l-.004-.001-.008.001-.006-.001v.003c-.399.007-.643.29-.651.659 0 .354.246.64.651.656v.004h.012l.003-.001.003.001v-.001a.636.636 0 0 0 .651-.66c0-.366-.257-.646-.651-.657z"/>
                            </g>
                            </svg>
                        </span>
                        </div>
                        <div className="swatch" onClick={ this.handleClick }>
                                <div className="color"  style={{background :  this.state.primaryColor}} /> <div >{this.state.primaryColor}</div>
                            </div>
                            { this.state.displayColorPicker ? <div className="popover">
                            <div className="cover" onClick={ this.handleClose }/>
                            <ChromePicker disableAlpha={true} color={ this.state.primaryColor } onChange={ this.handleChange } />
                        </div> : null }</div>
                        <div className="km-logo-picker">
                            <div className="km-customizer-heading">Launcher icon:</div>
                            <div className="logo-selection">
                            <div id="icon1" className={this.state.iconIndex === 1 ? "logo-design" : "logo-design km-non-selected"} onClick={  ()=>{this.setState({currentIcon : <KmDefaultIcon /> , hasCustomImage : false, iconIndex : 1 , widgetImageLink:"", changesMade:true})}} style={{background :  this.state.primaryColor}}> <KmDefaultIcon  /></div>
                            <div id ="icon2" className={this.state.iconIndex === 2 ? "logo-design" : "logo-design km-non-selected"} onClick={  ()=>{this.setState({currentIcon : <KmCustomIcon1 /> , hasCustomImage : false , iconIndex : 2 ,  widgetImageLink:"", changesMade:true})}} style={{background :  this.state.primaryColor}}> <KmCustomIcon1 /> </div>
                            <div id ="icon3" className={this.state.iconIndex === 3 ? "logo-design" : "logo-design km-non-selected"} onClick={  ()=>{this.setState({currentIcon : <KmCustomIcon2 /> , hasCustomImage : false , iconIndex : 3 ,  widgetImageLink:"", changesMade:true})}} style={{background :  this.state.primaryColor}}> <KmCustomIcon2 /> </div>
                            <div id ="icon4" className={this.state.iconIndex === 4 ? "logo-design" : "logo-design km-non-selected"} onClick={  ()=>{this.setState({currentIcon : <KmCustomIcon3 /> , hasCustomImage : false , iconIndex : 4 ,  widgetImageLink:"", changesMade:true})}} style={{background :  this.state.primaryColor}}> <KmCustomIcon3 /> </div>
                        </div>
                        </div>
                        <div className="km-logo-picker km-img-picker">
                        <div className={(CommonUtils.isTrialPlan() && CommonUtils.isStartupPlan() ) ||  (!CommonUtils.isTrialPlan() && !CommonUtils.isStartupPlan()) ? "n-vis" : "vis"}>
                        <LockBadge className={"lock-with-text"} text={"Available in Growth Plan"} history={this.props.history} onClickGoTo={"/settings/billing"}/>
                        </div>
                        <div className={ this.state.changedLogoUrl || this.state.widgetImageLink ? "km-chat-icon-img km-chat-icon km-pointer-cursor" : "n-vis" } style={{background:this.state.primaryColor, float:"none", margin:"0"}} onClick={ ()=>{this.setState({currWidgetIcon : this.state.changedLogoUrl , widgetImageLink : this.state.changedLogoUrl, hasCustomImage : true, iconIndex : "image"}) }}>
                           <img src={this.state.changedLogoUrl}  /> 
                         </div>
                            <div className="km-custom-icon-upload">Upload your own launcher icon
                            <input className={(CommonUtils.isTrialPlan() && CommonUtils.isStartupPlan() ) ||  (!CommonUtils.isTrialPlan() && !CommonUtils.isStartupPlan()) ?  "km-hide-input-element km-img-upload-input vis" : "n-vis km-cursor-default"} onClick={this.uploadImage } type="file" id="km-upload-chatwidget-image" accept="image/png, image/jpeg" />
                            <button className="km-cursor-default"><UploadIconButton /></button></div>
                        </div>
                        <div className="km-logo-picker">
                        <button href="#" className="km-button km-button--primary" onClick={this.updateWidgetSettings} disabled ={!this.state.changesMade}>Save Changes</button>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="km-demo-chat-box">
                            <div className="km-chat-box-header" style={{background:this.state.primaryColor}}>
                                <div className="km-chat-box-back-button"> 
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="18" viewBox="0 0 10 18">
                                     <path fill="#FFF" height="24" width="24" fillRule="nonzero" d="M9.653 1.818C10.686.862 9.176-.651 8.223.305L.358 8.188a.98.98 0 0 0 0 1.513l7.865 7.883c.953 1.035 2.463-.478 1.43-1.513L2.582 8.984l7.07-7.166z"/>
                                </svg>
                                </div>
                                <div className="km-chat-box-img"><AgentIcon /></div>
                                <div className="km-chat-box-name">James Drake
                                <div className="km-chat-box-status">Online</div>
                                </div>
                                <div className="km-chat-box-close">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path  fill="#fff" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                                </div>
                            </div>
                            <div className="km-chat-box-converstaions">
                                <div className="km-message-left">
                                    <div className="km-conversation-img"><AgentIcon /></div>
                                    <div className="km-conversation-content">Hi, how may I help you?</div>
                                </div>
                                <div className="km-message-right">
                                    <div className="km-conversation-content" style={{background:this.state.primaryColor}}>Hey, can I change the delivery address of my order? </div>
                                </div>
                                <div className="km-message-left">
                                    <div className="km-conversation-img"><AgentIcon /></div>
                                    <div className="km-conversation-content">Sure, I can help you with this. Can you give me your updated delivery address?</div>
                                </div>
                            </div>
                            <div className={this.state.hasCustomImage ? "n-vis" : "km-chat-icon"} style={{background:this.state.primaryColor}} >
                            {this.state.currentIcon} 
                         </div>
                            <div className={ this.state.hasCustomImage ? "km-chat-icon-img km-chat-icon" : "n-vis" } style={{background:this.state.primaryColor}}>
                           <img src={ this.state.changedLogoUrl }/> 
                         </div>
                        </div>
                      
                    </div>
                    </div>
                    <ReactTooltip />
                </div>)
    }
}

export default ChatWidgetCustomization