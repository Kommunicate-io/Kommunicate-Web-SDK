import React, { Component, Fragment } from 'react';
import './Aside.css';
import CommonUtils from '../../utils/CommonUtils';
import ApplozicClient from '../../utils/applozicClient';
import {updateApplozicUser, getThirdPartyListByApplicationId,getUsersByType, updateZendeskIntegrationTicket, createAgileCrmContact, updateAgileCrmContact, getAppSetting,updateUserPreference} from '../../utils/kommunicateClient';
import { thirdPartyList } from './km-thirdparty-list'
import Modal from 'react-responsive-modal';
import ModalContent from './ModalContent.js';
import Notification from '../../views/model/Notification';
import ReactTooltip from 'react-tooltip';
import { USER_TYPE, GROUP_ROLE, LIZ, DEFAULT_BOT, CONVERSATION_STATUS, CONVERSATION_TYPE, CONVERSATION_TAB_VIEW_MAP, FAQ_TYPE} from '../../utils/Constant';
import {ConversationsEmptyStateImage} from '../../views/Faq/LizSVG';
import TrialDaysLeft from '../TrialDaysLeft/TrialDaysLeft';
import quickReply from '../../views/quickReply/quickReply';
import { getConfig } from '../../config/config';
import config from '../../config/index';
import PersonInfoCard from '../PersonInfo/PersonInfoCard'
import {PseudonymModal} from '../PersonInfo/MetaInfo';
import Button from '../Buttons/Button';
import {KommunicateContactListLoader, KommunicateConversationLoader, KommunicateConversationDataLoader} from '../../components/EmptyStateLoader/emptyStateLoader.js';
import { CollapseIcon, ExpandIcon, EmailIndicatorIcon, DownArrow, AssignedToMeIcon, ClosedIcon, ListIcon } from "../../assets/svg/svgs";
import styled from 'styled-components';
import { connect } from 'react-redux'
import * as SignUpActions from '../../actions/signupAction'
import Banner from '../../components/Banner';
import { Link } from 'react-router-dom';
import MultiSelectInput from './MultiSelectInput';
import {integration_type} from '../../views/Integrations/ThirdPartyList';
import ResolutionDropdown from './ResolutionDropdown';
import CloseButton from '../Modal/CloseButton';
import { default as DeleteModal } from 'react-modal';
import { SearchBarIcon } from "../../assets/svg/svgs";
import Moment from 'moment-timezone';
import UserDropdown from '../../components/Dropdown/UserDrodown';
import AnalyticsTracking from '../../utils/AnalyticsTracking';

const userDetailMap = {
  "displayName": "km-sidebar-display-name",
  "email": "km-sidebar-user-email",
  "phoneNumber": "km-sidebar-user-number",
};

