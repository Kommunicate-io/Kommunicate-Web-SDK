import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios';
import  {getConfig,getEnvironmentId,get} from '../../config/config.js';
import Notification from '../model/Notification';
import {getUsersByType,createCustomerOrAgent, callSendEmailAPI, getIntegratedBots, patchUserInfo} from '../../utils/kommunicateClient';
import CommonUtils from '../../utils/CommonUtils';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import uuid from 'uuid/v1';
import SliderToggle from '../../components/SliderToggle/SliderToggle';

class Tabs extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: '1',
      faqModal: false,
      botEnabled: false
    };

    let userSession = CommonUtils.getUserSession();
    this.applicationId = userSession.application.applicationId;

    this.toggle = this.toggle.bind(this);

  }

  toggle = (tab) =>  {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  toggleBotAvailability = () => {
    this.setState({
      botEnabled: !this.state.botEnabled
    })
  }

  toggleFaqModal = () => {
    this.setState({
      faqModal: !this.state.faqModal
    })
  }

  render() {
    return (
      <div className="animated fadeIn" >
      {/* Change showNewBot to false to hide new bot section*/}
        <div className="card">
          <div className="card-block">
            <div style={{width: "60%", margin: "0 auto"}}>
              <div className="row">
                <div className="col-sm-12 km-bot-integration-heading">
                  <p>Integrating a bot will allow you to send answers to some customer <br />queries automatically</p>
                </div>
              </div>
              <div className="mt-4 km-bot-integrated-bots-container">
                <div style={{padding: "10px"}}>
                  <span className="km-bot-integrated-bots-container-heading">My Integrated Bots:</span>
                  <SliderToggle checked={this.state.botEnabled} handleOnChange={this.toggleBotAvailability}/>
                </div>
              </div>
              <div className="row mt-4">
                <button className="btn btn-primary" onClick={this.toggleFaqModal}>
                  + Add a FAQ
                </button>
              </div>
              <div className="row mt-4 km-bot-integration-second-container">
                
              </div>
            </div>
          </div>
        </div>
        <Modal isOpen={this.state.faqModal} toggle={this.toggleFaqModal} className="modal-dialog">
          <ModalHeader toggle={this.toggleFaqModal}>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <label className="col-sm-3">Title:</label>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <input type="text" name="hf-password" className="form-control input-field"/>
              </div>
            </div>
            <div className="row">
              <label className="col-sm-3">FAQ Content:</label>
            </div>
            <div className="row">
              <div className="col-md-12">
                <textarea rows="10" type="text" name="hf-password" className="form-control"/>
              </div>
            </div>
            <div className="row mt-4" style={{"borderTop": "1px solid black"}}>
              <div className="col-sm-6">
              </div> 
              <div className="col-sm-3 text-right">
                <button className="btn btn-outline-primary" onClick={ () => {this.toggleDeleteBotIntegrationModal();}}>
                  Delete
                </button>
              </div>
              <div className="col-sm-3 text-right">
                <button className="btn btn-primary" onClick={this.saveEditedBotDetails}>
                  Save
                </button>
              </div> 
            </div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default Tabs;