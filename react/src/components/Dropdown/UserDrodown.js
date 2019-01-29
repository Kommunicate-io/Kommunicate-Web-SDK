import React, { Component } from 'react';
import { getUsersByType } from '../../utils/kommunicateClient'
import { USER_TYPE } from '../../utils/Constant'
import AsyncSelect from 'react-select/lib/Async';
import CommonUtils from '../../utils/CommonUtils';

export default class UserDropDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: "",
            users:[]
        };

    }
    componentDidMount() {
        this.getAllUsers()
    }
    getAllUsers = () => {
        let users = [];
        this.props.name == "km-dashboard-agent-filter" && users.push({ label: "All agents", value: "allagents" })
        let userSession = CommonUtils.getUserSession();
        let applicationId = userSession.application.applicationId;
        return getUsersByType(applicationId, this.props.userType).then(data => {
            data.map((user, index) => {
                users.push({ label: user.name || user.email, value: user.email })     
            })
            this.setState({users:users})
        }).catch(err => {
            console.log("err while fetching users list ", err);
        });
    }
    render() {
        const { handleDropDownChange } = this.props;
        const promiseOptions = () =>
            new Promise(resolve => {
                setTimeout(() => {
                    resolve(this.state.users.filter(i =>
                        i.label
                    ));
                }, 2000);
            });

        return (
            <div className="km-user-drop-down">
                <AsyncSelect 
                    defaultValue = {this.props.defaultValue}
                    defaultOptions 
                    loadOptions={promiseOptions} 
                    onChange={handleDropDownChange} 
                    value={this.state.selectedItem} 
                    className={this.props.className}
                    name={this.props.name}
                />
            </div>
        );
    }
}

