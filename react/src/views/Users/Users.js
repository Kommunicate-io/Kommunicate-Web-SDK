import React, { Component } from 'react';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import {Dropdown, DropdownMenu, DropdownItem, Progress} from 'reactstrap';
import CustomerListItem from '../UserItem/CustomerListItem';
import './users.css'
import CommonUtils from '../../utils/CommonUtils';

class Users extends Component {

  constructor(props) {
    super(props);

    this.state = {
      result: [],
      showEmptyStateImage: true,
    };
    window.addEventListener("kmFullViewInitilized",this.getUsers,true);
  }
  componentWillMount() {
    this.getUsers(); 
  }

  getUsers = () => {
    var _this = this;
    var assingUser=[];
    let botAgentMap = CommonUtils.getItemFromLocalStorage("KM_BOT_AGENT_MAP");
    window.$kmApplozic.fn.applozic("fetchContacts", {
      "roleNameList": ["USER"],
      'callback': function(response) {
        if (response && response.response && (response.response.users.length > 0)) {
          const users=response.response.users.map((user, index)=>{
            if (user.messagePxy && user.messagePxy.groupId) {
              window.$kmApplozic.fn.applozic("getGroupFeed", { groupId: user.messagePxy.groupId,
                callback: function(group) {
                  if (botAgentMap && typeof group !== "undefined" && group !== null && group.data.metadata &&                group.data.metadata.CONVERSATION_ASSIGNEE) {
                    user.assignee = botAgentMap[group.data.metadata.CONVERSATION_ASSIGNEE].name || group.data.metadata.CONVERSATION_ASSIGNEE ;
                    assingUser.push(user);
                    _this.setState({result: assingUser, showEmptyStateImage: true})
                  }
                }
              });
            }
          });
        } else if (response.response.users.length == 0) {
          _this.setState({showEmptyStateImage: false});
        }
      }
    });
    
  }
  render() {
    const infoText = "The last time someone from your team <br><br/> or the user sent a message.";
    var result = this.state.result.map(function (result, index) {
      return <CustomerListItem key={index} user={result} hideConversation="false" />
    });

    return (<div className="animated fadeIn customer-list-item">

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
