import React, {Component} from 'react';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import {Dropdown, DropdownMenu, DropdownItem, Progress} from 'reactstrap';
import CustomerListItem from '../UserItem/CustomerListItem';
import './users.css'
import CommonUtils from '../../utils/CommonUtils';
import Labels from '../../utils/Labels';
import {fetchContactsFromApplozic, getGroupFeed, multipleGroupInfo} from '../../utils/kommunicateClient';
import ApplozicClient from '../../utils/applozicClient';
import _ from 'lodash';
import Pagination from "react-paginating";
import {UserSectionLoader} from '../../components/EmptyStateLoader/emptyStateLoader.js';

const limit = 2;
const pageCount = 3;
class Users extends Component {

  constructor(props) {
    super(props);

    this.state = {
      result: [],
      startTime:"",
      lastSeenTime:"",
      showEmptyStateImage: true,
      total:0,
      currentPage: 1,
      intial:0,
      final:20,
      pageNumber:1,
      pageFlag:2,
      stopFlag:1,
      getUsersFlag:1,
      isFromSearch: false
    };

  }
  componentWillMount() {
    this.getUsers();
    this.updateConversationWithRespectToPageNumber();
  }

  getUsers = () => {
    var _this = this;
    if(_this.state.getUsersFlag === 1){
      _this.setState({
        getUsersFlag:0
      })
      var params = {
        startIndex : 0,
        pageSize : 60,
        orderBy : 1,
        roleNameList : "USER"
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
            _this.setState({showEmptyStateImage: false});
            }
          }
        });
    }
  };

  listUsers = (response,assignedUser,isFromSearch) => {
    let botAgentMap = CommonUtils.getItemFromLocalStorage("KM_BOT_AGENT_MAP");
    var groupList=[];
    var test = this.state.isFromSearch ? response.response : response.response.users;
    const usersMap=test.map((user, index)=>{
      if (user.messagePxy && user.messagePxy.groupId) {
        groupList.push(user.messagePxy.groupId.toString());
      }
    });
    if(groupList.length === 0 ){
      this.mapUserDeatils(botAgentMap,response, assignedUser,[],[]);
    }
    else{
      this.getmMultipleGroupInfo(botAgentMap, groupList, response, assignedUser);
    }
  };

  getmMultipleGroupInfo = (botAgentMap, groupList, response, assignedUser)=> {
    var _this = this;
    ApplozicClient.multipleGroupInfo(groupList).then(data => {
      var arr = [];
      if(data.status == "success" && data.response && data.response.length){
        for(var j = 0; j < data.response.length; j++){
          arr[data.response[j].id] = data.response[j];
        };
      }
      _this.mapUserDeatils(botAgentMap, response, assignedUser, data, arr);
    });
  };

  mapUserDeatils = (botAgentMap, response, assignedUser, data, arr) => {
    var _this = this;
    var test = this.state.isFromSearch ? response.response : response.response.users;
    const users=test.map((user, index)=>{
      if (user.messagePxy && user.messagePxy.groupId) {
            if (botAgentMap && typeof data !== "undefined" && data !== null && data.status == "success") {
                if (arr[user.messagePxy.groupId]) {
                  user.assignee = (arr[user.messagePxy.groupId].metadata.CONVERSATION_ASSIGNEE && botAgentMap[arr[user.messagePxy.groupId].metadata.CONVERSATION_ASSIGNEE]) && botAgentMap[arr[user.messagePxy.groupId].metadata.CONVERSATION_ASSIGNEE].name || arr[user.messagePxy.groupId].metadata.CONVERSATION_ASSIGNEE ;
                  user.convoStatus = arr[user.messagePxy.groupId].metadata.CONVERSATION_STATUS;
                  assignedUser.push(user);
                  // Sort array after pushing
                  var arrObj = _.sortBy(assignedUser,"lastSeenAtTime").reverse();
                  _this.setState({
                    result: arrObj,
                    showEmptyStateImage: true
                  })
                }
            }
      }
      else {
        assignedUser.push(user);
        var arrObj = _.sortBy(assignedUser,"lastSeenAtTime").reverse();
        _this.setState({
          result: arrObj,
          showEmptyStateImage: true
        })
      }
    });
  };

  searchContactInApplozic = (searchQuery) => {
    var _this = this;
    var params = {
      name : searchQuery
    }
    ApplozicClient.searchContact(params).then(response => {
      console.log(response);
      if(response.response.length !== 0){
        var setPageNumbers = response.response.length;
        _this.setState({
          isFromSearch: true,
          total: (Math.ceil(setPageNumbers / 20)*limit)
        });
        _this.listUsers(response,[]);
      }
     else {
      var setPageNumbers = response.response.length;
      _this.setState({
        isFromSearch: true,
        result: [],
        total: (Math.ceil(setPageNumbers / 20)*limit),
        showEmptyStateImage: false
      }); 
      _this.listUsers(response,[]);
     }
    });
  };

  updateConversationWithRespectToPageNumber = () => {
    var _this = this;
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
            getUsersFlag:1
          })
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
              getUsersFlag:1
            })
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

  handleClick = (e) => {
    var _this = this;
    e.preventDefault();
    //km-text-box-wrapper
    var specifiedElement = document.getElementById('km-search-box');
    document.getElementById("km-search-svg").classList.add('n-vis');
    document.getElementById("km-clear-search-text").classList.remove('n-vis');
    specifiedElement.style.marginLeft="0px"

    document.addEventListener('click', function(event) {
      event.preventDefault();
      var isClickInside = specifiedElement.contains(event.target) || specifiedElement.id === event.target.id;
      if (!isClickInside) {
        //the click was outside the specifiedElement
        document.getElementById("km-search-svg") && document.getElementById("km-search-svg").classList.remove('n-vis');
        document.getElementById("km-clear-search-text") && document.getElementById("km-clear-search-text").classList.add('n-vis');
        specifiedElement && (specifiedElement.style.marginLeft="20px");
        specifiedElement && (specifiedElement.value ="");
      }
    });

    document.addEventListener('keyup', function(event){
      event.stopImmediatePropagation(); // When clicking on a button, execute the first event handler, and stop the rest of the event handlers from being executed.
      var key = event.which || event.keyCode;
       if(key=== 13){
        _this.searchContactInApplozic(document.getElementById('km-search-box').value);
       };
    });
  }


  render() {
    const infoText = Labels["lastcontacted.tooltip"];
    var showrResult = this.state.result.slice(this.state.intial, this.state.final).map(function (result, index) {
      return <CustomerListItem key={index} user={result} hideConversation="false" />
    });
   return (<div className="animated fadeIn customer-list-item">

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-block">
           <div id="km-text-box-wrapper" className="km-text-box-wrapper">
           <svg id="km-search-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52.966 52.966">
                <path fill="#a8a8a8" d="M51.704 51.273L36.845 35.82c3.79-3.801 6.138-9.041 6.138-14.82 0-11.58-9.42-21-21-21s-21 9.42-21 21 9.42 21 21 21c5.083 0 9.748-1.817 13.384-4.832l14.895 15.491a.998.998 0 0 0 1.414.028 1 1 0 0 0 .028-1.414zM21.983 40c-10.477 0-19-8.523-19-19s8.523-19 19-19 19 8.523 19 19-8.524 19-19 19z"/>
              </svg>
            <input id="km-search-box" type="text" className="km-search-box required" placeholder="Search in users" onClick={(event) => {this.handleClick(event)} } ></input>
            <span id="km-clear-search-text" className="n-vis"> &times; </span>
            </div>
            <table className={this.state.result.length !== 0 ? "table table-hover mb-0 hidden-sm-down km-show-visibility":"table table-hover mb-0 hidden-sm-down km-hide-visibility"}>
                  <thead className="thead-default">
                    <tr className="users-table">
                      <th>Name</th>
                      <th>Last Seen</th>
                      <th>Last Contacted
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" style={{
                            verticalAlign: "bottom",
                            marginLeft: "8px",
                            marginBottom: "2px"
                          }} data-tip={infoText} data-effect="solid" data-place="right" data-multiline="True">
                          <g fill="#514E4E" fillRule="nonzero">
                            <path d="M6.6.073c-.014-.002-.026 0-.04 0C2.983.094.073 2.975.073 6.5c0 3.525 2.914 6.409 6.494 6.426a.56.56 0 0 0 .035.002l.001-.002c3.489-.017 6.326-2.9 6.326-6.426 0-3.525-2.837-6.41-6.329-6.427zm.003 12.098l-.03-.001C3.404 12.155.827 9.61.827 6.5S3.405.845 6.598.83c3.073.015 5.574 2.56 5.574 5.67 0 3.108-2.498 5.652-5.569 5.671z"/>
                            <path d="M6.485 5.38H5.84v4.317h1.32V5.38zM6.509 3.306v-.003l-.004-.001-.008.001-.006-.001v.003c-.399.007-.643.29-.651.659 0 .354.246.64.651.656v.004h.012l.003-.001.003.001v-.001a.636.636 0 0 0 .651-.66c0-.366-.257-.646-.651-.657z"/>
                          </g>
                        </svg>
                      </th>
                      <th>Latest Conversation</th>
                      <th className="text-center n-vis">Country</th>
                      <th className="n-vis">Usage</th>
                      <th className="text-center n-vis">Payment Method</th>
                      <th className="n-vis">Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showrResult}
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
                this.state.showEmptyStateImage && <UserSectionLoader/>
                }
              <div className="empty-state-customers-div text-center col-lg-12" hidden={this.state.showEmptyStateImage}>
                <img src="/img/empty-customers.png" alt="Customers Empty State" className="empty-state-customers-img"/>
                <p className="empty-state-message-shortcuts-first-text">Couldn't find anyone!</p>
                <p className="empty-state-message-shortcuts-second-text">There are no users to show</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ReactTooltip/>
    </div>)
  }
}

export default Users;
