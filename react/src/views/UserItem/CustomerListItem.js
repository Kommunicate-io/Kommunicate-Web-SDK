import React, {Component} from 'react';
import CommonUtils from '../../utils/CommonUtils.js';
import DateTimeUtils from '../../utils/DateTimeUtils';
import { BlockIcon, DeleteIcon, EditIcon } from '../../assets/svg/svgs';

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
        },
        {
          "userId": "bot",
          "groupRole": 2
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
        CONVERSATION_STATUS:0, 
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
      return <span className={'km-contact-icon ' + first_alpha}>{name}</span>
    }
    else {
      return <span className="km-contact-icon alpha_user">{name}</span>
    }
  }

  conversationAssignee() {
    var user = this.props.user;
    var status = user.messagePxy.status;
    var convoStatus = user.convoStatus;
    var assignee = user.assignee? user.assignee: user.displayName||user.userId;
    var convoClass,initalText;
    KOMMUNICATE_CONSTANTS.CLOSED_CONVERSATION_ARRAY.includes(convoStatus)? (convoClass ="assignee-closed",initalText="CLOSED") :(convoClass ="km-custom-text-color assignee-open",initalText="ASSIGNED");
    return <span className ={convoClass}><strong>{initalText} - </strong>{assignee} </span>; 
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
    var latestConversation = user.messagePxy || null;
    var lastMessageTime = user.messagePxy? (window.$kmApplozic.fn.applozic('getDateTime', user.messagePxy.createdAtTime)) : '';
    var asignee = user.assignee? user.assignee : "";
    var openGroupChat = !(user.messagePxy && user.messagePxy.groupId) && lastMessageTime.trim()? false :true;
    var groupId = !openGroupChat ?  user.userId : user.messagePxy && user.messagePxy.groupId ||"" ;
    var image = (user.imageLink)? (user.imageLink) : '';
    var imageExpr = (user.imageLink)? 'img-avatar vis' : 'n-vis';
    var nameExpr = (user.imageLink)? 'n-vis': 'km-alpha-contact-image vis';
    var name = displayName.charAt(0).toUpperCase();
    var createdAtTime = window.$kmApplozic.fn.applozic('getDateTime', user.createdAtTime);
    var lastLoggedInAtTime = (typeof user.lastLoggedInAtTime !== 'undefined')? (window.$kmApplozic.fn.applozic('getDateTime', user.lastLoggedInAtTime)) : '';
    var lastSeenAt = (typeof user.lastSeenAtTime !== 'undefined')? (DateTimeUtils.lastSeenTime(user.lastSeenAtTime)) : '';
    return (<tr className={this.props.user.deactivated ? "km-user-blocked": ""}>
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
                  : DateTimeUtils.lastSeenTime(user.messagePxy.createdAtTime)
              }
            </td>
      }

      {
        this.props.hideConversation == "true"
          ? null
          : <td className="km-conversation-tab-link product product-kommunicate-table-cell km-custom-text-color" data-km-id={groupId + ''} data-isgroup= {openGroupChat + ''}>
              {
                latestConversation == null
                  ? <button type="submit" className="km-button km-button--secondary" onClick={(event) => this.handleClick(event)}>Start Conversation</button>
                  : this.conversationAssignee()
              }
            </td>
      }

      <td className="users-icon-container product product-applozic-table-cell">
        <div onClick={() => this.props.openModal("editUser", user)}>
          <EditIcon />
          <p>Edit</p>
        </div>
      </td>
      <td className="users-icon-container">
        <div onClick={() => this.props.openModal("deleteUser", user)}>
          <DeleteIcon />
          <p>Delete</p>
        </div>
      </td>
      <td className="users-icon-container">
        <div onClick={() => this.props.openModal(this.props.user.deactivated ? "unBlockUser" : "blockUser", user)}>
          <BlockIcon />
          <p>{this.props.user.deactivated ? "Unblock" : "Block"}</p>
        </div>
      </td>
    </tr>);
  }
}

export default CustomerListItem;
