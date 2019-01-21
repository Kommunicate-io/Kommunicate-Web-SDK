import React, { Component, PropTypes } from 'react';
import './LiveChatWidget.css';
// import './LiveChatWidgetAssets';
import { AgentIcon, KmDefaultIcon } from './LiveChatWidgetAssets';





const LiveChatWidget = (props) =>{
     
   return(
        <div className="km-demo-chat-box">
        <div className="km-chat-box-header" style={{ background: props.primaryColor }}>
            <div className="km-chat-box-back-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="18" viewBox="0 0 10 18">
                    <path fill="#FFF" height="24" width="24" fillRule="nonzero" d="M9.653 1.818C10.686.862 9.176-.651 8.223.305L.358 8.188a.98.98 0 0 0 0 1.513l7.865 7.883c.953 1.035 2.463-.478 1.43-1.513L2.582 8.984l7.07-7.166z" />
                </svg>
            </div>
            <div className="km-chat-box-img"><AgentIcon /></div>
            <div className="km-chat-box-name">James Drake
                <div className="km-chat-box-status">Online</div>
            </div>
            <div className="km-chat-box-close">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /><path d="M0 0h24v24H0z" fill="none" /></svg>
            </div>
        </div>
        <div className="km-chat-box-converstaions">
            <div className="km-message-left">
                <div className="km-conversation-img"><AgentIcon /></div>
                <div className="km-conversation-content">{props.firstMessage}</div>
            </div>
            <div className="km-message-right">
                <div className={props.hasCustomerMessage ? "km-conversation-content" : "n-vis"} style={{ background: props.primaryColor }}>{props.customerMessage}</div>
            </div>
            <div className={props.hasSecondMessage ? "km-message-left" : "n-vis"}>
                <div className="km-conversation-img"><AgentIcon /></div>
                <div className="km-conversation-content">{props.secondMessage}</div>
            </div>
        </div>
        <div className={props.hasCustomImage ? "n-vis" : "km-chat-icon"} style={{ background: props.primaryColor }} >
            {props.currentIcon}
        </div>
        <div className={props.hasCustomImage ? "km-chat-icon-img km-chat-icon" : "n-vis"} style={{ background: props.primaryColor }}>
            <img src={props.changedLogoUrl} />
        </div>
    </div>
   );
}

LiveChatWidget.defaultProps = {
    primaryColor: '#5553b7',
    hasCustomImage: false ,
    firstMessage:"Hi, how may I help you?",
    secondMessage:"Sure, I can help you with this. Can you give me your updated delivery address?",
    customerMessage:"Hey, can I change the delivery address of my order? ",
    currentIcon : <KmDefaultIcon />,
    hasCustomerMessage : false,
    hasSecondMessage:true
}
  

  

export{ 
    LiveChatWidget
}
