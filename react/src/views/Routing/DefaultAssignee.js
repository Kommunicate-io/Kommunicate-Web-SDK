import React from "react";
import Select from 'react-select';
function DefaultAssignee  (props) {
    // const userList = props.userList;
    return (
        <div className= "default-assignee-container">
            <div className="default-assignee-description-wrapper">
                <span className="default-assignee-description">{props.text}</span>
            </div>    
            <div className="default-assignee-dropdown-wrapper">
                <Select
                    className= {props.class}
                    name={props.name}
                    value={props.selectedAssignee}
                    clearable={false}
                    searchable={false}
                    onChange={props.updateDefaultAssignee}
                    options={props.userList}
                    controlShouldRenderValue={false}
                />
            </div>    
        </div>
    )
}
export default DefaultAssignee;