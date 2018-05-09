import React, { Component } from 'react';
import axios from 'axios';
import { Dropdown, DropdownMenu, DropdownItem, Progress } from 'reactstrap';
import UserItem from '../UserItem/'

class Users extends Component {

  constructor(props) {
    super(props);

    this.state = {
      result: [],
      showEmptyStateImage: true
    };
  }

  componentWillMount() {
    var _this = this;
    window.$kmApplozic.fn.applozic("fetchContacts", {"roleNameList":["USER"],'callback':function(response) {
        //console.log("User Response", response);
        // if(response&&response.response){
        // _this.setState({result: response.response.users});
        // }
        if(response && response.response && (response.response.users.length > 0)) {
          _this.setState({result: response.response.users,showEmptyStateImage: true});
        } else if(response.response.users.length == 0) {
          _this.setState({showEmptyStateImage: false});
        }
      }
    });
  }

  render() {
    var result = this.state.result.map(function (result, index) {
      if (result.messagePxy && result.messagePxy.groupId) {
        window.$kmApplozic.fn.applozic("getGroup", {
          groupId: result.messagePxy.groupId, callback: function (group) {
            if (typeof group !== "undefined" && group !== null && group.metadata && group.metadata.CONVERSATION_ASSIGNEE) {
              window.$kmApplozic.fn.applozic("getContactDetail", {
                "userId": group.metadata.CONVERSATION_ASSIGNEE, callback: function (user) {
                  if (typeof user !== "undefined") {
                    result.assignee = user.displayName || user.userId;
                  }
                }
              })
            }
          }
        })
      }
      return <UserItem key={index} user={result} hideConversation="false"/>
    });
    return (
      <div className="animated fadeIn">

        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-block">
                <table className="table table-hover table-outline mb-0 hidden-sm-down">
                  <thead className="thead-default">
                    <tr>
                      <th className="text-center"><i className="icon-people"></i></th>
                      <th>User</th>
                      <th>Contact Info</th>
                      <th>Last Activity</th>
                      <th>Latest Conversation</th>
                      <th className="text-center" >Assigned</th>
                      <th className="text-center">Add Info</th>
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
                  <img src="/img/empty-customers.png"  alt="Customers Empty State" className="empty-state-customers-img" />
                  <p className="empty-state-message-shortcuts-first-text">Couldn't find anyone!</p>
                  <p className="empty-state-message-shortcuts-second-text">There are no customers to show</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

export default Users;
