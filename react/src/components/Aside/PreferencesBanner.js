import React, { Component, Fragment } from 'react';
import styled, { css } from 'styled-components';
import { PreferencesIcon } from "../../assets/svg/svgs";
import TrialDaysLeft from '../TrialDaysLeft/TrialDaysLeft';
import Notification from '../../views/model/Notification'
import Button from '../Buttons/Button';
import Checkbox from '../Checkbox/Checkbox';
import { updateAppSetting}  from '../../utils/kommunicateClient'
import CommonUtils from '../../utils/CommonUtils';

class PreferencesBanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            isChecked: true
        }
    }

    componentDidMount() {
        let userSession = CommonUtils.getUserSession();
        this.setState({
            isChecked:  Boolean(userSession.loadInitialStateConversation)
        })
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

    toggleChangeCheckbox = () => {
        this.setState({
            isChecked:  !this.state.isChecked
        })
    }

    savePreference = () => {
        var settingsJson = {
            "loadInitialStateConversation": this.state.isChecked
        };
        updateAppSetting(settingsJson).then(response => {
            Notification.success("Preferences updated successfully");
            location.reload(true);
        }).catch(err => {
            Notification.info("Couldn't update preferences, please try again")
        })
    }

    render() {
        return (
            <PreferencesBannerContainer>
                <TrialPeriodContainer>
                    <TrialDaysLeft />
                </TrialPeriodContainer>
                <PreferencesContainer onClick={() => this.showDropDown()} tabIndex="0">
                    <PreferencesIconContainer >
                        <PreferencesIcon />
                    </PreferencesIconContainer>
                    <PreferencesText>
                        Preferences
                    </PreferencesText>

                    {this.state.open && (
                        <PreferencesDropdownContainer ref={(element) => {
                            this.dropdownMenu = element;
                          }}>
                            <PreferencesDropdownTitle>
                                Dormant conversations 
                            </PreferencesDropdownTitle>
                            <PreferencesDropdownDescription>
                                <Checkbox idCheckbox={'km-conversations-preferences-checkbox'} label={'Show conversations where the user has not replied after the welcome message was triggered'} checked = {this.state.isChecked} handleOnChange = {this.toggleChangeCheckbox} />
                            </PreferencesDropdownDescription>
                            <SaveButtonContainer>
                                <Button onClick={this.savePreference}>Save</Button>
                            </SaveButtonContainer>
                            
                        </PreferencesDropdownContainer>
                    )}
                </PreferencesContainer>
            </PreferencesBannerContainer>    
        );
    }
}

// Styles
const flex = css`
    display: flex;
    align-items: center;
`;
const PreferencesBannerContainer = styled.div`
    ${flex}
    justify-content: space-between;
    height: 45px;
    padding: 0 15px;
`;
const PreferencesContainer = styled.div`
    ${flex}
    justify-content: flex-start;
    cursor: pointer;
    position: relative;
    z-index: 520;

    &:focus, &:focus-within {
        outline: none;
    }
`;
const TrialPeriodContainer = styled.div`
    width: 100%;
    text-align: center;

    & .km-trial-days-left-container {
        position: relative;
        transform: none;
        left: 30px;
        right: auto;
    }
    & .km-trial-days-left-popup-container, & .km-trial-days-left-popup-container .triangle-after, & .km-trial-days-left-popup-container .triangle-before {
        right: 50%;
        transform: translateX(50%);
    }
`;
const PreferencesIconContainer = styled.div`
    margin-right: 5px;
`;
const PreferencesText = styled.div`
    font-size: 14px;
    letter-spacing: 0.3px;
    color: #7d7d7e;
`;
const PreferencesDropdownContainer = styled.div`
    position: absolute;
    top: 40px;
    right: 0;
    z-index: 10;
    border-radius: 2px;
    box-shadow: 0 2px 3px 2px rgba(104, 102, 102, 0.25);
    background-color: #ffffff;
    padding: 10px;
    width: 250px;
    cursor: default;
`;
const PreferencesDropdownTitle = styled.p`
    letter-spacing: 0.3px;
    color: #2f2f30;
`;
const PreferencesDropdownDescription = styled.div`
    border-radius: 1px;
    background-color: #ebebeb;
    padding: 10px;

    & .checkbox-input[type='checkbox'] + .checkbox-label {
        cursor: pointer;
    }
    & .checkbox-input[type='checkbox'] + .checkbox-label {
        align-items: flex-start;
    }
    & .checkbox-input[type='checkbox'] + .checkbox-label > span {
        flex-basis: 24%;
        width: 18px;
        margin-top: 2px;
        height: 18px;
    }
    & .checkbox-input[type='checkbox']:checked + .checkbox-label > span {
        border-right: 2px solid #5553b7;
        border-left: 2px solid #5553b7;
        border-bottom: 8px solid #5553b7;
        border-top: 10px solid #5553B7;
    }
    & .checkbox-input[type='checkbox']:checked + .checkbox-label > span:before {
        left: 2px;
    }
`;
const SaveButtonContainer = styled.div`
    margin-top: 10px;
    text-align: right;
`;

export default PreferencesBanner;