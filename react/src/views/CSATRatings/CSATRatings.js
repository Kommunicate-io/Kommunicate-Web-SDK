import React, { Component } from 'react';
import styled from 'styled-components';
import { SettingsHeader } from '../../components/SettingsComponent/SettingsComponents';
import SliderToggle from '../../components/SliderToggle/SliderToggle';
import {getAppSetting, updateAppSetting} from '../../utils/kommunicateClient';
import Notification from '../model/Notification';

class CSATRatings extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            enableConversationRating: false
        }
    }

    componentDidMount = () => {
        this.getConversationRatingSettings();
    }

    getConversationRatingSettings = () => {
        getAppSetting().then(response => {
            if(response.status == 200 && response.data.response) { 
                response.data.response.collectFeedback && this.setState({
                    enableConversationRating: response.data.response.collectFeedback
                });
            }
        }).catch(err => {
            console.log(err);
        })
    }

    toggleConversationRatingSettings = () => {
        let data = {
            collectFeedback: !this.state.enableConversationRating
        }
        updateAppSetting(data).then(response => {
            if(response.status == 200 && response.data.code == "SUCCESS") {
                this.setState({ enableConversationRating: data.collectFeedback });
                this.state.enableConversationRating ? Notification.success("CSAT Ratings enabled successfully") : Notification.success("CSAT Ratings disabled successfully");
            }
        }).catch( err => {
            Notification.error("Could not update CSAT Rating settings. Please try again after some time.");
            console.log(err);
        })
    }

    render() {
        return (
            <Container className="animated fadeIn">
                <div className="km-heading-wrapper">
					<SettingsHeader  />
                </div>
                <Content>
                    <ToggleSettingsContainer>
                        <ToggleSettingsText>Ask your users for CSAT ratings</ToggleSettingsText>
                        <ToggleSettingsToggler>
                            <SliderToggle 
                                checked={this.state.enableConversationRating} 
                                handleOnChange={this.toggleConversationRatingSettings}
                            />
                        </ToggleSettingsToggler>
                    </ToggleSettingsContainer>
                    <ToggleSettingsDescription>
                    Your users will be asked to rate their support experience and leave comments after you or your team members resolve the conversation.
                    </ToggleSettingsDescription>
                    <ToggleSettingsDescription>
                        <a href="#" className="n-vis">See more details</a> about when your users will be asked to rate the conversation.
                    </ToggleSettingsDescription>
                </Content>
            </Container>
        );
    }
}


//Styles
const Container = styled.div`
    & .switch.switch-3d {
        margin-bottom: 0px;
    }
`;
const Content = styled.div`
    margin-left: 15px;
`;
const ToggleSettingsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;
const ToggleSettingsText = styled.p`
    margin: 0 10px 0 0;
    font-size: 16px;
    letter-spacing: 0.3px;
    color: #272828;
`;
const ToggleSettingsToggler = styled.div``;
const ToggleSettingsDescription = styled.p`
    font-size: 15px;
    line-height: 1.4;
    letter-spacing: 0.5px;
    color: #797575;
    margin: 30px auto;
`;

export default CSATRatings;