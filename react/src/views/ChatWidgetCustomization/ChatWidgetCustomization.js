import React, { Component } from 'react';
import CommonUtils from '../../utils/CommonUtils';
import {SettingsHeader} from '../../components/SettingsComponent/SettingsComponents';
import { ChromePicker } from 'react-color';
import Notification from '../model/Notification';
import {KmDefaultIcon , KmCustomIcon1, KmCustomIcon2, KmCustomIcon3, AgentIcon,UploadIconButton} from './ChatWidgetCustomizationAssets';
import './ChatWidgetCustomization.css';
import {sendProfileImage,updateAppSetting,getAppSetting} from '../../utils/kommunicateClient';
import LockBadge from '../../components/LockBadge/LockBadge';



class ChatWidgetCustomization extends Component{
    constructor() {
        super();
        this.state = {
            displayColorPicker: false,
            primaryColor:'#5c5aa7',
            secondaryColor:"",
            currentIcon : <KmDefaultIcon />,
            chatWidgetImagefileObject: "",
            widgetImageLink: "",
            hasCustomImage : false,
            changesMade : false,
            iconIndex : 1 ,
            currWidgetIcon: "",
            customSettingsEnabled: false
        }
       
    }
    componentWillMount(){
        this.getwidgetSettings();
    }
    componentDidMount() {
        this.setState(this.widgetTheme);

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
                that.setState({ widgetImageLink: response.data.profileImageUrl });
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
            iconIndex : this.state.iconIndex,
            customSettingsEnabled : this.state.customSettingsEnabled
        }
        var widgetSettingsJson = {
            "widgetTheme":this.widgetTheme
        };
        updateAppSetting("", widgetSettingsJson).then(response => {
            this.setState.changesMade = false;
            Notification.info(response.data.message);
            this.setState({changesMade : false});
            }).catch(err => {
            Notification.info(err)
            this.setState.changesMade = false;
            })
    };
    
    getwidgetSettings = () => {
        return Promise.resolve(getAppSetting().then(response => {
            if(response.status == 200) {
                var widgetThemeResponse = response.data.response.widgetTheme;
                this.setState(widgetThemeResponse);
                widgetThemeResponse.iconIndex == "image"? this.setState({ hasCustomImage : true }) : (document.getElementById("icon"+this.state.iconIndex).click());
                this.setState({changesMade : false});
            }
            })).catch(err => {
            // console.log(err);
            })
    }


    render(){


      return  (<div className = "animated fadeIn km-chat-customization-wrapper">
                <div className= "km-coming-soon-style"> COMING SOON </div>
                <SettingsHeader />
                    <div className="row n-vis">
                    <div className="col-md-6">
                        <div className="km-color-picker">
                        <div className="km-customizer-heading">Color:</div>
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
                            <div id="icon1" className={this.state.iconIndex === 1 ? "logo-design" : "logo-design km-non-selected"} onClick={  ()=>{this.setState({currentIcon : <KmDefaultIcon /> , hasCustomImage : false, iconIndex : 1 , changesMade:true})}} style={{background :  this.state.primaryColor}}> <KmDefaultIcon  /></div>
                            <div id ="icon2" className={this.state.iconIndex === 2 ? "logo-design" : "logo-design km-non-selected"} onClick={  ()=>{this.setState({currentIcon : <KmCustomIcon1 /> , hasCustomImage : false , iconIndex : 2 , changesMade:true})}} style={{background :  this.state.primaryColor}}> <KmCustomIcon1 /> </div>
                            <div id ="icon3" className={this.state.iconIndex === 3 ? "logo-design" : "logo-design km-non-selected"} onClick={  ()=>{this.setState({currentIcon : <KmCustomIcon2 /> , hasCustomImage : false , iconIndex : 3 , changesMade:true})}} style={{background :  this.state.primaryColor}}> <KmCustomIcon2 /> </div>
                            <div id ="icon4" className={this.state.iconIndex === 4 ? "logo-design" : "logo-design km-non-selected"} onClick={  ()=>{this.setState({currentIcon : <KmCustomIcon3 /> , hasCustomImage : false , iconIndex : 4 , changesMade:true})}} style={{background :  this.state.primaryColor}}> <KmCustomIcon3 /> </div>
                        </div>
                        </div>
                        <div className="km-logo-picker km-img-picker">
                        <div className={(CommonUtils.isTrialPlan() && CommonUtils.isStartupPlan() ) ||  (!CommonUtils.isTrialPlan() && !CommonUtils.isStartupPlan()) ? "n-vis" : "vis"}>
                        <LockBadge className={"lock-with-text"} text={"Available in Growth Plan"} history={this.props.history} onClickGoTo={"/settings/billing"}/>
                        </div>
                        <div className={ this.state.hasCustomImage && this.setState.currWidgetIcon  ? "km-chat-icon-img km-chat-icon" : "n-vis" } style={{background:this.state.primaryColor, float:"none", margin:"0"}}>
                           <img src={this.state.currWidgetIcon} /> 
                         </div>
                            <div className="km-custom-icon-upload">Upload your own launcher icon
                            <input onClick={this.uploadImage } className="km-hide-input-element km-img-upload-input" type="file" id="km-upload-chatwidget-image" accept="image/png, image/jpeg" />
                            <button ><UploadIconButton /></button></div>
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
                           <img src={ this.state.widgetImageLink }/> 
                         </div>
                        </div>
                      
                    </div>
                    </div>
                    <div>
                        <div className="km-coming-soon-state">
                            <svg xmlns="http://www.w3.org/2000/svg" width="396" height="198" viewBox="0 0 396 198">
                                <g fill="none" fillRule="evenodd" transform="translate(0 -.381)">
                                    <path fill="#F7F7F7" fillRule="nonzero" d="M13.155 111.445a12.421 12.421 0 0 1-3.917-24.216l24.785-8.12c6.51-2.143 13.526 1.396 15.67 7.906 2.143 6.51-1.396 13.526-7.906 15.67L17 110.804c-1.239.42-2.538.636-3.846.641zM383.443 85.52a12.421 12.421 0 0 1 3.918 24.216l-24.786 8.119a12.41 12.41 0 1 1-7.763-23.575l24.785-8.12a12.108 12.108 0 0 1 3.846-.64zM241.78 118.71c-2.12-6.509 1.412-13.508 7.907-15.67l86.678-28.489a12.421 12.421 0 0 0-3.917-24.215 12.108 12.108 0 0 0-3.846.64l-37.606 12.251c-14.002-35.778-47.53-60.15-85.883-62.43-38.353-2.279-74.532 17.95-92.673 51.818L67.07 67.429a12.421 12.421 0 0 0 3.918 24.216 12.108 12.108 0 0 0 3.846-.641l59.827-19.444a12.108 12.108 0 0 1 3.846-.64 12.421 12.421 0 0 1 3.918 24.215l-82.192 27.35a12.421 12.421 0 0 0 3.918 24.215 12.108 12.108 0 0 0 3.846-.64l39.101-12.75c13.63 36.705 47.716 61.844 86.809 64.022 39.093 2.179 75.761-19.016 93.385-53.98l42.236-13.816a12.421 12.421 0 0 0-3.918-24.216 12.108 12.108 0 0 0-3.846.64l-64.314 20.655c-6.51 2.138-13.52-1.4-15.67-7.905z"/>
                                    <circle cx="126.072" cy="146.138" r="4.701" fill="#EA7AE7" fillRule="nonzero"/>
                                    <path fill="#EFEFEF" fillRule="nonzero" d="M273.796 104.251v-36.78a24.03 24.03 0 0 0-24.031-24.03h-21.858c-13.272 0-24.031 10.76-24.031 24.03 0 13.273 10.759 24.032 24.03 24.032h23.668c1.045.06 2.08.24 3.084.534.838.355 1.626.82 2.343 1.381l14.615 12.037s1.332 1.14 1.802.905c.47-.235.378-2.109.378-2.109z"/>
                                    <path stroke="#EC519E" strokeWidth="5" d="M273.796 104.251v-36.78a24.03 24.03 0 0 0-24.031-24.03h-21.858c-13.272 0-24.031 10.76-24.031 24.03 0 13.273 10.759 24.032 24.03 24.032h23.668c1.045.06 2.08.24 3.084.534.838.355 1.626.82 2.343 1.381l14.615 12.037s1.332 1.14 1.802.905c.47-.235.378-2.109.378-2.109z"/>
                                    <path fill="#EEE" fillRule="nonzero" stroke="#07AAC5" strokeWidth="5" d="M122.034 169.185c.84.414 3.205-1.623 3.205-1.623l26.003-21.41a18.518 18.518 0 0 1 4.167-2.45 24.337 24.337 0 0 1 5.484-.955H203c23.601 0 42.734-19.132 42.734-42.733 0-23.602-19.133-42.734-42.734-42.734h-38.888c-23.601 0-42.734 19.132-42.734 42.734v65.39s-.2 3.347.656 3.781zm79.77-78.83a5.57 5.57 0 0 1 11.103 0v18.376a5.57 5.57 0 0 1-11.104 0V90.356zm-23.796-8.667a5.57 5.57 0 0 1 11.103 0v35.704a5.57 5.57 0 0 1-11.103 0V81.688zm-23.803 8.668a5.57 5.57 0 0 1 11.11 0v18.375a5.57 5.57 0 0 1-11.11 0V90.356z"/>
                                </g>
                            </svg>
                        </div>
                        <div className="km-coming-soon-text">
                            Change the color of your chat widget, choose from our multiple chat icons or upload your own chat icon
                            <div className= "km-coming-soon-style" style={{marginTop:"0px"}}> COMING SOON </div>
                        </div>
                    </div>
                </div>)
    }
}

export default ChatWidgetCustomization