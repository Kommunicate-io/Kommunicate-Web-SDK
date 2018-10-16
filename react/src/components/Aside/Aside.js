import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Progress } from 'reactstrap';
import classnames from 'classnames';
import classes from './Aside.css';
import CommonUtils from '../../utils/CommonUtils';
import ApplozicClient from '../../utils/applozicClient';
import {updateApplozicUser, getThirdPartyListByApplicationId, updateConversation,getUsersByType} from '../../utils/kommunicateClient';
import { thirdPartyList } from './km-thirdparty-list'
import Modal from 'react-responsive-modal';
import ModalContent from './ModalContent.js';
import LocationIcon from './Icons/location.png';
import DomainIcon from './Icons/web-icon.png';
import Notification from '../../views/model/Notification';
import FacebookIcon from './Icons/facebook-icon.png';
import CrunchbaseIcon from './Icons/crunchbaseIcon-icon.png';
import TwitterIcon from './Icons/twitter-icon.png';
import LinkedinIcon from './Icons/linkedin-icon.png';
import ReactTooltip from 'react-tooltip';
import { USER_TYPE, GROUP_ROLE, LIZ, DEFAULT_BOT} from '../../utils/Constant';
import ReactModal from 'react-modal';
import {PseudoNameImage, ConversationsEmptyStateImage} from '../../views/Faq/LizSVG';
import TrialDaysLeft from '../TrialDaysLeft/TrialDaysLeft';
import quickReply from '../../views/quickReply/quickReply';
import { getConfig } from '../../config/config';
import Labels from '../../utils/Labels';

