import React, {Component} from 'react';
import moment from 'moment';
import axios from 'axios';
import {Dropdown, DropdownMenu, DropdownItem, Progress} from 'reactstrap';
import {getConfig} from '../../config/config.js';
import CommonUtils from '../../utils/CommonUtils.js';

class CustomerListItem extends Component {

  constructor(props) {
    super(props);
  }

  handleClick() {
    var user = this.props.user;
    var groupName = CommonUtils.getDisplayName(user);
    var agentId = window.$kmApplozic.fn.applozic("getLoggedInUser");
    var conversationDetail = {
      agentId: agentId,
      botIds: ["bot"],
      //groupName: [agentId, user.userId].sort().join().replace(/,/g, "_").substring(0, 250),
      groupName: groupName,
      type: 10,
      admin: agentId,
      users: [
        {
          "userId": user.userId,
          "groupRole": 3
        }
      ], //userId of user
      //clientGroupId: ''
    };

    window.$kmApplozic.fn.applozic("createGroup", {
      //createUrl: getConfig().kommunicateApi+"/conversations/create",
      groupName: conversationDetail.groupName,
      type: conversationDetail.type,
      admin: conversationDetail.agentId,
      users: conversationDetail.users,
      clientGroupId: conversationDetail.clientGroupId,
      metadata: {
        CREATE_GROUP_MESSAGE: "",
        REMOVE_MEMBER_MESSAGE: "",
        ADD_MEMBER_MESSAGE: "",
        JOIN_MEMBER_MESSAGE: "",
        GROUP_NAME_CHANGE_MESSAGE: "",
        GROUP_ICON_CHANGE_MESSAGE: "",
        GROUP_LEFT_MESSAGE: "",
        DELETED_GROUP_MESSAGE: "",
        GROUP_USER_ROLE_UPDATED_MESSAGE: "",
        GROUP_META_DATA_UPDATED_MESSAGE: "",
        CONVERSATION_ASSIGNEE: conversationDetail.agentId,
        KM_CONVERSATION_TITLE: conversationDetail.groupName,
        //ALERT: "false",
        HIDE: "true",
        WELCOME_MESSAGE: ""
      },
      callback: function(response) {
        //console.log("response", response);
        if (response.status === 'success') {
          window.$kmApplozic.fn.applozic('loadGroupTab', response.groupId);
          window.appHistory.push("/conversations");
        }
      }
    });
  }

  lastSeenTime(lastSeenAtTime) {
    var lastSeen;
    var minInTwoDays = 2880;
    var date = new Date(lastSeenAtTime);
    var currentDate = new Date();
    var diff = Math.abs(currentDate - date);
    var minutes = Math.floor((diff / 1000) / 60);
    if (minutes < minInTwoDays) {
      if (minutes < 60) {
        lastSeen = moment.unix(lastSeenAtTime / 1000).fromNow();
      } else {
        var hour = Math.floor(minutes / 60)
        lastSeen = hour + " hrs ago";
      }
    } else {
      lastSeen = moment.unix(lastSeenAtTime / 1000).format("DD MMMM YYYY");
    }
    return lastSeen;
  }

  getContactImageByAlphabet() {
    var displayIconColor;
    var user = this.props.user;
    var displayName = CommonUtils.getDisplayName(user);
    var name = displayName.charAt(0).toUpperCase();
    if (typeof name !== "string" || typeof name === 'undefined' || name === "") {
      return <span className="km-contact-icon km-icon-user km-alpha-user">{name}</span>
    }
    var first_alpha = name.charAt(0);
    var letters = /^[a-zA-Z0-9]+$/;
    if (first_alpha.match(letters)) {
      first_alpha = "alpha_" + first_alpha.toUpperCase();
      return <span className={`km-contact-icon ${first_alpha}`}>{name}</span>
    }
    else {
      return <span className="km-contact-icon alpha_user">{name}</span>
    }
  }

