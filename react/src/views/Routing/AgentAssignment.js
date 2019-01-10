import React, { Component } from 'react'
import { connect } from 'react-redux'
import './AgentAssignment.css';
import Notification from '../model/Notification';
import RadioButton from '../../components/RadioButton/RadioButton';
import axios from 'axios';
import { ROUTING_RULES_FOR_AGENTS, USER_TYPE } from '../../../src/utils/Constant';
import CommonUtils from '../../utils/CommonUtils';
import SliderToggle from '../../components/SliderToggle/SliderToggle';
import {Link} from 'react-router-dom';
import {SplitButton, MenuItem, DropdownButton} from 'react-bootstrap';
import { Collapse } from 'reactstrap';
import Diaglflow from '../Bot/images/dialogflow-icon.png';
import botPlatformClient from '../../utils/botPlatformClient';
import LockBadge from '../../components/LockBadge/LockBadge';
import AnalyticsTracking from '../../utils/AnalyticsTracking';
import {SettingsHeader} from '../../../src/components/SettingsComponent/SettingsComponents';
import DefaultAssignee from './DefaultAssignee'
import {
    getCustomerByApplicationId,
    getAgentandBotRouting,
    updateAgentAndBotRouting,
    getIntegratedBots,
    conversationHandlingByBot,
    getUsersByType,
    updateAppSetting
} from '../../utils/kommunicateClient'
import * as Actions from '../../actions/applicationAction'
import styled, { css } from 'styled-components';
import Banner from '../../components/Banner/Banner';
import { LearnMore } from '../../views/Faq/LizSVG';

