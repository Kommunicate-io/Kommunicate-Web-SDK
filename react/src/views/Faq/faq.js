import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { TabContent, TabPane, Nav, NavItem, NavLink, FormGroup, Label, Input} from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios';
import  {getConfig,getEnvironmentId,get} from '../../config/config.js';
import Notification from '../model/Notification';
import {getUsersByType,createCustomerOrAgent, callSendEmailAPI, getIntegratedBots, patchUserInfo} from '../../utils/kommunicateClient';
import CommonUtils from '../../utils/CommonUtils';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import uuid from 'uuid/v1';
import SliderToggle from '../../components/SliderToggle/SliderToggle';
import bot1x from './images/bot-icon.png';
import bot2x from './images/bot-icon@2x.png';
import bot3x from './images/bot-icon@3x.png';

class Tabs extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: '1',
      faqModal: false,
      botEnabled: false,
      faqTitle: "",
      faqContent: "",
      showDeleteFaq: false
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
                  <p>FAQs help customers find answers faster through self service, and also reduce workload of your team</p>
                </div>
              </div>
              <div className="mt-4 km-bot-integrated-bots-container">
                <div style={{padding: "10px"}}>
                  <p>
                  <img src={bot1x} style={{marginRight: "26px"}}/>
                  <span className="km-bot-integrated-bots-container-heading">Want to use the FAQs in a conversation as automatic replies? </span>
                  </p>
                  <p>
                  <span>Select &nbsp;<span style={{border:"1px dashed #c8c2c2", padding: "5px"}}><img src={bot1x} style={{widht: "17px", height: "18.4px"}}/> &nbsp;FAQ Bot&nbsp; </span> &nbsp;from the bot list in <span style={{color: "#5c5aa7"}}> Conversation Routing </span> to assign this bot to all new conversations. Bot will reply to customer queries with matching FAQs.</span>
                  </p>
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
                <input type="text" name="faq-title" className="form-control input-field" value={this.state.faqTitle} onChange={(e) => {this.setState({faqTitle:e.target.value})}}/>
              </div>
            </div>
            <div className="row mt-4">
              <label className="col-sm-3">FAQ Content:</label>
            </div>
            <div className="row">
              <div className="col-md-12">
                <textarea rows="10" style={{"borderRadius": "4px"}} type="text" name="faq-content" className="form-control" value={this.state.faqContent} onChange={(e) => {this.setState({faqContent:e.target.value})}}/>
              </div>
            </div>
            <div className={this.state.showDeleteFaq ? "n-vis":"row mt-4"} style={{borderTop: "1px solid #c8c2c2", paddingTop: "8px"}}>
              <div className="col-sm-2">
                <i className="icon-trash icons font-1xl d-block"></i>
              </div> 
              <div className="col-sm-6 text-right">
                <span>Status : </span>
                <FormGroup check className="form-check-inline">
                  <Label check htmlFor="inline-radio1">
                    <Input type="radio" id="inline-radio1" name="inline-radios" value="option1"/> Draft
                  </Label>
                  <Label check htmlFor="inline-radio2">
                    <Input type="radio" id="inline-radio2" name="inline-radios" value="option2"/> Published
                  </Label>
                </FormGroup>
              </div> 
              <div className="col-sm-2 text-right">
                <button className="btn btn-outline-primary" onClick={ () => {this.setState({showDeleteFaq: !this.state.showDeleteFaq})}}>
                  Delete
                </button>
              </div>
              <div className="col-sm-2 text-right">
                <button className="btn btn-primary" onClick={this.saveEditedBotDetails}>
                  Save
                </button>
              </div> 
            </div>
            <div className={this.state.showDeleteFaq ? "row mt-4":"n-vis"} style={{borderTop: "1px solid #c8c2c2", paddingTop: "8px"}}> 
              <div className="col-sm-6 text-left">
                <span>Do you want to delete this FAQ?</span>
              </div> 
              <div className="col-sm-4 text-right">
                <button className="btn btn-outline-primary" onClick={ () => {this.toggleDeleteBotIntegrationModal();}}>
                  Yes, Delete
                </button>
              </div>
              <div className="col-sm-2 text-right">
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