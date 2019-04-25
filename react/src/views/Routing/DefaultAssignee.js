import React from "react";
import Select from 'react-select';
import UserDropdown from '../../components/Dropdown/UserDrodown'
import { USER_TYPE } from '../../utils/Constant'

function DefaultAssignee  (props) {
    // const userList = props.userList;
    return (
        <div className= "default-assignee-container">
            <div className="default-assignee-description-wrapper">
                <span className="default-assignee-description">{props.text}</span>
            </div>    
            <div className="default-assignee-dropdown-wrapper">
                 <UserDropdown
                    className= {props.className} 
                    name={props.name}
                    handleDropDownChange = {props.updateDefaultAssignee} 
                    userType ={[USER_TYPE.AGENT, USER_TYPE.ADMIN]}
                    defaultValue={props.selectedAssignee}
                />
            </div>    
        </div>
    )
}
export default DefaultAssignee;