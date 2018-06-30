import React, {Component} from 'react';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import {Dropdown, DropdownMenu, DropdownItem, Progress} from 'reactstrap';
import CustomerListItem from '../UserItem/CustomerListItem'
import './users.css'

class Users extends Component {

  constructor(props) {
    super(props);

    this.state = {
      result: [],
      showEmptyStateImage: true
    };

    window.addEventListener("kmFullViewInitilized",this.getUsers,true);

  }
  componentWillMount() {
    this.getUsers();
  }
  getUsers = () => {
    var _this = this;
    window.$kmApplozic.fn.applozic("fetchContacts", {
      "roleNameList": ["USER"],
      'callback': function(response) {
        //console.log("User Response", response);
        // if(response&&response.response){
        // _this.setState({result: response.response.users});
        // }
        if (response && response.response && (response.response.users.length > 0)) {
          _this.setState({result: response.response.users, showEmptyStateImage: true});
        } else if (response.response.users.length == 0) {
          _this.setState({showEmptyStateImage: false});
        }
      }
    });
  }

  render() {
    const infoText = "The last time someone from your team <br><br/> or the user sent a message.";
    var result = this.state.result.map(function(result, index) {
      if (result.messagePxy && result.messagePxy.groupId) {
        window.$kmApplozic.fn.applozic("getGroup", {
          groupId: result.messagePxy.groupId,
          callback: function(group) {
            if (typeof group !== "undefined" && group !== null && group.metadata && group.metadata.CONVERSATION_ASSIGNEE) {
              window.$kmApplozic.fn.applozic("getContactDetail", {
                "userId": group.metadata.CONVERSATION_ASSIGNEE,
                callback: function(user) {
                  if (typeof user !== "undefined") {
                    result.assignee = user.displayName || user.userId;
                  }
                }
              })
            }
          }
        })
      }
      return <CustomerListItem key={index} user={result} hideConversation="false"/>
    });
    return (<div className="animated fadeIn customer-list-item">

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-block">
              <table className="table table-hover mb-0 hidden-sm-down">
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
                  {result}
                </tbody>
              </table>
              <div className="empty-state-customers-div text-center col-lg-12" hidden={this.state.showEmptyStateImage}>
                <img src="/img/empty-customers.png" alt="Customers Empty State" className="empty-state-customers-img"/>
                <p className="empty-state-message-shortcuts-first-text">Couldn't find anyone!</p>
                <p className="empty-state-message-shortcuts-second-text">There are no customers to show</p>
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
