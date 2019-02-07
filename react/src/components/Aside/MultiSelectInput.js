import React, { Component } from "react";
import CreatableSelect from "react-select/lib/Creatable";
import isEmail from "validator/lib/isEmail";
import Notification from '../../views/model/Notification';
import { GROUP_ROLE } from '../../utils/Constant';

const components = {
    DropdownIndicator: null
};

const createOption = label => ({
    label,
    value: label
});

const colourStyles = {
    control: styles => ({ ...styles }),

     multiValue: (styles, { data }) => {
        return {
            ...styles,
            borderRadius: '3px'
        };
    },
    input: (styles, {data}) => ({
        ...styles,
        transition: 'none',
        fontSize: '16px'

     }),
    multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: data.color,
        fontSize: '100%'
    })
};

export default class MultiSelectInput extends Component {
    state = {
        inputValue: "",
        value: []      
    };

    componentDidMount = () => {
        this.listenForSendButtonClick();
    }

    handleChange = (value, meta) => {
        let groupId = window.$kmApplozic(".left .person.active").data('km-id') || this.props.group.groupId;
        this.setState({ value });
        this.removeGroupMember(groupId, meta.removedValue.value);
    };

    handleInputChange = (inputValue, action) => {
        if (action.action !== "input-blur" && action.action !== "menu-close") {
            this.setState({ inputValue });
        }
    };

    handleKeyDown = event => {
        let groupId = window.$kmApplozic(".left .person.active").data('km-id') || this.props.group.groupId;
        const { inputValue, value } = this.state;
        if (!inputValue) return;
        switch (event.keyCode) {
            case 9: // TAB
            case 13: // ENTER
            case 32: // SPACE
            case 188: // COMMA
                event.preventDefault();
                if(isEmail(this.state.inputValue)) {
                    this.setState({
                        inputValue: "",
                        value: [...value, createOption(inputValue)]
                    });
                     this.addGroupMember(groupId, this.state.inputValue, function(resp) {});
                } else {
                    Notification.error("Please enter a valid email address.");
                }
         }
    };

    addGroupMember = (groupId, userId, callback) => {
        window.$kmApplozic.fn.applozic('addGroupMember',{'groupId': groupId,
            'userId': userId,
            'role': GROUP_ROLE.MEMBER, 
            'createNew': true,
            'callback': function(response) {
                if (typeof callback === 'function') {
                    callback();
                }
            }
        });  
    }

    removeGroupMember = (groupId, userId) => {
        window.$kmApplozic.fn.applozic('removeGroupMember', {
            'groupId': groupId,
            'userId': userId,
            'callback': function(response) {}
        });
    }

    emptyMultiEmailInputField = () => {
        var msgTypingBox = document.getElementById("km-text-box");
        if(msgTypingBox.innerHTML !== "") {
            this.setState({
                value: []
            });
        }
    }

    listenForSendButtonClick = () => {
        var _that = this;
        var sendButton = document.getElementById('km-msg-sbmt'),
            msgTypingBox = document.getElementById("km-text-box"),
            pressEnterToSendCheckbox = document.getElementById("km-press-enter-to-send-checkbox");

        sendButton.addEventListener('click', function() {
            _that.emptyMultiEmailInputField();
        });
        msgTypingBox.addEventListener('keydown', function(e) {
            pressEnterToSendCheckbox.checked && e.keyCode === 13 && _that.emptyMultiEmailInputField();
        });
    }

    render() {
        const { inputValue, value } = this.state;
        return (
            <CreatableSelect
                className={'multi-email-input-field'}
                components={components}
                inputValue={inputValue}
                isClearable={false}
                isMulti={true}
                menuIsOpen={false}
                blurInputOnSelect={false} 
                closeMenuOnSelect={false}
                onChange={this.handleChange}
                onInputChange={this.handleInputChange}
                onKeyDown={this.handleKeyDown}
                placeholder=""
                value={value}
                styles={colourStyles}
            />
        );
    }
}