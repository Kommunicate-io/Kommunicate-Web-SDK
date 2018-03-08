import React, { Component } from 'react'
import './AgentAssignment.css';
import Notification from '../model/Notification';
import RadioButton from '../../components/RadioButton/RadioButton';

import axios from 'axios';

class AgentAssignemnt extends Component{
  constructor(props){
    super(props);
    this.state = {
        checked:1
    };
    
  }
handleRadioButton = () => {
    this.setState({
            checked: !this.state.checked
    })
    if (this.state.checked === 1) {
        // enableNotifyEveryBody({checked:this.state.checked}).then(result => {
        //     if(result == ){
        //       Notification.success('Away Mesages Enabled');
        //       this.setState({status: 1});
        //     }
        //   })
    }
    else {
        // enableAutomaticAssignment({checked:this.state.checked}).then(result => {
        //     if(result == ){
        //       Notification.success('Away Mesages Enabled');
        //       this.setState({status: 1});
        //     }
        //   })
    }

}
  render() {
      const notifyEverybodyContainer = (
          <div className={this.state.checked ? "row notify-everybody-wrapper active-agent-routing" : "row notify-everybody-wrapper non-active-agent-routing"}>
              <div className="col-radio-btn col-md-1 col-lg-1">
              </div>
              <div className="col-md-11 col-lg-11">
                  <h4 className="routing-title">Notify everybody <span className="notify-everybody-sub-title">(recommended for small teams)</span></h4>
                  <p className="routing-description">Message notification will be sent to the entire team and whoever acts on it first is assigned the conversation</p>
              </div>
          </div>
      )
      const automaticAssignmentContainer = (
          <div className={!this.state.checked ? "row notify-everybody-wrapper active-agent-routing" : "row notify-everybody-wrapper non-active-agent-routing"}>
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
                            <RadioButton idRadioButton={'agent-routing-1'} handleOnChange={this.handleRadioButton } checked={this.state.checked} label={notifyEverybodyContainer} />
                            <RadioButton idRadioButton={'agent-routing'}   handleOnChange={this.handleRadioButton} checked={!this.state.checked} label={automaticAssignmentContainer} />
                        </form>
                        
                        {/* <div className="row notify-everybody-wrapper">   
                            <div className="col-md-1 col-lg-1">
                            </div>
                            <div className="col-md-11 col-lg-11">
                                <h4 className="notify-everybody-title">Notify everybody</h4>
                                <p className="notify-everybody-description">Message notification will be sent to the entire team and whoever acts on it first is assigned the conversation</p>
                            </div>   
                        </div> */}
                    </div>
                </div>
            </div>
        </div> 
                
    )
  }
}

export default AgentAssignemnt;
