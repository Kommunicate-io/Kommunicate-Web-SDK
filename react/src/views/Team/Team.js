import React, { Component } from 'react';
import isEmail from 'validator/lib/isEmail';
import UserItem from '../UserItem/';
import InvitedUsersList from './InvitedUsersList';
import { notifyThatEmailIsSent, getUsersByType, getInvitedUserByApplicationId } from '../../utils/kommunicateClient';
import '../MultiEmail/multiple-email.css'
import ValidationUtils from '../../utils/validationUtils'
import Notification from '../model/Notification';
import './team.css';
import CommonUtils from '../../utils/CommonUtils';
import { USER_TYPE, INVITED_USER_STATUS, MONTH_NAMES, ROLE_TYPE, ROLE_NAME, USER_STATUS } from '../../utils/Constant';
import Modal from 'react-modal';
import CloseButton from './../../components/Modal/CloseButton.js';
import RadioButton from '../../components/RadioButton/RadioButton';
import Banner from '../../components/Banner';
import DisabledUsersList from './DisabledUsersList';
import { Link } from 'react-router-dom';
import AnalyticsTracking from '../../utils/AnalyticsTracking';
import {SettingsHeader} from '../../../src/components/SettingsComponent/SettingsComponents';
import Button from '../../components/Buttons/Button';
import UserRoleRadioButtonsTemplate from './UserRoleRadioButtonsTemplate'
import EventMessageClient from '../../utils/EventMessageClient';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '580px',
    // maxWidth: '580px',
    overflow: 'visible'
  }
};

