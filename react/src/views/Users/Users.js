import React, { Component } from 'react';
import axios from 'axios';
import { Dropdown, DropdownMenu, DropdownItem, Progress } from 'reactstrap';
import UserItem from '../UserItem/'

class Users extends Component {

  constructor(props) {
    super(props);

    this.state = {
      result: []
    };
  }

  componentWillMount() {
    var _this = this;
    window.$applozic.fn.applozic("fetchContacts", {"roleNameList":["USER"],'callback': function(response) {
        console.log(response);
        if(response&&response.response){
        _this.setState({result: response.response.users});
        }
      }
    });
  }

  render() {
    var result = this.state.result.map(function(result,index){
          return <UserItem key={index} user={ result } />
          });
    return (
      <div className="animated fadeIn">

        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                Customers
              </div>
              <div className="card-block">

                <table className="table table-hover table-outline mb-0 hidden-sm-down">
                  <thead className="thead-default">
                    <tr>
                      <th className="text-center"><i className="icon-people"></i></th>
                      <th>User</th>
                       <th>Contact Info</th>
                       <th>Last Activity</th>
                       <th className="text-center">Add Info</th>
                      <th className="text-center">Actions</th>
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
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

export default Users;
