import React, {Component, Fragment} from 'react';
//import axios from 'axios';
import ReactTooltip from 'react-tooltip';
//import {Dropdown, DropdownMenu, DropdownItem, Progress} from 'reactstrap';
import CustomerListItem from '../UserItem/CustomerListItem';
import './users.css'
import CommonUtils from '../../utils/CommonUtils';
import Labels from '../../utils/Labels';
//import {fetchContactsFromApplozic, getGroupFeed, multipleGroupInfo} from '../../utils/kommunicateClient';
import ApplozicClient from '../../utils/applozicClient';
import { updateApplozicUser, checkUserInApplozic } from '../../utils/kommunicateClient';
import sortBy from 'lodash/sortBy';
import Pagination from "react-paginating";
import {UserSectionLoader} from '../../components/EmptyStateLoader/emptyStateLoader.js';
import Notification from '../model/Notification';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import * as UserStyles from './UserStyles';
import { InfoIcon } from '../../assets/svg/svgs';
import AnalyticsTracking from '../../utils/AnalyticsTracking';
const limit = 2;
const pageCount = 3;
var hasClass = function(el, className) {
  return (' ' + el.className + ' ').indexOf(' ' + className + ' ') > -1;
};
var _this;
class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: [],
      startTime:"",
      lastSeenTime:"",
      hideEmptyStateImage: true,
      total:0,
      currentPage: 1,
      intial:0,
      final:20,
      pageNumber:1,
      pageFlag:2,
      stopFlag:1,
      getUsersFlag:1,
      isFromSearch: false,
      oldResult : [],
      searchBoxEmpty : true,
      isSearchBoxActive : true,
      checkEnter: false,
      modalType: "",
      userId: "",
      userName: "",
      userEmail: "",
      loginPassword: "",
      users: {}
    };

  }
  componentWillMount() {
    _this = this;
    this.getUsers();
    this.updateConversationWithRespectToPageNumber();
  }

  getUsers = () => {
    if(_this.state.getUsersFlag === 1){
      _this.setState({
        getUsersFlag:0
      })
      var params = {
        startIndex : 0,
        pageSize : 60,
        orderBy : 1,
        roleNameList : "USER",
        inactiveUser: true
      };
      if(_this.state.lastSeenTime){
        params.lastSeenTime = _this.state.lastSeenTime;
      }
      else if (_this.state.startTime){
        params.startTime = _this.state.startTime;
      }
      var groupList=[];
      var assignedUser = _this.state.result;
        ApplozicClient.fetchContactsFromApplozic(params).then(response => {
          if(response.status == "success"){
            if (response && response.response && (response.response.users.length > 0)) {
              if(response.response.users.length < params.pageSize || response.response.lastSeenFetchTime === 0 ){
                _this.setState({stopFlag:0})
              }
              var setPageNumbers = assignedUser.length + response.response.users.length;
              _this.setState({
                total: (Math.ceil(setPageNumbers / 20)*limit),
                startTime : response.response.lastSeenFetchTime ? "": response.response.lastFetchTime,
                lastSeenTime : response.response.lastSeenFetchTime
              });
              _this.listUsers(response,assignedUser);

            } else if (response.response.users.length == 0 && this.state.result == 0) {
            _this.setState({hideEmptyStateImage: false});
            }
          }
        }).catch(err=>{
          Notification.error("Oops! Something went wrong. Please refresh the page or try again after sometime");
          console.log('uploading error',err)
          return;
        });
    }
  };

  listUsers = (response, assignedUser) => {
    var groupList = [];
    var userdetail = this.state.isFromSearch ? response.response : response.response.users;
    const usersMap = userdetail.map((user, index) => {
      if (user.messagePxy && user.messagePxy.groupId) {
        groupList.push(user.messagePxy.groupId.toString());
      }
    });
    if (groupList.length === 0) {
      this.mapUserDetails(response, assignedUser, [], []);
    }
    else {
      this.getmMultipleGroupInfo(groupList, response, assignedUser);
    }
  };

  getmMultipleGroupInfo = (groupList, response, assignedUser) => {
    // var _this = this;
    ApplozicClient.multipleGroupInfo(groupList).then(data => {
      var arr = [];
      if (data.status == "success" && data.response && data.response.length) {
        for (var j = 0; j < data.response.length; j++) {
          arr[data.response[j].id] = data.response[j];
        };
      }
      _this.mapUserDetails(response, assignedUser, data, arr);
    });
  };

  mapUserDetails = (response, assignedUser, data, arr) => {
    let botAgentMap = CommonUtils.getItemFromLocalStorage("KM_BOT_AGENT_MAP");
    var userdetail = this.state.isFromSearch ? response.response : response.response.users;
    const users = userdetail.map((user, index) => {
      if (user.messagePxy && user.messagePxy.groupId) {
        if (botAgentMap && typeof data !== "undefined" && data !== null) {
          if (arr[user.messagePxy.groupId]) {
            user.assignee = (arr[user.messagePxy.groupId].metadata.CONVERSATION_ASSIGNEE && botAgentMap[arr[user.messagePxy.groupId].metadata.CONVERSATION_ASSIGNEE]) && botAgentMap[arr[user.messagePxy.groupId].metadata.CONVERSATION_ASSIGNEE].name || arr[user.messagePxy.groupId].metadata.CONVERSATION_ASSIGNEE;
            user.convoStatus = arr[user.messagePxy.groupId].metadata.CONVERSATION_STATUS;
            assignedUser.push(user);
            // Sort array after pushing
            var sortOnBasisOf = assignedUser[index] && assignedUser[index].lastSeenTime ? "lastSeenAtTime" : "lastLoggedInAtTime"
            var arrObj = sortBy(assignedUser, sortOnBasisOf).reverse();
            _this.setState({
              result: arrObj,
              hideEmptyStateImage: true
            })
          }
        }
      }
      else {
        assignedUser.push(user);
        var sortOnBasisOf = assignedUser[index] && assignedUser[index].lastSeenTime ? "lastSeenAtTime" : "lastLoggedInAtTime"
        var arrObj = sortBy(assignedUser, sortOnBasisOf).reverse();
        _this.setState({
          result: arrObj,
          hideEmptyStateImage: true
        })
      }
    });
  };

  searchContactInApplozic = (searchQuery) => {
    var params = {
      key: searchQuery
    }
    ApplozicClient.searchContact(params).then(response => {
      if (_this.state.isSearchBoxActive) {
        _this.setState({
          oldResult: _this.state.result
        })
      };
      if (response.response.length !== 0) {
        var setPageNumbers = response.response.length;
        _this.setState({
          isFromSearch: true,
          result: [],
          isSearchBoxActive: false,
          total: (Math.ceil(setPageNumbers / 20) * limit),
          currentPage: 1,       // default value 
          intial: 0,            // default value 
          final: 20,            // default value 
          pageNumber: 1,        // default value 
          pageFlag: 2           // default value 
        });
        _this.listUsers(response, []);
      }
      else {
        var setPageNumbers = response.response.length;
        _this.setState({
          isFromSearch: true,
          result: [],
          total: (Math.ceil(setPageNumbers / 20) * limit),
          hideEmptyStateImage: false,
          currentPage: 1,   // default value 
          intial: 0,        // default value
          final: 20,        // default value
          pageNumber: 1,    // default value 
          pageFlag: 2,      // default value 
        });
        _this.listUsers(response, []);
      }
    }).catch(err=>{
      Notification.error("Oops! Something went wrong. Please refresh the page or try again after sometime");
      console.log('uploading error',err)
      return;
    });
  };

  detectEmptySearchBox = (event) => {
    event.preventDefault();
    var setPageNumbers = this.state.oldResult.length;
    var searchBox = document.getElementById('km-search-box');
    if (searchBox && searchBox.value === "" && (hasClass(event.target, 'km-search-box') || hasClass(event.target, 'km-clear-search-text')) && !this.state.searchBoxEmpty) {
      this.setState({
        isFromSearch: true,
        isSearchBoxActive: true,
        total: (Math.ceil(setPageNumbers / 20) * limit),
        result: this.state.oldResult,
        currentPage: 1,   // default value 
        intial: 0,        // default value
        final: 20,        // default value
        pageNumber: 1,    // default value 
        pageFlag: 2,      // default value 
        hideEmptyStateImage: true,
        checkEnter:false
      });
    }
  };

  updateConversationWithRespectToPageNumber = (e) => {
    var hasClass = function(el, className) {
      return (' ' + el.className + ' ').indexOf(' ' + className + ' ') > -1;
    };
    document.addEventListener('click', function(e) {
      if (hasClass(e.target, 'km-pagination-check')) {
        e.preventDefault();
        var checkPreviousPageNumber = _this.state.pageNumber;
        var getPageNumber = parseInt(e.target.id.replace('km-pagination-',''));
        _this.setState({
          pageNumber: getPageNumber,
          intial: (getPageNumber-1)*20,
          final:((getPageNumber-1)*20)+20
        });

        if((((_this.state.pageNumber % 2) === 0) && _this.state.pageFlag === _this.state.pageNumber && _this.state.stopFlag === 1 ) || _this.state.pageNumber === (checkPreviousPageNumber +2)){
          _this.setState({
            pageFlag: _this.state.pageNumber + 2,
            getUsersFlag:1,
            isFromSearch:false
          })
          if(!_this.state.searchBoxEmpty && _this.state.checkEnter){
            return;
          }
          _this.getUsers();
        };
        }

        else if (hasClass(e.target, 'km-previous-page')){
          e.preventDefault();
          var previousPageNumber = _this.state.pageNumber - 1;
          _this.setState({
            pageNumber: previousPageNumber,
            intial: (previousPageNumber-1)*20,
            final:((previousPageNumber-1)*20)+20
          });
        }

        else if (hasClass(e.target, 'km-next-page')){
          e.preventDefault();
          var nextPageNumber = _this.state.pageNumber +1;
          _this.setState({
            pageNumber: nextPageNumber,
            intial: (nextPageNumber-1)*20,
            final:((nextPageNumber-1)*20)+20
          });
          if(((_this.state.pageNumber % 2) === 0) && _this.state.pageFlag === _this.state.pageNumber && _this.state.stopFlag === 1) {
            _this.setState({
              pageFlag: _this.state.pageNumber + 2,
              getUsersFlag:1,
              isFromSearch:false
            })
            if(!_this.state.searchBoxEmpty && _this.state.checkEnter){
              return;
            }
            _this.getUsers();
          }
        }

      });
  };

  handlePageChange = page => {
    this.setState({
      currentPage: page
    });
  };

  handleClickEventForSearch = (event) => {
    event.preventDefault();
    var specifiedElement = document.getElementById('km-search-box');
    var isClickInside = specifiedElement ? (specifiedElement.contains(event.target) || specifiedElement.id === event.target.id) : false;

    if (hasClass(event.target, 'km-search-box')) {
      document.getElementById("km-search-svg").classList.add('n-vis');
      document.getElementById("km-clear-search-text").classList.remove('n-vis');
      specifiedElement.style.marginLeft = "0px"
    }
    else if (!isClickInside && hasClass(event.target, 'km-clear-search-text')) {
      document.getElementById("km-search-svg") && document.getElementById("km-search-svg").classList.remove('n-vis');
      document.getElementById("km-clear-search-text") && document.getElementById("km-clear-search-text").classList.add('n-vis');
      specifiedElement && (specifiedElement.style.marginLeft = "20px");
      specifiedElement && (specifiedElement.value = "");
      _this.detectEmptySearchBox(event);
    }
  };

  handleKeyboardEventForSearch = (event) => {
    event.preventDefault(); // When clicking on a button, execute the first event handler, and stop the rest of the event handlers from being executed.
    var key = event.which || event.keyCode;
    var kmSearchBoxValue = document.getElementById('km-search-box').value;
    if (key === 13 && kmSearchBoxValue.length !== 0) {
      _this.searchContactInApplozic(kmSearchBoxValue.trim());
      _this.setState({
        searchBoxEmpty: false,
        checkEnter:true
      })
    };
    _this.detectEmptySearchBox(event);
  };

  openModal = (modalType, users) => {
    this.setState({
      modalType,
      users
    }, () => {
      if(users) {
        this.handleFormFields(users);
      } else {
        this.handleFormFields({});
      }
    });
  }

  handleFormFields = (users) => {
    this.setState({
      userId: users.userId || "",
      userName: users.userName || "",
      userEmail: users.email || "",
      loginPassword: ""
    });
  }

  onInputChange = (e) => {
    const target = e.target;
    const value  = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  onFormSubmit = (e) => {
    e.preventDefault();
    if(this.state.modalType === 'newUser') {
      this.createNewUser(e);
    } else {
      this.editUser(e);
    }
  }

  dataForApi = () => {
    return {
      userId: this.state.userId,
      displayName: this.state.userName,
      email: this.state.userEmail,
      password: this.state.loginPassword,
      roleName:'USER'
    }
  }

  createNewUser = (e) => {
    const form = e.target;
    let userSession = CommonUtils.getUserSession();
    const header = {
      'Content-Type' :'application/json',
      'Apz-AppId': userSession.application.applicationId,
      'Apz-Token': 'Basic ' + new Buffer(userSession.userName + ':' + userSession.accessToken).toString('base64'),
      'Apz-Product-App': 'true'
    }
    const data = this.dataForApi();
    const args = {
      header: header,
      data: data
    }
    checkUserInApplozic(args).then(response => {
      if(response.status === 200 && response.data.response === 'success'){
        Notification.success('User created successfully');  
        AnalyticsTracking.acEventTrigger('createUserAL');
        form.reset();
        this.openModal("");
        this.reRenderUsersList();
      } else if(response.data.status === "error") {
        let errorMessage = response.data.errorResponse[0].description.charAt(0).toUpperCase() + response.data.errorResponse[0].description.slice(1);
        Notification.error(errorMessage);
      }
    }).catch(err => {
      console.log(err);
      Notification.info('Something went wrong. Please try again later.');
    });
  }

  editUser = (e) => {
    let data = this.dataForApi();
    const form = e.target;
    updateApplozicUser(data).then(response => {
      if(response.status === 200 && response.data.response === 'success') {
        Notification.success('User details updated successfully');
        form.reset();
        this.openModal("");
        this.reRenderUsersList();
      }
      console.log(response);
    }).catch(err => {
      console.log(err);
      Notification.info('Something went wrong. Please try again later.');
    });
  }

  activateDeactivateUser = (userId, currentActivateDeactivateStatus) => {
    let params = {
      userId: userId,
      deactivate: !currentActivateDeactivateStatus
    }
    ApplozicClient.activateDeactivateUser(params).then(response => {
      if(response && response.status === 200 && response.data.response === 'success') {
        Notification.success("User " + (params.deactivate ? "blocked" : "unblocked" ) + " successfully");
        this.openModal("");
        this.reRenderUsersList();
      }
      console.log(response);
    }).catch(err => {
      console.log(err);
      Notification.info('Something went wrong. Please try again later.');
    })
  }

  deleteUser = (userId) => {
    let data = {
      userId: userId
    }
    ApplozicClient.deleteUser(data).then(response => {
      if(response && response.status === 200 && response.data.response === 'success') {
        Notification.success("User deleted successfully");
        this.openModal("");
        this.reRenderUsersList();
      }
    }).catch(err => {
      console.log(err);
      Notification.info('Something went wrong. Please try again later.');
    })
  }

  reRenderUsersList = () => {
    this.setState({
      getUsersFlag: 1,
      result: [],
      lastSeenTime: "",
      startTime: ""
    });
    this.getUsers();
    this.updateConversationWithRespectToPageNumber();
  }

  keyPress(e) {
    var regex = /[^a-zA-Z0-9_\-@#]/;
    var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if(regex.test(key)) {
      Notification.error("Special characters not allowed.");
      e.preventDefault();
      return false;
    }
  }

  render() {
    var _this = this;
    const infoText = Labels["lastcontacted.tooltip"];
    var showResult = this.state.result.slice(this.state.intial, this.state.final).map(function (result, index) {
      return <CustomerListItem key={index} user={result} hideConversation="false" openModal={_this.openModal} />
    });

    const CreateNewUser = (
      <Fragment>
        <form onSubmit={this.onFormSubmit} autoComplete="off">
          <InputGroup id='user-id' label='User Id:' name='userId' inputType='text' value={this.state.userId} onChange={this.onInputChange} onKeyPress={this.keyPress} placeholder='' required />
          <InputGroup id='user-name' label='User Name:' name='userName' inputType='text' value={this.state.userName} onChange={this.onInputChange} onKeyPress={this.keyPress} placeholder='' />
          <InputGroup id='user-email' label='User Email:' name='userEmail' inputType='text' value={this.state.userEmail} onChange={this.onInputChange} placeholder='' />
          <InputGroup id='login-password' label='Login Password:' name='loginPassword' inputType='password' value={this.state.loginPassword} onChange={this.onInputChange} placeholder='' required />

          <UserStyles.ButtonGroup>
            <Button secondary type="reset" onClick={() => this.openModal("")}>Cancel</Button>
            <Button type="submit">Create new user</Button>
          </UserStyles.ButtonGroup>
        </form>
      </Fragment>
    );

    const EditUser = (
      <Fragment>
        <form onSubmit={this.onFormSubmit} autoComplete="off">
          <InputGroup id='user-id' label='User Id:' name='userId' inputType='text' value={this.state.userId} onChange={this.onInputChange} onKeyPress={this.keyPress} placeholder='' required disabled />
          <InputGroup id='user-name' label='User Name:' name='userName' inputType='text' value={this.state.userName} onChange={this.onInputChange} onKeyPress={this.keyPress} placeholder='' />
          <InputGroup id='user-email' label='User Email:' name='userEmail' inputType='text' value={this.state.userEmail} onChange={this.onInputChange} placeholder='' />
          <InputGroup id='login-password' label='Login Password:' name='loginPassword' inputType='password' value={this.state.loginPassword} onChange={this.onInputChange} placeholder='' required />

          <UserStyles.ButtonGroup>
            <Button secondary type="reset" onClick={() => this.openModal("")}>Cancel</Button>
            <Button type="submit">Save changes</Button>
          </UserStyles.ButtonGroup>
        </form>
      </Fragment>
    );

    const DeleteUser = (
      <Fragment>
        <UserStyles.P>This action is irreversible and all the data for this user will be permanently
lost. Although, the user can come back to initiate a new conversation with you anytime.</UserStyles.P>
        <UserStyles.P>Are you sure you want to delete this user?</UserStyles.P>
        <UserStyles.ButtonGroup>
          <Button secondary onClick={() => this.openModal("")}>Cancel</Button>
          <Button danger onClick={() => this.deleteUser(this.state.users.userId)}>Delete user</Button>
        </UserStyles.ButtonGroup>
      </Fragment>
    );

    const BlockUser = (
      <Fragment>
        <UserStyles.P>This action will block the user from starting any new conversations or continuing existing ones. You can unblock the user at any time.</UserStyles.P>
        <UserStyles.P>Are you sure you want to block this user?</UserStyles.P>
        <UserStyles.ButtonGroup>
          <Button secondary onClick={() => this.openModal("")}>Cancel</Button>
          <Button danger onClick={() => this.activateDeactivateUser(this.state.users.userId, this.state.users.deactivated)}>Block user</Button>
        </UserStyles.ButtonGroup>
      </Fragment>
    );
    const UnBlockUser = (
      <Fragment>
        <UserStyles.P>This action will allow the user to send messages to you again.</UserStyles.P>
        <UserStyles.P>Are you sure you want to unblock this user?</UserStyles.P>
        <UserStyles.ButtonGroup>
          <Button secondary onClick={() => this.openModal("")}>Cancel</Button>
          <Button onClick={() => this.activateDeactivateUser(this.state.users.userId, this.state.users.deactivated)}>Unblock user</Button>
        </UserStyles.ButtonGroup>
      </Fragment>
    );

    const renderModalContent = {
      '': {
        'heading': '',
        'content': ''
      },
      'newUser': {
        'heading': "Create new user",
        'content': CreateNewUser
      },
      'editUser': {
        'heading': "Edit user details",
        'content': EditUser
      },
      'deleteUser': {
        'heading': "Delete user - " + (this.state.users && (this.state.users.userName || this.state.users.userId)),
        'content': DeleteUser
      },
      'blockUser': {
        'heading': "Block user - " + (this.state.users && (this.state.users.userName || this.state.users.userId)),
        'content': BlockUser
      },
      'unBlockUser': {
        'heading': "Unblock user - " + (this.state.users && (this.state.users.userName || this.state.users.userId)),
        'content': UnBlockUser
      }
    }

   return (
   <div className="animated fadeIn customer-list-item">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-block">
            <div className="flexi mb-30">
              <Button className="product product-applozic" secondary onClick={() => this.openModal("newUser")}>Create new user</Button>
              <div id="km-text-box-wrapper" className="km-text-box-wrapper">
                <svg id="km-search-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52.966 52.966">
                  <path fill="#a8a8a8" d="M51.704 51.273L36.845 35.82c3.79-3.801 6.138-9.041 6.138-14.82 0-11.58-9.42-21-21-21s-21 9.42-21 21 9.42 21 21 21c5.083 0 9.748-1.817 13.384-4.832l14.895 15.491a.998.998 0 0 0 1.414.028 1 1 0 0 0 .028-1.414zM21.983 40c-10.477 0-19-8.523-19-19s8.523-19 19-19 19 8.523 19 19-8.524 19-19 19z"/>
                </svg>
                <input id="km-search-box" type="text" className="km-search-box required"  onClick={(event) => this.handleClickEventForSearch(event)} onKeyUp={(event) => this.handleKeyboardEventForSearch(event)} placeholder="Search for email or user ID"></input>
                <span id="km-clear-search-text" className=" km-clear-search-text n-vis"  onClick={(event) => this.handleClickEventForSearch(event)}> &times; </span>
              </div>
            </div>
            <table className={this.state.result.length !== 0 ? "table table-hover mb-0 hidden-sm-down km-show-visibility":"table table-hover mb-0 hidden-sm-down km-hide-visibility"}>
                  <thead className="thead-default">
                    <tr className="users-table">
                      <th>Name</th>
                      <th>Last Seen</th>
                      <th>Last Contacted
                        <InfoIcon style={{marginLeft: "5px", verticalAlign: "text-top"}} data-tip={infoText} data-effect="solid" data-place="right" data-multiline="True" />
                      </th>
                      <th className="product product-kommunicate-table-cell">Latest Conversation</th>
                      <th className="users-edit-icon km-hide-visibility product product-applozic-table-cell">Edit</th>
                      <th className="users-delete-icon km-hide-visibility n-vis">Delete</th>
                      <th className="users-block-icon km-hide-visibility n-vis">Block</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showResult}
                  </tbody>
          </table>
              { this.state.result.length !== 0 ?
                <div>
                <Pagination
                    total={this.state.total}
                    limit={limit}
                    pageCount={pageCount}
                    currentPage={this.state.currentPage}
                  >
                    {({
                      pages,
                      currentPage,
                      hasNextPage,
                      hasPreviousPage,
                      previousPage,
                      nextPage,
                      totalPages,
                      getPageItemProps
                    }) => (
                      <div style={{textAlign: "center",margin: "30px auto"}}>
                        <button style={{display:"none"}}
                          {...getPageItemProps({
                            pageValue: 1,
                            onPageChange: this.handlePageChange
                          })}
                        >
                          first
                        </button>

                        {hasPreviousPage && (
                          <button className="km-previous-page" style={{border: "none", color: "#5c5aa7", backgroundColor: "transparent"}}
                            {...getPageItemProps({
                              pageValue: previousPage,
                              onPageChange: this.handlePageChange
                            })}
                          >
                          <span style={{ fontSize: "30px", verticalAlign: "sub",marginRight: "5px"}}>
                            &#8249;
                          </span>
                            Previous
                          </button>
                        )}

                        {pages.map(page => {
                          let activePage = null;
                          if (currentPage === page) {
                            activePage = { backgroundColor: "#f1efef" };
                          }
                          return (
                            <button id={"km-pagination-"+page+""} className="km-pagination-check"
                              key={page}
                              style={activePage}
                              {...getPageItemProps({
                                pageValue: page,
                                onPageChange: this.handlePageChange
                              })}
                            >
                              {page}
                            </button>
                          );
                        })}

                        {hasNextPage && (
                          <button className="km-next-page" style={{border: "none", color: "#5c5aa7", backgroundColor: "transparent"}}
                            {...getPageItemProps({
                              pageValue: nextPage,
                              onPageChange: this.handlePageChange
                            })}
                          >
                            Next 
                            <span style={{ fontSize: "30px", verticalAlign: "sub",marginLeft: "5px"}}>
                              &#8250;
                            </span>
                          </button>
                        )}

                        <button style={{display:"none"}}
                          {...getPageItemProps({
                            pageValue: totalPages,
                            onPageChange: this.handlePageChange
                          })}
                        >
                          last
                        </button>
                      </div>
                    )}
                </Pagination>
                  </div>
                :
                this.state.hideEmptyStateImage && <UserSectionLoader/>
                }
              <div className="empty-state-customers-div text-center col-lg-12" hidden={this.state.hideEmptyStateImage}>
                <img src="/img/empty-customers.png" alt="Customers Empty State" className="empty-state-customers-img"/>
                <p className="empty-state-message-shortcuts-first-text">Couldn't find anyone!</p>
                <p className="empty-state-message-shortcuts-second-text">There are no users to show</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={this.state.modalType !== ""} heading={renderModalContent[this.state.modalType].heading} onRequestClose={() => this.openModal("")} width="550px">
        {
          renderModalContent[this.state.modalType].content  
        }
      </Modal>

      <ReactTooltip/>
    </div>)
  }
}

const InputGroup = (props) => {
  return ( 
      <UserStyles.InputGroupContainer>
          <UserStyles.LabelContainer>
              <UserStyles.Label htmlFor={props.id}>{props.label}</UserStyles.Label> 
          </UserStyles.LabelContainer> 
          <UserStyles.Input id={props.id} className="input" name={props.name} type={props.inputType} value={props.value} onChange={props.onChange} placeholder={props.placeholder} {...props} />
      </UserStyles.InputGroupContainer>
  )
}

export default Users;
