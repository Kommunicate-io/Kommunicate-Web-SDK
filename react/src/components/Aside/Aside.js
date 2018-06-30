import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Progress } from 'reactstrap';
import classnames from 'classnames';
import classes from './Aside.css';
import CommonUtils from '../../utils/CommonUtils';
import {updateApplozicUser, getThirdPartyListByApplicationId, updateConversation,getUsersByType} from '../../utils/kommunicateClient';
import { thirdPartyList } from './km-thirdparty-list'
import Modal from 'react-responsive-modal';
import ModalContent from './ModalContent.js';
import LocationIcon from './Icons/location.png';
import DomainIcon from './Icons/web-icon.png';
import FacebookIcon from './Icons/facebook-icon.png';
import CrunchbaseIcon from './Icons/crunchbaseIcon-icon.png';
import TwitterIcon from './Icons/twitter-icon.png';
import LinkedinIcon from './Icons/linkedin-icon.png';
import ReactTooltip from 'react-tooltip';
import { USER_TYPE, GROUP_ROLE, LIZ, DEFAULT_BOT } from '../../utils/Constant';
import ReactModal from 'react-modal';
import {PseudoNameImage} from '../../views/Faq/LizSVG';


class Aside extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      applicationId : "",
      activeTab: '1',
      assignee: '',
      visibleIntegartion:false,
      visibleReply:true,
      modalIsOpen:false,
      clickedButton:-1,
      disableButton:true,
      agents : new Array(),
      clearbitKey:"",
      botRouting : false,
      statuses: {
        0: 'Open',
        2: 'Close',
        3: 'Spam',
        4: 'Duplicate'
      },
      group: null,
      modalOpen: false,
      hideInfoBox: false
    };
    this.dismissInfo = this.dismissInfo.bind(this);
  }
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  componentDidMount() {
    this.getThirdparty ();
     if(CommonUtils.getUserSession() === null){
       //window.location ="#/login";
       window.appHistory.replace('/login');
       return;
     }else {
       //window.location ="/dashboard";
       //window.appHistory.push('/dashboard');
     }
     window.Aside = this;
     
  }
  componentWillMount() {
    let userSession = CommonUtils.getUserSession();
    let applicationId = userSession.application.applicationId;
    let botRouting = userSession.botRouting;
    let clearbitKey = userSession.clearbitKey;
    this.setState({
      clearbitKey: clearbitKey,
      applicationId:applicationId,
      botRouting:botRouting
     },this.loadAgents);
     if (typeof(Storage) !== "undefined") {
      (localStorage.getItem("KM_PSEUDO_INFO") === null ) ?
        this.setState({hideInfoBox: false}) : this.setState({hideInfoBox: true})      
    } else {
        console.log("Please update your browser.");
    }
  }
  
  getThirdparty = () => {
    getThirdPartyListByApplicationId().then(response => {
      if(response !== undefined ) {
        let zendeskKeys = response.data.message.filter(function (integration) {
          return integration.type == 2;});
          if(zendeskKeys.length > 0 ){
            this.setState({disableButton:false}) 
          }
      }     
    }).catch(err => {
      console.log("erroe while fetching zendesk integration keys",err)
    });
    
  }
  changeTabToIntegration = () => {
    this.setState({
      visibleIntegartion: false,
      visibleReply:true
    })
  }
  changeTabToReply = () => {
    this.setState({
      visibleIntegartion:true,
      visibleReply:false
    })
  }
  openModal = (index) => {
    this.setState({ modalIsOpen: true});
  }
  onOpenModal = () => {
    this.setState({ modalOpen: true});
  }
  onCloseModal = () => {
    this.setState({ modalOpen: false});
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  }

  loadAgents() {
     // var that = this;
      // window.$kmApplozic.fn.applozic('fetchContacts', {roleNameList: ['APPLICATION_WEB_ADMIN'], callback: function(response) {
      //   if(response.status === 'success') {
      //         var assign = window.$kmApplozic("#assign");
      //         that.setState({agents: response.response.users});
      //         window.$kmApplozic.each(response.response.users, function() {
      //             assign.append(window.$kmApplozic("<option />").val(this.userId).text(CommonUtils.getDisplayName(this)));
      //         });
      //         if(sessionStorage.getItem("userProfileUrl")!=null){
      //           that.props.updateProfilePicUrl(sessionStorage.getItem("userProfileUrl"));
      //           let userSession = CommonUtils.getUserSession();
      //           userSession.imageLink = sessionStorage.getItem("userProfileUrl");
      //           CommonUtils.setUserSession(userSession);
      //         }
      //       }
      //    }
      // });
      var that = this;
      window.$kmApplozic("#assign").empty();
      let users = [USER_TYPE.AGENT, USER_TYPE.ADMIN,USER_TYPE.BOT];
      return Promise.resolve(getUsersByType(this.state.applicationId, users)).then(data => {
        var assign = window.$kmApplozic("#assign");
        that.setState({ agents: data });
        window.$kmApplozic.each(data, function () {
          if (this.type == GROUP_ROLE.MEMBER || this.type == GROUP_ROLE.ADMIN) {
            assign.append(window.$kmApplozic("<option />").val(this.userName).text(this.name || this.userName));
          } else if (this.type == GROUP_ROLE.MODERATOR && this.name != DEFAULT_BOT.userName && this.name != LIZ.userName) {
            assign.append(window.$kmApplozic("<option />").val(this.userName).text(this.name || this.userName));
          }
  
        });
      }).catch(err => {
        // console.log("err while fetching users list ", err);
      });
  
      if (sessionStorage.getItem("userProfileUrl") != null) {
                  that.props.updateProfilePicUrl(sessionStorage.getItem("userProfileUrl"));
                  let userSession = CommonUtils.getUserSession();
                  userSession.imageLink = sessionStorage.getItem("userProfileUrl");
                  CommonUtils.setUserSession(userSession);
      }
  
  }
  loadBots() {
    window.$kmApplozic.fn.applozic('fetchContacts', { roleNameList: ['BOT'], callback: function (response) { } });
  }
 

  initConversation(groupId) {
    var that = this;
    window.$kmApplozic.fn.applozic("getGroup", {
        groupId: groupId, callback: function(response) {
          that.setState({
            group: response,
            visibleIntegartion:false,
            visibleReply:true,
          });
          that.selectAssignee();
          that.selectStatus();
          that.setUpAgentTakeOver(response);
        }
    });
  }
  
  getGroupAdmin(group) {
    var assignee = this.state.group.adminName;
    for(var key in this.state.group.users) {
      if(this.state.group.users.hasOwnProperty(key)) {
        var user = this.state.group.users[key];
        if (user.role == 1) {
          assignee = user.userId;
          break;
        }
      }
    }
    return assignee;
  }

  selectAssignee() {
    var assignee = this.getGroupAdmin(this.state.group);
    if (this.state.group.metadata && this.state.group.metadata.CONVERSATION_ASSIGNEE) {
      assignee = this.state.group.metadata.CONVERSATION_ASSIGNEE;
    }

    var userSession = CommonUtils.getUserSession();
    if (assignee == userSession.userName && userSession.isAdmin) {
      //assignee = "agent";
    }

    window.$kmApplozic("#assign").val(assignee);
  }

  selectStatus() {
    if (this.state.group.metadata && this.state.group.metadata.CONVERSATION_STATUS) {
      window.$kmApplozic("#conversation-status").val(this.state.group.metadata.CONVERSATION_STATUS);
    } else {
      window.$kmApplozic("#conversation-status").val(0);      
    }
  }

  removeServiceBots() {
    var that = this;
    var group = that.state.group;
    var loggedInUserId = window.$kmApplozic.fn.applozic("getLoggedInUser");
    var changeAssignee = true;
    for(var key in group.users) {
      if(group.users.hasOwnProperty(key)) {
        var groupUser = group.users[key];
        window.$kmApplozic.fn.applozic("getContactDetail", {"userId": groupUser.userId, callback: function(user) {
            if (typeof user.roleType !== "undefined" && user.roleType == 1 && user.userId !== "bot") {
              that.removeGroupMember(group.groupId, user.userId);  
              if (changeAssignee) {
                that.changeAssignee(loggedInUserId);
                changeAssignee = false;
              }
            }
          }
        }); 
      }
    }
    var takeOverEleContainer = document.getElementById("km-take-over-bot-container");
    takeOverEleContainer.style.display = "none";    
  }

  setUpAgentTakeOver(group) {
    var takeOverEleContainer = document.getElementById("km-take-over-bot-container"), takeOverEleText = document.querySelector("#km-bot-active-text p>strong"), pseudoNameIcon = document.getElementById("pseudo-name-icon");
    takeOverEleContainer.style.display = "none";
    pseudoNameIcon.classList.remove("vis");
    pseudoNameIcon.classList.add("n-vis");
    let allBotsInGroup = [];
    for(var key in group.users) {
      if(group.users.hasOwnProperty(key)) {
        var groupUser = group.users[key];

        window.$kmApplozic.fn.applozic("getContactDetail", {"userId": groupUser.userId, callback: function(user) {
            if (typeof user !== "undefined" && typeof user.roleType !== "undefined" && user.roleType == 1 && user.userId !== "bot") {
              allBotsInGroup.push(user.userId);
              // takeOverEleText.innerHTML = user.displayName; 
              takeOverEleContainer.style.display = "flex";          
              // console.log(user.displayName);         
              return;
            }
          }
        });
      }
    }
    takeOverEleText.innerHTML = allBotsInGroup.join(', ');
    if(allBotsInGroup.length>1) {
      document.getElementById("takeover-from-bot").innerHTML = "Take over from all bots";
    } else {
      document.getElementById("takeover-from-bot").innerHTML = "Take over from bot";
    }
    // console.log(allBotsInGroup);
  }

  changeAssignee(userId) {
    var that = this;
    this.setState({assignee:userId});
    var groupId = window.$kmApplozic(".left .person.active").data('km-id');
    window.$kmApplozic.fn.applozic('updateGroupInfo',
                                    {
                                      'groupId': this.state.group.groupId,
                                      'metadata': {
                                                'CONVERSATION_ASSIGNEE' : userId,
                                      },
                                      'callback': function(response) {
                                        var displayName = "";
                                        for(var key in that.state.agents) {
                                          if(that.state.agents.hasOwnProperty(key)) {
                                            var user = that.state.agents[key];
                                            if (user.userName == userId) {
                                              displayName = user.name ? user.name: user.userName;
                                              break;
                                            }
                                          }
                                        }
                                        window.$kmApplozic.fn.applozic('sendGroupMessage', {
                                            'groupId' : groupId,
                                            'message' : "Assigned to " + displayName,
                                            'metadata':{
                                              'skipBot':true,
                                              'KM_ASSIGN' :userId,
                                              NO_ALERT:true,
                                              BADGE_COUNT:false,
                                              category: "ARCHIVE",
                                            }
                                          });
                                      }
                                    });

                                    updateConversation({groupId:this.state.group.groupId,agentId:userId});

    var loggedInUserId = window.$kmApplozic.fn.applozic("getLoggedInUser");
    window.$kmApplozic.fn.applozic("getGroup", {'groupId': groupId, 'callback': function(group) {
                                                  if (group.members.indexOf(userId) == -1) {
                                                    that.addGroupMember(groupId, userId, function() {
                                                      //that.updateGroupRole(groupId, [{userId: that.getGroupAdmin(group), role: 2}]);
                                                    });
                                                  } else {
                                                    //that.updateGroupRole(groupId, [{userId: userId, role: 1},{userId: that.getGroupAdmin(group), role: 2}]);
                                                  }
                                                }
                                              });
    
  }

  addGroupMember(groupId, userId, callback) {
    //'role' :  1,  // (optional)  USER(0), ADMIN(1), MODERATOR(2), MEMBER(3)
    window.$kmApplozic.fn.applozic('addGroupMember',{'groupId': groupId,
                                        'userId': userId,
                                        'callback': function(response) {
                                          if (typeof callback === 'function') {
                                            callback();
                                          }
                                        }
                                      });
  }

  removeGroupMember(groupId, userId) {
    window.$kmApplozic.fn.applozic('removeGroupMember',{'groupId': groupId,
                                              'userId': userId,
                                              'callback': function(response) {console.log(response);}
                                              });
  }

  updateGroupRole(groupId, users) {
    window.$kmApplozic.fn.applozic('updateGroupInfo', {'groupId': groupId,
                                     'users': users,
                                     'callback' : function(response){console.log(response);}});
  }

  changeStatus(status) {
    //var groupId = window.$kmApplozic(".left .person.active").data('km-id');
    var that = this;
    window.$kmApplozic.fn.applozic('updateGroupInfo',
                                    {
                                      'groupId': that.state.group.groupId,
                                      'metadata': {
                                                'CONVERSATION_STATUS' : status
                                      },
                                      'callback': function(response) {
                                        window.$kmApplozic.fn.applozic('sendGroupMessage', {
                                            'groupId' : that.state.group.groupId,
                                            'message' : "Status changed to " + that.state.statuses[status],
                                            'metadata':{
                                              'KM_STATUS' :that.state.statuses[status],
                                              skipBot:true,
                                              NO_ALERT:true,
                                              BADGE_COUNT:false,
                                              category: "ARCHIVE",
                                            }
                                          });
                                      }
                                    });
                                    updateConversation({groupId:that.state.group.groupId,status:status});
  }

  updateUserContactDetail(userId, params){
    var data={'contacts':userId};
    window.$kmApplozic.fn.applozic('loadContacts', data.contacts );
  }

  updateApplozicUser(userInfo){
    updateApplozicUser(userInfo);
  }

  dismissInfo() {
    if (typeof(Storage) !== "undefined") {
      if(localStorage.getItem("KM_PSEUDO_INFO") === null) {
        localStorage.setItem("KM_PSEUDO_INFO", "true");
        this.setState({
          hideInfoBox: true
        });
      }       
    } else {
        console.log("Please update your browser.");
    }
    
  }

  render() {
    const thirdParty = thirdPartyList.map((item,index) => {
         return <button disabled = {this.state.disableButton } key = {index} onClick={() => {this.setState({clickedButton:index,},this.openModal)}}
         className="km-button km-button--secondary">
         <img src={item.logo} className="km-fullview-integration-logo" />{item.name}</button>
    });
    return (
      <aside className="aside-menu">
        <div className="animated fadeIn applozic-chat-container">

          <div id="tab-chat" className="row tabs hide">
            <div id="sec-chat-box" className="col-lg-12 tab-box">
              <div id="chat-box-div" style={{height: '100vh'}}>

                <div className="km-container">
                  <div className="left km-message-inner-left">
                    <div className="panel-content">
                    {/* conversation tab new design */}
                      
                      <div className="km-box-top km-row km-wt-user-icon km-conversation-header">
                        <div className="km-conversation-header-icons">
                          <div id="km-assigned" className="km-conversation-header-icon km-conversation-icon-active km-conversation-tabView" data-tip="Assigned to me" data-effect="solid" data-place="bottom">
                            {/* <div className="km-conversation-header-notification-alert"></div> */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="20">
                              <path fill="#AAA" d="M13.997 4.771c-.001-.615-.49-.947-.948-.947a.981.981 0 0 0-.657.255.91.91 0 0 0-.289.693v5.93a.41.41 0 1 1-.82 0V1.846c-.002-.615-.49-.947-.948-.947a.98.98 0 0 0-.656.254.91.91 0 0 0-.29.697v8.767a.41.41 0 0 1-.41.411.41.41 0 0 1-.41-.41V.947A.92.92 0 0 0 7.641 0h-.018a.978.978 0 0 0-.658.255.909.909 0 0 0-.29.696v9.74a.41.41 0 0 1-.82 0V2.657c-.003-.612-.49-.943-.947-.943a.98.98 0 0 0-.657.255.91.91 0 0 0-.29.696v9.96c1.097.015 3.055.314 4.458 2.066a.41.41 0 1 1-.64.513c-1.226-1.53-2.962-1.759-3.888-1.759-.11 0-.215.004-.314.01h-.014a.181.181 0 0 1-.07-.007.374.374 0 0 1-.145-.05.365.365 0 0 1-.105-.085.391.391 0 0 1-.049-.072.451.451 0 0 1-.036-.077L2.029 9.58c-.19-.6-.672-.958-1.287-.958-.148 0-.294.023-.433.067L0 8.788l1.899 6.03.002.008c.81 2.572 3.149 4.349 5.819 4.422.007 0 .014 0 .021.002 3.438-.016 6.24-2.829 6.259-6.28a.19.19 0 0 1-.003-.034V4.77z"/>
                            </svg>
                            <span id="km-assigned-unread-icon" className="km-unread-icon n-vis"></span>
                          </div>
                          <div id= "km-conversation" className="km-conversation-header-icon km-conversation-tabView " data-tip="All Conversations" data-effect="solid" data-place="bottom">
                          <svg xmlns='http://www.w3.org/2000/svg' width='14' height='17'>
                            <path fill='#AAA' d='M11.427 0H2.57C1.151 0 0 1.096 0 2.448v11.845c0 1.351 1.151 2.447 2.57 2.447h8.851c1.42 0 2.57-1.096 2.57-2.447V8.898l.006-.01v-6.44c0-1.352-1.15-2.448-2.57-2.448zM8.913 13.273h-5.81c-.516 0-.934-.398-.934-.89s.418-.89.935-.89h5.809c.516 0 .935.398.935.89s-.419.89-.935.89zm1.98-2.834h-7.79c-.516 0-.934-.399-.934-.89 0-.492.418-.89.935-.89h7.79c.516 0 .934.398.934.89 0 .491-.418.89-.935.89zm0-2.835h-7.79c-.516 0-.934-.399-.934-.89 0-.492.418-.89.935-.89h7.79c.516 0 .934.398.934.89 0 .491-.418.89-.935.89zm-7.7-3.507a1.024 1.024 0 1 1 0-2.049 1.024 1.024 0 0 1 0 2.049zm3.635 0a1.024 1.024 0 1 1 0-2.049 1.024 1.024 0 0 1 0 2.049zm3.755 0a1.024 1.024 0 1 1 0-2.049 1.024 1.024 0 0 1 0 2.049z'/>
                          </svg>
                          <span id="km-allconversation-unread-icon" className="km-unread-icon n-vis"></span>
                          </div>
                          <div id="km-closed" className="km-conversation-header-icon km-conversation-tabView" data-tip="Closed Conversations" data-effect="solid" data-place="bottom">
                            <svg xmlns='http://www.w3.org/2000/svg' width='14' height='17'>
                              <path fill='#AAA' d='M13.3 0H.7C.314 0 0 .317 0 .706V3.67c0 .389.314.706.7.706h12.6c.386 0 .7-.317.7-.706V.706A.704.704 0 0 0 13.3 0zM.875 13.76c0 1.34 1.008 2.428 2.25 2.428h7.745c1.241 0 2.249-1.087 2.249-2.427V8.41l.005-.01V5H.875v8.76z'/>
                            </svg>
                            <span id="km-closed-unread-icon"></span>
                          </div>
                        </div>
                      </div>
                      {/* Introducing Pseudonyms */}
                      <div className="introducing-text-box-main-container" hidden={this.state.hideInfoBox}>
                        <div className="introducing-text-box-container">
                          <div className="introducing-info-icon-container">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 20 20" style={{marginRight:"10px"}}>
                              <path id="Path_2" data-name="Path 2" d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,15h0a1,1,0,0,1-1-1V12a1,1,0,0,1,1-1h0a1,1,0,0,1,1,1v4A1,1,0,0,1,12,17Zm1-8H11V7h2Z" transform="translate(-2 -2)" fill="#6d6d6d"/>
                            </svg>
                          </div>
                          <div className="introducing-text-container">
                            <p>Introducing Pseudonyms for anonymous users</p>
                            <a href="#" onClick={this.onOpenModal}>Learn more</a>
                          </div>
                          <div className="introducing-close-icon-container" onClick={this.dismissInfo}>
                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 24 24" >
                              <g id="Bounding_Boxes">
                                <g id="ui_x5F_spec_x5F_header_copy_3" display="none">
                                </g>
                                <path fill="none" d="M0,0h24v24H0V0z"/>
                              </g>
                              <g id="Rounded_1_">
                                <g id="ui_x5F_spec_x5F_header_copy_6" display="none">
                                </g>
                                <path d="M18.3,5.71L18.3,5.71c-0.39-0.39-1.02-0.39-1.41,0L12,10.59L7.11,5.7c-0.39-0.39-1.02-0.39-1.41,0l0,0   c-0.39,0.39-0.39,1.02,0,1.41L10.59,12L5.7,16.89c-0.39,0.39-0.39,1.02,0,1.41h0c0.39,0.39,1.02,0.39,1.41,0L12,13.41l4.89,4.89   c0.39,0.39,1.02,0.39,1.41,0l0,0c0.39-0.39,0.39-1.02,0-1.41L13.41,12l4.89-4.89C18.68,6.73,18.68,6.09,18.3,5.71z" fill="#6d6d6d"/>
                              </g>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="km-row">
                        <h4 id="assign-selected" className="km-conversation-tab-selected km-assigned">Assigned to me</h4>
                        <h4 id="all-conversatios-selected" className="km-conversation-tab-selected km-allconversation n-vis">All Conversations</h4>
                        <h4 id="closed-conversatios-selected"className="km-conversation-tab-selected km-closed n-vis">Closed Conversations</h4>
                      </div>  
                      {/* conversation tab old design */}
                      {/* <div className="km-box-top km-row km-wt-user-icon km-conversation-header">
                        <div className="blk-lg-3">
                          <div id="km-user-icon" className="km-user-icon"></div>
                        </div>
                        <div className="blk-lg-7">
                           <ul id="kommunicate-panel-tabs" className="list-inline km-nav-tab">
                             <li id="km-conversation"className="km-conversation-tabView active "><a className="km-li-nav-tab" href="javascript:void(0)" data-tab="km-contact-cell">All Conversation</a></li>
                             <li id="km-assigned" className="km-conversation-tabView"><a id="km-customers-cell-link" className="km-li-nav-tab" href="javascript:void(0)" data-tab="km-customers-cell">Assigned</a></li>
                             <li id="km-closed" className="km-conversation-tabView"><a id="km-customers-cell-link" className="km-li-nav-tab" href="javascript:void(0)" data-tab="km-customers-cell">Closed</a></li>
                           </ul>
                        </div>
                        <div className="blk-lg-2 move-right km-menu-item km-text-right">
                            <div className="km-dropdown-toggle" data-toggle="kmdropdown"
                                aria-expanded="true">
                                <img
                            src="/applozic/images/icon-menu.png" className="km-menu-icon" alt="Menu"/>
                              </div>
                              <ul id="km-start-new-menu-box"
                                className="km-dropdown-menu km-tab-menu-box menu-right"
                                role="menu">
                                <li><a href="javascript:void(0)"
                                  className="km-group-search menu-item n-vis"
                                  title="Groups">Groups</a></li>
                                <li><a href="javascript:void(0)"
                                  id="km-new-group" className="menu-item" title="Create Group">Create
                                    Group</a></li>
                              </ul>
                        </div>
                      </div> */}
                      <div id="kommunicate-panel-body" className="km-panel-body">

                        <div id="km-customers-cell" className="km-customers-cell km-panel-cell n-vis">

                          <div id="km-search-tab-box" className="km-search-tab-box km-row n-vis">
                            <div className="km-row">
                              <ul className="km-nav km-nav-panel">
                                <li className="km-nav-item km-nav-divider"><a id="km-contact-search-tab"
                                  className="km-nav-link km-contact-search active" href="javascript:void(0)"><strong>Contacts</strong></a></li>
                                <li className="km-nav-item"><a id="km-group-search-tab" className="km-nav-link km-group-search" href="javascript:void(0)"><strong>Groups</strong></a>
                                </li>
                              </ul>
                            </div>
                          </div>

                          <div className="km-box-body">
                            <div className="km-form-group">
                              <div id="km-contact-search-input-box" className="km-input-group blk-lg-12">
                                <span
                                  className="km-search-icon"><a href="javascript:void(0)" role="link"
                                  className="km-contact-search-link"><span
                                    className="km-icon-search"></span></a></span>
                                <input id="km-contact-search-input" type="text"
                                  data-provide="typeahead" placeholder="Search..." autoFocus />
                              </div>
                               <div id="km-group-search-input-box" className="km-input-group blk-lg-12 n-vis">
                                <span
                                  className="km-search-icon"><a href="javascript:void(0)" role="link"
                                  className="km-group-search-link"><span
                                    className="km-icon-search"></span></a></span>
                                <input id="km-group-search-input" type="text"
                                  data-provide="typeahead" placeholder="Search..." autoFocus />
                              </div>
                            </div>
                            <div className="km-tab-cell">
                              <div className="km-message-inner">
                                <ul id="km-contact-search-list"
                                  className="km-contact-list km-contact-search-list km-nav km-nav-tabs km-nav-stacked"></ul>
                                      <ul id="km-group-search-list"
                                  className="km-contact-list km-group-search-list km-nav km-nav-tabs km-nav-stacked n-vis"></ul>
                                <div id="km-no-search-contacts" className="km-show-more-icon n-vis">
                                  <h3>No contacts yet!</h3>
                                </div>
                                  <div id="km-no-search-groups" className="km-show-more-icon n-vis">
                                  <h3>No groups yet!</h3>
                                </div>
                                  <div id="km-search-loading" className="km-loading n-vis">
                                    <img src="/applozic/images/ring.gif"/>
                                  </div>
                              </div>
                            </div>
                          </div>

                        </div>

                        <div id="km-unassigned-cell" className="km-unassigned-cell km-panel-cell n-vis">
                          <div className="km-panel-inner km-contacts-inner">
                            <ul id="km-assigned-list"
                              className="km-contact-list km-nav km-nav-tabs km-nav-stacked">
                            </ul>
                          </div>
                          <div id="km-unassigned-loading" className="km-loading n-vis">
                            <img src="/applozic/images/ring.gif"/>
                          </div>
                          <div id="km-no-unassigned-text"
                            className="km-no-data-text km-text-muted n-vis">No
                            Leads yet!</div>
                          <div id="km-show-more-icon" className="km-show-more-icon n-vis">
                            <h3>No more leads!</h3>
                          </div>
                        </div>


                        <div id="km-contact-cell" className="km-assigned-cell km-panel-cell">

                          <div className="km-box-body">
                            <div className="km-form-group">
                              <div id="km-assigned-search-input-box" className="km-input-group blk-lg-12">
                                <span className="km-search-icon"> <a href="javascript:void(0)" role="link"
                                className="km-tab-search"> <span className="km-icon-search"></span>
                              </a>
                              </span> <input type="text" id="km-search" data-provide="typeahead"
                                placeholder="Search..." autoFocus />
                              </div>
                            </div>
                            <div className="km-tab-cell">
                              <div className="km-message-inner">
                                <ul id="km-contact-list"
                                  className="people km-contact-list km-allconversation km-converastion km-nav km-nav-tabs km-nav-stacked n-vis">
                                </ul>
                                <ul id="km-assigned-search-list"
                                  className="km-contact-list people km-assigned km-converastion km-nav km-nav-tabs km-nav-stacked"></ul>
                                <ul id="km-closed-conversation-list"
                                  className="km-contact-list people km-converastion km-closed km-nav km-nav-tabs km-nav-stacked n-vis"></ul>
                                <div id="km-contact-loading" className="km-loading">
                                  <img src="/applozic/images/ring.gif"/>
                                </div>
                                <div id="km-no-contact-text"
                                  className="km-no-data-text km-text-muted n-vis">No
                                  conversations yet!</div>
                                <div id="km-show-more-icon" className="km-show-more-icon n-vis">
                                  <h3>No more conversations!</h3>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>

                      </div>
                    </div>
                  </div>
                  <div className="right">
                    <div id="km-conversation-heading" className="km-conversation-heading breadcrumb vis">
                      <p className="active breadcrumb-item">Conversations</p>
                    </div>
                    <div className="panel-content">
                      <div id="km-toolbar" className="km-toolbar blk-lg-12 n-vis">
                          <div className="km-new-conversation-header">

                            <div id="km-tab-header" className="km-box-top n-vis km-hide">
                              <div id="km-tab-individual"
                                className="km-tab-individual km-row">
                                <div className="blk-lg-8 km-box-title">
                                  <div id="km-group-tab-title" className="n-vis">
                                    <a id="km-tab-info" href="javascript:void(0)" className="km-tab-info">
                                      <div className="km-tab-title km-truncate name"></div>
                                      <div className="km-tab-status km-truncate n-vis km-hide"></div>
                                      <div className="km-typing-box km-truncate n-vis">
                                        <span className="name-text"></span><span>typing...</span>
                                      </div>
                                    </a>
                                    
                                  </div>
                                  <div id="km-individual-tab-title"
                                    className="km-individual-tab-title">
                                    <a id="km-tab-info-individual" href="javascript:void(0)" className="km-tab-info">
                                      <div className="km-tab-title km-truncate name"></div>
                                      <div className="km-tab-status km-truncate n-vis km-hide"></div>
                                      <div className="km-typing-box km-truncate n-vis">
                                        <span className="name-text"></span><span>typing...</span>
                                      </div>
                                    </a>
                                  </div>
                                </div>
                                <div className="blk-lg-4 move-right">
                                  <div id="km-tab-menu" className="km-menu-item km-text-right n-vis">
                                    <div className="km-dropdown-toggle" data-toggle="kmdropdown"
                                      aria-expanded="true">
                                      <img src="/applozic/images/icon-menu.png" className="km-menu-icon"
                                        alt="Tab Menu"/>
                                    </div>
                                    <ul id="km-tab-menu-list"
                                      className="km-dropdown-menu km-tab-menu-box menu-right"
                                      role="menu">
                                      <li className="km-tab-message-option vis"><a href="javascript:void(0)"
                                        id="km-delete-button"
                                        className="km-delete-button menu-item vis"
                                        title="Clear Messages"> Clear Messages </a></li>
                                      <li id="km-li-block-user" className="vis"><a href="javascript:void(0)"
                                        id="km-block-button" className="menu-item" title="Block User">Block
                                          User</a></li>
                                      <li id="km-li-group-info"
                                        className="km-group-menu-options n-vis"><a href="javascript:void(0)"
                                        id="km-group-info-btn" className="menu-item km-group-info-btn"
                                        title="Group Info"> Group Info </a></li>
                                      <li id="km-li-leave-group"
                                        className="km-group-menu-options n-vis"><a href="javascript:void(0)"
                                        id="km-leave-group-btn" className="menu-item" title="Exit Group">
                                          Exit Group </a></li>
                                    </ul>
                                  </div>
                                  {/* <div className="pseudo-name-icon text-center n-vis" id="pseudo-name-icon" onClick={this.onOpenModal}>
                                    <svg xmlns="http://www.w3.org/2000/svg" id="Incognito_Copy_3" data-name="Incognito Copy 3"
                                    viewBox="0 0 15.433 13.883">
                                        <path id="Shape" d="M7.75 0A12.3 12.3 0 0 0 0 2.83h15.433A12.128 12.128 0 0 0 7.75 0z"
                                      transform="translate(0 5.998)" fill="#42b9e8" />
                                        <path id="Shape-2" d="M9.3 5.257A2.564 2.564 0 0 1 6.739 2.7v-.2A2.946 2.946 0 0 0 5.7 2.289a2.355 2.355 0 0 0-.573.07v.269A2.561 2.561 0 1 1 2.561.068a2.58 2.58 0 0 1 2.426 1.617 3.734 3.734 0 0 1 .824-.094 3.641 3.641 0 0 1 1.063.162A2.556 2.556 0 0 1 9.3 0a2.634 2.634 0 0 1 2.561 2.7A2.564 2.564 0 0 1 9.3 5.257zm0-4.515a1.936 1.936 0 0 0-1.887 1.886A1.889 1.889 0 0 0 9.3 4.515a1.937 1.937 0 0 0 1.887-1.887A1.936 1.936 0 0 0 9.3.742zm-6.739 0A1.936 1.936 0 0 0 .674 2.628a1.887 1.887 0 1 0 3.774 0 2.066 2.066 0 0 0-.135-.741A1.859 1.859 0 0 0 2.561.742z"
                                      data-name="Shape" transform="translate(1.954 8.626)"
                                        fill="#42b9e8" />
                                        <path id="Shape-3" d="M8.289 0L3.707.741 1.483 0 0 4.515h9.772z"
                                        data-name="Shape" transform="translate(2.965)" fill="#42b9e8" />
                                    </svg>
                                  </div> */}
                                </div>
                              </div>
                            </div>

                            {/*<div className="col-sm-1">
                              <i className="fa fa-user fa-lg mt-2"></i>
                            </div>
                            */}
                            <div className="select-labels">
                                <span className="">Status:</span>
                            </div>
                            <div className="">
                              <div className="select-container">
                                <select id="conversation-status" onChange = {(event) => this.changeStatus(event.target.value)}>
                                  <option value="0">Open</option>
                                  <option value="2">Close</option>
                                  <option value="3">Spam</option>
                                  <option value="4">Duplicate</option>
                                </select>
                              </div>
                            </div>
                            <div className="select-labels">
                                <span className="">Assign to:</span>
                            </div>
                            <div className="">
                              <div className="select-container">
                                <select id="assign" onChange = {(event) => this.changeAssignee(event.target.value)} > </select>
                              </div>
                              
                              {/*
                               {
                                  this.state.agents.map(function(user) {
                                    return <option key={user.userId}
                                      value={user.userId}>{user.displayName}</option>;
                                  })
                               }
                                */}
                               

                            </div>

                            {/*
                            <div className="col-sm-1">
                              <i className="fa fa-flag-o fa-lg mt-2"></i>
                            </div>
                            */}
                            
                            
                          </div>
                          <hr/>
                          <div className="km-new-conversation-header-bot" id="km-take-over-bot-container">
                            <div className="km-bot-active-text" id="km-bot-active-text">
                                <p><span>&#9679;</span> Active bots <strong></strong></p>
                            </div>
                            <div className="">
                              <button id="takeover-from-bot" className="km-button km-button--secondary" onClick= {(event) => this.removeServiceBots(event.target.value)}>Takeover from Bot</button>
                            </div>
                          </div>
                      </div>
                      <div id="km-product-group"
                        className="km-tab-panel km-btn-group km-product-group">
                        <div id="km-product-box"
                          className="km-product-box n-vis km-dropdown-toggle"
                          data-toggle="kmdropdown" aria-expanded="true">
                          <div className="km-row">
                            <div className="blk-lg-10">
                              <div className="km-row">
                                <div className="blk-lg-3 km-product-icon"></div>
                                <div className="blk-lg-9">
                                  <div className="km-row">
                                    <div className="blk-lg-8 km-product-title km-truncate"></div>
                                    <div
                                      className="blk-lg-4 move-right km-product-rt-up km-truncate">
                                      <strong className="km-product-key"></strong>:<span
                                        className="km-product-value"></span>
                                    </div>
                                  </div>
                                  <div className="km-row">
                                    <div className="blk-lg-8 km-truncate km-product-subtitle"></div>
                                    <div
                                      className="blk-lg-4 move-right km-product-rt-down km-truncate">
                                      <strong className="km-product-key"></strong>:<span
                                        className="km-product-value"></span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="blk-lg-2 km-text-center">
                              <span className="km-caret n-vis"></span>
                            </div>
                          </div>
                        </div>
                        <ul id="km-conversation-list"
                          className="km-dropdown-menu menu-right km-conversation-list n-vis"
                          role="menu"></ul>
                      </div>
                      <div className="km-panel-body">
                        <div id="km-message-cell" className="km-message-cell km-panel-cell">
                          <div id="conversation-section" className="conversation-section">
                            <div className="chat km-message-inner km-panel-inner"
                              data-km-id="${contIdExpr}"></div>
                            <div id="km-msg-loading" className="km-loading n-vis">
                              <img src="/applozic/images/ring.gif"/>
                            </div>
                            <div id="km-no-more-messages"
                              className="km-no-more-messages km-show-more-icon n-vis">
                              <h3>No more messages!</h3>
                            </div>
                          </div>
                        </div>
                        <div id="empty-state-conversations-div" className="empty-state-conversations-div text-center n-vis">
                            <img src="/img/empty-conversations.png" alt="Conversations Empty State" className="empty-state-conversations-img"/>
                            <p className="empty-state-message-shortcuts-first-text">No message notification</p>
                            <p className="empty-state-message-shortcuts-second-text">Add chat widget into your webpage to<br></br>engage more with your users</p>
                        </div>
                      </div>
                      <div className="write">
                        
                        <div id="km-sidebox-ft" className="km-box-ft km-panel-ft">
                          <div className="km-box-form km-row n-vis">
                            <div className="blk-lg-12">
                              <p id="km-msg-error" className="km-sidebox-error n-vis"></p>
                            </div>
                            <div className="blk-lg-12">
                              <p id="km-msg-response" className="km-box-response n-vis"></p>
                            </div>
                            <div className="km-sidebox-tab">       
                              <span className={ this.state.visibleReply ? "km-sidebox-tab-reply active-tab-reply" : "km-sidebox-tab-reply"} 
                              onClick={this.changeTabToIntegration}>Reply</span>
                              <span className= {this.state.visibleIntegartion ? "km-sidebox-forward-tab-integration active-tab-integration" : "km-sidebox-forward-tab-integration"}
                              onClick={this.changeTabToReply}>Forward to integrations</span>
                            </div>
                            <div className={this.state.visibleReply ? "n-vis" : "km-sidebox-third-party-integration"}>
                              <span className="inteagration-forward-text">Forward to:</span>
                              {thirdParty}
                            </div>

                            <div id="km-write-box" className={this.state.visibleReply ? "blk-lg-12 km-write-box":"n-vis" } >
                              <form id="km-msg-form" className="vertical km-msg-form">
                                <div className="km-form-group n-vis">
                                  <label className="sr-only placeholder-text control-label"
                                  htmlFor="km-msg-to">To:</label> <input className="km-form-cntrl"
                                    id="km-msg-to" name="km-msg-to" placeholder="To" required/>
                                </div>
                                <input id="km-file-input" className="km-file-input n-vis"
                                  type="file" name="files[]"/>
                                <div id="km-btn-attach" className="km-btn-attach">
                                  <div className="km-dropdown-toggle" data-toggle="kmdropdown"
                                    aria-expanded="true">
                                    <a href="javascript:void(0)" type="button" id="km-btn-attach"
                                      className="write-link attach km-btn-text-panel"
                                      aria-expanded="true" title="Attach File"> </a>
                                  </div>
                                  <ul id="km-upload-menu-list"
                                    className="km-dropup-menu km-upload-menu-list" role="menu">
                                    <li><a id="km-file-up" href="javascript:void(0)"
                                      className="km-file-upload menu-item" title="File &amp; Photos">

                                        <img src="/applozic/images/mck-icon-photo.png"
                                        className="menu-icon" alt="File &amp; Photos"/> <span>Files
                                          &amp; Photos</span>
                                    </a></li>
                                    <li><a id="km-btn-loc" href="javascript:void(0)" className="menu-item"
                                      title="Location"> <img
                                        src="/applozic/images/mck-icon-marker.png" className="menu-icon"
                                        alt="Location"/> <span>Location</span>
                                    </a></li>

                                  </ul>
                                </div>
                                <a href="javascript:void(0)" id="km-file-up2" type="button"
                                  className="write-link attach n-vis km-file-upload km-btn-text-panel"
                                  title="Attach File"> </a> <span id="km-text-box"
                                  contentEditable="true" suppressContentEditableWarning="true" className="km-text-box km-text required"></span>

                                <a href="javascript:void(0)" type="button" id="km-btn-smiley"
                                  className="write-link smiley km-btn-smiley km-btn-text-panel"
                                  title="Smiley"></a> <a href="javascript:void(0)" type="submit"
                                  id="km-msg-sbmt" className="write-link send km-btn-text-panel"
                                  title="Send Message"></a>
                              </form>
                            </div>
                            
                            <div className="blk-lg-12">
                              <div id="km-file-box" className="n-vis"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="km-group-create-tab"
                      className="km-group-create-tab km-panel-sm km-panel n-vis">
                        <div className="panel-content">
                      <div className="km-box-top">
                        <div className="blk-lg-10">
                          <div className="km-box-title km-truncate" title="Create Group">Create
                            Group</div>
                        </div>
                          <div className="blk-lg-2">
                          <button type="button" id="km-group-create-close"
                            className="km-box-close km-close-panel move-right">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                      </div>
                      <div className="km-box-body">
                        <div className="km-tab-cell">
                          <div id="km-group-create-panel"
                            className="km-tab-panel km-message-inner km-group-create-inner">
                            <div className="km-group-sub-sec">
                              <div id="km-group-create-icon-box"
                                className="km-group-create-icon-box km-group-icon-box km-hover-on">
                                <div className="km-group-icon"></div>
                                <span className="km-overlay-box">
                                  <div className="km-overlay">
                                    <span className="km-camera-icon"></span> <span
                                      className="km-overlay-label">Add Group Icon</span>
                                  </div>
                                  <div id="km-group-create-icon-loading"
                                    className="km-loading n-vis">
                                    <img
                                      src="/applozic/images/mck-loading.gif"/>
                                  </div> <input id="km-group-icon-upload"
                                  className="km-group-icon-upload n-vis" type="file"
                                  name="files[]"/>
                                </span>
                              </div>
                            </div>
                            <div id="km-group-create-name-sec" className="km-group-sub-sec">
                              <div id="km-group-create-name-box"
                                className="km-row km-group-name-box">
                                <div className="blk-lg-12">
                                  <div className="km-label">Group Title</div>
                                </div>
                                <div className="blk-lg-12">
                                  <div id="km-group-create-title" className="km-group-create-title km-group-title"
                                    contentEditable="true" suppressContentEditableWarning="true">Group title</div>
                                </div>
                              </div>
                            </div>
                            <div id="km-group-create-type-sec" className="km-group-sub-sec">
                              <div id="km-group-create-type-box"
                                className="km-row km-group-type-box">
                                <div className="blk-lg-12">
                                  <div className="km-label">Group Type</div>
                                </div>
                                <div className="blk-lg-12">
                                  <select id="km-group-create-type" defaultValue ="2" className="km-select">
                                    <option value="2">Public</option>
                                    <option value="1">Private</option>
                                    <option value="6">Open</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div id="km-group-create-btn-sec" className="km-group-sub-sec">
                              <button type="button" id="km-btn-group-create"
                                className="km-btn km-btn-green km-btn-group-create"
                                title="Create Group">Create Group</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="km-group-info-tab"
                    className="km-group-info-tab km-panel-sm km-panel">
                    <div className="panel-content">
                      <div className="km-box-top">
                        <div className="km-title-wrapper n-vis"> 
                          <div className="blk-lg-10">
                            <div className="km-box-title km-truncate" title="Group Info">Details
                            </div>
                          </div>
                          <div className="blk-lg-2">
                            <button type="button" id="km-group-info-close"
                              className="km-box-close km-close-panel move-right">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                        </div>
                        <div className="km-group-icon-sec">
                          <div id="km-group-info-icon-box"
                            className="km-group-icon-box km-group-info-icon-box km-hover-on">
                            <div className="km-group-icon"></div>
                            {/* <span className="km-overlay-box n-vis">
                              <div className="km-overlay">
                                <span className="km-camera-icon"></span> <span
                                  className="km-overlay-label">Change Group Icon</span>
                              </div>
                              <div id="km-group-info-icon-loading" className="km-loading n-vis">
                                <img src="/applozic/images/mck-loading.gif"/>
                              </div> <input id="km-group-icon-change"
                              className="km-group-icon-change n-vis" type="file" name="file[]" />
                            </span> */}
                          </div>
                          <div className="km-text-center">
                            <a id="km-btn-group-icon-save" href="javascript:void(0)" role="link"
                              className="km-btn-group-icon-save n-vis" title="Click to save">
                              <img
                              src="/applozic/images/mck-icon-save.png"
                              alt="Save"/>
                            </a>
                          </div>
                        </div>
                        <div className="km-dispalyname-wrapper">
                        <div>
                        <p id="km-sidebar-display-name"  className="km-sidebar-display-name km-truncate"></p>
                          <p id="km-sidebar-user-email"  className="km-sidebar-user-email"></p>
                        </div>
                          <div className="pseudo-name-icon text-center n-vis" id="pseudo-name-icon" onClick={this.onOpenModal}>
                            <svg xmlns="http://www.w3.org/2000/svg" id="Incognito_Copy_3" data-name="Incognito Copy 3"
                            viewBox="0 0 15.433 13.883">
                                <path id="Shape" d="M7.75 0A12.3 12.3 0 0 0 0 2.83h15.433A12.128 12.128 0 0 0 7.75 0z"
                              transform="translate(0 5.998)" fill="#42b9e8" />
                                <path id="Shape-2" d="M9.3 5.257A2.564 2.564 0 0 1 6.739 2.7v-.2A2.946 2.946 0 0 0 5.7 2.289a2.355 2.355 0 0 0-.573.07v.269A2.561 2.561 0 1 1 2.561.068a2.58 2.58 0 0 1 2.426 1.617 3.734 3.734 0 0 1 .824-.094 3.641 3.641 0 0 1 1.063.162A2.556 2.556 0 0 1 9.3 0a2.634 2.634 0 0 1 2.561 2.7A2.564 2.564 0 0 1 9.3 5.257zm0-4.515a1.936 1.936 0 0 0-1.887 1.886A1.889 1.889 0 0 0 9.3 4.515a1.937 1.937 0 0 0 1.887-1.887A1.936 1.936 0 0 0 9.3.742zm-6.739 0A1.936 1.936 0 0 0 .674 2.628a1.887 1.887 0 1 0 3.774 0 2.066 2.066 0 0 0-.135-.741A1.859 1.859 0 0 0 2.561.742z"
                              data-name="Shape" transform="translate(1.954 8.626)"
                                fill="#42b9e8" />
                                <path id="Shape-3" d="M8.289 0L3.707.741 1.483 0 0 4.515h9.772z"
                                data-name="Shape" transform="translate(2.965)" fill="#42b9e8" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div id="km-clearbit-title-panel" className={this.state.clearbitKey != "" ? "km-clearbit-title-panel" : "n-vis" }>
                        Clearbit</div>
                        <div className="km-tab-cell">
                          <div className="km-user-info-inner">
                            <div id="km-user-info-list" className="km-user-info-list">
                              <h4 id="full-name" className="km-clearbit-field km-clearbit-user-full-name"></h4>
                              <p id="bio" className="km-clearbit-field km-clearbit-user-bio n-vis"></p>
                              <div className="km-clearbit-user-domain-location-wrapper">
                                <div id="location-icon" className="km-clearbit-logo-wrapper n-vis">
                                  <img src = {LocationIcon} className="km-clearbit-location-icon" />
                                  <p id="location" className="km-clearbit-field km-clearbit-user-data"></p>
                                </div>
                                <div id="domain-icon" className="km-clearbit-logo-wrapper n-vis">
                                  <img src={DomainIcon} className="km-clearbit-domain-icon" />
                                  <a id= "domain-link" className="km-clearbit-link" href="" target="_blank">
                                    <p id="domain" className="km-clearbit-field km-clearbit-user-domain"></p>
                                  </a>          
                              </div>
                              </div>
                              <div id="divider-1" className="km-clearbit-divider n-vis"></div>
                              <div id="industry" className="km-clearbit-field km-clearbit-user-industry"></div>
                              <div id="foundedYear" className="km-clearbit-field km-clearbit-user-industry"></div>
                              <div className="km-clearbit-company-description-wrapper">
                                <p id="description" className="km-clearbit-field km-clearbit-user-data"></p>
                              </div>
                              <div id="divider-2" className="km-clearbit-divider n-vis"></div>
                              <div className="km-clearbit-user-social-info-wrapper">
                                <div id="km-cl-ln-icon-box" className="km-cl-icon-wrapper n-vis">
                                  <a id="linkedin" className="km-cl-icon km-clearbit-link" href="" target="_blank">
                                    <img src={LinkedinIcon} className="km-clearbit-social-icon " />
                                  </a>
                                </div>
                                <div id="km-cl-fb-icon-box" className="km-cl-icon-wrapper n-vis">
                                  <a id="facebook" className="km-cl-icon km-clearbit-link" href="" target="_blank">
                                    <img src={FacebookIcon} className="km-clearbit-social-icon " />
                                  </a>
                                </div>
                                <div id="km-cl-tw-icon-box" className="km-cl-icon-wrapper n-vis">
                                  <a id="twitter" className="km-cl-icon km-clearbit-link" href="" target="_blank">  
                                    <img src={TwitterIcon} className="km-clearbit-social-icon" />
                                  </a>  
                                </div>
                                <div id="km-cl-cb-icon-box" className="km-cl-icon-wrapper n-vis">
                                  <a id="crunchbase" className="km-cl-icon km-clearbit-link"  href="" target="_blank">  
                                    <img src={CrunchbaseIcon} className="km-clearbit-social-icon" />
                                  </a>
                                </div>  
                              </div>
                            
                            </div>        
                          </div>
                        </div>
                      </div>
                      {/* user metadata */}
                      <div id="km-sidebar-user-info-wrapper" className="n-vis" >
                        <div id="km-user-info-panel" className="km-sidebar-info-panel">User Info</div>
                        <div id="km-user-info-metadata-wrapper" className="km-user-info-metadata-wrapper"></div>
                      </div>     
                      <div id="km-group-info-panel" className="km-sidebar-info-panel">
                        Group Info</div>
                      <div id="km-group-detail-panel" className="km-group-detail-box">
                        <div id="km-group-member-panel"
                          className="km-tab-panel km-group-member-panel vis">
                          <div className="km-group-md-sec">
                            <div className="km-row km-group-member-text">Members</div>
                            <div id="km-group-add-member-box"
                              className="km-row km-group-admin-options km-group-add-member-box n-vis">
                              <a id="km-group-add-member" className="km-group-add-member"
                                href="javascript:void(0)">
                                <div className="blk-lg-3">
                                  <img src="/applozic/images/mck-icon-add-member.png"
                                    alt="Add Member"/>
                                </div>
                                <div className="blk-lg-9">Add member</div>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="km-box-body">
                        <div className="km-tab-cell">
                          <div className="km-group-member-inner">
                            <ul id="km-group-member-list"
                              className="km-group-member-list km-contact-list km-nav km-nav-tabs km-nav-stacked">
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div id="km-group-info-ft" className="km-group-info-ft">
                        <button type="button" id="km-btn-group-exit"
                          className="km-btn km-btn-blue km-btn-group-exit"
                          title="Exit Group">Exit Group</button>
                      </div>
                    </div>
                  </div> 
                </div>
                <div id="km-loc-box" className="km-box km-loc-box fade"
                  aria-hidden="false">
                  <div className="km-box-dialog km-box-md">
                    <div className="km-box-content">
                      <div className="km-box-top km-row">
                        <div className="blk-lg-10">
                          <h4 className="km-box-title">Location Sharing</h4>
                        </div>
                        <div className="blk-lg-2">
                          <button type="button" className="km-box-close" data-dismiss="kmbox"
                            aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                      </div>
                      <div className="km-box-body">
                        <div className="km-form-group">
                          <div className="blk-lg-12">
                            <input id="km-loc-address" type="text" className="km-form-control"
                              placeholder="Enter a location" autoComplete="off"/>
                          </div>
                        </div>
                        <div id="km-map-content" className="km-loc-content"></div>
                        <div className="n-vis">
                          <label className="blk-sm-2 km-control-label">Lat.:</label>
                          <div className="blk-sm-3">
                            <input type="text" id="km-loc-lat" className="km-form-control"/>
                          </div>
                          <label className="blk-sm-2 km-control-label">Long.:</label>
                          <div className="blk-sm-3">
                            <input type="text" id="km-loc-lon" className="km-form-control"/>
                          </div>
                        </div>
                      </div>
                      <div className="km-box-footer">
                        <button id="km-my-loc" type="button"
                          className="km-my-loc km-btn km-btn-green">My Location</button>
                        <button id="km-loc-submit" type="button"
                          className="km-btn km-btn-blue km-loc-submit move-right">Send</button>
                        <button type="button" className="km-btn km-btn-default move-right"
                          data-dismiss="kmbox">Close</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="km-goup-search-box"
                  className="km-box km-group-search-box km-sm-modal-box fade"
                  aria-hidden="false">
                  <div className="km-box-dialog km-box-sm">
                    <div className="km-box-content">
                      <div className="km-box-top km-row">
                        <div className="blk-lg-3">
                          <img src="/applozic/images/mck-icon-add-member.png" alt="Add Member"/>
                        </div>
                        <div className="blk-lg-7">
                          <h4 className="km-box-title">Add Member</h4>
                        </div>
                        <div className="blk-lg-2">
                          <button type="button" className="km-box-close" data-dismiss="kmbox"
                            aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                      </div>
                      <div className="km-box-body">
                        <div className="km-form-group">
                          <div className="km-input-group blk-lg-12">
                            <input id="km-group-member-search" type="text" data-provide="typeahead"
                              placeholder="Search..." autoFocus /> <span
                              className="km-search-icon"><a href="javascript:void(0)" role="link"
                              className="km-group-member-search-link"><span className="km-icon-search"></span></a></span>
                          </div>
                        </div>
                        <div className="km-tab-cell">
                          <div className="km-message-inner">
                            <ul id="km-group-member-search-list"
                              className=" km-contact-list km-group-search-list km-nav km-nav-tabs km-nav-stacked"></ul>
                                <div id="km-no-gsm-text"
                              className="km-no-data-text km-text-muted n-vis">No Users!</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div id="km-sidebox"></div>
            </div>
          </div>
          <ReactTooltip />
        </div>
        <Modal open={this.state.modalIsOpen} onClose={this.closeModal} >
          
          <ModalContent activeModal={this.state.clickedButton} handleCloseModal={this.closeModal} />
        </Modal>
        <ReactModal isOpen={this.state.modalOpen} style={customStyles}  shouldCloseOnOverlayClick={true} ariaHideApp={false}>
          <div className="row" style={{marginTop:"80px"}}>
            <div className="col-lg-5 col-md-6 col-sm-12 pseudo-name-intro-text-container">
              <p className="intro text-center">Introducing</p>
              <h1 className="pseudo text-center">PSEUDONYMS</h1>
              <p className="anonymous text-center">for your anonymous visitors</p>
              <p className="desc">Pseudonyms help identify anonymous visitors easily when they initiate a conversation and facilitates a better cross team collaboration.<br/><br/>Look out for the <span><svg xmlns="http://www.w3.org/2000/svg" id="Incognito_Copy_3" data-name="Incognito Copy 3" viewBox="0 0 15.433 13.883"><path id="Shape" d="M7.75 0A12.3 12.3 0 0 0 0 2.83h15.433A12.128 12.128 0 0 0 7.75 0z" transform="translate(0 5.998)" fill="#42b9e8" /><path id="Shape-2" d="M9.3 5.257A2.564 2.564 0 0 1 6.739 2.7v-.2A2.946 2.946 0 0 0 5.7 2.289a2.355 2.355 0 0 0-.573.07v.269A2.561 2.561 0 1 1 2.561.068a2.58 2.58 0 0 1 2.426 1.617 3.734 3.734 0 0 1 .824-.094 3.641 3.641 0 0 1 1.063.162A2.556 2.556 0 0 1 9.3 0a2.634 2.634 0 0 1 2.561 2.7A2.564 2.564 0 0 1 9.3 5.257zm0-4.515a1.936 1.936 0 0 0-1.887 1.886A1.889 1.889 0 0 0 9.3 4.515a1.937 1.937 0 0 0 1.887-1.887A1.936 1.936 0 0 0 9.3.742zm-6.739 0A1.936 1.936 0 0 0 .674 2.628a1.887 1.887 0 1 0 3.774 0 2.066 2.066 0 0 0-.135-.741A1.859 1.859 0 0 0 2.561.742z" data-name="Shape" transform="translate(1.954 8.626)" fill="#42b9e8" /><path id="Shape-3" d="M8.289 0L3.707.741 1.483 0 0 4.515h9.772z" data-name="Shape" transform="translate(2.965)" fill="#42b9e8" /></svg></span> icon in the conversation screen to identify visitors with pseudonyms.</p>
              <button className="km-button km-button--primary" onClick={this.onCloseModal}>Cool! Got it</button>
            </div>
            <div className="col-lg-7 col-md-6 col-sm-12 pseudo-name-intro-svg-container">
              <PseudoNameImage />
            </div>
          </div>
          <div className="close-button-container" onClick={this.onCloseModal}>
            <button className="close-btn"><svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24" viewBox="0 0 24 24" width="24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg></button>
          </div>
        </ReactModal>
      </aside>
      
    )
  }
}

const customStyles = {
  content : {
    top                   : '80px',
    // left                  : '50%',
    // right                 : 'auto',
    bottom                : '80px',
    // marginRight           : '-50%',
    // transform             : 'translate(-50%, -50%)'
    maxWidth              : '1000px',
    margin                : '0 auto',
    overflowY             : 'auto'
  }
};

export default Aside;
