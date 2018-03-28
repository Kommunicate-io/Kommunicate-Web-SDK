import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { TabContent, TabPane, Nav, NavItem, NavLink, FormGroup, Label, Input} from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios';
import {getConfig,getEnvironmentId,get} from '../../config/config.js';
import Notification from '../model/Notification';
import {createSuggestions, getSuggestionsByCriteria, deleteSuggestionsById, updateSuggestionsById} from '../../utils/kommunicateClient';
import CommonUtils from '../../utils/CommonUtils';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import uuid from 'uuid/v1';
import SliderToggle from '../../components/SliderToggle/SliderToggle';
import bot1x from './images/bot-icon.png';
import bot2x from './images/bot-icon@2x.png';
import bot3x from './images/bot-icon@3x.png';
import {Link} from 'react-router-dom';


class Tabs extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: '1',
      faqModal: false,
      botEnabled: false,
      faqTitle: "",
      faqContent: "",
      showDeleteFaq: false,
      isDraft: true,
      isPublished: false,
      listOfFAQs: [],
      faqId: null
    };

    let userSession = CommonUtils.getUserSession();
    this.applicationId = userSession.application.applicationId;

    this.toggle = this.toggle.bind(this);

  }

  componentDidMount=()=>{

    this.getFaqsWrapper()

  }

  getFaqsWrapper = () => {

    getSuggestionsByCriteria(this.applicationId, 'type', 'faq').then(response => {
      console.log(response)
      if(response.code === 'GOT_ALL_SUGGESTIONS_BY_CRITERIA_type'){
        this.setState({
          listOfFAQs :  response.data ? response.data : []
        }, () => {
          console.log(this.state.listOfFAQs)
        })
      }
    }).catch(err => {console.log(err)});
  }

  toggle = (tab) =>  {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  clearFAQDetails = () => {
    this.setState({
      faqContent: '',
      faqTitle: '',
      faqId: null
    })
  }

  setFAQDetails = (title, content, status, id) => {
    this.setState({
      faqId: id,
      faqContent: content,
      faqTitle: title,
      isDraft: status == "draft" ? true:false,
      isPublished: status == "published" ? true:false,
      faqModal: !this.state.faqModal,
    }, () => {console.log(this.state)})
  }

  toggleBotAvailability = () => {
    this.setState({
      botEnabled: !this.state.botEnabled
    })
  }

  toggleFaqModal = () => {
    this.setState({
      faqModal: !this.state.faqModal,
      showDeleteFaq: false
    }, this.clearFAQDetails)
  }

  createFAQ = () => {

    if(this.state.faqTitle == "" || this.state.faqTitle.trim() == "" || !this.state.faqTitle){
      Notification.info("Title is missing")
      return
    } else if (this.state.faqContent == "" || this.state.faqContent.trim() == "" || !this.state.faqContent){
      Notification.info("Content is missing")
      return
    }

    let userSession = CommonUtils.getUserSession();

    const suggestion = {
      applicationId: userSession.application.applicationId,
      userName: userSession.userName,
      name: this.state.faqTitle,
      content: this.state.faqContent,
      category: 'faq',
      type: 'faq',
      status: this.state.isDraft ? 'draft':'published'
    }

    createSuggestions(suggestion)
      .then(response => {
        if (response.status === 200 && response.data.code === "SUGESSTION_CREATED") {
          Notification.info("FAQ created")
        } else {
          Notification.info("There was problem in creating the faq.");
        }}).then(response => {
          this.getFaqsWrapper()
        }).then(response => {
          this.toggleFaqModal()
        }).catch(err => {
          console.log(err)
        })
  }

  toggleDeleteFaq = () => {

    if(this.state.faqId === null){
      Notification.info("Nothing to delete");
      return;
    }

    this.setState({
      showDeleteFaq: !this.state.showDeleteFaq
    })
  }

  deleteFaq = () => {

    if(this.state.faqId === null){
      Notification.info("Nothing to delete");
      return;
    }

    let suggestion = {
      data: {
        id: parseInt(this.state.faqId)
      }
    }

    deleteSuggestionsById(suggestion)
      .then(response => {
        Notification.info("Deleted successfully");
      }).then(response => {
        this.getFaqsWrapper()
      }).then(response => {
        this.toggleFaqModal()
      }).catch(err => {console.log(err)})
  }

  updateFaq = () => {

    if(!this.state.faqTitle){
      Notification.info("Title is missing")
      return
    } else if (!this.state.faqContent){
      Notification.info("Content is missing")
      return
    } 

    let suggestion = {
        id: parseInt(this.state.faqId),
        name: this.state.faqTitle,
        content: this.state.faqContent,
        category: 'faq',
        status: this.state.isDraft ? 'draft':'published'
    }

    updateSuggestionsById(suggestion).then(response => {
      Notification.info("Updated successfully");
    }).then(response => {
      this.getFaqsWrapper()
    }).then(response => {
      this.toggleFaqModal()
    }).catch(err => {console.log(err)})

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
              <div className="mt-4 km-faq-second-container">
                <div style={{padding: "10px"}}>
                  <p>
                  <img src={bot1x} style={{marginRight: "26px"}}/>
                  <span className="km-bot-integrated-bots-container-heading">Want to use the FAQs in a conversation as automatic replies? </span>
                  </p>
                  <p>
                  <span>Select &nbsp;<span style={{border:"1px dashed #c8c2c2", padding: "5px"}}><img src={bot1x} style={{widht: "17px", height: "18.4px"}}/> &nbsp;FAQ Bot&nbsp; </span> &nbsp;from the bot list in <span style={{color: "#5c5aa7", fontWeight: "500", cursor: "pointers"}}> <Link to="/agent-assignment">Conversation Routing </Link>  </span> to assign this bot to all new conversations. Bot will reply to customer queries with matching FAQs.</span>
                  </p>
                </div>
              </div>
              <div className="row mt-4">
                <button className="km-button km-button--primary" onClick={this.toggleFaqModal}>
                  + Add a FAQ
                </button>
              </div>
              <div className={this.state.listOfFAQs.length > 0 ? "mt-4 km-faq-container":"n-vis"}>
                <div className="col-sm-12 mt-4" style={{borderBottom: "1px solid #c8c2c2", height: "35px", paddingTop: "0.4rem"}}>
                  <span>{"FAQs (" + this.state.listOfFAQs.length + ")"}</span>
                </div>
                <div className={this.state.listOfFAQs.length > 0 ? "km-bot-list-of-faqs-container":"n-vis"}>
                  {this.state.listOfFAQs.map(faq => (
                    <div key={faq.id} className="row km-bot-align-item-v-center" onClick={() => this.setFAQDetails(faq.name, faq.content, faq.status.toLowerCase(), faq.id)} style={{cursor: "pointer"}}>
                      <div className="col-sm-2">
                        { 
                          faq.status.toLowerCase() == "published" ? <span className="km-bot-list-of-integrated-bots-badge badge-enabled">PUBLISHED</span> : <span className="km-bot-list-of-integrated-bots-badge badge-disabled">DRAFT</span>
                        }
                      </div>
                      <div className="col-sm-10" style={{textAlign: "left"}}>
                          {faq.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal isOpen={this.state.faqModal} toggle={this.toggleFaqModal} className="modal-dialog">
          <ModalHeader toggle={this.toggleFaqModal}>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <label className="col-sm-12 km-faq-label">Title:</label>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <input type="text" name="faq-title" className="form-control input-field" placeholder="Enter your FAQ title here" value={this.state.faqTitle} onChange={(e) => {this.setState({faqTitle:e.target.value})}} />
              </div>
            </div>
            <div className="row mt-4">
              <label className="col-sm-12 km-faq-label">FAQ Content:</label>
            </div>
            <div className="row">
              <div className="col-md-12">
                <textarea rows="10" style={{"borderRadius": "4px"}} type="text" name="faq-content" placeholder="Enter your FAQ content here" className="form-control" value={this.state.faqContent} onChange={(e) => {this.setState({faqContent:e.target.value})}} />
              </div>
            </div>
            <div className={this.state.showDeleteFaq ? "n-vis":"row mt-4"} style={{borderTop: "1px solid #c8c2c2", paddingTop: "8px"}}>
              <div className="col-sm-2 km-bot-align-item-v-center">
                <div style={{border: "1px solid black", borderRadius: "50%", padding: "5px"}} onClick={this.toggleDeleteFaq}>
                  <i className="icon-trash icons font-1xl d-block"></i>
                </div>
              </div> 
              <div className="text-right km-bot-align-item-v-center" style={{width: "47%"}}>
                <span>Status : </span>
                <div className="km-bot-align-item-v-center">
                  <Label check htmlFor="inline-radio1">
                    <Input type="radio" id="inline-radio1" name="inline-radios" value="option1" checked={this.state.isDraft} onChange={() => {this.setState({isPublished: false, isDraft: true})}}/> Draft
                  </Label>
                  <Label check htmlFor="inline-radio2">
                    <Input type="radio" id="inline-radio2" name="inline-radios" value="option2" checked={this.state.isPublished} onChange={() => {this.setState({isPublished: true, isDraft: false})}}/> Published
                  </Label>
                </div>
              </div> 
              <div className="col-sm-2 text-right">
                <button className="km-button km-button--secondary" onClick={this.toggleFaqModal}>
                  Discard 
                </button>
              </div>
              <div className="col-sm-2 text-right">
                <button className="km-button km-button--primary" onClick={ this.state.faqId === null ? this.createFAQ:this.updateFaq }>
                  Save
                </button>
              </div> 
            </div>
            <div className={this.state.showDeleteFaq ? "row mt-4":"n-vis"} style={{borderTop: "1px solid #c8c2c2", paddingTop: "8px"}}> 
              <div className="col-sm-6 text-left km-bot-align-item-v-center" style={{width: "47%"}}>
                <span>Do you want to delete this FAQ?</span>
              </div> 
              <div className="col-sm-4 text-right">
                <button className="km-button km-button--secondary" onClick={ () => {this.deleteFaq();}}>
                  Yes, Delete
                </button>
              </div>
              <div className="col-sm-2 text-right">
                <button className="km-button km-button--primary" onClick={this.toggleDeleteFaq}>
                  No
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