  converastionAssignee() {
    var convoStatus;
    var displayIconColor;
    var user = this.props.user;
    var status = user.messagePxy.status;
    var assignee = user.assignee
      ? user.assignee
      : "";
    var groupId = user.messagePxy
      ? user.messagePxy.groupId
      : "";
    window.$kmApplozic.fn.applozic("getGroup", {
      groupId: groupId,
      callback: function(response) {
        if (response) {
          convoStatus = response.metadata.CONVERSATION_STATUS;
        }
      }
    });
    if (assignee !== (undefined || "" || null)) {
      if (convoStatus == 0) {
        return <span className="assignee-open">
          <strong>
            ASSIGNED -</strong>{assignee}
        </span>;
      } else if (convoStatus == 2) {
        return <span className="assignee-closed">
          <strong>
            CLOSED -</strong>{assignee}
        </span>;
      }
    } else
      return "";
    }

  render() {
    var conversationStyle = {
      textDecoration: 'underline',
      color: '#0000EE'
    };
    var conversationClass = this.props.hideConversation? 'n-vis': 'vis';
    var user = this.props.user;
    var emailId = user.email;
    var status = user.status;
    var displayName = CommonUtils.getDisplayName(user);
    var online = (user.connected)? 'avatar-status badge-success': 'n-vis';
    var latestConversation = user.messagePxy? user.messagePxy.message: null;
    var lastMessageTime = user.messagePxy? (window.$kmApplozic.fn.applozic('getDateTime', user.messagePxy.createdAtTime)) : '';
    var asignee = user.assignee? user.assignee : "";
    var groupId = user.messagePxy? user.messagePxy.groupId : "";
    var image = (user.imageLink)? (user.imageLink) : '';
    var imageExpr = (user.imageLink)? 'img-avatar vis' : 'n-vis';
    var nameExpr = (user.imageLink)? 'n-vis': 'km-alpha-contact-image vis';
    var name = displayName.charAt(0).toUpperCase();
    var createdAtTime = window.$kmApplozic.fn.applozic('getDateTime', user.createdAtTime);
    var lastLoggedInAtTime = (typeof user.lastLoggedInAtTime !== 'undefined')? (window.$kmApplozic.fn.applozic('getDateTime', user.lastLoggedInAtTime)) : '';
    var lastSeenAt = (typeof user.lastSeenAtTime !== 'undefined')? (CommonUtils.lastSeenTime(user.lastSeenAtTime)) : '';
    return (<tr>
      <td className="text-center">
        <div>
          <div className="customer-section-design">

            <div className="avatar">
              <img src={user.imageLink} className={imageExpr}/>
              <div className={nameExpr}>
                {this.getContactImageByAlphabet()}
              </div>
              <span className={online}></span>

            </div>
            <div style={{
                  textAlign: "left"
                }}>
              <p className="display-name-customer">
                {displayName}</p>
              <p className="email-id-customer">
                {emailId}</p>
            </div>
          </div>
        </div>
      </td>
      <td>
        <div className="small text-muted"></div>
        <span>{lastSeenAt}</span>
      </td>

      {
        this.props.hideConversation == "true"
          ? null
          : <td>
              {
                latestConversation == null
                  ? <span style={{
                        color: "#a4a3a9",
                        fontSize: "13px"
                      }}>No Conversation</span>
                  : CommonUtils.lastSeenTime(user.messagePxy.createdAtTime)
              }
            </td>
      }

      {
        this.props.hideConversation == "true"
          ? null
          : <td className="km-conversation-tab-link" data-km-id={groupId + ''} data-isgroup="true">
              {
                latestConversation == null
                  ? <button type="submit" className="km-button km-button--secondary" onClick={(event) => this.handleClick(event)}>Start Conversation</button>
                  : this.converastionAssignee()
              }
            </td>
      }

      <td className="text-center n-vis">
        <img src={'img/flags/USA.png'} alt="USA" style={{
            height: 24 + 'px'
          }}/>
      </td>
      <td className="text-center n-vis">
        <i className="fa fa-cc-mastercard" style={{
            fontSize: 24 + 'px'
          }}></i>
      </td>
      <td className="n-vis">
        <div className="small text-muted n-vis">Last Seen</div>
        <strong className="n-vis">{lastSeenAt}</strong>
      </td>
    </tr>);
  }
}

export default CustomerListItem;
