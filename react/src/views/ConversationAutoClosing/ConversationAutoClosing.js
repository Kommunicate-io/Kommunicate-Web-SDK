import React, { Component } from 'react';
import styled from 'styled-components';
import { SettingsHeader } from '../../components/SettingsComponent/SettingsComponents';
import SliderToggle from '../../components/SliderToggle/SliderToggle';
import {getAppSetting, updateAppSetting} from '../../utils/kommunicateClient';
import Notification from '../model/Notification';
import {CaretTop ,CaretBottom } from '../../assets/svg/svgs';
import LockBadge from '../../components/LockBadge/LockBadge';
import CommonUtils from '../../utils/CommonUtils';
import AnalyticsTracking from '../../utils/AnalyticsTracking'

let updateTimer;

class ConversationAutoResolving extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            inputDuration: 10,
            durationOptions: [
                { value: 1, label: "minutes" },
                { value: 2, label: "hours" }
            ],
            defaultDurationType :[{ value: 1, label: "minutes" }] ,
            durationType : 'minutes',
            enableConversationAutoResolving:true
        };
    }

    componentDidMount = () => {
        this.getConversationAutoResolveSettings();
    }

    getConversationAutoResolveSettings = () => {
        getAppSetting().then(response => {
            if(response.status == 200 && response.data.response) { 
                this.setState({
                    inputDuration: !response.data.response.conversationCloseTime ?  10 : response.data.response.conversationCloseTime/60 ,
                    enableConversationAutoResolving:  response.data.response.conversationCloseTime > 0 
                });
            }
        }).catch(err => {
            console.log(err);
        })
    }

    handleKeypress = (e) =>{
        var a = [];
        var k = e.which;
    
        for (var i = 48; i < 58; i++)
            a.push(i);
    
        if (!(a.indexOf(k,a)>=0))
            e.preventDefault();
    }

    changeConversationResolvingTime = (change) =>{
        //following check is there to make sure the value of the auto-resolve time never drops below 0
        if(change === -1 && this.state.inputDuration ===0){
            return;
        }
        this.setState({
            inputDuration : this.state.inputDuration + change
        },()=>{ updateTimer && clearTimeout(updateTimer), this.handleConversationResolvingTimeChange()})
    }

    handleConversationResolvingTimeChange = () =>{
        let timer = 500;
        updateTimer = setTimeout(() => {
            let resolvingTime = this.state.inputDuration > 0  ? this.state.inputDuration*60 : 0 ;
            this.updateConversationResolvingTime(resolvingTime);
        }, timer);
    }


    toggleConversationAutoResolving = () => {
        let resolvingTime = !this.state.enableConversationAutoResolving  ? this.state.inputDuration*60 : 0 ;
        this.updateConversationResolvingTime(resolvingTime);
    }

    isAutoResolvingRestricted = () => {
        return !(CommonUtils.isEnterprisePlan() || CommonUtils.isTrialPlan());
    }

    updateConversationResolvingTime = (resolvingTime) =>{
        let data = {
            conversationCloseTime: resolvingTime
        }
        updateAppSetting(data).then(response => {
            if(response.status == 200 && response.data.code == "SUCCESS") {
                AnalyticsTracking.acEventTrigger('conversationAutoresolve');
                data.conversationCloseTime && this.state.enableConversationAutoResolving && Notification.success("Conversation auto-resolving time updated") 
                !data.conversationCloseTime && Notification.success("Conversation auto-resolving disabled successfully");
                data.conversationCloseTime && !this.state.enableConversationAutoResolving && Notification.success("Conversation auto-resolving enabled successfully") 
                this.setState({ enableConversationAutoResolving: data.conversationCloseTime > 0 });
                this.state.inputDuration === 0 && this.setState({ inputDuration : 10 });
            }
        }).catch( err => {
            Notification.error("Could not update conversation auto-resolving setting. Please try again after some time.");
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
                        <ToggleSettingsText>Allow conversations to be resolved automatically</ToggleSettingsText>
                        <ToggleSettingsToggler>
                            <SliderToggle 
                                checked={this.state.enableConversationAutoResolving} 
                                handleOnChange={this.toggleConversationAutoResolving}
                                disabled={this.isAutoResolvingRestricted()}
                            />   
                        </ToggleSettingsToggler>

                    {  this.isAutoResolvingRestricted() &&
                           <LockBadge 
                                className={"lock-with-text"} 
                                text={"Available in Enterprise plan"} 
                                history={this.props.history} 
                                onClickGoTo={"/settings/billing"}
                        />
                    }
                    </ToggleSettingsContainer>
                    <ToggleSettingsDescription disabled={!this.state.enableConversationAutoResolving}>
                    Conversations which are assigned to a bot will be auto-resolved, when the user has not replied for
                    <InputNumberWrapper>
                        <DurationInput type="number" min="0" value={this.state.inputDuration}
                            onChange={(e)=>{
                                this.setState({
                                    inputDuration : parseInt(e.target.value)
                                },()=>{
                                    updateTimer && clearTimeout(updateTimer), this.handleConversationResolvingTimeChange();
                                })
                            }}
                            onKeyPress={this.handleKeypress}
                            />
                        <ToggleButtonWrapper>
                            <ToggleButton onClick={()=>{this.changeConversationResolvingTime(+1)}}> <CaretTop/> </ToggleButton>
                            <ToggleButton onClick={()=>{this.changeConversationResolvingTime(-1)}}> <CaretBottom/> </ToggleButton>
                        </ToggleButtonWrapper>
                    </InputNumberWrapper>minutes.
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
const ToggleSettingsText = styled.div`
    margin: 0 10px 0 0;
    font-size: 16px;
    letter-spacing: 0.3px;
    color: #272828;
`;
const ToggleSettingsToggler = styled.div`
    margin-right: 20px;
`;
const ToggleSettingsDescription = styled.div`
    font-size: 15px;
    line-height: 1.4;
    letter-spacing: 0.5px;
    color: #797575;
    margin: 30px auto;
    pointer-events : ${props => props.disabled ? 'none' : 'all'};
    opacity : ${props => props.disabled ? '.5' : '1'};
`;

const InputNumberWrapper = styled.div`
    display: inline-flex;
    width: 75px;
    margin-right: 10px;
    border-bottom: 1px solid #ccc;
    margin: 0 3px;
`;
const ToggleButtonWrapper = styled.div``;
const ToggleButton = styled.div`
    font-size: 10px;
    height: 5px;
    font-size: 7px;
    height: 10px;
    background: #eee;
    margin: 3px 0;
    padding: 0 5px;
    cursor: pointer;
    z-index: 10;
`;

const DurationInput = styled.input`
    outline: none;
    border: none;
    box-shadow: none;
    padding: 0 2px;
    position: relative;
    width: 57px;
    /* Hide default arrows in numver field */
    -moz-appearance: textfield; /*For FireFox*/
    &::-webkit-inner-spin-button { /*For Webkits like Chrome and Safari*/
        -webkit-appearance: none;
        margin: 0;
    }

    &:focus{
        outline: none;
        border: none;
    }
`

export default ConversationAutoResolving;