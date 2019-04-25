import React, { Component } from 'react';
import { Label, Input} from 'reactstrap';
import Notification from '../model/Notification';
import {createSuggestions, getSuggestionsByCriteria, deleteSuggestionsById, updateSuggestionsById} from '../../utils/kommunicateClient';
import CommonUtils from '../../utils/CommonUtils';
import { Modal as FaqModal, ModalBody } from 'reactstrap';
import bot2x from './images/bot-icon@2x.png';
import trash2x from './images/trash-icon@2x.png';
import {AUTOREPLY} from '../Autoreply/Constant';
import TickIcon from '../Integrations/images/tick.png';
import Modal  from 'react-responsive-modal'  ;
import IntegrationDescription from '../Integrations/IntegrationDescription.js';
import { getThirdPartyListByApplicationId }  from '../../utils/kommunicateClient'
import CloseButton from './../../components/Modal/CloseButton.js';
import AnalyticsTracking from '../../utils/AnalyticsTracking.js';
import EventMessageClient from '../../utils/EventMessageClient.js'
import ReactQuill from 'react-quill';
import './ReactQuill.css';
import './LizSVG';
import { LearnMore } from './LizSVG';
import { connect } from 'react-redux';
import * as Actions from '../../actions/applicationAction';
import { SettingsHeader } from '../../components/SettingsComponent/SettingsComponents';


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
      faqId: null,
      modalIsOpen:false,
      helpdocsKey:[],
      addFaqSectionCheck: false,
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    let userSession = CommonUtils.getUserSession();
    this.applicationId = userSession.application.applicationId;

    this.toggle = this.toggle.bind(this);

  }

  componentDidMount=()=>{
    this.getFaqsWrapper();
    this.getThirdPartyList();
  }

  getFaqsWrapper = () => {

    getSuggestionsByCriteria(this.applicationId, 'type', 'faq').then(response => {
      // console.log(response)
      if(response.code === 'GOT_ALL_SUGGESTIONS_BY_CRITERIA_type'){
        var faqList = response.data ? response.data : [];
        this.setState({
          listOfFAQs : faqList
        })
        this.props.updateFaqListInAppSettings(faqList);
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
  getThirdPartyList = () =>{
    return Promise.resolve(getThirdPartyListByApplicationId()).then(response =>{
      let helpdocsKey = response.data.message.filter(function (integration) {
        return integration.type == 1;
      });
      this.setState({
        helpdocsKey:helpdocsKey
      })
        
    }).catch(err => {
        console.log("Error while fetching third patry intgration list", err);
    })
}

  openModal = (event) => {
    this.setState({
        modalIsOpen: true
    });
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  }
  setFAQDetails = (title, content, status, id) => {
    this.setState({
      addFaqSectionCheck : false,
      faqId: id,
      faqContent: content,
      faqTitle: title,
      isDraft: status == "draft" ? true:false,
      isPublished: status == "published" ? true:false,
      faqModal: !this.state.faqModal,
    })
  }

  toggleBotAvailability = () => {
    this.setState({
      botEnabled: !this.state.botEnabled
    })
  }

  toggleFaqModal = () => {
    this.setState({
      addFaqSectionCheck : true,
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
      category: AUTOREPLY.FAQ,
      type: AUTOREPLY.FAQ,
      status: this.state.isDraft ? 'draft':'published'
    }

    createSuggestions(suggestion)
      .then(response => {
        if (response.status === 200 && response.data.code === "SUGGESTION_CREATED") {
          Notification.info("FAQ created")
        } else {
          Notification.info("There was problem in creating the faq.");
        }}).then(response => {
          if (this.state.listOfFAQs.length == 0) {
            EventMessageClient.sendEventMessage('ac-created-faq');
          }
          this.getFaqsWrapper()
        }).then(response => {
          this.toggleFaqModal()
        }).catch(err => {
          console.log(err)
        })
      AnalyticsTracking.acEventTrigger('ac-created-faq');
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
     let userSession = CommonUtils.getUserSession();
    let suggestion = {
      data: {
        id: parseInt(this.state.faqId),
        applicationId:userSession.application.applicationId
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

  modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link']
    ],
  }

  render() {
    return (
      <div className="animated fadeIn" >

        <div className="km-heading-wrapper">
					<SettingsHeader  />
        </div>

      {/* Change showNewBot to false to hide new bot section*/}
        <div className="card">
          <div className="card-block">
            <div style={{width: "90%", margin: "0 17px"}}>
              <div className="mt-4 km-faq-second-container">
                <div style={{padding: "10px"}}>
                  <p>
                  <img src={bot2x} style={{marginRight: "26px", widht: "24px", height: "26px"}}/>
                  <span className="km-bot-integrated-bots-container-heading">Want to use the FAQs in a conversation as automatic replies? </span>
                  </p>
                  <p className="km-bot-integration-instruction" >Read instructions for opening chat with FAQ Bot (botId: liz)
                    <a className="km-bot-instruction-link" target="_blank" href="https://docs.kommunicate.io/docs/web-botintegration.html"> here </a> </p>
                </div>
              </div>
              <div className="row mb-4 faq-btn-wrapper">
                <button className="km-button km-button--primary" onClick={this.toggleFaqModal}>
                  + Add FAQ
                </button>
                <Modal open={this.state.modalIsOpen} onClose={this.closeModal} >
                  <div>
                    <IntegrationDescription activeModal={"helpdocs"} handleCloseModal={this.closeModal} 
                      getThirdPartyList = {this.getThirdPartyList} helpdocsKeys={this.state.helpdocsKey}/> 
                  
                  </div>
                </Modal>
              </div>
              <div className={this.state.listOfFAQs.length > 0 ? "km-faq-container":"n-vis"}>
                <div className="col-sm-12" style={{borderBottom: "1px solid #c8c2c2", height: "35px", paddingTop: "0.4rem"}}>
                  <span>{"FAQs (" + this.state.listOfFAQs.length + ")"}</span>
                </div>
                <div className={this.state.listOfFAQs.length > 0 ? "km-bot-list-of-faqs-container":"n-vis"}>
                  {this.state.listOfFAQs.slice(0).reverse().map(faq => (
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
        <FaqModal isOpen={this.state.faqModal} toggle={this.toggleFaqModal} className="modal-dialog modal-dialog--add-faq-modal">          
            <h4 className="faq-modal-title km-faq-heading-section">FAQ</h4>      
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
                <ReactQuill theme="snow" value={this.state.faqContent}
                  onChange={(value) => {this.setState({faqContent: value})}} modules={this.modules} />
              </div>
            </div>
            <div className={this.state.showDeleteFaq ? "n-vis":"row mt-4"} style={{borderTop: "1px solid #c8c2c2", paddingTop: "8px"}}>
              <div className={this.state.addFaqSectionCheck ?"n-vis":"col-sm-1 km-bot-align-item-v-center"}>
                <div onClick={this.toggleDeleteFaq}>
                  <img src={trash2x} style={{width: "22px", height: "22px"}}/>
                </div>
              </div> 
              <div className="text-right km-bot-align-item-v-center" style={{width: "47%"}}>
                <div style={{width: "33%", marginRight: "5px"}}>
                  <span className="km-faq-label-14-500">Status: </span>
                </div>
                <div className="km-bot-align-item-v-center" style={{width: "66%"}}>
                  <Label check htmlFor="inline-radio1" style={{marginRight: "5px"}}>
                    <Input type="radio" id="inline-radio1" name="inline-radios" value="option1" checked={this.state.isDraft} onChange={() => {this.setState({isPublished: false, isDraft: true})}}/> <span className="km-faq-label-14">Draft</span>
                  </Label>
                  <Label check htmlFor="inline-radio2">
                    <Input type="radio" id="inline-radio2" name="inline-radios" value="option2" checked={this.state.isPublished} onChange={() => {this.setState({isPublished: true, isDraft: false})}}/> <span className="km-faq-label-14">Published</span>
                  </Label>
                </div>
              </div> 
              <div className={this.state.addFaqSectionCheck ? "col-sm-2 text-right faq-modal-discard-btn-box-shift":"col-sm-2 text-right faq-modal-discard-btn-box"} >
                <button className="km-button km-button--secondary" onClick={this.toggleFaqModal}>
                  Discard 
                </button>
              </div>
              <div className="col-sm-2 text-right">
                <button className="km-button km-button--primary faq-modal-save-btn" onClick={ this.state.faqId === null ? this.createFAQ:this.updateFaq }>
                  Save
                </button>
              </div> 
            </div>
            <div className={this.state.showDeleteFaq ? "row mt-4":"n-vis"} style={{borderTop: "1px solid #c8c2c2", paddingTop: "8px"}}> 
              <div className="col-sm-6 text-left km-bot-align-item-v-center" style={{width: "47%"}}>
                <span>Do you want to delete this FAQ?</span>
              </div> 
              <div className="col-sm-4 text-right faq-yes-delete-box">
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
          <CloseButton  onClick={this.toggleFaqModal}  />
        </FaqModal>

      </div>
    )
  }
}


// export default Tabs;

const mapDispatchToProps = dispatch => ({
  updateFaqListInAppSettings: payload => dispatch(Actions.updateApplicationData('FAQ_LIST', payload))
}) ;

export default connect(null, mapDispatchToProps)(Tabs);