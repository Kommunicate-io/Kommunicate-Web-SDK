import React, { Component } from 'react'
import './AgentAssignment.css';
import Notification from '../model/Notification';
import RadioButton from '../../components/RadioButton/RadioButton';
import { enableNotifyEveryBody, enableAutomaticAssignment, getCustomerByApplicationId} from '../../utils/kommunicateClient'
import axios from 'axios';
import { ROUND_ROUBIN } from './Constants.js';
import CommonUtils from '../../utils/CommonUtils';

class AgentAssignemnt extends Component{
    constructor(props) {
        super(props);
        this.state = {
            checked: 1,
            checkedNotifyEverybody:1,
            checkedAutomaticAssignemnt:0,
            preventMultiCallAutoAssignment:false,
            preventMultiCallNotifyEverybody:false
        };

    }
componentWillMount (){
    this.getRoutingState();
}
getRoutingState = () => {
    return Promise.resolve(getCustomerByApplicationId()).then(response => {
        if (response.data.data.agentRouting === 1) {
            this.setState({
                checkedNotifyEverybody: 0,
                checkedAutomaticAssignemnt: 1,
                preventMultiCallAutoAssignment: true,
                preventMultiCallNotifyEverybody: false
            })
        }
        else {
            this.setState({
                checkedNotifyEverybody: 1,
                checkedAutomaticAssignemnt: 0,
                preventMultiCallNotifyEverybody: true,
                preventMultiCallAutoAssignment: false
            })
        }
    }).catch(err => {
        console.log("error while fetching routing state/round roubin state", err);
    })
}
handleRadioBtnNotifyEverybody = () => {
    this.setState({
        checkedNotifyEverybody: 1,
        checkedAutomaticAssignemnt: 0
    })
    if (this.state.preventMultiCallNotifyEverybody == false) {
        enableNotifyEveryBody({ routingState: ROUND_ROUBIN.DISABLE }).then(response => {
            if (response.status === 200 && response.data.code === "SUCCESS") {
                let userSession = CommonUtils.getUserSession();
                userSession.routingState = ROUND_ROUBIN.DISABLE;
                CommonUtils.setUserSession(userSession)
                Notification.success('Notify everybody is enabled');
                this.setState({
                    preventMultiCallAutoAssignment: false,
                    preventMultiCallNotifyEverybody: true
                })
            }
        })
    }
}
handleRadioBtnAutomaticAssignment = () => {
    this.setState({
        checkedNotifyEverybody: 0,
        checkedAutomaticAssignemnt: 1,
    })
    if (this.state.preventMultiCallAutoAssignment == false) {
        enableAutomaticAssignment({ routingState: ROUND_ROUBIN.ENABLE }).then(response => {
            if (response.status === 200 && response.data.code === "SUCCESS") {
                let userSession = CommonUtils.getUserSession();
                userSession.routingState = ROUND_ROUBIN.ENABLE;
                CommonUtils.setUserSession(userSession);
                Notification.success('Automatic assignment is enabled');
                this.setState({
                    preventMultiCallAutoAssignment: true,
                    preventMultiCallNotifyEverybody: false
                })
            }
        })
    }
}


  render() {
      const notifyEverybodyContainer = (
          <div className={this.state.checkedNotifyEverybody ? "row notify-everybody-wrapper active-agent-routing" : "row notify-everybody-wrapper non-active-agent-routing"}>
              <div className="col-radio-btn col-md-1 col-lg-1">
              </div>
              <div className="col-md-11 col-lg-11">
                  <h4 className="routing-title">Notify everybody <span className="notify-everybody-sub-title">(recommended for small teams)</span></h4>
                  <p className="routing-description">Message notification will be sent to the entire team and whoever acts on it first is assigned the conversation</p>
              </div>
          </div>
      )
      const automaticAssignmentContainer = (
          <div className={!this.state.checkedNotifyEverybody ? "row notify-everybody-wrapper active-agent-routing" : "row notify-everybody-wrapper non-active-agent-routing"}>
              <div className="col-radio-btn col-md-1 col-lg-1">
              </div>
              <div className="col-md-11 col-lg-11">
                  <h4 className="routing-title">Automatic assignment </h4>
                  <p className="routing-description">All new conversations will be automatically assigned to each agent on a round robin basis.</p>
              </div>
          </div>
    )

    return (
        <div className="col-md-8 col-sm-12">
            <div className="card-block">
                <div className="row agent-assignment-wrapper">
                    <h4 className="agent-assignment-title">Set up the way you want conversations to be assigned among your team members</h4>
                    <div className="options-wrapper">
                        <h4 className="options-wrapper-title">Select from one of the options below </h4>
                        <form>
                            <RadioButton idRadioButton={'notify-everybody-radio'} handleOnChange={this.handleRadioBtnNotifyEverybody}
                                checked={this.state.checkedNotifyEverybody} label={notifyEverybodyContainer} />
                            <RadioButton idRadioButton={'automatic-assignemnt-radio'} handleOnChange={this.handleRadioBtnAutomaticAssignment}
                                checked={this.state.checkedAutomaticAssignemnt} label={automaticAssignmentContainer} />
                        </form>
                    </div>
                </div>
            </div>
        </div>             
    )
  }
}

export default AgentAssignemnt;