const userDetailMap = {
  "displayName": "km-sidebar-display-name",
  "email": "km-sidebar-user-email",
  "phoneNumber": "km-sidebar-user-number",
};
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
      inputBoxMouseDown:false,
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
      hideInfoBox: false,
      trialDaysLeftComponent: ""
    };
    this.dismissInfo = this.dismissInfo.bind(this);
    this.updateEmailOnBlur = this.updateEmailOnBlur.bind(this);
    this.submitEmailMouseDown = this.submitEmailMouseDown.bind(this);
    this.updatePhoneOnBlur = this.updatePhoneOnBlur.bind(this);
    this.submitEmailMouseDown = this.submitEmailMouseDown.bind(this);
    this.updateDisplayNameOnBlur = this.updateDisplayNameOnBlur.bind(this);
    this.submitDisplayNameMouseDown = this.submitDisplayNameMouseDown.bind(this);
    this.showEditUserDetailDiv=this.showEditUserDetailDiv.bind(this);
    this.onKeyDown =this.onKeyDown.bind(this);
    this.setInputFlag=this.setInputFlag.bind(this);
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
    quickReply.loadQuickReplies();
     if(CommonUtils.getUserSession() === null){
       //window.location ="#/login";
       window.appHistory.replace('/login');
       return;
     }else {
       //window.location ="/dashboard";
       //window.appHistory.push('/dashboard');
     }
     window.Aside = this;

     this.setState({
      trialDaysLeftComponent: <TrialDaysLeft />
     })

  }
  componentWillMount() {
    let userSession = CommonUtils.getUserSession();
    let applicationId = userSession.application.applicationId;
    let botRouting = userSession.botRouting;
    let clearbitKey = userSession.clearbitKey;
    this.setState({
      clearbitKey: clearbitKey,
      applicationId:applicationId,
      botRouting:botRouting,
      inputBox:false
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
  updateEmailOnBlur =(e) =>{
    if(this.state.inputBoxMouseDown){
      return;
    }else{
      this.validateEmail();
    }
    this.setState({inputBoxMouseDown:false})
  }

  submitEmailMouseDown =(e)=>{
    this.setState({inputBoxMouseDown:true})
    this.validateEmail();
  }
  updatePhoneOnBlur =(e) =>{
    if(this.state.inputBoxMouseDown){
      return;
    }else{
      this.updateUserDetail("phoneNumber");
    }
    this.setState({inputBoxMouseDown:false})
  }

  submitPhoneMouseDown =(e)=>{
    this.setState({inputBoxMouseDown:true})
    this.updateUserDetail("phoneNumber");
  }
  updateDisplayNameOnBlur =(e) =>{
    if(this.state.inputBoxMouseDown){
      return;
    }else{
      this.updateUserDetail("displayName");
    }
    this.setState({inputBoxMouseDown:false})
  }

  submitDisplayNameMouseDown =(e)=>{
    this.setState({inputBoxMouseDown:true})
    this.updateUserDetail("displayName");
  }

  validateEmail = (e) => {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (document.getElementById("km-sidebar-user-email-edit").innerHTML.match(mailformat)) {
      this.updateUserDetail("email");
    }
    else {
      Notification.error("You have entered an invalid email address!");
      return false;
    }
  }
  setInputFlag(e){
    console.log(e.target.dataset.kmEditfield);
    this.setState({inputBoxMouseDown:false})
     this.showEditUserDetailDiv(e.target.dataset.kmEditfield);
  }
  onKeyDown = (e) => {
    if (e.which !== 8 && e.which !== 127) {
      if (isNaN(e.key))
        e.preventDefault();
    }

  }
  validatePhoneNumber =(e) =>{
    var phoneNumberformat = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/; 
    if(document.getElementById("km-sidebar-user-number-edit").innerHTML.match(phoneNumberformat))
    {
    this.updateUserDetail("phoneNumber");
    }
    else
    {
      Notification.error("You have entered an invalid phone Number");
    return false;
    }
  }
  
  updateUserDetail = (params) => {
    var userDetails = {};
    var elemId = '';
    var userId = document.getElementById("km-sidebar-userId").innerHTML;
    var displayName = document.getElementById("km-sidebar-display-name").innerHTML;
    var userDetails ={};
    userDetails[params] = document.getElementById(userDetailMap[params]+"-edit").innerHTML;
    elemId ="km-"+params+"-submit";

    userDetails.callback = function (userDetails) {
       document.getElementById(userDetailMap[params]).innerHTML = document.getElementById(userDetailMap[params]+"-edit").innerHTML;
      var list = document.querySelectorAll(".person.active .name");
      for (var i = 0; i < list.length; i++) {
        list[i].innerText = document.getElementById("km-sidebar-display-name").innerHTML;
      }
    }
    ApplozicClient.updateUserDetail({ "userDetails": userDetails, "ofUserId": userId });
    this.hideEditUserDetailDiv(params);

  }
  cancelEdit = function (event,elemId) {
    this.setState({inputBoxMouseDown:true});
    event.stopPropagation();
    this.hideEditUserDetailDiv(elemId);
    document.getElementById(userDetailMap[elemId]+"-edit").innerHTML= document.getElementById(userDetailMap[elemId]).innerHTML;
  }
  showEditUserDetailDiv = function (elemId) {
    document.getElementById(userDetailMap[elemId]).classList.remove("vis");
    document.getElementById(userDetailMap[elemId]).classList.add("n-vis");
    document.getElementById("km-"+elemId+"-submit").classList.remove("n-vis");
    document.getElementById("km-"+elemId+"-submit").classList.add("vis");
    if(document.getElementById(userDetailMap[elemId]+"-edit").classList.contains("vis")) {
      document.getElementById(userDetailMap[elemId]+"-edit").focus();
    }
    document.getElementById("pseudo-name-icon").classList.add("n-vis");
    document.getElementById("pseudo-name-icon").classList.remove("vis");
  }
  
  hideEditUserDetailDiv = function (elemId) {
    document.getElementById(userDetailMap[elemId]).classList.remove("n-vis");
    document.getElementById(userDetailMap[elemId]).classList.add("vis");
    document.getElementById("km-"+elemId+"-submit").classList.remove("vis");
    document.getElementById("km-"+elemId+"-submit").classList.add("n-vis");
    document.getElementById("pseudo-name-icon").classList.add("n-vis");
    document.getElementById("pseudo-name-icon").classList.remove("vis");
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
        var changeAssignee = true;

        let botAgentMap = CommonUtils.getItemFromLocalStorage("KM_BOT_AGENT_MAP");

        let groupUserDetail =  botAgentMap && botAgentMap[groupUser.userId];

        if (groupUserDetail && groupUserDetail.type == 2 && groupUserDetail.userName != "bot") {
              that.removeGroupMember(group.groupId, groupUserDetail.userName);
              if (changeAssignee) {
                that.changeAssignee(loggedInUserId);
                changeAssignee = false;
              }
            }
          }

        }
    var takeOverEleContainer = document.getElementById("km-take-over-bot-container");
    takeOverEleContainer.style.display = "none";
  }

  setUpAgentTakeOver(group) {
    var takeOverEleContainer = document.getElementById("km-take-over-bot-container"),
      takeOverEleText = document.querySelector("#km-bot-active-text p>strong"),
      pseudoNameIcon = document.getElementById("pseudo-name-icon");
    takeOverEleContainer.style.display = "none";
    pseudoNameIcon.classList.remove("vis");
    pseudoNameIcon.classList.add("n-vis");
    let allBotsInGroup = [];
    for (var key in group.users) {
      if (group.users.hasOwnProperty(key)) {
        var groupUser = group.users[key];

        let botAgentMap = CommonUtils.getItemFromLocalStorage("KM_BOT_AGENT_MAP");

        let groupUserDetail = botAgentMap && botAgentMap[groupUser.userId];

        if (groupUserDetail && groupUserDetail.type == 2 && groupUserDetail.userName != "bot") {
          allBotsInGroup.push(groupUserDetail.userName);
          // takeOverEleText.innerHTML = user.displayName;
          takeOverEleContainer.style.display = "flex";
          // console.log(user.displayName);
        }
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
    var groupId = window.$kmApplozic(".left .person.active").data('km-id') || this.state.group.groupId ;
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
                                            'type':10,
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
                                    //updateConversation({groupId:that.state.group.groupId,status:status});
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
    const infoText = Labels["lastcontacted.tooltip"];
    return (
      <aside className="aside-menu">
        <div className="animated fadeIn applozic-chat-container">
          {/* hide class is breaking conversation UI, while loading integry */}
          {/* <div id="tab-chat" className="row tabs hide"> */}
          <div id="tab-chat" className="row tabs">
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
                            <div className="trial-period-container">
                              {this.state.trialDaysLeftComponent}
                            </div>


                          </div>
                          <hr/>
                          <div className="km-new-conversation-header-bot" id="km-take-over-bot-container">
                            <div className="km-bot-active-text" id="km-bot-active-text">
                                <p><span>&#9679;</span> Active bots <strong></strong></p>
                            </div>
                            <div className="">
                              <button id="takeover-from-bot" className="km-button km-button--secondary take-over-from-bot-btn" onClick= {(event) => this.removeServiceBots(event.target.value)}>Takeover from Bot</button>
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
                            <ConversationsEmptyStateImage />
                            <p className="empty-state-message-shortcuts-first-text">You have no pending conversations</p>
                            <p className="empty-state-message-shortcuts-second-text">You may check how a conversation looks like by starting a <a href={`${getConfig().kommunicateWebsiteUrls.kmConversationsTestUrl}?appId=${CommonUtils.getUserSession().applicationId}&title=${CommonUtils.getUserSession().adminDisplayName}`} target="_blank">demo conversation</a> </p>
                        </div>
                      </div>
                      <div className="write">
                        <div className="email-conversation-indicator n-vis">
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11"><path fill="#949292" fillRule="nonzero" d="M0 3.64244378L4.17855719 0v2.08065889h.0112584c1.2252898.0458706 2.30872368.23590597 3.23022417.58877205 1.03614858.39436807 1.89047392.92952513 2.56710409 1.60169828.53552482.53356847.95771502 1.14100649 1.27501442 1.8173497.08349984.17792235.16437271.35624185.23304899.54349718.32987128.89954044.56029331 1.87632619.49311816 2.87991943-.01613705.24821756-.14560871.98810447-.2962837.98810447 0 0-.18801538-1.03695368-.94795775-2.22482365-.23267371-.36259621-.50437656-.70533502-.81698495-1.02186205l-.0350887.03038182v-.06533086c-.19420749-.19301397-.40079923-.37828356-.63497407-.54588006-.63272238-.45433742-1.40748832-.8141536-2.32279668-1.0796471-.74962217-.21763716-1.60432278-.34412883-2.54909064-.39019801h-.20809286l.00150112 2.08085746L0 3.64244378z"/></svg>
                            </span>
                            <span>
                              Your message will also be sent as an email reply
                            </span>
                        </div>
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
                                  title="Attach File"> </a>

                                <div id="dropup" className="dropup">
                                  <div id="d-box">
                                  </div>
                                </div>

                                <span id="km-text-box"
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
                        <div className="km-group-icon-sec km-postion-relative">
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
                        <p id="km-sidebar-userId"  hidden></p>
                        <div className="km-dispalyname-wrapper">
                          <div>
                            <p id="km-sidebar-display-name" className="km-sidebar-display-name km-truncate" onClick={() => this.showEditUserDetailDiv("displayName")}></p>
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
                          <div id="km-displayName-submit" className="n-vis" onBlur={() => this.updateDisplayNameOnBlur()}>
                          <p id="km-sidebar-display-name-edit"  contentEditable="true" className="km-sidebar-display-name km-truncate vis" onFocus={this.setInputFlag} data-km-editfield ="displayName"></p>
                          <div className="km-sidebar-displayName-svg">
                          <div className="km-rectangle km-displayName" onMouseDown={() => this.submitDisplayNameMouseDown()}>
                              <svg xmlns="http://www.w3.org/2000/svg" className ="km-sidebar-submit-svg" width="11" height="10" viewBox="0 0 11 10">
                                <path fill="#656161" fillRule="nonzero" d="M1.111 5.019a.66.66 0 1 0-.902.962l3.52 3.3a.66.66 0 0 0 .972-.076l6.16-7.92a.66.66 0 0 0-1.042-.81L4.103 7.823 1.111 5.02z" />
                              </svg>
                            </div>
                            <div className="km-rectangle km-displayName" onMouseDown={(e) => this.cancelEdit(e,"displayName")}>
                              <svg xmlns="http://www.w3.org/2000/svg" className ="km-sidebar-submit-svg" width="11" height="10" viewBox="0 0 9 9">
                                <path fill="#656161" fillRule="nonzero" d="M4.274 3.597L1.454.777a.479.479 0 0 0-.677.677l2.82 2.82a.32.32 0 0 1 0 .452l-2.82 2.82a.479.479 0 1 0 .677.677l2.82-2.82a.32.32 0 0 1 .452 0l2.82 2.82a.479.479 0 1 0 .677-.677l-2.82-2.82a.32.32 0 0 1 0-.452l2.82-2.82a.479.479 0 0 0-.677-.677l-2.82 2.82a.32.32 0 0 1-.452 0z" />
                              </svg>
                            </div>
                            </div>
                            </div>
                        </div>
                        <hr className="hr"/>
                        <div className="km-display-email-number-wrapper">
                          <div className="km-postion-relative">
                            <p className="n-vis">@</p> 
                            <p id="km-sidebar-user-email" className="km-sidebar-user-email vis" contentEditable="true" placeholder="Add Email" onClick={() => this.showEditUserDetailDiv("email")} data-km-editfield ="email" onFocus={this.setInputFlag}></p>
                            <div id= "km-email-submit" className="km-editemail n-vis" onBlur={this.updateEmailOnBlur}> 
                            <p id="km-sidebar-user-email-edit" type ="text" contentEditable="true" className="km-sidebar-user-email" placeholder="Add Email" ></p>
                            <div className="km-sidebar-svg">
                            <div className="km-rectangle" onMouseDown={this.submitEmailMouseDown}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10" className ="km-sidebar-submit-svg">
                                <path fill="#656161" fillRule="nonzero" d="M1.111 5.019a.66.66 0 1 0-.902.962l3.52 3.3a.66.66 0 0 0 .972-.076l6.16-7.92a.66.66 0 0 0-1.042-.81L4.103 7.823 1.111 5.02z" />
                              </svg>
                            </div>
                            <div className="km-rectangle" onMouseDown={(e) => this.cancelEdit(e,"email")}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" className ="km-sidebar-submit-svg" viewBox="0 0 9 9">
                                <path fill="#656161" fillRule="nonzero" d="M4.274 3.597L1.454.777a.479.479 0 0 0-.677.677l2.82 2.82a.32.32 0 0 1 0 .452l-2.82 2.82a.479.479 0 1 0 .677.677l2.82-2.82a.32.32 0 0 1 .452 0l2.82 2.82a.479.479 0 1 0 .677-.677l-2.82-2.82a.32.32 0 0 1 0-.452l2.82-2.82a.479.479 0 0 0-.677-.677l-2.82 2.82a.32.32 0 0 1-.452 0z" />
                              </svg>
                            </div>
                            </div>
                            </div>
                          </div>
                          <div className="vis km-postion-relative">
                            <p>
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 14">
                                <path fill="#686363" fillRule="nonzero" d="M8.33515566 13.38715016c-.05926722-.00832946-.11912954-.01893995-.1798423-.0313181-.72433044-.15252154-1.42626503-.47091322-2.27774871-1.03226124-1.50153202-1.01436369-2.75189609-2.31205273-3.719929-3.85938861l-.00046307-.00061446C1.3837426 7.22173723.86397466 5.99028636.61187513 4.80377854.4862773 4.21186996.38029987 3.50772098.5469947 2.77121015c.08723782-.46695842.34864425-.87135055.75334045-1.15635487L2.33561942.83451216c.60636074-.45717604 1.33570037-.35723769 1.81417846.2492895.14774114.18154096.29022762.37571102.42813376.56337758.06890112.0935513.13821485.18807619.20968376.28290396l.61744193.81924641c.469604.65142567.3703215 1.35785726-.25450303 1.8499775-.18127857.13658208-.3557812.26404499-.5302838.39150789-.1481799.10827262-.29633457.21636566-.44489304.32733183.10639789.37276514.28599585.75636724.5736771 1.22968834.6024601.98579219 1.21545411 1.72201055 1.92827981 2.31605998l.01516317.01330119c.08826528.0821727.19996166.15921504.31820799.240474.03239393.02231508.06478785.04463015.09679734.06707434l.97048089-.73103612c.2994681-.22563053.6334768-.3204217.96573219-.27372625.33225544.04669546.62740205.22972555.85307703.52916007l1.26573083 1.67963472c.47218866.62651871.36846445 1.36455479-.25814961 1.83682991-.11040583.08318392-.2205088.16421292-.32963818.2448294-.21777313.1603857-.42330672.3118708-.62381623.47321778-.44092231.38117707-.98627486.53196492-1.61576413.44349597zM2.77280686 8.0798434c.913921 1.46062416 2.09409806 2.68563972 3.50749335 3.64037227.76851357.50665465 1.39348005.79280436 2.02335274.92545858.48637304.1007671.8618835.0182177 1.1828808-.25895616.22203942-.17901343.44352489-.34235665.6578159-.50011874.1072605-.07904801.2154948-.15850851.32369789-.24035386.31073397-.2341187.34954852-.5102986.11535848-.82081824l-1.26575596-1.6794551c-.21502418-.28530257-.51782556-.32785853-.80316011-.1128768l-1.04486104.78723747c-.08541597.06435566-.3452753.25966173-.68298256.0276175-.06818674-.05041825-.12799042-.09141809-.18758932-.13257223-.13206778-.0910755-.26832263-.18493687-.39352062-.30013397-.7726529-.64530714-1.43247918-1.4366335-2.07605379-2.48954839-.35330624-.58106136-.56403643-1.05199111-.6840576-1.52720247-.0867049-.3526013.11851632-.53965504.2325599-.61353803.17183095-.12930333.34305621-.25429695.5143067-.37947015.17163493-.12530229.34326986-.25060458.51535612-.38042137.31675166-.2495704.35357249-.51156423.1132766-.8450992l-.61281112-.81310207c-.07316686-.0970807-.14435816-.19388374-.21493201-.28986755-.1388323-.18889543-.26997182-.36737072-.40973962-.53918457-.16789546-.2127567-.44141-.40245184-.81118683-.123527l-1.0446562.78708317c-.25998966.18320201-.41482075.42220147-.47016174.71693416-.13830646.6114026-.05063776 1.19431823.06401915 1.73506428.234443 1.10363771.7227653 2.25650656 1.45135088 3.42647847z"/>
                              </svg>
                            </p>
                            <p id="km-sidebar-user-number" placeholder ="Add Phone Number" contentEditable="true" className="km-sidebar-user-number" data-km-editfield ="phoneNumber" onFocus={this.setInputFlag} onClick={() => this.showEditUserDetailDiv("phoneNumber")}></p>
                            <div id="km-phoneNumber-submit" className="km-editphone n-vis" onBlur={this.updatePhoneOnBlur}>
                            <p id="km-sidebar-user-number-edit" placeholder ="Add Phone Number"contentEditable="true" className="km-sidebar-user-number"  onKeyDown={(e) => this.onKeyDown(e)}></p>
                            <div className="km-sidebar-svg">
                            <div className="km-rectangle" onMouseDown={() => this.submitPhoneMouseDown()}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10" className="km-sidebar-contact-svg" className ="km-sidebar-submit-svg">
                                <path fill="#656161" fillRule="nonzero" d="M1.111 5.019a.66.66 0 1 0-.902.962l3.52 3.3a.66.66 0 0 0 .972-.076l6.16-7.92a.66.66 0 0 0-1.042-.81L4.103 7.823 1.111 5.02z" />
                              </svg>
                            </div>
                            <div className="km-rectangle" onMouseDown={(e) => this.cancelEdit(e,"phoneNumber")}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" className ="km-sidebar-submit-svg" viewBox="0 0 9 9">
                                <path fill="#656161" fillRule="nonzero" d="M4.274 3.597L1.454.777a.479.479 0 0 0-.677.677l2.82 2.82a.32.32 0 0 1 0 .452l-2.82 2.82a.479.479 0 1 0 .677.677l2.82-2.82a.32.32 0 0 1 .452 0l2.82 2.82a.479.479 0 1 0 .677-.677l-2.82-2.82a.32.32 0 0 1 0-.452l2.82-2.82a.479.479 0 0 0-.677-.677l-2.82 2.82a.32.32 0 0 1-.452 0z" />
                              </svg>
                            </div>
                            </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr className="km-email-hr"></hr>
                      <div className ="km-user-lastseen-info">
                     <p className="km-user-info-metadata">
                      <span className="km-user-info-meatadata-key">
                      Last seen</span>
                      <span className="km-user-info-meatadata-value km-lastseen"></span>
                      </p>
                      <p className="km-user-info-metadata">
                      <span className="km-user-info-meatadata-key">Last contacted
                      <span className="km-tooltipsvg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" data-tip={infoText} data-effect="solid" data-place="right" data-multiline="True" currentitem="false"><g fill="#514E4E" fillRule="nonzero"><path d="M6.6.073c-.014-.002-.026 0-.04 0C2.983.094.073 2.975.073 6.5c0 3.525 2.914 6.409 6.494 6.426a.56.56 0 0 0 .035.002l.001-.002c3.489-.017 6.326-2.9 6.326-6.426 0-3.525-2.837-6.41-6.329-6.427zm.003 12.098l-.03-.001C3.404 12.155.827 9.61.827 6.5S3.405.845 6.598.83c3.073.015 5.574 2.56 5.574 5.67 0 3.108-2.498 5.652-5.569 5.671z"></path><path d="M6.485 5.38H5.84v4.317h1.32V5.38zM6.509 3.306v-.003l-.004-.001-.008.001-.006-.001v.003c-.399.007-.643.29-.651.659 0 .354.246.64.651.656v.004h.012l.003-.001.003.001v-.001a.636.636 0 0 0 .651-.66c0-.366-.257-.646-.651-.657z"></path></g></svg>
                      </span>
                      </span>
                      <span className="km-user-info-meatadata-value km-lastMessageAtTime"></span>
                      </p>
                      </div>
                      {/* user metadata */}
                      <div id="km-sidebar-user-info-wrapper" className="n-vis" >
                        <div id="km-user-info-panel" className="km-sidebar-info-panel">User Info</div>
                        <div id="km-user-info-metadata-wrapper" className="km-user-info-metadata-wrapper"></div>
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
                     
                      {/* <div id="km-group-info-panel" className="km-sidebar-info-panel">Group Info</div> */}
                      {/* <div id="km-group-detail-panel" className="km-group-detail-box">
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
                      </div> */}
                      {/* <div className="km-box-body">
                        <div className="km-tab-cell">
                          <div className="km-group-member-inner">
                            <ul id="km-group-member-list"
                              className="km-group-member-list km-contact-list km-nav km-nav-tabs km-nav-stacked">
                            </ul>
                          </div>
                        </div>
                      </div> */}
                      {/* <div id="km-group-info-ft" className="km-group-info-ft">
                        <button type="button" id="km-btn-group-exit"
                          className="km-btn km-btn-blue km-btn-group-exit"
                          title="Exit Group">Exit Group</button>
                      </div> */}
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