class AgentAssignemnt extends Component{
    constructor(props) {
        super(props);
        this.state = {
            checked: 1,
            checkedNotifyEverybody:true,
            checkedAutomaticAssignemnt:false,
            preventMultiCallAutoAssignment:false,
            preventMultiCallNotifyEverybody:false,
            botsAreAvailable: false,
            assignConversationToBot: false,
            openAgentRoutingRules: false,
            listOfBots: [],
            listOfBotsDropDown: false,
            dropDownBoxTitle: 'Select a bot',
            previousSelectedBot: null,
            currentSelectedBot: null,
            userList :[],
            notifyEveryBodyDefaultAssigneeInfo:{},
            automaticAssignmentDefaultAssigneeInfo:{},
            botInAgentAssignedConversation: false
        };

    }
componentWillMount (){
    this.getRoutingState();
}

componentDidMount(){
    this.getIntegratedBots();
    this.getAgents();
}
updateDefaultAssigneeDetails = (userList) => {
    //AssigneeInfo:key value pair for drop down
    let appSettings = this.props.appSettings;
    let notifyEveryBodyDefaultAssignee = appSettings.defaultConversationAssignee[ROUTING_RULES_FOR_AGENTS.NOTIFY_EVERYBODY];
    let automaticAssignmentAssignee = appSettings.defaultConversationAssignee[ROUTING_RULES_FOR_AGENTS.AUTOMATIC_ASSIGNMENT];
    let notifyEveryBodyDefaultAssigneeInfo = userList.find(result => {
        if (result.value == notifyEveryBodyDefaultAssignee) return result
    });
    let automaticAssignmentDefaultAssigneeInfo = userList.find(result => {
        if (result.value == automaticAssignmentAssignee) return result
    });
    this.setState({
        notifyEveryBodyDefaultAssigneeInfo: notifyEveryBodyDefaultAssigneeInfo,
        automaticAssignmentDefaultAssigneeInfo: automaticAssignmentDefaultAssigneeInfo
    })
}
updateDefaultAssignee = (selectedAssignee) => {
    let appSettings = this.props.appSettings
    let prevAssignee = appSettings.defaultConversationAssignee
    // let assignee = `${selectedAssignee.value}`;
    let assignee = {label : `${selectedAssignee.label}`, value: `${selectedAssignee.value}`};
    let selectedRouting = this.state.checkedNotifyEverybody ? ROUTING_RULES_FOR_AGENTS.NOTIFY_EVERYBODY : ROUTING_RULES_FOR_AGENTS.AUTOMATIC_ASSIGNMENT;
    let data ={'defaultConversationAssignee':{} }
    if(selectedRouting) {
        data.defaultConversationAssignee[selectedRouting] = assignee.value;
        data.defaultConversationAssignee[ROUTING_RULES_FOR_AGENTS.NOTIFY_EVERYBODY] = prevAssignee[ROUTING_RULES_FOR_AGENTS.NOTIFY_EVERYBODY];
        this.setState({automaticAssignmentDefaultAssigneeInfo: assignee})
    } else {
        data.defaultConversationAssignee[selectedRouting] = assignee.value;
        data.defaultConversationAssignee[ROUTING_RULES_FOR_AGENTS.AUTOMATIC_ASSIGNMENT]= prevAssignee[ROUTING_RULES_FOR_AGENTS.AUTOMATIC_ASSIGNMENT];
        this.setState({notifyEveryBodyDefaultAssigneeInfo: assignee});
    }
    updateAppSetting(null, data)
    .then(response => {
        appSettings.defaultConversationAssignee = data.defaultConversationAssignee;
        //update store
        this.props.updateAssignee(appSettings);
        Notification.success('Routing rules updated successfully.');
    })
    .catch(err => {
        Notification.warning('There was a problem. Please try again');
    })
}
getAgents = () => {
    let userList = [];
    return Promise.resolve(getUsersByType(this.props.appSettings.applicationId, [USER_TYPE.AGENT, USER_TYPE.ADMIN]))
    .then(data => {
        data.map((user, index) => {
            let name = user.name ? user.name : user.email
            userList.push({ label: name, value: user.userName })
        })
        this.setState({ userList: userList })
        this.updateDefaultAssigneeDetails(userList);
    })
    .catch(err => {
        
    });
}

getIntegratedBots = () => {
    getIntegratedBots().then(response => {
        if (response && response.allBots && response.allBots.length > 0) {
            this.setState({
                listOfBots: response.allBots,
                botsAreAvailable: true
            }, () => {
                this.state.listOfBots.map( bot => {
                    if (parseInt(bot.allConversations) == 1 && parseInt(bot.bot_availability_status) === 1) {
                        this.setState({
                            currentSelectedBot: bot.userName,
                            dropDownBoxTitle: bot.name,
                            // assignConversationToBot: true,
                        })
                    }
                })
            })
        }
    })
}
getRoutingState = () => {
    return Promise.resolve(getAgentandBotRouting()).then(response => {
        let resp = response.data.response;
        resp.botRouting && this.setState({assignConversationToBot:true});
        this.setState({botInAgentAssignedConversation: !resp.removeBotOnAgentHandOff})
        if (response.data.response.agentRouting === 1) {
            this.setState({
                checkedNotifyEverybody: false,
                checkedAutomaticAssignemnt: true,
                preventMultiCallAutoAssignment: true,
                preventMultiCallNotifyEverybody: false
            })
        }
        else {
            this.setState({
                checkedNotifyEverybody: true,
                checkedAutomaticAssignemnt: false,
                preventMultiCallNotifyEverybody: true,
                preventMultiCallAutoAssignment: false
            })
        }
    }).catch(err => {
        console.log("error while fetching routing state/round robin state", err);
    })
}
handleRadioBtnNotifyEverybody = () => {
    this.setState({
        checkedNotifyEverybody: true,
        checkedAutomaticAssignemnt: false
    })
    if (this.state.preventMultiCallNotifyEverybody == false) {
        return Promise.resolve(updateAgentAndBotRouting({agentRouting: ROUTING_RULES_FOR_AGENTS.NOTIFY_EVERYBODY }).then(response => {
            if (response.status === 200 && response.data.code === "SUCCESS") {
                let userSession = CommonUtils.getUserSession();
                userSession.routingState = ROUTING_RULES_FOR_AGENTS.NOTIFY_EVERYBODY;
                CommonUtils.setUserSession(userSession)
                Notification.success('Notify everybody is enabled');
                this.setState({
                    preventMultiCallAutoAssignment: false,
                    preventMultiCallNotifyEverybody: true
                })
            }
        })).catch(err => {
            console.log("error while updating agent routing", err);
        })
    }
}
handleRadioBtnAutomaticAssignment = () => {
    this.setState({
        checkedNotifyEverybody: false,
        checkedAutomaticAssignemnt: true,
    })
    if (this.state.preventMultiCallAutoAssignment == false) {
        return Promise.resolve(updateAgentAndBotRouting({agentRouting: ROUTING_RULES_FOR_AGENTS.AUTOMATIC_ASSIGNMENT }).then(response => {
            if (response.status === 200 && response.data.code === "SUCCESS") {
                let userSession = CommonUtils.getUserSession();
                userSession.routingState = ROUTING_RULES_FOR_AGENTS.AUTOMATIC_ASSIGNMENT;
                CommonUtils.setUserSession(userSession);
                Notification.success('Automatic assignment is enabled');
                this.setState({
                    preventMultiCallAutoAssignment: true,
                    preventMultiCallNotifyEverybody: false
                })
            }
        })).catch(err => {
            console.log("error while updating agent routing", err);
        })
    }
}

toggleConversationAssignment = () => {
    this.setState({
        assignConversationToBot: !this.state.assignConversationToBot
    })
    AnalyticsTracking.acEventTrigger("ac-configured-routing");
    // console.log("state",this.state);
    // let status = !this.state.assignConversationToBot?"enabled":"disabled";
    let status = !this.state.assignConversationToBot
    // let currentSelectedBot = this.state.listOfBots.filter(item =>item.userName==this.state.currentSelectedBot)
    // if(currentSelectedBot.length){
    // botPlatformClient.toggleMute(currentSelectedBot[0].userKey,status).then(data=>{
    //     if(data.code=="success"){
    //         // console.log("bot routing disabled..");
    //     }
    //     })
    // }
    return Promise.resolve(updateAgentAndBotRouting({botRouting: status }).then(response => {
        if (response.status === 200 && response.data.code === "SUCCESS") {
            let userSession = CommonUtils.getUserSession();
            userSession.botRouting = status;
            CommonUtils.setUserSession(userSession);
        }
    })).catch(err => {
        console.log("error while updating bot routing", err);
    })

}

