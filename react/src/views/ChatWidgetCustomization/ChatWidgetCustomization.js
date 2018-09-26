import React, { Component } from 'react';
import CommonUtils from '../../utils/CommonUtils';
import {SettingsHeader} from '../../components/SettingsComponent/SettingsComponents';
import { ChromePicker } from 'react-color';
import Notification from '../model/Notification';
import {KmDefaultIcon , KmCustomIcon1, KmCustomIcon2, KmCustomIcon3, AgentIcon,UploadIconButton} from './ChatWidgetCustomizationAssets';
import './ChatWidgetCustomization.css';
import {sendProfileImage} from '../../utils/kommunicateClient';
import LockBadge from '../../components/LockBadge/LockBadge';



class ChatWidgetCustomization extends Component{
    constructor() {
        super();
        this.state = {
            displayColorPicker: false,
            color:'#5c5aa7',
            currentIcon : <KmDefaultIcon />,
            chatWidgetImagefileObject: "",
            widgetImageLink: "",
            hasCustomImage : false,
            changesMade : false,
            iconIndex : 1,
            currWidgetIcon: ""
    }

}


        handleClick = () => {
            this.setState({ displayColorPicker: !this.state.displayColorPicker })
        };

        handleClose = () => {
            this.setState({ displayColorPicker: false })
        };

        handleChange = (changedColor) => {
            this.setState({ color: changedColor.hex , changesMade:true });   
            
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


    render(){


      return  (<div className = "animated fadeIn km-chat-customization-wrapper">
                <SettingsHeader />
                    <div className="row">
                    <div className="col-md-6">
                        <div className="km-color-picker">
                        <div className="km-customizer-heading">Color:</div>
                        <div className="swatch" onClick={ this.handleClick }>
                                <div className="color"  style={{background :  this.state.color}} /> <div >{this.state.color}</div>
                            </div>
                            { this.state.displayColorPicker ? <div className="popover">
                            <div className="cover" onClick={ this.handleClose }/>
                            <ChromePicker disableAlpha={true} color={ this.state.color } onChange={ this.handleChange } />
                        </div> : null }</div>
                        <div className="km-logo-picker">
                            <div className="km-customizer-heading">Launcher icon:</div>
                            <div className="logo-selection">
                            <div className={this.state.iconIndex === 1 ? "logo-design" : "logo-design km-non-selected"} onClick={  ()=>{this.setState({currentIcon : <KmDefaultIcon /> , hasCustomImage : false, iconIndex : 1 , changesMade:true})}} style={{background :  this.state.color}}> <KmDefaultIcon /> </div>
                            <div className={this.state.iconIndex === 2 ? "logo-design" : "logo-design km-non-selected"} onClick={  ()=>{this.setState({currentIcon : <KmCustomIcon1 /> , hasCustomImage : false , iconIndex : 2 , changesMade:true})}} style={{background :  this.state.color}}> <KmCustomIcon1 /> </div>
                            <div className={this.state.iconIndex === 3 ? "logo-design" : "logo-design km-non-selected"} onClick={  ()=>{this.setState({currentIcon : <KmCustomIcon2 /> , hasCustomImage : false , iconIndex : 3 , changesMade:true})}} style={{background :  this.state.color}}> <KmCustomIcon2 /> </div>
                            <div className={this.state.iconIndex === 4 ? "logo-design" : "logo-design km-non-selected"} onClick={  ()=>{this.setState({currentIcon : <KmCustomIcon3 /> , hasCustomImage : false , iconIndex : 4 , changesMade:true})}} style={{background :  this.state.color}}> <KmCustomIcon3 /> </div>
                        </div>
                        </div>
                        <div className="km-logo-picker km-img-picker">
                        <div className={(CommonUtils.isTrialPlan() && CommonUtils.isStartupPlan() ) ||  (!CommonUtils.isTrialPlan() && !CommonUtils.isStartupPlan()) ? "n-vis" : "vis"}>
                        <LockBadge className={"lock-with-text"} text={"Available in Growth Plan"} history={this.props.history} onClickGoTo={"/settings/billing"}/>
                        </div>
                        <div className={ this.state.hasCustomImage && this.setState.currWidgetIcon  ? "km-chat-icon-img km-chat-icon" : "n-vis" } style={{background:this.state.color, float:"none", margin:"0"}}>
                           <img src={this.state.currWidgetIcon} /> 
                         </div>
                            <div className="km-custom-icon-upload">Upload your own launcher icon
                            <input onClick={this.uploadImage } className="km-hide-input-element km-img-upload-input" type="file" id="km-upload-chatwidget-image" accept="image/png, image/jpeg" />
                            <button ><UploadIconButton /></button></div>
                        </div>
                        <div className="km-logo-picker">
                        <button href="#" className="km-button km-button--primary" disabled ={!this.state.changesMade}>Save Changes</button>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="km-demo-chat-box">
                            <div className="km-chat-box-header" style={{background:this.state.color}}>
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
                                    <div className="km-conversation-content" style={{background:this.state.color}}>Hey, can I change the delivery address of my order? </div>
                                </div>
                                <div className="km-message-left">
                                    <div className="km-conversation-img"><AgentIcon /></div>
                                    <div className="km-conversation-content">Sure, I can help you with this. Can you give me your updated delivery address?</div>
                                </div>
                            </div>
                            <div className={this.state.hasCustomImage ? "n-vis" : "km-chat-icon"} style={{background:this.state.color}} >
                            {this.state.currentIcon} 
                         </div>
                            <div className={ this.state.hasCustomImage ? "km-chat-icon-img km-chat-icon" : "n-vis" } style={{background:this.state.color}}>
                           <img src={ this.state.widgetImageLink } /> 
                         </div>
                        </div>
                      
                    </div>
                    </div>
                </div>)
    }
}

export default ChatWidgetCustomization