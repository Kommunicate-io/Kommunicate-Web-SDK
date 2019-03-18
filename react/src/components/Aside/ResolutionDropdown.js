import React, { Component } from 'react';
import styled from 'styled-components';
import { MoreIconVertical } from "../../assets/svg/svgs";

class ResolutionDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    showDropDown = (e) => {
        this.setState({ open: true }, () => {
          document.addEventListener('click', this.hideDropDown);
        });
    }

    hideDropDown = (e) => {
        if (!this.dropdownMenu.contains(e.target)) {
            this.setState({ open: false }, () => {
              document.removeEventListener('click', this.hideDropDown);
            });  
        }
    }

    render() {
        return (
            <ResolutionDropdownContainer onClick={() => this.showDropDown()} tabIndex="0">
                <ResolutionDropdownIconContainer>
                    <MoreIconVertical />
                </ResolutionDropdownIconContainer>

                {this.state.open && (
                    <ResolutionDropdownOptionsContainer ref={(element) => {
                        this.dropdownMenu = element; }}>
                        <ResolutionDropdownOptions onClick={() => this.props.changeStatus(this.props.conversationStatus.SPAM)}>Mark as Spam/Irrelevant</ResolutionDropdownOptions>
                        <ResolutionDropdownOptions onClick={this.props.toggleDeleteConversationModal}>Delete Conversation</ResolutionDropdownOptions>
                    </ResolutionDropdownOptionsContainer>
                    )
                }              
            </ResolutionDropdownContainer>
        );
    }
}


//Styles
const ResolutionDropdownContainer = styled.div`
    cursor: pointer;
    position: relative;
    z-index: 20;

    &:focus, &:focus-within {
        outline: none;
    }
`;
const ResolutionDropdownIconContainer = styled.div`
    min-width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
`;
const ResolutionDropdownOptionsContainer = styled.div`
    position: absolute;
    top: 40px;
    right: 0;
    z-index: 10;
    border-radius: 2px;
    box-shadow: 0 2px 3px 2px rgba(104, 102, 102, 0.25);
    background-color: #ffffff;
    padding: 5px 10px;
    width: 250px;
    cursor: default;
`;
const ResolutionDropdownOptions = styled.div`
    padding: 15px;
    margin: 0 -10px;
    font-size: 14px;
    letter-spacing: 0.4px;
    color: #454548;
    &:hover {
        background-color: #efefef;
        cursor: pointer;
    }
    &:last-child {
        color: #d90a0f;
    }
`;

export default ResolutionDropdown;