    toggleBotInAgentAssignedConversation = () => {
        return Promise.resolve(updateAgentAndBotRouting({removeBotOnAgentHandOff: this.state.botInAgentAssignedConversation}).then(response => {
            if (response.status === 200 && response.data.code === "SUCCESS") {
                this.setState({
                    botInAgentAssignedConversation: !this.state.botInAgentAssignedConversation
                });
            }
        })).catch(err => {
            console.log("error while updating bot routing", err);
        });
    }

  render() {
      const notifyEverybodyContainer = (
          <div className={this.state.checkedNotifyEverybody ? "row notify-everybody-wrapper active-agent-routing" : "row notify-everybody-wrapper non-active-agent-routing"}>
              <div className="col-radio-btn col-md-1 col-lg-1">
              </div>
              <div className="col-md-11 col-lg-11" style={{marginLeft : "-5px"}}>
                  <h4 className="routing-title">Notify everybody <span className="notify-everybody-sub-title">(recommended for small teams)</span></h4>
                  <p className="routing-description">All conversations will be first assigned to one particular agent by default. Conversation notifications will be sent to the entire team and whoever acts on it first can then take the conversation</p>
              </div>
          </div>
      )
      const automaticAssignmentContainer = (
          <div className={!this.state.checkedNotifyEverybody ? "row notify-everybody-wrapper active-agent-routing" : "row notify-everybody-wrapper non-active-agent-routing"}>
              <div className="col-radio-btn col-md-1 col-lg-1">
              </div>
              <div className="automatic-assignemnt-content col-md-11 col-lg-11">
                {   (CommonUtils.isTrialPlan()) ? <h4 className="routing-title">Automatic assignment</h4> :  (CommonUtils.isStartupPlan()) ? <div className="badge-design">
                    <h4 className="routing-title startup-badge">Automatic assignment</h4> <LockBadge className={"lock-with-text"} text={"Available in Growth Plan"} history={this.props.history} onClickGoTo={"/settings/billing"}/> </div> : <h4 className="routing-title">Automatic assignment</h4>
                }
                  {/* <h4 className="routing-title">Automatic assignment</h4> */}
                  <p className="routing-description">Conversations will be automatically assigned to every online agent on a round robin basis </p>
              </div>
          </div>
    )

    return (
        <div className="animated fadeIn km-conversation-rules-container">
            <div className="km-heading-wrapper">
                <SettingsHeader  />
            </div>
            <div className=" agent-assignment-wrapper row">
                <div className="card col-md-9">
                    <OptionsContainer className="options-wrapper">
                        <Headings>Routing rules for agents</Headings>
                        <SubHeadings>Select from one of the options below</SubHeadings>
                        <form>
                            <div className="km-agent-assignment-radio-container">
                                <RadioButton idRadioButton={'notify-everybody-radio'} handleOnChange={this.handleRadioBtnNotifyEverybody}
                                checked={this.state.checkedNotifyEverybody} label={notifyEverybodyContainer} />
                                { this.state.checkedNotifyEverybody &&
                                    <DefaultAssignee  userList = {this.state.userList} class = {"notify-everybody-dropdown"} name= {"notify-everybody-dropdown"} text = {"Initially assign all new conversations to:"} updateDefaultAssignee = {this.updateDefaultAssignee} selectedAssignee = {this.state.notifyEveryBodyDefaultAssigneeInfo} />
                                }  
                            </div>      
                            <div className="km-agent-assignment-radio-container">
                                    <RadioButton idRadioButton={'automatic-assignemnt-radio'} handleOnChange={this.handleRadioBtnAutomaticAssignment}
                                    checked={this.state.checkedAutomaticAssignemnt} label={automaticAssignmentContainer} disabled={(CommonUtils.isTrialPlan())?false: (CommonUtils.isStartupPlan()) ? true : false}/>
                                {   this.state.checkedAutomaticAssignemnt &&
                                    <DefaultAssignee  userList = {this.state.userList} class = {"automatic-assignment-dropdown"} name= {"automatic-assignment-dropdown"}
                                    text = {"If nobody is in online, then assign all conversations to:"}updateDefaultAssignee = {this.updateDefaultAssignee} 
                                    selectedAssignee = {this.state.automaticAssignmentDefaultAssigneeInfo}/> 
                                }
                            </div> 
                        </form>
                        <div className={this.state.openAgentRoutingRules ? "row":"n-vis"} style={{backgroundColor: "#cce7f8"}}>
                            <span className="km-agent-routing-note-text"><strong>NOTE:</strong> An agent will also be assigned to every conversation irrespective of bot routing rules</span>
                        </div>
                    </OptionsContainer>
                    <Hr />
                </div>
                <div className="card col-md-9">
                    <OptionsContainer>
                        <Headings>Routing rules for bots</Headings>
                        <OptionsWrapper>
                            <TogglerHeading >Assign new conversations to bot</TogglerHeading>
                            <SliderToggle checked={this.state.assignConversationToBot} handleOnChange={this.toggleConversationAssignment} />
                        </OptionsWrapper>
                        <div className={this.state.assignConversationToBot ? "n-vis":"vis"}>
                            <BannerContainer>
                                <div>
                                    {
                                        this.state.botsAreAvailable ?  <Banner indicator={"default"} isVisible={false} text={"You have bots available. Turn this section on to use them in conversations. "}/> : 
                                        <Banner indicator={"warning"} isVisible={false} text={["You do not have any bots available. You may start with your ", <Link key={1} className="routing-bot-link" to="/bot">Bot Integration</Link>,  " or set up your ", <Link key={2} className="routing-bot-link" to="/faq">FAQ</Link>, " section."]}/> 
                                    }
                                </div>
                            </BannerContainer>
                        </div>
                        <div className={!this.state.assignConversationToBot ? "n-vis":null}>
                            <div style={{marginTop: "20px"}}>
                                <p className="km-routing-assign-bot-text-1">All new conversations will be assigned to a single bot only. Other available bots (if any) will remain idle.</p>
                            </div>
                            <OptionsWrapper>
                                <TogglerHeading>Select a bot to handle all new conversations: </TogglerHeading>
                                <div className="drop-down-container">
                                    <DropdownButton title={this.state.dropDownBoxTitle}  className="drop-down-list-of-bots km-button km-button--dropdown" id="#">
                                            {
                                            this.state.listOfBots.map( bot => {
                                                return (
                                                    <MenuItem className="ul-list-of-bots" key={bot.id} onClick={()=>{
                                                        if (parseInt(bot.bot_availability_status) === 1) {
                                                            this.setState({"dropDownBoxTitle":bot.name}, () => {
                                                                if (bot.allConversations == 0) {
                                                                    if(this.state.currentSelectedBot){
                                                                        conversationHandlingByBot(this.state.currentSelectedBot, 0)
                                                                    }
                                                                    conversationHandlingByBot(bot.userName, 1).then(response => {
                                                                        // console.log(response);
                                                                        if(response.data.code === "success"){
                                                                            Notification.info('Conversations assigned to ' + bot.name);
                                                                            window.Aside.loadAgents();
                                                                            this.getIntegratedBots();
                                                                        } else {
                                                                                Notification.info('Conversations not assigned to ' + bot.name)
                                                                        }
                                                                    }).catch(err => {console.log(err)})
                                                                } else if (bot.allConversations == 1) {
                                                                    Notification.info( bot.name + ' is already selected.')
                                                                }
                                                                })
                                                        } else if (parseInt(bot.bot_availability_status) === 0) {
                                                            Notification.warning( bot.name + ' is disabled')
                                                        }
                                                    }}>
                                                        <img src={Diaglflow} style={{ width: "39px", height: "37.5px"}} />
                                                        <span className="bot-name-drop-down-list">{bot.name}</span>
                                                        {
                                                            (parseInt(bot.bot_availability_status) === 1) ? <span style={{marginLeft: '5px'}} className="km-bot-list-of-integrated-bots-badge badge-enabled">Enabled</span>:<span style={{marginLeft: '5px'}} className="km-bot-list-of-integrated-bots-badge badge-disabled">Disabled</span>
                                                        }
                                                    </MenuItem>
                                                )
                                            })
                                        }
                                    </DropdownButton>
                                </div>
                            </OptionsWrapper>
                            <div style={{marginTop: "30px"}}>
                                <div className="see-docs-link-container">
                                    <p className="km-routing-assign-bot-text-3">Want more routing rules for bot assignment? <a className="see-docs-link" href="https://docs.kommunicate.io/docs/web-conversation-assignment" target="_blank" >See Docs <LearnMore color={"#5553B7"} /></a></p>
                                </div>
                            </div>
                        </div>
                    </OptionsContainer>
                    <Hr />
                </div>
                <div className="col-md-9">
                    <OptionsContainer>
                        <Headings>Reply rules for unassigned bots</Headings>

                        <OptionsWrapper>
                            <TogglerHeadingFixedWidth >Allow other bots to reply even after the conversation is assigned to a specific bot or agent</TogglerHeadingFixedWidth>
                            <SliderToggle checked={this.state.botInAgentAssignedConversation} handleOnChange={this.toggleBotInAgentAssignedConversation} />
                        </OptionsWrapper>

                        <BannerContainer>   
                            <Banner indicator={"default"} isVisible={false} text={"NOTE: If enabled, the unassigned bots will also reply to user messages."} />
                        </BannerContainer>
                    </OptionsContainer>
                </div>
            </div>
          </div>
    )
  }
}


