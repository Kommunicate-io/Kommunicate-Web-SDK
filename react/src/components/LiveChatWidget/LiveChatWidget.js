import React, { Component, PropTypes } from 'react';
import './LiveChatWidget.css';
// import './LiveChatWidgetAssets';
import { AgentIcon, KmDefaultIcon, AttachmentIcon } from './LiveChatWidgetAssets';





const LiveChatWidget =  (props) =>{

    LiveChatWidget.defaultProps = {
        primaryColor: '#5553b7',
        hasCustomImage: false ,
        agentMessages:["Hi, how may I help you?", "Sure, I can help you with this. Can you give me your updated delivery address?","Please wait our agents will be with you shortly."],
        welcomeMessagesDefault:["This is an example of how a welcome message will look like","This is an example of how a second welcome message will look like","This is an example of how a third welcome message will look like"],
        customerMessage:"Hey, can I change the delivery address of my order? ",
        awayMessage:"This is an example of how an away message will look like to your users",
        currentIcon : <KmDefaultIcon />,
        hasCustomerMessage : false,
        hasFirstMessage:true,
        hasSecondMessage:true,
        hasThirdMessage:false,
        hasAwayMessage:false,
        hasTextBox:false,
        hideChatIcon:false,
        status: 'Online'
    }
     
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
                <div className="km-chat-box-status">{props.status}</div>
            </div>
            <div className="km-chat-box-close">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /><path d="M0 0h24v24H0z" fill="none" /></svg>
            </div>
        </div>
        <div className="km-chat-box-converstaions">
        {/* //for mapping welcome messages */}
        {
                props.welcomeMessages && props.welcomeMessages.map((data, index) => (
                    <div className="km-message-left" key={index}>
                        <div className="km-conversation-img"><AgentIcon /></div>
                        <div className="km-conversation-content">{data.messageField ? data.messageField : (props.welcomeMessagesDefault ? props.welcomeMessagesDefault[index] : "")}</div>
                    </div>
                ))
            }
            <div className={props.hasFirstMessage ? "km-message-left" : "n-vis"}>
                <div className="km-conversation-img"><AgentIcon /></div>
                <div className="km-conversation-content">{props.agentMessages ? props.agentMessages[0] : ""}</div>
            </div>
            <div className="km-message-right">
                <div className={props.hasCustomerMessage ? "km-conversation-content" : "n-vis"} style={{ background: props.primaryColor }}>{props.customerMessage}</div>
            </div>
            <div className={props.hasSecondMessage ? "km-message-left" : "n-vis"}>
                <div className="km-conversation-img"><AgentIcon /></div>
                <div className="km-conversation-content">{props.agentMessages ? props.agentMessages[1] : ""}</div>
            </div>
            <div className={props.hasThirdMessage ? "km-message-left" : "n-vis"}>
                <div className="km-conversation-img"><AgentIcon /></div>
                <div className="km-conversation-content">{props.agentMessages ? props.agentMessages[2] : ""}</div>
            </div>
            <div className={props.hasAwayMessage ? "away-message--demo-wrapper" : "n-vis"}>
                <hr style={{borderTop: "dotted 1px", borderColor : "#bbb"}} />
                <div className="away-message-demo-">{props.awayMessage}</div>
            </div>
            <div  className={props.hasTextBox ? "live-chat-demo-textbox" : "n-vis"}>
            <AttachmentIcon />
            </div>
        </div>
        <div className={props.hasCustomImage || props.hideChatIcon ? "n-vis" : " km-chat-icon km-chat-icon-sidebox"} style={{ background: props.primaryColor }} >
            {props.currentIcon}
        </div>
        <div className={props.hasCustomImage ? "km-chat-icon-img km-chat-icon-sidebox  km-chat-icon" : "n-vis"} style={{ background: props.primaryColor }}>
            <img src={props.changedLogoUrl} />
        </div>
    </div>
   );
}


  

  

export{ 
    LiveChatWidget
}