const SubmitButton = styled(Button)`
  &:hover, &:active, &:focus {
    box-shadow: none;
  }
`;
class Aside extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      applicationId : "",
      activeTab: '1',
      assignee: '',
      conversationAssigneeInfo: { label: "", value: "" },
      conversationStatus:"",
      visibleIntegartion:false,
      visibleReply:true,
      modalIsOpen:false,
      inputBoxMouseDown:false,
      clickedButton:-1,
      agents : new Array(),
      clearbitKey:"",
      botRouting : false,
      statuses: {
        0: 'Open',
        2: 'Resolved',
        3: 'Spam/Irrelevant',
        4: 'Duplicate'
      },
      group: null,
      modalOpen: false,
      hideInfoBox: false,
      trialDaysLeftComponent: "",
      userInfo: null,
      toggleExpandIcon: false,
      toggleCcBccField: true,
      warningBannerText: '',
      toggleCcBccField: true,
      disabledIntegration:{[integration_type.AGILE_CRM]: true, [integration_type.ZENDESK]:true },
      pseudoUser: true,
      activeConversationTab: CONVERSATION_TYPE.ASSIGNED_TO_ME,
      conversationTab:{
        [CONVERSATION_TYPE.ALL]: {title:"All Conversations", count: 0 }, 
        [CONVERSATION_TYPE.ASSIGNED_TO_ME]: {title:"Assigned to me",  count: 0 }, 
        [CONVERSATION_TYPE.CLOSED]: {title:"Resolved Conversations", count: 0 }
      },
      loggedInUser:"",
      isLizActive: false,
      isDeleteModalOpen: false
    };
    this.dismissInfo = this.dismissInfo.bind(this);
    this.handleGroupUpdate =this.handleGroupUpdate.bind(this);
    this.forwardMessageToZendesk = this.forwardMessageToZendesk.bind(this);
    this.handleUpdateUser = this.handleUpdateUser.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
  }
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  componentDidMount() {
    var userSession = CommonUtils.getUserSession();
     if(userSession === null){
       //window.location ="#/login";
       window.appHistory.replace('/login');
       return;
     }else {
       //window.location ="/dashboard";
       //window.appHistory.push('/dashboard');
     }

     this.getThirdparty ();
     this.getAgileCrmSettings();
     quickReply.loadQuickReplies();

       var currentTimeZone = Moment.tz.guess(true).toString();
       var timeZone = userSession.timeZone;
       if (typeof timeZone == "undefined" || timeZone !== currentTimeZone) {
         updateUserPreference(userSession.application.applicationId, userSession.email, currentTimeZone).then(res => {
           userSession.timeZone = currentTimeZone;
           CommonUtils.setUserSession(userSession);
         })
       }
     getAppSetting(userSession.application.applicationId)
     .then(this.storeAppSettingInSession)
     .catch(e=>{
       console.log("error while fetching app setting", e);
     });
     window.Aside = this;
    

     this.setState({	
        trialDaysLeftComponent: <TrialDaysLeft />	
     })

    window.addEventListener("group-update", this.handleGroupUpdate);
    window.addEventListener("_sendMessageEvent", this.forwardMessageToZendesk);
    window.addEventListener("_userDetailUpdate", this.handleUpdateUser);

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
      agileCrmData :"",
      inputBox:false,
      loggedInUser: userSession.userName
     },this.loadAgents);
     if (typeof(Storage) !== "undefined") {
      (localStorage.getItem("KM_PSEUDO_INFO") === null ) ?
        this.setState({hideInfoBox: false}) : this.setState({hideInfoBox: true})
    } else {
        console.log("Please update your browser.");
    }
    window.removeEventListener("group-update",this.handleGroupUpdate);
    window.removeEventListener("_sendMessageEvent", this.forwardMessageToZendesk);
    window.removeEventListener("_userDetailUpdate", this.handleUpdateUser);
  }

  storeAppSettingInSession(appSetting){
    appSetting  && appSetting.data&& CommonUtils.setItemInLocalStorage('KM_APP_SETTINGS', appSetting.data.response);
  }

  handleUpdateUser(e) {
    var user = e.detail.data;
    var pseudoUser = (user.metadata && user.metadata.KM_PSEUDO_USER ) ? true : false;
    this.setState({
        userInfo: user,
        agileCrmData: (user.metadata && user.metadata.KM_AGILE_CRM) ? JSON.parse(user.metadata.KM_AGILE_CRM) : "" ,
        pseudoUser:pseudoUser
    })
}
  updateUserInfo = (userData) => {
    let userInfo = this.state.userInfo
    for (var key in userData) {
      userInfo[key] = userData[key]
    }
    this.setState({
      userInfo:userInfo,
      pseudoUser:false
    })
  }
  displayConversationCount = (count) => {
    const displayLimit = 999;
    return count > displayLimit ? (displayLimit.toString() + "+") : count
  }
  updateConversationCount = (type, change) => {
    let conversationTab = this.state.conversationTab;
    conversationTab[type].count += change;
    this.setState({conversationTab:conversationTab})
  }
  clearConversationAssignee = () => {
    this.setState({conversationAssigneeInfo: { label: "", value: "" }})
  }
  handleGroupUpdate(e) {
    e.preventDefault();
    let activeConversationId = window.document.getElementsByClassName("active-chat")[0] && window.document.getElementsByClassName("active-chat")[0].dataset.kmId
    let group = e.detail.data;
    !group.groupId && (group["groupId"] = group.id);
    !group.users && (group["users"] = group.groupUsers);
    if(activeConversationId == group.groupId ) { 
      this.setState({ group: group });
      this.selectStatus();
      this.selectAssignee();
    }
   
  }
  populateAgentAndBotDetailMap(agents){
    let AGENT_BOT_DETAIL_MAP= {}
    if(agents && agents.length){
      agents.forEach(function(agent){
        AGENT_BOT_DETAIL_MAP[agent.userName]= agent;
      })
    }
   window.AGENT_BOT_DETAIL_MAP = AGENT_BOT_DETAIL_MAP;
  }
  forwardMessageToZendesk(e) {
    var message = e.detail.data;
    if (this.state.group && this.state.group.metadata && this.state.group.metadata.KM_ZENDESK_TICKET_ID) {
      var data = {
        "ticket": {
          "comment": { "body": message.message }
        }
      }
      updateZendeskIntegrationTicket(data, this.state.group.metadata.KM_ZENDESK_TICKET_ID)
          .then(response => {
            console.log(response)
          })
          .catch(err => {
            console.log(err)
          })
    }
  }

  getThirdparty = () => {
    getThirdPartyListByApplicationId().then(response => {
        let zendeskKeys = response.data.message.filter(function (integration) {
          return integration.type == integration_type.ZENDESK;});
          if(zendeskKeys.length > 0 ){
            this.updateIntegrationStatus({[integration_type.ZENDESK]: false})
          }
    }).catch(err => {
      console.log("erroe while fetching zendesk integration keys",err)
    });

  }
  getAgileCrmSettings = () => {
    getThirdPartyListByApplicationId(integration_type.AGILE_CRM).then(response => {   
        response.data.message.length > 0 && this.updateIntegrationStatus({[integration_type.AGILE_CRM]: false})
    }).catch(err => {
      console.log("error while fetching agile crm integration keys",err)
    });
  }
  updateIntegrationStatus = (status) => {
    let disabledIntegration = this.state.disabledIntegration;
    for (var key in status) {
      disabledIntegration[key] = status[key]
    }
    this.setState({disabledIntegration:disabledIntegration})


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
      var that = this;
      let users = [USER_TYPE.AGENT, USER_TYPE.ADMIN,USER_TYPE.BOT];
      return Promise.resolve(getUsersByType(this.state.applicationId, users)).then(data => {
        that.setState({ agents: data });
        that.populateAgentAndBotDetailMap(data);
      }).catch(err => {
        console.log("error while fetching users list ", err);
      });

      if (CommonUtils.getItemFromLocalStorage("userProfileUrl") != null) {
                  that.props.updateProfilePicUrl(CommonUtils.getItemFromLocalStorage("userProfileUrl"));
                  let userSession = CommonUtils.getUserSession();
                  userSession.imageLink = CommonUtils.getItemFromLocalStorage("userProfileUrl");
                  CommonUtils.setUserSession(userSession);
      }

  }
  loadBots() {
    window.$kmApplozic.fn.applozic('fetchContacts', { roleNameList: ['BOT'], callback: function (response) { } });
  }


  initConversation(groupId) {
    var that = this;
    var emptyState = document.getElementById("empty-state-conversations-div");
    window.$kmApplozic.fn.applozic("getGroup", {
        groupId: groupId, callback: function(response) {
          if(response) {
            emptyState.classList.add('n-vis');
            emptyState.classList.remove('vis');
            that.setState({
              visibleIntegartion:false,
              visibleReply:true,
              toggleCcBccField: true
            });
            that.setUpAgentTakeOver(response);
          }
          }
    });
  }

  getGroupAdmin(group) {
    if(typeof this.state.group =='undefined'){
      return "";
    }
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
    this.isConversationAssignedToLiz(assignee);

    let userList = this.state.agents;
    let conversationAssigneeInfo = {};
    userList && assignee && userList.find(result => {
      if (result.userName == assignee) {
        conversationAssigneeInfo.label = result.name || result.userName ;
        conversationAssigneeInfo.value = result.userName;
      }
    });
    this.setState({
      assignee:assignee,
      conversationAssigneeInfo:conversationAssigneeInfo
    })
  }

  isConversationAssignedToLiz (assignee) {
    assignee && this.setState({
      isLizActive: (assignee === LIZ.userName)
    })
  };
  
  selectStatus() {
    if (this.state.group.metadata && this.state.group.metadata.CONVERSATION_STATUS) {
      if(this.state.group.metadata.CONVERSATION_STATUS == window.KOMMUNICATE_CONSTANTS.CONVERSATION_STATE.UNRESPONDED || this.state.group.metadata.CONVERSATION_STATUS == window.KOMMUNICATE_CONSTANTS.CONVERSATION_STATE.INITIAL || this.state.group.metadata.CONVERSATION_STATUS == window.KOMMUNICATE_CONSTANTS.CONVERSATION_STATE.OPEN){
        window.$kmApplozic("#conversation-status").val(window.KOMMUNICATE_CONSTANTS.CONVERSATION_STATE.OPEN);
        this.setState({conversationStatus:window.KOMMUNICATE_CONSTANTS.CONVERSATION_STATE.OPEN})
      }else{
        window.$kmApplozic("#conversation-status").val(this.state.group.metadata.CONVERSATION_STATUS);
        this.setState({conversationStatus:this.state.group.metadata.CONVERSATION_STATUS})
      }
    } else {
      window.$kmApplozic("#conversation-status").val(0);
      this.setState({conversationStatus:""})
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

  setUpConversationHeader(group){
    let kmConversationHeader = document.getElementsByClassName("km-new-conversation-header")[0];
    let kmBoxTop = document.getElementsByClassName("km-box-top")[0] ;
    if(group){
      kmConversationHeader.classList.remove("n-vis");
      kmConversationHeader.classList.add("vis");
      kmBoxTop.classList.remove('km-conversation-header-without-border');
    }else{
      kmConversationHeader.classList.remove("vis");
      kmConversationHeader.classList.add("n-vis");
      kmBoxTop.classList.add('km-conversation-header-without-border');
    }
  }

  setUpAgentTakeOver(group) {
    var takeOverEleContainer = document.getElementById("km-take-over-bot-container"),
      takeOverEleText = document.querySelector("#km-bot-active-text p>strong"),
      pseudoNameIcon = document.getElementById("pseudo-name-icon");
    takeOverEleContainer.style.display = "none";
    document.querySelector("#km-bots-warning--banner").style.display = "none";
    var allBotsInGroup = [];
    //pseudoNameIcon.classList.remove("vis");
    //pseudoNameIcon.classList.add("n-vis");
    this.setUpConversationHeader(group);
    if (group) {
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

    if(allBotsInGroup.length > 0 && (!CommonUtils.isTrialPlan() && CommonUtils.isStartupPlan())) {
      document.querySelector("#km-bots-warning--banner").style.display = "block";
      this.setState({
        warningBannerText: [<span key={1} className="km-bot-names">{allBotsInGroup.join(', ')} </span>, <span key={2}>will not work as your trial has ended. </span>,<Link key={3} to={'/settings/billing'} >Upgrade plan</Link>]
      });
    }
  }
    
  }
  
  changeAssignee = (assigneeInfo) => {
    var that = this;
    var prevAssignee = that.state.assignee
    var userId = assigneeInfo.value;
    this.setState({conversationAssigneeInfo: assigneeInfo})
    var groupId = window.$kmApplozic(".left .person.active").data('km-id') || this.state.group.groupId ;
    that.state.group && window.$kmApplozic.fn.applozic('updateGroupInfo',
                                    {
                                      'groupId': this.state.group.groupId,
                                      'metadata': {
                                                'CONVERSATION_ASSIGNEE' : userId,
                                      },
                                      'callback': function(response) {
                                        that.setState({assignee:userId});
                                        if(userId == that.state.loggedInUser) {
                                          that.updateConversationCount(CONVERSATION_TYPE.ASSIGNED_TO_ME, +1)
                                        } else if (prevAssignee == that.state.loggedInUser && prevAssignee != userId ){
                                          that.updateConversationCount(CONVERSATION_TYPE.ASSIGNED_TO_ME, -1)
                                        }
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
                                            'type': 10,
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
                                                  if (group && group.members.indexOf(userId) == -1) {
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
    let botAgentMap = CommonUtils.getItemFromLocalStorage("KM_BOT_AGENT_MAP");
    var role = botAgentMap[userId].type == 2 ? 2 : 1
    window.$kmApplozic.fn.applozic('addGroupMember',{'groupId': groupId,
                                        'userId': userId,
                                        'role': role,
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
    var prevStatus = this.state.conversationStatus;
    window.$kmApplozic.fn.applozic('updateGroupInfo',
                                    {
                                      'groupId': that.state.group.groupId,
                                      'metadata': {
                                                'CONVERSATION_STATUS' : status.toString()
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
                                          that.setState({conversationStatus:status})
                                        if( status == CONVERSATION_STATUS.OPEN) {
                                          that.updateConversationCount(CONVERSATION_TYPE.CLOSED, -1);
                                          that.updateConversationCount(CONVERSATION_TYPE.ALL, +1);
                                          (that.state.assignee == that.state.loggedInUser) && that.updateConversationCount(CONVERSATION_TYPE.ASSIGNED_TO_ME, +1);
                                        } else if (prevStatus == CONVERSATION_STATUS.OPEN) {
                                          AnalyticsTracking.acEventTrigger("resolveConversation");
                                          that.updateConversationCount(CONVERSATION_TYPE.CLOSED, +1);
                                          that.updateConversationCount(CONVERSATION_TYPE.ALL, -1);
                                          (that.state.assignee == that.state.loggedInUser) && that.updateConversationCount(CONVERSATION_TYPE.ASSIGNED_TO_ME, -1);

                                        }
                                          
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
    this.props.updatPseudoBannerStatus(true);
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

  expandTextArea = () => {
    var textArea = document.getElementById("km-text-box");
    textArea.classList.toggle("km-expand-text-area-box");
    this.setState({
      toggleExpandIcon: !this.state.toggleExpandIcon
    }, () => {
      CommonUtils.setCursorAtTheEndOfInputString(textArea);
    });
    
  }
  handleForwardToZendesk = (e) => {
    this.setState({
      clickedButton:e.target.dataset.index
      },
      this.openModal)
    }
  onTabClick= (e) => {
    let selectedTab = e.currentTarget.dataset.tab;
    this.toggleTab(selectedTab);
    var tabId = $kmApplozic(".km-conversation-icon-active")[0].id;
    this.setState({activeConversationTab:selectedTab})
    this.populateMessageList(tabId);
    this.selectFirstConversation(tabId);
  }
  populateMessageList = (tabId) => {
    $kmApplozic(".km-converastion").removeClass('vis').addClass('n-vis');
    $kmApplozic("." + CONVERSATION_TAB_VIEW_MAP[tabId]).removeClass('n-vis').addClass('vis');
  }

  selectFirstConversation = (tabId) => {
    let fistConversation =  $kmApplozic("." + CONVERSATION_TAB_VIEW_MAP[tabId] + " li:first-child")[0];
    fistConversation && fistConversation.click();
  }

  toggleTab = (selectedTab) => {
    for (var i =0 ; i < document.querySelector('.km-conversation-header-icons').childNodes.length ; i++ ) {
      document.querySelector('.km-conversation-header-icons').childNodes[i].classList.remove("km-conversation-icon-active");
    }
    document.querySelector('[data-tab="'+selectedTab+'"]').classList.add("km-conversation-icon-active");
  }
  
  handleForwardToAgileCrm = (e) => {
    let contact = { metadata: {} };
    let agileCrmData = {};
    let contactId = e.target.dataset.agileContactId
    contact.email = this.state.userInfo.email || "";
    contact.displayName = (!this.state.pseudoUser && this.state.userInfo.displayName) || "";
    contact.userId = this.state.userInfo.userId;
    contact.phoneNumber = this.state.userInfo.phoneNumber || "";
    for (var i = 0; i < Object.keys(this.state.userInfo.metadata).length; i++) {
      let key = Object.keys(this.state.userInfo.metadata)[i];
      let value = this.state.userInfo.metadata[Object.keys(this.state.userInfo.metadata)[i]]
      if(!CommonUtils.hasJsonStructure(value)){
        contact.metadata[key] = value
      }
    }
    if (contactId) {
      contact.contactId = contactId
      updateAgileCrmContact(contact)
        .then(response => {
          Notification.success("User Info updated")
        }).catch(err => {
          Notification.error("Could not update Agile CRM contact. Please try again")
        })
    } else {
    createAgileCrmContact(contact)
      .then(response => {
          agileCrmData.contactId = response.data.response.id;
          this.setState({agileCrmData:agileCrmData})
          Notification.success("User Info successfully forwarded") 
        }).catch(err => {
          Notification.error("Could not create Agile CRM contact. Please try again")
      })
  }

  }
  forwardIntegrationButtonClick = (e) => {
    integration_type.ZENDESK == e.target.dataset.integrationType && this.handleForwardToZendesk(e);
    integration_type.AGILE_CRM == e.target.dataset.integrationType && this.handleForwardToAgileCrm(e);
    
  };

  faqAndLizBanner = () => {
    var faqList = this.props.appSettings.faqList;
    var publishedFaq = faqList && faqList.filter(function (item) {
        return item.status == FAQ_TYPE.PUBLISHED;
    });
    if (this.state.isLizActive && publishedFaq && publishedFaq.length < 5) {
      var heading = "Add more FAQs for better results from the ";
      if (publishedFaq.length === 0) {
        heading = "Liz will not work as you’ve not added any FAQs. Add them now from the ";
      } 
      return <Banner cssClass="km-is-liz" appearance="warning" heading={[heading, <Link key={1} to={'/faq'} >FAQ section.</Link>]}/>
    }
  };

  toggleDeleteConversationModal = () => {
    this.setState({
      isDeleteModalOpen: !this.state.isDeleteModalOpen
    });
  }

  deleteGroup = () => {
    let url = window.location.origin + '/conversations';
    var that = this;
    window.$kmApplozic.fn.applozic('deleteGroup',
      {
        'groupId': that.state.group.groupId,
        'callback': function (response) {
          if(response && response.data && response.data === 'success') {
            that.setState({
              isDeleteModalOpen: false
            });
            Notification.success("Conversation deleted successfully");
            AnalyticsTracking.acEventTrigger('deleteConversation');
            window.location.replace(url);
          } else {
            Notification.error("Something went wrong. Please try again after some time.");
          }
        }
      }
    );
  };

  render() {
    let agileContactId = this.state.agileCrmData.contactId ? this.state.agileCrmData.contactId : "";
    const thirdParty = thirdPartyList.map((item,index) => {
      return <Button secondary data-index ={index} data-integration-type={item.type} disabled = {this.state.disabledIntegration[item.type]} key = {index} onClick={(e) => {this.forwardIntegrationButtonClick(e)}}
      className="km-forward-integration-button" data-agile-contact-id = {agileContactId} >
      <img src={item.logo} className="km-fullview-integration-logo" />{item.name}</Button>
 });
    const kmConversationsTestUrl = getConfig().kommunicateWebsiteUrls.kmConversationsTestUrl+"?appId="+CommonUtils.getUserSession().application.applicationId +"&title="+CommonUtils.getUserSession().adminDisplayName;
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
                          <div id="km-assigned" className="km-conversation-header-icon km-conversation-icon-active km-conversation-tabView" data-tab = {CONVERSATION_TYPE.ASSIGNED_TO_ME} data-tip="Assigned to me" data-effect="solid" data-place="bottom" onClick={this.onTabClick}>
                            {/* <div className="km-conversation-header-notification-alert"></div> */}
                            <AssignedToMeIcon />
                            <span id="km-assigned-unread-icon" className="km-unread-icon n-vis"></span>
                          </div>
                          <div id= "km-conversation" className="km-conversation-header-icon km-conversation-tabView " data-tip="All Conversations" data-tab = {CONVERSATION_TYPE.ALL} data-effect="solid" data-place="bottom" onClick={this.onTabClick}>
                           <ListIcon />
                          <span id="km-allconversation-unread-icon" className="km-unread-icon n-vis"></span>
                          </div>
                          <div id="km-closed" className="km-conversation-header-icon km-conversation-tabView" data-tip="Resolved Conversations" data-tab = {CONVERSATION_TYPE.CLOSED} data-effect="solid" data-place="bottom" onClick={this.onTabClick}>
                            <ClosedIcon />
                            <span id="km-closed-unread-icon"></span>
                          </div>
                        </div>
                      </div>
                      {/* Introducing Pseudonyms */}
                      <div className={this.props.kmOnBoarding ?"introducing-text-box-main-container" :"n-vis"} hidden={this.state.hideInfoBox}>
                        <div className="introducing-text-box-container">
                          <div className="introducing-info-icon-container">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 20 20" style={{marginRight:"10px"}}>
                              <path id="Path_2" data-name="Path 2" d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,15h0a1,1,0,0,1-1-1V12a1,1,0,0,1,1-1h0a1,1,0,0,1,1,1v4A1,1,0,0,1,12,17Zm1-8H11V7h2Z" transform="translate(-2 -2)" fill="#6d6d6d"/>
                            </svg>
                          </div>
                          <div className="introducing-text-container">
                            <p>Introducing Pseudonyms for anonymous users</p>
                            <Button secondary link onClick={this.onOpenModal}>Learn more</Button>
                            {
                              this.state.modalOpen ? <PseudonymModal modalOpen={this.state.modalOpen} onCloseModal={this.onCloseModal} /> : null
                            }
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
                      <div id="km-dashboard-conversation-list-heading" className="km-row km-conversation-tab-title-wrapper">
                        <h4 id="km-conversation-tab-title" className="km-conversation-tab-selected km-assigned">{this.state.conversationTab[this.state.activeConversationTab].title}</h4>
                       { this.state.conversationTab[this.state.activeConversationTab].count > 0 &&
                          <div className="km-conversation-count-wrapper n-vis">
                            <p className="km-conversation-count">{this.displayConversationCount(this.state.conversationTab[this.state.activeConversationTab].count)}</p>
                          </div>
                       }
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
                              <span id="km-clear-search-text" className=" km-clear-search-text n-vis"> × </span>
                              <input type="text" id="km-search" className= "km-search-icon-properties" autoComplete="off" placeholder="Search..."/>
                              <span className="km-search-icon km-conversation-search-icon"> 
                                <SearchBarIcon id = "km-conversation-search-icon-svg"/>
                              </span> 
                              </div>
                            </div>
                            <div className="km-tab-cell">
                              <div className="km-message-inner">
                                <ul id="km-contact-list"
                                  className="people km-contact-list km-allconversation km-converastion km-nav km-nav-tabs km-nav-stacked n-vis">
                                </ul>
                                <ul id="km-assigned-search-list"
                                  className="km-contact-list people km-assigned km-converastion km-nav km-nav-tabs km-nav-stacked"></ul>
                                <ul id="km-search-results" 
                                  className="km-contact-list people km-converastion km-nav km-nav-tabs km-nav-stacked vis"></ul>
                                <ul id="km-closed-conversation-list"
                                  className="km-contact-list people km-converastion km-closed km-nav km-nav-tabs km-nav-stacked n-vis"></ul>
                                <div id="km-no-search-results-found" className="n-vis">
                                  No results found
                                </div>
                                <div id="km-contact-loading" className="km-loading km-contact-loading">
                                  <KommunicateContactListLoader/>
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

                            <div className="flexi">
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
                                  </div>
                                </div>
                              </div>
                              <div className="trial-period-container">	
                                {this.state.trialDaysLeftComponent}	
                              </div>
                            </div>
                            
                            {/* <div className="select-labels">
                                <span className="">Status:</span>
                            </div>
                            <div className="">
                              <div className="select-container">
                                <select id="conversation-status" onChange = {(event) => this.changeStatus(event.target.value)}>
                                  <option value={CONVERSATION_STATUS.OPEN}>Open</option>
                                  <option value={CONVERSATION_STATUS.CLOSED}>Close</option>
                                  <option value={CONVERSATION_STATUS.SPAM}>Spam</option>
                                  <option value={CONVERSATION_STATUS.DUPLICATE}>Duplicate</option>
                                </select>
                              </div>
                            </div> */}
                            <div className="flexi">
                              <div className="flexi">
                                <div className="select-labels">
                                    <span className="">Assign to:</span>
                                </div>
                                <div>
                                     <UserDropdown
                                        handleDropDownChange = {this.changeAssignee} 
                                        userType ={[USER_TYPE.AGENT, USER_TYPE.ADMIN, USER_TYPE.BOT]}
                                        className="conversation-assignee-dropdown"
                                        defaultValue={this.state.conversationAssigneeInfo}
                                      />
                                </div>
                              </div>
                              
                              <ResolveButtonContainer>
                                {
                                  (this.state.conversationStatus == CONVERSATION_STATUS.CLOSED || this.state.conversationStatus == CONVERSATION_STATUS.SPAM) ? <Button onClick={() => this.changeStatus(CONVERSATION_STATUS.OPEN)}>Reopen</Button> : <Button onClick={() => this.changeStatus(CONVERSATION_STATUS.CLOSED)}>Resolve</Button>
                                }
                                
                              </ResolveButtonContainer>

                              <div>
                                <ResolutionDropdown conversationStatus={CONVERSATION_STATUS} changeStatus={this.changeStatus} group={this.state.group} toggleDeleteConversationModal={this.toggleDeleteConversationModal}/>
                              </div>
                            </div>
                          </div>
                          <hr/>
                          <div className="km-new-conversation-header-bot" id="km-take-over-bot-container" hidden={this.state.warningBannerText !== ""}>
                            <div className="km-bot-active-text" id="km-bot-active-text">
                                <p><span>&#9679;</span> Active bots <strong></strong></p>
                            </div>
                            <div className="">
                              <button id="takeover-from-bot" className="km-button km-button--secondary take-over-from-bot-btn" onClick= {(event) => this.removeServiceBots(event.target.value)}>Takeover from Bot</button>
                            </div>
                          </div>
                          <div className="km-bots-warning-banner" id="km-bots-warning--banner">
                            <Banner hidden={this.state.warningBannerText === ""} appearance="warning" heading={this.state.warningBannerText}/>
                          </div>
                          <LizBanner>
                            { !(!CommonUtils.isTrialPlan() && CommonUtils.isStartupPlan()) && this.state.isLizActive && this.faqAndLizBanner()}
                          </LizBanner>
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
                              <div style= {{position:"relative"}}>
                                <KommunicateConversationLoader/> 
                                <KommunicateConversationDataLoader/>
                              </div>
                            </div>
                            <div id="km-msg-loading-ring" className="km-loading n-vis">
                            <img src="/applozic/images/ring.gif"/>
                            </div>
                            <div id="km-no-more-messages"
                              className="km-no-more-messages km-show-more-icon n-vis">
                              <h3>No more messages!</h3>
                            </div>

                            <NewMessageIndicatorContainer className="km-new-messages-indicator--container n-vis">
                              <NewMessageIndicatorText>
                                <DownArrow />
                              </NewMessageIndicatorText>
                              <NewMessageIndicatorText className="km-new-messages-indicator--count"></NewMessageIndicatorText>
                              <NewMessageIndicatorText>new messages</NewMessageIndicatorText>
                            </NewMessageIndicatorContainer>
                            <div className="km-typing-indicator-for-agent--container n-vis">
                        <div className="km-typing-indicator-for-agent--image"></div>
                        <div className="km-typing-indicator-for-agent--text">Typing...</div>
                      </div>
                          </div>
                        </div>
                        <div id="empty-state-conversations-div" className="empty-state-conversations-div text-center n-vis">
                            <ConversationsEmptyStateImage />
                            
                            <p className="empty-state-message-shortcuts-first-text km-empty-state-heading">You have no pending conversations</p>

                            <p className="empty-state-message-shortcuts-second-text km-empty-state-subheading">You may check how a conversation looks like by starting a <a href={kmConversationsTestUrl+""} target="_blank">demo conversation</a> </p>

                            <button className="km-button km-button--primary" onClick={() => {
                              window.appHistory.push('/settings/install');
                            }}>See how to install</button>

                        </div>
                      </div>
                     
                      <div className="write">
                    
                        <div id="km-sidebox-ft" className="km-box-ft km-panel-ft">
                          {/* Email Indicator Text below */}
                          <div className="email-conversation-indicator n-vis">
                            <span><EmailIndicatorIcon /></span>
                            <span>Your message will also be sent as an email reply </span>
                          </div>

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
                              <div onClick={this.expandTextArea} className={this.state.visibleReply ? "km-expand-icon": "n-vis"}>
                                { !this.state.toggleExpandIcon ? <ExpandIcon /> : <CollapseIcon /> }
                              </div>
                              <div className="km-cc-bcc-button-container n-vis" onClick={() => {
                                this.setState({
                                  toggleCcBccField: !this.state.toggleCcBccField
                                })
                              }}>Cc</div>
                            </div>
                            <div className={this.state.visibleReply ? "n-vis" : "km-sidebox-third-party-integration"}>
                              <span className="inteagration-forward-text">Forward to:</span>
                              {thirdParty}
                            </div>
                            <div className={this.state.visibleReply ?"km-cc-bcc-input-container" : "n-vis"} hidden={this.state.toggleCcBccField}>
                              <div className="km-cc-text">Cc</div>
                              <div className="km-cc-input-container">
                                <MultiSelectInput group={this.state.group}/>
                              </div>
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
                                
                                <a href="javascript:void(0)" id="km-file-up2" type="button"
                                  className="write-link attach n-vis km-file-upload km-btn-text-panel" title="Attach File"></a>

                                <div id="dropup" className="dropup">
                                  <div id="d-box">
                                  </div>
                                </div>

                                <div id="km-text-box" contentEditable="true" suppressContentEditableWarning="true" className="km-text-box km-text required" data-text="Type your message..."></div>

                              </form>
                            </div>

                            <div className={this.state.visibleReply ? "km-text-box-icons-container": "n-vis"}>
                              <div className="km-text-box-icons--first-half">
                                {/* Attach File and Location Dropdown Container */}
                                <div id="km-btn-attach" className="km-btn-attach">
                                  <div className="km-dropdown-toggle" data-toggle="kmdropdown"
                                    aria-expanded="true">
                                    <a href="javascript:void(0)" type="button" id="km-btn-attach"
                                      className="write-link attach km-btn-text-panel"
                                      aria-expanded="true" title="Attach File">
                                    </a>
                                  </div>
                                  <ul id="km-upload-menu-list" className="km-dropup-menu km-upload-menu-list" role="menu">
                                    <li>
                                      <a id="km-file-up" href="javascript:void(0)"
                                      className="km-file-upload menu-item" title="File &amp; Photos">
                                        <img src="/applozic/images/mck-icon-photo.png"
                                        className="menu-icon" alt="File &amp; Photos"/> <span>Files
                                          &amp; Photos</span>
                                      </a>
                                    </li>
                                    <li>
                                      <a id="km-btn-loc" href="javascript:void(0)" className="menu-item"
                                      title="Location"> 
                                        <img src="/applozic/images/mck-icon-marker.png" className="menu-icon" alt="Location"/> <span>Location</span>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                                {/* Smiley Button */}
                                <a href="javascript:void(0)" type="button" id="km-btn-smiley" className="write-link smiley km-btn-smiley km-btn-text-panel" title="Smiley"></a>
                              </div>
                              
                              <div  className="km-text-box-icons--second-half">
                                {/* Press Enter to Send */}
                                <div className="km-enter-to-send-container">
                                  <input className="km-styled-checkbox" id="km-press-enter-to-send-checkbox" type="checkbox" />
                                  <label htmlFor="km-press-enter-to-send-checkbox">Press enter to send</label>
                                </div>
                                {/* Send Button */}
                                <button type="submit" id="km-msg-sbmt" className="write-link send km-btn-text-panel" title="Send Message">Send</button>
                              </div>
                              
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
                                  <div id="km-group-create-title" className="km-group-create-title km-group-title contenteditable"
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
                  <PersonInfoCard user={this.state.userInfo} group={this.state.group} updateUserInfo = {this.updateUserInfo}/>
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
        
        <DeleteModal isOpen={this.state.isDeleteModalOpen} onRequestClose={this.toggleDeleteConversationModal} style={modalStyles} shouldCloseOnOverlayClick={true} ariaHideApp={false}>
          <ModalHeading>Delete conversation</ModalHeading>
          <Hr />
          <ModalDescription>Are you sure you want to delete this conversation?</ModalDescription>
          <ModalDescription>This action is irreversible and all the messages and user info in this conversation will be lost. Data on your user’s end will be deleted too.</ModalDescription>

          <ButtonContainer>
            <Button secondary onClick={this.toggleDeleteConversationModal}>Cancel</Button>
            <Button danger onClick={this.deleteGroup}>Delete Conversation</Button>
          </ButtonContainer>

          <CloseButton onClick={this.toggleDeleteConversationModal}/>
        </DeleteModal>

      </aside>

    )
  }
}

const modalStyles = {
  content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '600px',
      overflow: 'unset',
  }
};


const NewMessageIndicatorContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 142px;
  height: 32px;
  border-radius: 20px 0 0 20px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.28);
  background-color: #5553b7;
  padding:  0 5px;
  z-index: 30;
  bottom: 60px;
  right: 0;
  cursor: pointer;
`;
const NewMessageIndicatorText = styled.div`
  font-size: 13px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.2px;
  color: #ffffff;
`;
const LizBanner = styled.div`
    & .km-is-liz{
      margin: 0 -10px;
    }
    & .km-is-liz a {
      font-weight:500;
    }
`;

const ResolveButtonContainer = styled.div`
  margin-right: 20px;
`;

//Delete Modal Styles
const ModalHeading = styled.h4``;
const Hr = styled.hr`
    margin: 15px -20px;
`;
const ModalDescription = styled.div`
    margin: 10px auto;
`;
const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;

    & button {
      margin-left: 20px;
    }
`;


// export default Aside;
const mapStateToProps = state => ({
  kmOnBoarding:state.signUp.kmOnBoarding,
  appSettings : state.application
})
const mapDispatchToProps = dispatch => {
  return {
      updatPseudoBannerStatus: payload => dispatch(SignUpActions.updateDetailsOnSignup("UPDATE_PSEUDO_BANNER_STATUS",payload))
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(Aside) 
