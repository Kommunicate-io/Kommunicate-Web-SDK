import React, { Component } from 'react';
import { getUsersByType } from '../../utils/kommunicateClient'
import { USER_TYPE } from '../../utils/Constant'
import CommonUtils from '../../utils/CommonUtils'
import Button from '../../components/Buttons/Button'
import { colors } from 'react-select/lib/theme'
import Select from "react-select";
export default class UserDropDown extends React.Component {
    constructor() {
        super();
        this.state = {
            options: [],
            isOpen: false,
            value: undefined
        };
    }
    componentDidMount() {
        this.getAllUsers()
    }
    toggleOpen = (e) => {
        e && e.preventDefault()
        this.setState({ isOpen: !this.state.isOpen });
    };
    onSelectChange = (value) => {
        this.props.handleDropDownChange(value);
        this.toggleOpen();
        this.setState({ value });
    };
    getAllUsers = () => {
        let users = [];
        this.props.name == "km-dashboard-agent-filter" && users.push({ label: "All agents", value: "allagents" })
        let userSession = CommonUtils.getUserSession();
        let applicationId = userSession.application.applicationId;
        return getUsersByType(applicationId, this.props.userType).then(data => {
            data.map((user, index) => {
                users.push({ label: user.name || user.userName, value: user.userName })
            })
            this.setState({
                users: users,
                options: users
            })
        }).catch(err => {
            console.log("err while fetching users list ", err);
        });
    }

    render() {
        const { options, isOpen, value } = this.state;
        return (
            <div className="km-user-dropdown-container">
                <Dropdown
                    isOpen={isOpen}
                    onClose={this.toggleOpen}
                    target={
                        <Button
                            id={this.props.id}
                            className={"km-user-dropdown-btn " + (this.props.className || "")}
                            onClick={this.toggleOpen}
                            isSelected={isOpen}
                        >
                            <span className="dropdown-btn-text">{this.props.defaultValue.label}</span>
                            <ChevronDown />
                        </Button>
                    }
                >
                    <Select
                        defaultValue = {this.props.defaultValue}
                        options={options}
                        onChange={this.onSelectChange}
                        value={this.state.selectedItem}
                        className={"user-dropdown-search-box" + (this.props.searchBoxClassName || "")}
                        name={this.props.searchBoxName}
                        styles={selectStyles}
                        components={{ IndicatorSeparator: null, DropdownIndicator }}
                        menuIsOpen
                        controlShouldRenderValue={false}
                        hideSelectedOptions={false}
                        isClearable={false}
                        tabSelectsValue={false}
                        autoFocus
                        placeholder="Search..."
                    />
                </Dropdown>
            </div>
        );
    }
}
const selectStyles = {
    control: provided => ({ ...provided, minWidth: 190, margin: 8 }),
    menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' }),
};
const Menu = props => {
    return (
        <div
            css={{
                backgroundColor: 'white',
                borderRadius: 4,
                boxShadow: `rgba(0, 0, 0, 0.1) 0px 4px 8px 0px, rgba(0, 0, 0, 0.1) 0px -1px 4px 0px`,
                marginTop: 8,
                position: 'absolute',
                zIndex: 2,
            }}
            {...props}
        />
    );
};
const Blanket = props => (
    <div
        css={{
            bottom: 0,
            left: 0,
            top: 0,
            right: 0,
            position: 'fixed',
            zIndex: 1,
        }}
        {...props}
    />
);
const Dropdown = ({ children, isOpen, target, onClose }) => (
    <div css={{ position: 'relative' }}>
        {target}
        {isOpen &&  <Menu>{children}</Menu> }
        {isOpen && <Blanket onClick={onClose} />}
    </div>
);
const Svg = p => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        focusable="false"
        role="presentation"
        {...p}
    />
);
const DropdownIndicator = () => (
    //SearchIcon
    <div css={{ color: colors.neutral20, height: 24, width: 32 }}>
        <Svg>
            <path
                d="M16.436 15.085l3.94 4.01a1 1 0 0 1-1.425 1.402l-3.938-4.006a7.5 7.5 0 1 1 1.423-1.406zM10.5 16a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z"
                fill="currentColor"
                fillRule="evenodd"
            />
        </Svg>
    </div>
);
const ChevronDown = () => (
    <span className="user-dropdown-arrow-wrapper">
        <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="css-19bqh2r">
            <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" fill="rgb(204,204,204)" >
            </path>
        </svg>
    </span>

);