class Integration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      result: [],
      multipleEmailAddress: [],
      emailAddress: "",
      loggedInUserId: "",
      loggedInUserRoleType: "",
      usersList: [],
      applicationId: "",
      hideErrorMessage: true,
      activeUsers: [],
      selectedRole: CommonUtils.isKommunicateDashboard() ? ROLE_TYPE.AGENT : ROLE_TYPE.ADMIN,
      invitedUser: [],
      isTrialPlan: null,
      isStartupPlan: null,
      applicationExpiryDate: null,
      disabledUsers: [],
      isDisabledUsersListHidden: true,
      activeUsersList: [],
      restrictInvite:false,
      hideSeeDisabledAccounts : true,
      kmActiveUsers: [],
      invitedUsersEmail: []
    };
    this.getUsers = this.getUsers.bind(this);
    window.addEventListener("kmFullViewInitilized", this.getUsers, true);
    this.onOpenModal = this.onOpenModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);

  }
  componentWillMount() {
    this.getInvitedUsers();
    this.getUsers();
    let userSession = CommonUtils.getUserSession();
    let applicationId = userSession.application.applicationId;
    let isTrialPlan = CommonUtils.isTrialPlan();
    let isStartupPlan = userSession.subscription == "startup" ? true : false;

    this.setState({
      loggedInUserId: userSession.userName,
      applicationId: applicationId,
      isTrialPlan: isTrialPlan,
      isStartupPlan: isStartupPlan,
      applicationExpiryDate: CommonUtils.getFormatedExpiryDate()
    }, this.getAgents);
  }
  getUsers = () => {
    var _this = this;
    window.$kmApplozic.fn.applozic("fetchContacts", {
      roleNameList: ['APPLICATION_ADMIN', 'APPLICATION_WEB_ADMIN'], 'callback': function (response) {
        let users = response.response.users;
        let activeUsers = []
        users.map(function (user, index) {
          if (user &&(!user.deactivated && !user.deletedAtTime)) {
            activeUsers.push(user.userId);
          }
        })

        _this.setState({
          result: response.response.users,
          activeUsers: activeUsers,
          hideSeeDisabledAccounts:false

        });
      }
    });
  }
  getInvitedUsers = () => {
    let invitedUser = [];
    let invitedUsersEmail = [];
    let invitedusersEmailWithoutDeletedInvitation =[];
    return Promise.resolve(getInvitedUserByApplicationId()).then(response => {
      response.forEach(item => {
        if (item.status == INVITED_USER_STATUS.INVITED) {
          invitedusersEmailWithoutDeletedInvitation.push(item.invitedUser);
          if(!item.deleted_at){
          invitedUser.push({ userId: item.invitedUser, roleType: item.roleType, status: item.status, invitedBy: item.invitedBy, id: item.id });
          invitedUsersEmail.push(item.invitedUser);
          }
        }
         
      })
      this.setState({
        invitedUsersEmail:invitedUsersEmail, 
        invitedUser: invitedUser,
        invitedusersEmailWithoutDeletedInvitation:invitedusersEmailWithoutDeletedInvitation
         
      });
    }).catch(err => {
      console.log("error while fetching invited users list", err.message);
    })
  }
  showEmailInput = (e) => {
    e.preventDefault();
    this.setState({ emailInstructions: true })
  }
  onOpenModal = () => {
    this.setState({ modalIsOpen: true });
  };

  onCloseModal = () => {
    this.setState({ modalIsOpen: false, selectedRole: ROLE_TYPE.AGENT });
  };
  showAndHideDisabledUsers = () => {
    let isDisabledUsersListHidden = this.state.isDisabledUsersListHidden
    this.setState({ isDisabledUsersListHidden: !isDisabledUsersListHidden });
  }
  sendEmail = (e) => {
    let email = this.state.email.trim();
    let roleType = this.state.selectedRole;
    let activeUsers = this.state.activeUsers;
    let invitedUsersEmail = this.state.invitedusersEmailWithoutDeletedInvitation;
    let isUserExists = activeUsers.indexOf(email) == -1 ? false : true ;
    let isInvitationExists = invitedUsersEmail.indexOf(email) == -1 ? false : true ;
    let mailformat = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
    
    if (!isUserExists) {
      if (email.match(mailformat)) {
        this.onCloseModal();
        AnalyticsTracking.acEventTrigger('ac-added-agent');
        if (activeUsers.length == 1) {
          EventMessageClient.sendEventMessage('ac-added-agent');
        }
        return Promise.resolve(notifyThatEmailIsSent({ to: email, templateName: "INVITE_TEAM_MAIL",     roleType:roleType,resendMail :isInvitationExists?true:false })).then(response => {
          if (response.data && response.data.code === "SUCCESS") {
            Notification.success('Invitation sent successfully');
            this.getInvitedUsers();
          } else if (response.data && response.data.code === "USER_ALREADY_EXIST") {
            this.getUsers();
            Notification.success(response.data.message);
          }
        }).catch(err => {
          Notification.error("Something went wrong!")
          console.log("error while inviting an user", err.message.response.data);
        })
      } else {
        Notification.error(email + " is an invalid Email");
        return false;
      }
    } else {
      isInvitationExists && Notification.warning(email +" already invited");
      isUserExists && Notification.warning("Teammate with this email already exists");
    }
  }

  //this method not using now. this can be use in case of sending multiple invitation 
  sendMail = (e) => {
    const _this = this;
    console.log(_this.state.email);
    if (!_this.state.emailAddress && _this.state.multipleEmailAddress.length === 0) {
      Notification.info("Please enter email address");
      return;
    }
    e.preventDefault();

    let multipleEmailAddress = this.state.multipleEmailAddress;
    if (isEmail(this.state.emailAddress)) {
      multipleEmailAddress = multipleEmailAddress.concat([this.state.emailAddress]);
      this.setState({ multipleEmailAddress: this.state.multipleEmailAddress.concat([this.state.emailAddress]) })
      this.setState({ emailAddress: '' });
    }
    if (multipleEmailAddress.length >= 1) {
      for (let i = 0; i < multipleEmailAddress.length; i++) {
        if (!isEmail(multipleEmailAddress[i])) {
          Notification.error(multipleEmailAddress[i] + " is an invalid Email");
          return;
        }
      }

      for (let i = 0; i < multipleEmailAddress.length; i++) {
        notifyThatEmailIsSent({ to: multipleEmailAddress[i], templateName: "INVITE_TEAM_MAIL" }).then(data => {
          _this.setState({ multipleEmailAddress: [], emailAddress: "" });
        });
      }

    } else {
      console.log(this.state.emailAddress)
      if (this.state.emailAddress && !isEmail(this.state.emailAddress)) {
        Notification.error(this.state.emailAddress + " is an invalid Email");
        return;
      } else {
        notifyThatEmailIsSent({ to: this.state.emailAddress, templateName: "INVITE_TEAM_MAIL" }).then(data => {
          _this.setState({ multipleEmailAddress: [], emailAddress: "" });

        });
      }
    }
  }
  getAgents() {
    var that = this;
    let users = [USER_TYPE.AGENT, USER_TYPE.ADMIN];
    let disabledUsers = this.state.disabledUsers;
    let kmActiveUsers =[];
    return Promise.resolve(getUsersByType(this.state.applicationId, users)).then(data => {
      let usersList = data;
      data.map((user => {
        user.userName == this.state.loggedInUserId  && this.setState({loggedInUserRoleType: user.roleType})
        user.status == USER_STATUS.EXPIRED && disabledUsers.push(user);
        (user.status == USER_STATUS.AWAY || user.status == USER_STATUS.ONLINE) && kmActiveUsers.push(user);
      }))
      this.setState({
        usersList: usersList,
        disabledUsers: disabledUsers,
        kmActiveUsers,kmActiveUsers
      },this.restrictInvite);
    }).catch(err => {
       console.log("err while fetching users list");
    });
  }
  restrictInvite = () => {
    if(!this.state.isTrialPlan && this.state.isStartupPlan && this.state.kmActiveUsers.length >= 2 && CommonUtils.isKommunicateDashboard()) {
      this.setState({restrictInvite:true})
    }
  }
  multipleEmailHandler = (e) => {
    if (e.target.value.includes(' ')) {
      // this.setState({emailAddress: ''})
    } else {
      this.setState({ emailAddress: e.target.value });
    }
  }

  checkForSpace = (e) => {
    if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 13) && ValidationUtils.isValidEmail(this.state.emailAddress)) {
      this.setState({ multipleEmailAddress: this.state.multipleEmailAddress.concat([this.state.emailAddress]) })
      this.setState({ emailAddress: '' })
    }

  }
  updateUserRoleOnUI = (usersList) => {
    this.setState({usersList:usersList})
  }
  removeEmail = (removeEmail) => {
    // console.log(this.state.multipleEmailAddress);
    const filteredEmails = this.state.multipleEmailAddress.filter(email => email !== removeEmail)
    this.setState({ multipleEmailAddress: filteredEmails })
    // console.log(this.state.multipleEmailAddress);
  }
  handleRoleRadioBtn = (e) => {
    this.setState({
      selectedRole: e.target.getAttribute('data-value')
    })
  }


  render() {
    let userSession = CommonUtils.getUserSession();
    var agentList = this.state.result;
    var getUsers = this.getUsers;
    var updateUserRoleOnUI = this.updateUserRoleOnUI;
    var loggedInUserId = this.state.loggedInUserId;
    var loggedInUserRoleType = this.state.loggedInUserRoleType;
    var usersList = this.state.usersList;
    var isAway = false;
    var isOnline = false;
    var roleType;
    var status;
    var result = this.state.result.map(function (result, index) {
      let userId = result.userId.toLowerCase();
      let isOnline = userId == userSession.userName || result.connected;
      if (!result.deactivated) {
        usersList.map(function (user, i) {
          if (userId == user.userName.toLowerCase()) {
            roleType = user.roleType
            status = user.status;
            if (user.status && isOnline) {
              //agent is online
              isOnline = true;
              isAway = false;
            } else if (!user.status && isOnline) {
              //agent is away
              isAway = true;
              isOnline = false;
            } else {
              //agent is offline
              isOnline = false;
              isAway = false;

            }
          }
        })
        if (status == USER_STATUS.ONLINE || status == USER_STATUS.AWAY) {
          return <UserItem key={index} user={result} agentList={agentList} index={index} hideConversation="true" getUsers={getUsers} loggedInUserId={loggedInUserId} isOnline={isOnline} isAway={isAway} roleType={roleType} loggedInUserRoleType={loggedInUserRoleType} updateUserRoleOnUI = {updateUserRoleOnUI} usersList = {usersList}/>
        }
      }
    });
    var invitedUserList = this.state.invitedUser.map((user, index) => {
      return <InvitedUsersList key={index} user={user} index={index} loggedInUserRoleType={loggedInUserRoleType} getInvitedUsers ={this.getInvitedUsers} getUsers={this.getUsers}/>
    })
    var disabledUsersList = this.state.disabledUsers.map((user, index) => {
      let moreUserInfo;
      this.state.result.map((userInfo => {
        if (user.userName == userInfo.userId) {
          moreUserInfo = userInfo;
          return;
        }
      }))

      return <DisabledUsersList key={index} user={user} index={index} moreUserInfo={moreUserInfo}
        loggedInUserRoleType={loggedInUserRoleType} disabledUsers={this.state.disabledUsers} isDisabledUsersListHidden={this.state.isDisabledUsersListHidden} getUsers={getUsers} />
    })
    return (
      <div className="animated fadeIn teammate-wrapper ">
        <div className="km-settings-banner">
            <Banner appearance="warning" hidden={this.state.loggedInUserRoleType != ROLE_TYPE.AGENT} heading={"You need admin permissions to manage your team."}/>
        </div>
        <div className="km-heading-wrapper">
          <SettingsHeader />
          <Button className="teammates-add-member-btn" onClick={this.onOpenModal} disabled={this.state.loggedInUserRoleType == ROLE_TYPE.AGENT && true}>+ Add a team member</Button>
        </div>
        <div className="row teammate-table">
          <div className="col-md-12">
            <div className="card">
             
              <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.onCloseModal} style={customStyles} ariaHideApp={false} >
                { !this.state.restrictInvite &&
                  <div className="teammates-add-member-modal-wrapper">
                    <div className="teammates-add-member-modal-header">
                      <p className="teammates-add-member-modal-header-title">Adding new team member</p>
                    </div>
                    <hr className="teammates-add-member-modal-divider product product-kommunicate" />
                      <Banner cssClass = "km-trial-banner" appearance="warning" hidden={!(CommonUtils.isKommunicateDashboard() && this.state.isTrialPlan)} heading={"Upgrade to a paid plan before your trial period ends (" + this.state.applicationExpiryDate + ") to ensure access for this team member."}/>
                    { !this.state.isTrialPlan &&
                    <div className="teammates-billing-update-container product product-kommunicate">
                      <div className="teammates-billing-update-text">
                      Adding a team member will automatically increase the number of seats in your plan. Your bill will be adjusted on a pro-rata basis.
                      </div>
                    </div>
                    }
                    <div className="teammates-add-member-modal-content-wrapper">
                      <h5 className="teammates-add-member-modal-content-title">Whom do you want to add?</h5>
                      <input type="text" className="form-control email-field" id="email-field"
                        onChange={(e) => {
                          let email = this.state.email;
                          email = e.target.value;
                          this.setState({ email: email })
                        }}

                        placeholder="Enter email address" />
                    </div>
                    <div> 
                      <UserRoleRadioButtonsTemplate handleOnChange={this.handleRoleRadioBtn} selectedRole={this.state.selectedRole}/>
                    </div>
                    <div className="teammates-add-member-modal-btn">
                      <Button secondary className="teammates-add-member-modal-cancel-btn" onClick={this.onCloseModal}>Cancel</Button>
                      <Button className="teammates-add-member-modal-add-btn" onClick={this.sendEmail}>Add member</Button>
                    </div>
                  </div>
                }
                { this.state.restrictInvite &&
                  <div className="tm-upgrade-plan-container">
                    <div className="tm-upgrade-plan-title">Upgrade your plan to add more teammates!</div>
                    <div className="tm-upgrade-plan-logo">
                      <svg xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74">
                        <g fill="#22D674" fillRule="nonzero">
                          <path d="M37 73.852C16.678 73.852.148 57.319.148 37 .148 16.68 16.678.148 37 .148 57.322.148 73.852 16.678 73.852 37c0 20.322-16.533 36.852-36.852 36.852zm0-69.696C18.889 4.156 4.156 18.89 4.156 37S18.89 69.84 37 69.84 69.844 55.109 69.844 37C69.844 18.892 55.108 4.156 37 4.156z" />
                          <path d="M26.292 28.66a2.002 2.002 0 0 1-1.415-3.42l10.708-10.708a2.002 2.002 0 0 1 2.833 0L49.127 25.24c.783.78.783 2.05 0 2.834a2.002 2.002 0 0 1-2.834 0L37 18.784l-9.29 9.287a1.999 1.999 0 0 1-1.418.589z" />
                          <path d="M37 60.054a2.004 2.004 0 0 1-2.004-2.004V18.59a2.004 2.004 0 1 1 4.008 0v39.457c0 1.11-.897 2.007-2.004 2.007z" />
                        </g>
                      </svg>
                    </div>
                    <div className="tm-upgrade-plan-description">
                      You are in the Free plan. Add more teammates by upgrading your plan starting from
                    <span className="tm-upgrade-plan-description-pricing"> $8 per month per agent! </span>
                    </div>
                    <div className="tm-upgrade-plan-description-btn-set">
                      <Button secondary className="teammates-add-member-modal-cancel-btn" onClick ={this.onCloseModal }>Cancel</Button>
                      <Button as={Link} to="/settings/billing" className="tm-upgrade-btn">Upgrade plan</Button>
                      
                    </div>
                  </div>  
                }
                <CloseButton onClick={this.onCloseModal} />
              </Modal>
            </div>
          </div>
          <div className="col-md-12 new">
            <div className="card">
              { !this.state.isTrialPlan && this.state.disabledUsers.length > 0 &&
                <div>
                  <div className="container disabled-account-info-container">
                    <div className="row">
                      <div className="col-lg-4 tm-disabled-accounts-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="73" viewBox="0 0 80 73">
                          <path fill="#F8BA36" fillRule="nonzero" d="M47.106 5.104C45.275 1.812 42.751 0 40 0c-2.75 0-5.275 1.812-7.107 5.104L2.153 60.32c-1.822 3.273-2.04 6.422-.613 8.867C2.973 71.646 5.837 73 9.602 73h60.796c3.765 0 6.629-1.354 8.062-3.812 1.426-2.445 1.208-5.594-.614-8.867L47.106 5.104zM40 64.958c-2.039 0-3.691-1.662-3.691-3.712 0-2.05 1.652-3.712 3.69-3.712a3.703 3.703 0 0 1 3.694 3.712A3.703 3.703 0 0 1 40 64.958zm4.092-39.6l-1.413 24.14c-.12 2.038-1.324 3.705-2.678 3.705-1.354 0-2.559-1.667-2.678-3.705l-1.413-24.14c-.12-2.038 1.445-3.705 3.476-3.705h1.23c2.031 0 3.595 1.667 3.476 3.705z" />
                        </svg>
                      </div>
                      <div className="col-lg-6">
                        <p className="tm-disabled-accounts-count">You have {this.state.disabledUsers.length} disabled accounts in your team</p>
                        <p className="tm-disabled-accounts-description-1">Their accounts have been temporarily disabled till you upgrade your plan.</p>
                        <p className="tm-disabled-accounts-description-2">Till then, they will not be able to sign in and conversations will not be assigned to them.</p><br />
                        <div className="tm-disabled-link-btn">
                          <Button secondary as={Link} to="/settings/billing" className="tm-upgrade-btn" >Upgrade plan</Button>
                          { !this.state.hideSeeDisabledAccounts && 
                            <span onClick={this.showAndHideDisabledUsers} className="hide-disabled-accounts-btn brand-color">{this.state.isDisabledUsersListHidden ? "See disabled accounts" : "Hide disabled accounts"}</span>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  {!this.state.isDisabledUsersListHidden &&
                    <table className="table table-hover mb-0 hidden-sm-down teammates-table tm-disabled-accounts-table">
                      <thead className="thead-default">
                        <tr className="tm-disable-accounts-table-th-parent">
                          <th className="tm-disabled-accounts-table-th">Name</th>
                          <th className="tm-disabled-accounts-table-th">Email Id (Agent id)</th>
                          <th className="tm-disabled-accounts-table-th">Role</th>
                          <th className="tm-disabled-accounts-table-th">Status</th>
                        </tr>

                      </thead>
                      <tbody>
                        {disabledUsersList}
                      </tbody>
                    </table>
                  }
                </div>
              }
            </div>
          </div>
          <div className="col-md-12">
            <div className="card">
              <div>
                {/* <label className="col-md-3 form-control-label invite-team" htmlFor="invite">Team</label> */}
                <table className="table table-hover mb-0 hidden-sm-down teammates-table">
                  <thead className="thead-default">
                    <tr>
                      {/* <th className="text-center"><i className="icon-people"></i></th> */}
                      <th className="team-name-title">Name</th>
                      <th>Email id (Agent id)</th>
                      <th>Role</th>
                      {/* <th>Last Activity</th> */}
                      <th>Status</th>
                      <th className="teammates-table-hide-coloumn">Edit</th>
                      <th className="teammates-table-hide-coloumn">Delete</th>
                      <th className="teammates-table-hide-coloumn">Invite</th>
                      {/* <th className="team-th-delete-edit">Delete</th>
                      <th className="text-center n-vis">Add Info</th>
                      <th className="text-center n-vis">Actions</th>
                      <th className="text-center n-vis">Country</th>
                      <th className="n-vis">Usage</th>
                      <th className="text-center n-vis">Payment Method</th>
                      <th className="team-th-delete-edit">Copy Link</th>
                      <th className="n-vis">Activity</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {invitedUserList}
                    {result}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

export default Integration;
