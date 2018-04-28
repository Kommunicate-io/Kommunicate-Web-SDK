import React, { Component } from 'react';
import axios from 'axios';
import { Dropdown, DropdownMenu, DropdownItem, Progress } from 'reactstrap';
import { getConfig } from '../../config/config.js';

class UserItem extends Component {

    constructor(props) {
      super(props);
    }

    handleClick() {
      var user = this.props.user;
      //Todo: set conversationDetail
      /**
       * {"groupName":"Devashish","users":[{"userId":"devashish@kommunicate.io","groupRole":1},{"userId":"bot","groupRole":2}],"type":10,"admin":"devashish@kommunicate.io","metadata":{"CREATE_GROUP_MESSAGE":"","REMOVE_MEMBER_MESSAGE":"","ADD_MEMBER_MESSAGE":"","JOIN_MEMBER_MESSAGE":"","GROUP_NAME_CHANGE_MESSAGE":"","GROUP_ICON_CHANGE_MESSAGE":"","GROUP_LEFT_MESSAGE":"","DELETED_GROUP_MESSAGE":"","GROUP_USER_ROLE_UPDATED_MESSAGE":"","GROUP_META_DATA_UPDATED_MESSAGE":"","CONVERSATION_ASSIGNEE":"devashish@kommunicate.io","KM_CONVERSATION_TITLE":"Devashish","HIDE":"true"}}
       */
      var agentId = window.$kmApplozic.fn.applozic("getLoggedInUser");
      var conversationDetail = {
        agentId: agentId, //replace with logged in user id
        botIds: ["bot"], //optional
        //groupName: [agentId, user.userId].sort().join().replace(/,/g, "_").substring(0, 250),
        groupName: user.displayName,
        type: 10,
        admin: agentId, //replace with logged in user id
        users: [{"userId":user.userId,"groupRole":3}], //userId of user
        //clientGroupId: ''
      };

      window.$kmApplozic.fn.applozic("createGroup", {
        createUrl: getConfig().kommunicateApi+"/conversations/create",
        groupName: conversationDetail.groupName,
        type: conversationDetail.type,
        admin: conversationDetail.agentId,
        users: conversationDetail.users,
        clientGroupId:conversationDetail.clientGroupId,
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
            KM_CONVERSATION_TITLE:conversationDetail.groupName,
            //ALERT: "false",
            HIDE: "true"
        },
        callback: function (response) {
            console.log("response", response);
            if (response.status === 'success') {
              window.$kmApplozic.fn.applozic('loadGroupTab', response.groupId);
              window.appHistory.push("/conversations");
            }
        }
      });
      //window.$kmApplozic.fn.applozic('loadTab', user.userId);
    }
   
    render() {
        var user = this.props.user;
        var online = (user.connected === true) ? 'avatar-status badge-success ':'n-vis';
        var latestConversation=user.messagePxy?user.messagePxy.message:null;
        var lastMessageTime=user.messagePxy?(window.$kmApplozic.fn.applozic('getDateTime',user.messagePxy.createdAtTime)):'';
        var asignee=user.assignee?user.assignee:"";
        var groupId=user.messagePxy?user.messagePxy.groupId:"";
        var image = (user.imageLink) ? (user.imageLink):'';
        var imageExpr = (user.imageLink) ? 'img-avatar vis' :'n-vis';
        var nameExpr =  (user.imageLink) ? 'n-vis' :'km-alpha-contact-image vis';
        var name = (user.displayName) ? (user.displayName).charAt(0).toUpperCase():(user.userId).charAt(0).toUpperCase();
        var createdAtTime = window.$kmApplozic.fn.applozic('getDateTime',user.createdAtTime);
        var lastLoggedInAtTime = (typeof user.lastLoggedInAtTime !== 'undefined') ?(window.$kmApplozic.fn.applozic('getDateTime',user.lastLoggedInAtTime)): '';
        var lastSeenAt = (typeof user.lastSeenAtTime !== 'undefined') ?(window.$kmApplozic.fn.applozic('getDateTime',user.lastSeenAtTime)):lastLoggedInAtTime;
        return(
                  <tr>
                    <td className="text-center">
                      <div className="avatar">
                        <img src={user.imageLink} className= {imageExpr}/>
                        <div className ={nameExpr}><span className="km-contact-icon">{name}</span></div>
                        <span className={online}></span>
                      </div>
                    </td>
                    <td>
                      <div>{user.userId}</div>
                      <div className="small text-muted">
                        <span>New</span> | Registered: {createdAtTime}
                      </div>
                    </td>
                     <td className="text-center">
                      <div className="small text-muted n-vis"></div>
                      <strong> </strong>
                    </td>
                    <td>
                      <div className="small text-muted">Last Seen</div>
                      <strong>{lastSeenAt}</strong>
                      <div className="small text-muted">Last Loggedin at {lastLoggedInAtTime} </div>
                    </td>
                    <td className="km-conversation-tab-link" data-km-id={groupId+''} data-isgroup="true">
                      <strong className="km-truncate-block">
                      
                      {latestConversation == null ?
                        <button type="submit" className="btn btn-sm btn-primary"  onClick={(event) => this.handleClick(event)}>Start New</button>
                        :
                        latestConversation
                      }
                      
                      </strong>
                      <div className="small text-muted">{lastMessageTime} </div>
                    </td>
                    <td>
                      <div>{asignee}</div>
                      <div className="small text-muted">
                      </div>
                    </td>
                    <td className="text-center n-vis">
                      <img src={'img/flags/USA.png'} alt="USA" style={{height: 24 + 'px'}}/>
                    </td>
                    <td>
                      <div className="clearfix n-vis">
                        <div className="float-left">
                          <strong>50%</strong>
                        </div>
                        <div className="float-right">
                          <small className="text-muted">Jun 11, 2015 - Jul 10, 2015</small>
                        </div>
                      </div>
                      <Progress className="progress-xs n-vis" color="success" value="50" />
                    </td>
                    <td className="text-center n-vis">
                      <i className="fa fa-cc-mastercard" style={{fontSize: 24 + 'px'}}></i>
                    </td>
                    <td className="n-vis">
                      <div className="small text-muted n-vis">Last Seen</div>
                      <strong className="n-vis">{lastSeenAt}</strong>
                    </td>
                  </tr>
        );
    }
}


export default UserItem;