const headingColor = css`
    color: #666464;
`;
const subHeadingColor = css`
    color: #9b9b9b;
`;
const lightColor = css`
    color: #807d7d;
`;

const OptionsContainer = styled.div``;

const OptionsWrapper = styled(OptionsContainer)`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;

    & .switch.switch-3d {
        margin-bottom: 4px;
    }
`;

const Headings = styled.h3`
    font-size: 18px;
    font-weight: 500;
    letter-spacing: 1.3px;
    ${headingColor}
    margin-bottom: 25px;
    margin-right: 25px;
`;
const SubHeadings = styled.h5`
    font-size: 16px;
    font-weight: normal;
    letter-spacing: 0.6px;
    ${subHeadingColor}
    margin-bottom: 25px;
    margin-right: 25px;
`;

const TogglerHeading = styled(SubHeadings)`
    ${headingColor}
    margin-bottom: 0;
`;

const TogglerHeadingFixedWidth = styled(TogglerHeading)`
        max-width: 89%;
`;

const Hr = styled.hr`
    width: 100%;
    border-top: 1px solid;
    border-top-color: #cacaca;
    margin-bottom: 30px;
`;
const BannerContainer = styled.div`
    width: 100%;
    margin: 25px auto;
`;



const mapStateToProps = state => ({
    appSettings : state.application 
  });
const mapDispatchToProps = dispatch => ({
    updateAssignee: payload => dispatch(Actions.saveAppSettings(payload))
}) ;
  
export default connect(mapStateToProps, mapDispatchToProps)(AgentAssignemnt)
