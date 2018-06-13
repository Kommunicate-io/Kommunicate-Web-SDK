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
import {Button, Modal as FaqModal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import uuid from 'uuid/v1';
import SliderToggle from '../../components/SliderToggle/SliderToggle';
import bot1x from './images/bot-icon.png';
import bot2x from './images/bot-icon@2x.png';
import bot3x from './images/bot-icon@3x.png';
import {Link} from 'react-router-dom';
import trash2x from './images/trash-icon@2x.png';
import {AUTOREPLY} from '../Autoreply/Constant';
import HelpdocsLogo from '../Integrations/images/helpdocs.png';
import TickIcon from '../Integrations/images/tick.png';
import { thirdPartyList } from '../Integrations/ThirdPartyList';
import Modal  from 'react-responsive-modal'  ;
import IntegrationDescription from '../Integrations/IntegrationDescription.js';
import { getThirdPartyListByApplicationId }  from '../../utils/kommunicateClient'
import LockBadge from '../../components/LockBadge/LockBadge';

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
      category: AUTOREPLY.FAQ,
      type: AUTOREPLY.FAQ,
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



  render() {
    return (
      <div className="animated fadeIn" >
      {/* Change showNewBot to false to hide new bot section*/}
        <div className={((CommonUtils.getDaysCount() < 31 ) && (typeof CommonUtils.getUserSession().subscription === 'undefined' || CommonUtils.getUserSession().subscription == '' || CommonUtils.getUserSession().subscription == '0' || CommonUtils.getUserSession().subscription === "startup")) ? "card" : "n-vis"}>
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
                  <img src={bot2x} style={{marginRight: "26px", widht: "24px", height: "26px"}}/>
                  <span className="km-bot-integrated-bots-container-heading">Want to use the FAQs in a conversation as automatic replies? </span>
                  </p>
                  <p className="km-bot-integration-instruction" >Read instructions for opening chat with FAQ Bot (botId: liz)
                    <a className="km-bot-instruction-link" target="_blank" href="https://docs.kommunicate.io/docs/web-botintegration.html"> here </a> </p>
                  {/* <p>
                  <span>Select &nbsp;<span style={{border:"1px dashed #c8c2c2", padding: "5px"}}>
                  <img src={bot2x} style={{width: "17px", height: "18.4px"}}/> &nbsp;FAQ Bot&nbsp; </span> 
                  &nbsp;from the bot list in <span style={{color: "#5c5aa7", fontWeight: "500", cursor: "pointers"}}> 
                  <Link className="faq-converstion-routing-link" to="/settings/agent-assignment">Conversation Routing </Link>  </span> 
                  to assign this bot to all new conversations. Bot will reply to customer queries with matching FAQs.</span>
                  </p> */}
                </div>
              </div>
              <div className="row mt-4 faq-btn-wrapper">
                <button className="km-button km-button--primary" onClick={this.toggleFaqModal}>
                  + Add FAQ
                </button>
                <div className="km-faq-or">OR</div>
                { this.state.helpdocsKey.length == 0 &&
                  <div className="faq-integrate-btn-container">
                    <button className="km-button km-button--secondary" onClick={this.openModal}>
                    <img className="km-faq-helpdocs-logo" src={HelpdocsLogo} />
                      Integrate with Helpdocs
                    </button>
                    <div className="km-faq-import-faq-sub">Import your FAQs from Helpdocs</div>
                    <div className="percent-off-pill">20% off</div>
                  </div>  
                }
                
                { this.state.helpdocsKey.length > 0 &&
                  <div className="km-faq-helpdocs-edit-wrapper">
                    <img className="km-faq-helpdocs-logo" src={TickIcon} />
                    <span className="km-faq-helpdocs-edit">Integration done with Helpdocs
                    <span onClick ={this.openModal}  className="km-faq-helpdocs-edit km-faq-edit-btn"> Edit</span></span>
                  </div>
                }
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
        <FaqModal isOpen={this.state.faqModal} toggle={this.toggleFaqModal} className="modal-dialog">
          <ModalHeader toggle={this.toggleFaqModal}>
            <h4 className="faq-modal-title">FAQ</h4>
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
              <div className="col-sm-1 km-bot-align-item-v-center">
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
              <div className="col-sm-2 text-right faq-modal-discard-btn-box">
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
        </FaqModal>


        <div className={ 
          ((CommonUtils.getDaysCount() < 31 ) && (typeof CommonUtils.getUserSession().subscription === 'undefined' || CommonUtils.getUserSession().subscription == '' || CommonUtils.getUserSession().subscription == '0' || CommonUtils.getUserSession().subscription === "startup")) ? "n-vis" : "upgrade-plan-container faq-pricing-restriction"}>
          <div className="upgrade-plan-heading-container">
              <div className="upgrade-plan-heading">
                  <h4>Upgrade your plan to create your FAQs</h4> 
                  <button className="km-button km-button--primary" onClick={() => this.props.history.push("/settings/billing")}>Upgrade plan</button>
              </div>
          </div>

          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <div className="upgrade-plan-integrations">
                <h2>What are FAQs?</h2>
                <p className="p">Create FAQs to cater generic and recurring customer queries. Your customer will be able to directly access FAQs in chat.</p>
              </div>
              <div className="upgrade-plan-integrations">
                <h2>Create your own FAQs or import them from Helpdocs</h2>
                <div className="faq-restricted-container">
                  <LockBadge className={"lock-with-text"} text={"Available in Growth Plan"} history={this.props.history} onClickGoTo={"/settings/billing"}/>
                  <div className="faq-disabled-buttons mt-4 faq-btn-wrapper">
                    <button className="km-button km-button--primary">+ Add FAQ</button>
                    <div className="km-faq-or">OR</div>
                    <div className="faq-integrate-btn-container">
                      <button className="km-button km-button--secondary">
                      <img className="km-faq-helpdocs-logo" src={HelpdocsLogo} />
                        Integrate with Helpdocs
                      </button>
                      <div className="km-faq-import-faq-sub">Import your FAQs from Helpdocs</div>
                    </div>  
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 342 464" className="faq-svg-liz-svg">
                <defs>
                  <filter id="Mask" width="342" height="464" x="0" y="0" filterUnits="userSpaceOnUse">
                    <feOffset dy="1"/>
                    <feGaussianBlur result="blur" stdDeviation="2"/>
                    <feFlood floodColor="#dcd7d7" floodOpacity=".502"/>
                    <feComposite in2="blur" operator="in"/>
                    <feComposite in="SourceGraphic"/>
                  </filter>
                  <filter id="Mask-2" width="342" height="464" x="0" y="0" filterUnits="userSpaceOnUse">
                    <feOffset dy="1"/>
                    <feGaussianBlur result="blur-2" stdDeviation="2"/>
                    <feFlood floodColor="#dcd7d7" floodOpacity=".502"/>
                    <feComposite in2="blur-2" operator="in"/>
                    <feComposite in="SourceGraphic"/>
                  </filter>
                  <clipPath id="clip-path">
                    <circle id="Mask-3" cx="15" cy="15" r="15" className="faq-svg-liz-1" data-name="Mask"/>
                  </clipPath>
                  <clipPath id="clip-path-2">
                    <circle id="Mask-4" cx="20" cy="20" r="20" className="faq-svg-liz-1" data-name="Mask"/>
                  </clipPath>
                </defs>
                <g id="Group_1" data-name="Group 1" transform="translate(-666 -196)">
                  <g filter="url(#Mask)" transform="translate(666 196)">
                    <path id="Mask-5" d="M8 0h314a8 8 0 0 1 8 8v444H0V8a8 8 0 0 1 8-8z" className="faq-svg-liz-2" data-name="Mask" transform="translate(6 5)"/>
                  </g>
                  <g filter="url(#Mask-2)" transform="translate(666 196)">
                    <path id="Mask-6" d="M8 0h314a8 8 0 0 1 8 8v444H0V8a8 8 0 0 1 8-8z" className="faq-svg-liz-2" data-name="Mask" transform="translate(6 5)"/>
                  </g>
                  <path id="Rectangle_3" d="M8 0h314.048a8 8 0 0 1 8 8v56H0V8a8 8 0 0 1 8-8z" className="faq-svg-liz-3" data-name="Rectangle 3" transform="translate(671.619 200.699)"/>
                  <text id="Liz" fill="#fff" className="faq-svg-liz-41" transform="translate(773 237)">
                    <tspan x="0" y="0">Liz</tspan>
                  </text>
                  <text id="PREVIEW" fill="#fff" className="faq-svg-liz-42" transform="translate(922 235)">
                    <tspan x="0" y="0">PREVIEW</tspan>
                  </text>
                  <g id="back" transform="translate(689 223)">
                    <path id="Shape" d="M9.653 1.825A1.043 1.043 0 0 0 8.223.306L.358 8.219a.985.985 0 0 0 0 1.519l7.865 7.914c.953 1.039 2.463-.48 1.43-1.519L2.582 9.019z" className="faq-svg-liz-2"/>
                  </g>
                  <rect id="Rectangle_6_Copy" width="208" height="48" className="faq-svg-liz-3" data-name="Rectangle 6 Copy" rx="5" transform="translate(780 280)"/>
                  <text id="How_do_I_cancel_my_o" fill="#fff" data-name="How do I cancel my o"  className="faq-svg-liz-40" transform="translate(794 309)">
                    <tspan x="0" y="0">How do I cancel my order?</tspan>
                  </text>
                  <rect id="Rectangle_6_Copy-2" width="223" height="53" fill="#e6e5ec" data-name="Rectangle 6 Copy" rx="5" transform="translate(720 348)"/>
                  <g id="Rectangle_18_Copy_2" fill="#fff" stroke="#ddd9d9" strokeMiterlimit="10" data-name="Rectangle 18 Copy 2" transform="translate(719 413)">
                    <rect width="223" height="214" className="faq-svg-liz-33" rx="8"/>
                    <rect width="222" height="213" x=".5" y=".5" className="faq-svg-liz-34" rx="7.5"/>
                  </g>
                  <g id="Liz03" transform="translate(684 349)">
                    <circle id="Mask-7" cx="15" cy="15" r="15" className="faq-svg-liz-1" data-name="Mask"/>
                    <g id="Liz03-2" clipPath="url(#clip-path)" data-name="Liz03">
                      <g id="Liz03-3" data-name="Liz03" transform="translate(4.342 1.974)">
                        <path id="Shape-2" d="M4.482 0c-.089 4.287-1.364 21.012-1.1 22.571.248 1.559 2.374 4.606 1.878 5.244S1.913 25.228 1.4 23.4C.886 21.561 0 1.311 0 1.311z" className="faq-svg-liz-10" data-name="Shape" transform="translate(11.392 57.508)"/>
                        <path id="Shape-3" d="M.028 0C2.349 4.234 4 5.085 3.376 2.906c0 0 1.524 2.675.709 2.693-.567.017-2.126-1.17-3.225-3.03v.691l-.442-.425S.258 1.843.17 1.081A2.21 2.21 0 0 1 .028 0z" className="faq-svg-liz-11" data-name="Shape" transform="translate(12.604 80.043)"/>
                        <path id="Shape-4" d="M.854 0c.089 4.287 1.364 21.012 1.1 22.571C1.7 24.13-.421 27.177.075 27.815s3.348-2.587 3.862-4.415c.514-1.843 1.4-22.093 1.4-22.093z" className="faq-svg-liz-10" data-name="Shape" transform="translate(4.266 57.508)"/>
                        <path id="Shape-5" d="M4.3 0C1.976 4.234.328 5.085.948 2.906c0 0-1.524 2.675-.709 2.693.567.018 2.126-1.169 3.224-3.03v.691l.443-.425s.159-.992.248-1.754A2.757 2.757 0 0 0 4.3 0z" className="faq-svg-liz-11" data-name="Shape" transform="translate(4.083 80.043)"/>
                        <path id="Shape-6" d="M3.054 0a5.558 5.558 0 0 0-1.79 1.47 8.1 8.1 0 0 0-.956 4.589A56.172 56.172 0 0 1 .1 14.722c-.407 2.073.62 7.831.744 9.726s1.772-.957 1.772-.957.23-4.394.213-5.581-.3-2.5-.266-3.224.6-5.244.6-5.244l.478-5.262z" className="faq-svg-liz-10" data-name="Shape" transform="translate(1.872 23.085)"/>
                        <path id="Shape-7" d="M.585 0a5.558 5.558 0 0 1 1.789 1.47 8.1 8.1 0 0 1 .957 4.589 56.172 56.172 0 0 0 .213 8.663c.407 2.073-.62 7.831-.744 9.726s-1.772-.957-1.772-.957S.8 19.1.815 17.911s.3-2.5.266-3.224-.6-5.244-.6-5.244L0 4.181z" className="faq-svg-liz-10" data-name="Shape" transform="translate(15.537 23.085)"/>
                        <path id="Shape-8" d="M1.23 17c1.2-1.1 2.728-1.47 5.067-.709s3.88.159 5.209.106a21.728 21.728 0 0 1 4.11.372c2.339-1.506.266-10.772.142-11.533-.142-.765-8.291-5.619-9.691-5.212s-2.781 0-3.278.6.142 6.927-1.276 8.823C.114 11.345-.913 14.747 1.23 17z" className="faq-svg-liz-12" data-name="Shape" transform="translate(2.366 1.96)"/>
                        <path id="Shape-9" d="M6.945 0c-.23 2.675-1.01 7.175 1.612 7.9-.957 2.6-4.252 4.553-4.252 4.553S.726 11.179 0 7.831c2.144-.461 2.392-3.1 2.48-6.077C3.012.638 6.945 0 6.945 0z" className="faq-svg-liz-10" data-name="Shape" transform="translate(6.201 14.97)"/>
                        <path id="Shape-10" d="M0 6.148a12.939 12.939 0 0 0 .62-4.394C1.116.656 5.067 0 5.067 0a38.221 38.221 0 0 0-.283 4.217A10.125 10.125 0 0 1 0 6.148z" className="faq-svg-liz-13" data-name="Shape" transform="translate(8.079 14.953)"/>
                        <path id="Shape-11" d="M8.17.247A6.974 6.974 0 0 0 5.69.034a6.974 6.974 0 0 0-2.48.213C.817.849-.476 4.818.162 9.778A6.968 6.968 0 0 0 5.441 15.7a.694.694 0 0 0 .23.035c.106 0 .195 0 .23-.035a6.968 6.968 0 0 0 5.28-5.917C11.855 4.818 10.579.849 8.17.247z" className="faq-svg-liz-10" data-name="Shape" transform="translate(4.887 2.96)"/>
                        <path id="Shape-12" d="M1.537 6.112c-.142 2-3.207 6.768-.266 8.717.195-1.2.8-2.374 2.215-1.807a3.059 3.059 0 0 0 3.472-.833 6.405 6.405 0 0 0-.567-7.813A11.381 11.381 0 0 1 4.69 0L2.015 3.1" className="faq-svg-liz-14" data-name="Shape" transform="translate(14.461 6.626)"/>
                        <path id="Shape-13" d="M.691.618c.85-1.311 2.5-.337 1.967 1.063C2.108 3.134.744 3.311 0 2.567A5.554 5.554 0 0 1 .691.618z" className="faq-svg-liz-10" data-name="Shape" transform="translate(14.864 10.136)"/>
                        <path id="Shape-14" d="M2.07.618C1.22-.693-.428.282.1 1.681c.549 1.453 1.913 1.63 2.657.886A5.554 5.554 0 0 0 2.07.618z" className="faq-svg-liz-10" data-name="Shape" transform="translate(3.9 10.136)"/>
                        <path id="Shape-15" d="M.051 1.8C0 1.782-.037 1.534.069 1.144A1.436 1.436 0 0 1 .476.506a1.615 1.615 0 0 1 .85-.372 4.528 4.528 0 0 1 .85 0 4.034 4.034 0 0 0 .638.018c.337-.018.478-.195.549-.142.019.018.019.09-.052.19a.783.783 0 0 1-.425.283A9.313 9.313 0 0 1 1.4.595a1.3 1.3 0 0 0-.64.23 1.461 1.461 0 0 0-.372.443c-.195.319-.266.549-.337.532z" className="faq-svg-liz-15" data-name="Shape" transform="translate(12.085 10)"/>
                        <path id="Shape-16" d="M1.364 0a1.181 1.181 0 0 1 .3.78.945.945 0 0 1-.831 1.027A.945.945 0 0 1 0 .78 1.089 1.089 0 0 1 .283.018C.638 0 1.01 0 1.364 0z" className="faq-svg-liz-15" data-name="Shape" transform="translate(12.88 10.346)"/>
                        <path id="Shape-17" d="M1.972.515c-.035.018-.124-.053-.3-.142a1.624 1.624 0 0 0-.71-.141 1.278 1.278 0 0 0-.691.213C.112.551.041.657.006.639-.012.622.006.48.165.321A1.1 1.1 0 0 1 .945 0a1.351 1.351 0 0 1 .815.23c.177.144.23.27.212.285z" className="faq-svg-liz-12" data-name="Shape" transform="translate(6.178 7.652)"/>
                        <path id="Shape-18" d="M3.7 0C1.967 1.63 1.152 1.4.886 1.2A7.644 7.644 0 0 1 0 .106 6.316 6.316 0 0 0 3.7 0z" className="faq-svg-liz-16" data-name="Shape" transform="translate(8.823 15.219)"/>
                        <path id="Shape-19" d="M1.01 3.45c.443 2.267.762 4.55 3.171 5.279 2.409.744 4.783-.035 4.677.5s-.514 2.427.018 2.569c.709-.833.709-1.045 1.063-1.417.567-.62 2.533-.531 2.5-2.232s-.709-5.156-2.073-5.421A6.915 6.915 0 0 1 6.112.881 3.9 3.9 0 0 0 0 2.546c.478-.266.974.567 1.01.904z" className="faq-svg-liz-14" data-name="Shape" transform="translate(7.016 .129)"/>
                        <path id="Shape-20" d="M8.661 1.382c-1.506-2.6-6.006-1.134-5.7 1.169s1.116 4.128-1.1 6.059a5.93 5.93 0 0 0-.638 7.919C2.832 18.5 2.6 18.6 2.3 18.974c2.179-.8 2.215-1.843.939-4.571-1.276-2.746 2.232-5.616 2.2-8.663-.056-3.224 1.042-4.199 3.222-4.358z" className="faq-svg-liz-14" data-name="Shape" transform="translate(.109 1.967)"/>
                        <path id="Shape-21" d="M.069 2.2a9.115 9.115 0 0 1 .142 4A5.49 5.49 0 0 0 .6 4.31C.565 1.617 1.345.5 2.886.111 1.256-.243-.356.2.069 2.2z" className="faq-svg-liz-12" data-name="Shape" transform="translate(4.909 3.379)"/>
                        <path id="Shape-22" d="M3.305 1.794c-.071.018-.159-.213-.319-.531A1.708 1.708 0 0 0 2.614.82a1.368 1.368 0 0 0-.638-.23A9.634 9.634 0 0 1 .488.483.667.667 0 0 1 .063.2C-.008.093-.008.022.01 0c.053-.031.212.146.549.146A4.119 4.119 0 0 0 1.2.129a4.528 4.528 0 0 1 .85 0 1.45 1.45 0 0 1 1.258 1.01c.086.407.05.655-.003.655z" className="faq-svg-liz-15" data-name="Shape" transform="translate(5.518 9.828)"/>
                        <path id="Shape-23" d="M.3 0a1.181 1.181 0 0 0-.3.78.945.945 0 0 0 .833 1.027A.945.945 0 0 0 1.665.78a1.089 1.089 0 0 0-.283-.762C1.028 0 .656 0 .3 0z" className="faq-svg-liz-15" data-name="Shape" transform="translate(6.413 10.169)"/>
                        <g id="Group" transform="translate(4.961 8.504)">
                          <g id="Group-2" data-name="Group" transform="translate(6.201)">
                            <circle id="Oval" cx="2.321" cy="2.321" r="2.321" className="faq-svg-liz-17" transform="translate(.124 .142)"/>
                            <circle id="Oval-2" cx="2.321" cy="2.321" r="2.321" className="faq-svg-liz-18" data-name="Oval" transform="translate(.124 .142)"/>
                          </g>
                          <path id="Shape-24" d="M0 .327A1.354 1.354 0 0 1 1.931.5" className="faq-svg-liz-19" data-name="Shape" transform="translate(4.553 1.289)"/>
                          <g id="Group-3" data-name="Group">
                            <circle id="Oval-3" cx="2.321" cy="2.321" r="2.321" className="faq-svg-liz-17" data-name="Oval" transform="translate(.035 .142)"/>
                            <circle id="Oval-4" cx="2.321" cy="2.321" r="2.321" className="faq-svg-liz-18" data-name="Oval" transform="translate(.035 .142)"/>
                          </g>
                        </g>
                        <path id="Shape-25" d="M0 .515C-.014.5.039.374.216.232A1.351 1.351 0 0 1 1.031 0a1.1 1.1 0 0 1 .78.319c.159.159.177.3.159.319-.036.019-.107-.087-.27-.193a1.229 1.229 0 0 0-.687-.213A1.364 1.364 0 0 0 .3.374C.127.462.021.533 0 .515z" className="faq-svg-liz-12" data-name="Shape" transform="translate(12.912 7.652)"/>
                        <path id="Shape-26" d="M0 0c.159.089.283.159.425.23A1.072 1.072 0 0 0 .8.372a.381.381 0 0 0 .142 0A.362.362 0 0 0 1.1.283 4.169 4.169 0 0 0 1.47 0a.8.8 0 0 1-.177.478.64.64 0 0 1-.23.195A.563.563 0 0 1 .9.726a.478.478 0 0 1-.159 0A.87.87 0 0 1 .266.443.833.833 0 0 1 0 0z" className="faq-svg-liz-20" data-name="Shape" transform="translate(9.656 13.5)"/>
                        <path id="Shape-27" d="M11.516.372A6.194 6.194 0 0 0 10.2 0c-.354 0-.159 1.967-4.429 4.27H5.74C1.47 1.967 1.665 0 1.311 0A6.194 6.194 0 0 0 0 .372a21.682 21.682 0 0 1 .407 3.579C.425 4.943.089 5.935.106 6.7c.035 2.126 1.648 8.167 1.648 8.167a12.931 12.931 0 0 0 3.986.633h.035a13.483 13.483 0 0 0 3.986-.638s1.613-6.039 1.648-8.162c.018-.744-.319-1.754-.3-2.746a19.95 19.95 0 0 1 .407-3.582z" className="faq-svg-liz-21" data-name="Shape" transform="translate(4.748 22.624)"/>
                        <path id="Shape-28" d="M12.8 8.4A28.441 28.441 0 0 0 10.837.018a42.877 42.877 0 0 1-4.359.265.107.107 0 0 0-.071.017c-.017 0-.035-.017-.07-.017A43.214 43.214 0 0 1 1.872 0a30 30 0 0 0-1.86 8.4c-.071 2.336.195 7.244.388 10.22s.9 17.575 1.276 20.321a3.588 3.588 0 0 0 3.65.3c.035-.531.9-26.167.9-26.167s.089-.638.195-1.612c.106.992.195 1.612.195 1.612s.868 25.636.9 26.167a3.6 3.6 0 0 0 3.65-.3c.372-2.746 1.063-17.344 1.276-20.321.166-2.976.432-7.884.358-10.22z" className="faq-svg-liz-22" data-name="Shape" transform="translate(4.152 35.539)"/>
                        <path id="Shape-29" d="M.282.673A6.261 6.261 0 0 1 1.061 0a15.177 15.177 0 0 1 1.2 5.3A3.554 3.554 0 0 1 .282 7.335c-.443.124-.302-6.325 0-6.662z" className="faq-svg-liz-23" data-name="Shape" transform="translate(4.024 41.634)"/>
                        <path id="Shape-30" d="M2 .673A6.261 6.261 0 0 0 1.218 0a15.177 15.177 0 0 0-1.2 5.3A3.554 3.554 0 0 0 2 7.335c.422.124.281-6.325 0-6.662z" className="faq-svg-liz-23" data-name="Shape" transform="translate(14.763 41.634)"/>
                        <path id="Shape-31" d="M2.889 6.484a2.39 2.39 0 0 1-.23-1.152v-.017c0-.39.018-.939-.018-1.47a2.236 2.236 0 0 0-.053-.531 1.61 1.61 0 0 0-.372-.957c-.443-.337-.372-.921-.354-1.843C1.861.39 1.666.142 1.7 0c0 0-.884.106-1.451.124C.125 1.293.072 2.374.036 3.242v.035C0 4.075 0 4.713.019 5.12A4.7 4.7 0 0 0 .16 7.033c.319.5 1.789 2.693 2.037 2.64.23-.071.071-.6.071-.6.5.5 1.1.762.9-.6a8.487 8.487 0 0 1-.709-1.559c.78 1.081.868 1.648 1.169 1.594.288-.057-.328-1.439-.739-2.024z" className="faq-svg-liz-10" data-name="Shape" transform="translate(2.586 46.081)"/>
                        <path id="Shape-32" d="M0 1.772a1.769 1.769 0 0 1 .374.728c.035.124.089.248.124.407a2.7 2.7 0 0 0 .159.443 2.259 2.259 0 0 0 .266.443.929.929 0 0 0 .177.195c.035.018.071.053.089.053h.018v-.019a.134.134 0 0 1 .018-.071v-.16a2.663 2.663 0 0 0-.035-.354c-.035-.23-.089-.478-.142-.691-.037-.106-.054-.213-.09-.319a1.677 1.677 0 0 1-.088-.319A3.621 3.621 0 0 1 .852.957 1.482 1.482 0 0 0 .746.248L.692.142A.245.245 0 0 0 .639.071L.6 0a.11.11 0 0 1 .075.035 1.448 1.448 0 0 1 .141.16 1.452 1.452 0 0 1 .195.762 4.761 4.761 0 0 0 .071 1.1 5.913 5.913 0 0 1 .337 1.364 2.643 2.643 0 0 1 .035.372.727.727 0 0 1-.018.195.225.225 0 0 1-.018.106c0 .018-.018.035-.018.053a.245.245 0 0 0-.053.071.2.2 0 0 1-.142.053.263.263 0 0 1-.124-.018c-.071-.018-.106-.071-.159-.106a1.259 1.259 0 0 1-.213-.23 2.26 2.26 0 0 1-.266-.5A2.868 2.868 0 0 1 .3 2.941C.267 2.8.232 2.657.2 2.533a5.83 5.83 0 0 0-.2-.761z" className="faq-svg-liz-20" data-name="Shape" transform="translate(3.489 48.738)"/>
                        <path id="Shape-33" d="M.1 1.117c-.407 2.073.62 7.831.744 9.726s1.772-.957 1.772-.957.23-4.394.213-5.581-.3-2.5-.266-3.224S.5-.956.1 1.117z" className="faq-svg-liz-10" data-name="Shape" transform="translate(1.854 36.69)"/>
                        <path id="Shape-34" d="M.816 6.484a2.39 2.39 0 0 0 .23-1.152v-.017c0-.39-.018-.939.018-1.47a2.236 2.236 0 0 1 .053-.531 1.61 1.61 0 0 1 .372-.957c.443-.337.372-.921.354-1.843C1.843.39 2.038.142 2 0c0 0 .886.106 1.453.124.124 1.169.177 2.25.213 3.118v.035c.035.8.035 1.435.018 1.843a4.7 4.7 0 0 1-.142 1.913c-.319.5-1.789 2.693-2.037 2.64-.23-.071-.071-.6-.071-.6-.5.5-1.1.762-.9-.6a8.487 8.487 0 0 0 .709-1.559C.462 7.99.373 8.557.072 8.5c-.284-.049.336-1.431.744-2.016z" className="faq-svg-liz-10" data-name="Shape" transform="translate(14.739 46.081)"/>
                        <path id="Shape-35" d="M1.488 1.754c.035.018-.124.283-.23.78-.035.124-.071.266-.106.407s-.089.319-.142.478a3.384 3.384 0 0 1-.266.5.867.867 0 0 1-.213.23.618.618 0 0 1-.159.106.263.263 0 0 1-.124.018c-.053 0-.089-.035-.142-.053a.245.245 0 0 1-.053-.071.065.065 0 0 1-.018-.053.225.225 0 0 1-.018-.106A.727.727 0 0 1 0 3.791a2.643 2.643 0 0 1 .035-.372 8.534 8.534 0 0 1 .337-1.364A4.82 4.82 0 0 0 .443.957 1.229 1.229 0 0 1 .638.195 1.448 1.448 0 0 1 .78.035C.815 0 .833 0 .85 0a.11.11 0 0 1-.035.071.245.245 0 0 0-.053.071L.709.248A1.569 1.569 0 0 0 .6.957a3.62 3.62 0 0 1-.015 1.151 2.142 2.142 0 0 0-.085.319c-.035.106-.053.213-.089.319-.053.23-.106.461-.142.691a2.4 2.4 0 0 0-.035.354v.159a.107.107 0 0 0 .018.071v.018h.014c.018 0 .053-.035.089-.053a.929.929 0 0 0 .177-.195A2.931 2.931 0 0 0 .8 3.348a2.7 2.7 0 0 0 .159-.443c.053-.142.089-.283.124-.407a2.063 2.063 0 0 1 .405-.744z" className="faq-svg-liz-20" data-name="Shape" transform="translate(16.051 48.756)"/>
                        <path id="Shape-36" d="M2.729 1.117c.407 2.073-.62 7.831-.744 9.726S.214 9.887.214 9.887-.017 5.493 0 4.306s.3-2.5.266-3.224 2.074-2.038 2.463.035z" className="faq-svg-liz-10" data-name="Shape" transform="translate(16.351 36.69)"/>
                        <g id="Group-4" data-name="Group" transform="translate(16.299 46.417)">
                          <path id="Shape-37" d="M2.126.833H.177A.178.178 0 0 1 0 .656V.177A.191.191 0 0 1 .177 0h1.949A.178.178 0 0 1 2.3.177v.479a.191.191 0 0 1-.174.177z" className="faq-svg-liz-24" data-name="Shape" transform="translate(.035 .372)"/>
                          <path id="Shape-38" d="M.212 1.28h-.1c-.077 0-.128-.053-.1-.089L.16.075C.16.022.237-.013.288 0h.1c.077 0 .128.053.1.089L.34 1.209c0 .053-.077.091-.128.071z" className="faq-svg-liz-25" data-name="Shape" transform="translate(2.104 .155)"/>
                        </g>
                      </g>
                    </g>
                  </g>
                  <g id="Liz03_Copy" data-name="Liz03 Copy" transform="translate(720 212)">
                    <circle id="Mask-8" cx="20" cy="20" r="20" className="faq-svg-liz-1" data-name="Mask"/>
                    <g id="Liz03_Copy-2" clipPath="url(#clip-path-2)" data-name="Liz03 Copy">
                      <g id="Liz03-4" data-name="Liz03" transform="translate(5.789 2.632)">
                        <path id="Shape-39" d="M5.976 0c-.118 5.717-1.819 28.016-1.464 30.094.331 2.079 3.165 6.142 2.5 6.992S2.551 33.638 1.866 31.2C1.181 28.748 0 1.748 0 1.748z" className="faq-svg-liz-10" data-name="Shape" transform="translate(15.189 76.677)"/>
                        <path id="Shape-40" d="M.037 0C3.132 5.646 5.328 6.78 4.5 3.874c0 0 2.031 3.567.945 3.591-.756.024-2.835-1.559-4.3-4.039v.921L.557 3.78S.344 2.457.226 1.441A2.946 2.946 0 0 1 .037 0z" className="faq-svg-liz-11" data-name="Shape" transform="translate(16.805 106.724)"/>
                        <path id="Shape-41" d="M1.139 0C1.257 5.717 2.958 28.016 2.6 30.094c-.327 2.079-3.162 6.142-2.5 6.993s4.465-3.449 5.15-5.882c.684-2.457 1.865-29.457 1.865-29.457z" className="faq-svg-liz-10" data-name="Shape" transform="translate(5.688 76.677)"/>
                        <path id="Shape-42" d="M5.729 0C2.635 5.646.438 6.78 1.265 3.874c0 0-2.031 3.567-.945 3.591.756.024 2.835-1.559 4.3-4.039v.921l.59-.567s.213-1.323.331-2.339A3.675 3.675 0 0 0 5.729 0z" className="faq-svg-liz-11" data-name="Shape" transform="translate(5.444 106.724)"/>
                        <path id="Shape-43" d="M4.072 0a7.41 7.41 0 0 0-2.386 1.961C.93 3.071.339 5.126.41 8.079S.646 16.866.127 19.63c-.543 2.764.827 10.441.992 12.969s2.362-1.276 2.362-1.276.307-5.858.283-7.441-.4-3.331-.354-4.3.8-6.992.8-6.992l.638-7.016z" className="faq-svg-liz-10" data-name="Shape" transform="translate(2.495 30.78)"/>
                        <path id="Shape-44" d="M.78 0a7.41 7.41 0 0 1 2.385 1.961c.756 1.11 1.346 3.165 1.276 6.118s-.241 8.787.283 11.551c.544 2.764-.824 10.441-.992 12.97S1.37 31.323 1.37 31.323s-.307-5.858-.283-7.441.4-3.331.354-4.3-.8-6.992-.8-6.992L0 5.575z" className="faq-svg-liz-10" data-name="Shape" transform="translate(20.717 30.78)"/>
                        <path id="Shape-45" d="M1.641 22.662C3.247 21.2 5.278 20.7 8.4 21.717s5.173.213 6.945.142a28.97 28.97 0 0 1 5.48.5c3.118-2.008.354-14.362.189-15.378C20.822 5.961 9.956-.511 8.089.032s-3.709 0-4.37.8.189 9.236-1.7 11.764c-1.867 2.531-3.237 7.066-.378 10.066z" className="faq-svg-liz-12" data-name="Shape" transform="translate(3.155 2.613)"/>
                        <path id="Shape-46" d="M9.26 0c-.307 3.567-1.346 9.567 2.15 10.535-1.276 3.472-5.669 6.071-5.669 6.071S.969 14.906 0 10.441c2.858-.614 3.189-4.134 3.307-8.1C4.016.85 9.26 0 9.26 0z" className="faq-svg-liz-10" data-name="Shape" transform="translate(8.268 19.961)"/>
                        <path id="Shape-47" d="M0 8.2a17.252 17.252 0 0 0 .827-5.861C1.488.874 6.756 0 6.756 0a50.962 50.962 0 0 0-.378 5.622A13.5 13.5 0 0 1 0 8.2z" className="faq-svg-liz-13" data-name="Shape" transform="translate(10.772 19.937)"/>
                        <path id="Shape-48" d="M10.893.329A9.3 9.3 0 0 0 7.586.045a9.3 9.3 0 0 0-3.307.284C1.09 1.132-.634 6.423.216 13.038a9.29 9.29 0 0 0 7.039 7.89.926.926 0 0 0 .307.047c.142 0 .26 0 .307-.047a9.29 9.29 0 0 0 7.039-7.89c.898-6.615-.802-11.906-4.015-12.709z" className="faq-svg-liz-10" data-name="Shape" transform="translate(6.516 3.947)"/>
                        <path id="Shape-49" d="M2.049 8.15c-.189 2.669-4.276 9.024-.354 11.622.26-1.606 1.063-3.165 2.953-2.409a4.079 4.079 0 0 0 4.63-1.11c2.764-4.819.945-8.2-.756-10.417A15.175 15.175 0 0 1 6.254 0L2.687 4.134" className="faq-svg-liz-14" data-name="Shape" transform="translate(19.282 8.835)"/>
                        <path id="Shape-50" d="M.921.824C2.055-.924 4.252.375 3.543 2.241 2.811 4.178.992 4.415 0 3.423A7.406 7.406 0 0 1 .921.824z" className="faq-svg-liz-10" data-name="Shape" transform="translate(19.819 13.514)"/>
                        <path id="Shape-51" d="M2.76.824C1.626-.924-.571.375.138 2.241.87 4.178 2.689 4.415 3.681 3.423A7.406 7.406 0 0 0 2.76.824z" className="faq-svg-liz-10" data-name="Shape" transform="translate(5.201 13.514)"/>
                        <path id="Shape-52" d="M.068 2.4C0 2.375-.05 2.045.092 1.525a1.915 1.915 0 0 1 .543-.85 2.154 2.154 0 0 1 1.134-.5A6.037 6.037 0 0 1 2.9.179 5.379 5.379 0 0 0 3.753.2c.449-.024.638-.26.732-.189.024.024.024.118-.071.26a1.044 1.044 0 0 1-.567.378 12.417 12.417 0 0 1-1.984.144 1.731 1.731 0 0 0-.85.307 1.948 1.948 0 0 0-.5.591c-.256.425-.35.732-.445.709z" className="faq-svg-liz-15" data-name="Shape" transform="translate(16.113 13.333)"/>
                        <path id="Shape-53" d="M1.819 0a1.574 1.574 0 0 1 .4 1.039 1.261 1.261 0 0 1-1.11 1.37A1.261 1.261 0 0 1 0 1.039 1.452 1.452 0 0 1 .378.024C.85 0 1.346 0 1.819 0z" className="faq-svg-liz-15" data-name="Shape" transform="translate(17.173 13.795)"/>
                        <path id="Shape-54" d="M2.629.687C2.582.711 2.464.616 2.228.5a2.165 2.165 0 0 0-.945-.191 1.7 1.7 0 0 0-.921.284C.149.735.055.876.007.853-.016.829.007.64.22.427A1.465 1.465 0 0 1 1.259 0a1.8 1.8 0 0 1 1.087.309c.236.191.307.355.283.378z" className="faq-svg-liz-12" data-name="Shape" transform="translate(8.237 10.202)"/>
                        <path id="Shape-55" d="M4.937 0c-2.315 2.173-3.4 1.866-3.756 1.606A10.193 10.193 0 0 1 0 .142C.921.638 3.827.5 4.937 0z" className="faq-svg-liz-16" data-name="Shape" transform="translate(11.764 20.291)"/>
                        <path id="Shape-56" d="M1.346 4.6c.591 3.024 1.016 6.071 4.228 7.039 3.213.992 6.378-.047 6.236.661s-.685 3.236.024 3.425c.945-1.11.945-1.394 1.417-1.89.756-.827 3.378-.709 3.331-2.976s-.945-6.874-2.764-7.228S9.9 3.04 8.15 1.174 1.465-.6 0 3.395c.638-.355 1.3.756 1.346 1.205z" className="faq-svg-liz-14" data-name="Shape" transform="translate(9.354 .172)"/>
                        <path id="Shape-57" d="M11.547 1.842C9.54-1.63 3.54.331 3.941 3.4s1.488 5.5-1.465 8.079a7.907 7.907 0 0 0-.85 10.559c2.15 2.622 1.843 2.764 1.441 3.26 2.906-1.062 2.953-2.456 1.252-6.098C2.618 15.543 7.3 11.716 7.248 7.653c-.071-4.299 1.394-5.598 4.299-5.811z" className="faq-svg-liz-14" data-name="Shape" transform="translate(.145 2.622)"/>
                        <path id="Shape-58" d="M.092 2.935a12.153 12.153 0 0 1 .189 5.339A7.32 7.32 0 0 0 .8 5.746C.753 2.156 1.793.667 3.848.148 1.675-.325-.475.266.092 2.935z" className="faq-svg-liz-12" data-name="Shape" transform="translate(6.546 4.506)"/>
                        <path id="Shape-59" d="M4.407 2.392c-.094.024-.213-.283-.425-.709a2.277 2.277 0 0 0-.5-.591 1.824 1.824 0 0 0-.85-.307A12.846 12.846 0 0 1 .651.644.889.889 0 0 1 .084.266C-.01.124-.01.03.013.006.084-.041.3.2.745.2A5.492 5.492 0 0 0 1.6.172a6.037 6.037 0 0 1 1.134 0 1.933 1.933 0 0 1 1.673 1.346c.118.543.071.874 0 .874z" className="faq-svg-liz-15" data-name="Shape" transform="translate(7.357 13.104)"/>
                        <path id="Shape-60" d="M.4 0A1.574 1.574 0 0 0 0 1.039a1.261 1.261 0 0 0 1.11 1.37 1.261 1.261 0 0 0 1.11-1.37A1.452 1.452 0 0 0 1.843.024C1.37 0 .874 0 .4 0z" className="faq-svg-liz-15" data-name="Shape" transform="translate(8.551 13.559)"/>
                        <g id="Group-5" data-name="Group" transform="translate(6.614 11.339)">
                          <g id="Group-6" data-name="Group" transform="translate(8.268)">
                            <circle id="Oval-5" cx="3.094" cy="3.094" r="3.094" className="faq-svg-liz-17" data-name="Oval" transform="translate(.165 .189)"/>
                            <circle id="Oval-6" cx="3.094" cy="3.094" r="3.094" className="faq-svg-liz-19" data-name="Oval" transform="translate(.165 .189)"/>
                          </g>
                          <path id="Shape-61" d="M0 .327A2.241 2.241 0 0 1 2.575.5" className="faq-svg-liz-19" data-name="Shape" transform="translate(6.071 1.719)"/>
                          <g id="Group-7" data-name="Group">
                            <circle id="Oval-7" cx="3.094" cy="3.094" r="3.094" className="faq-svg-liz-17" data-name="Oval" transform="translate(.047 .189)"/>
                            <circle id="Oval-8" cx="3.094" cy="3.094" r="3.094" className="faq-svg-liz-19" data-name="Oval" transform="translate(.047 .189)"/>
                          </g>
                        </g>
                        <path id="Shape-62" d="M0 .687C-.019.664.052.5.288.309A1.8 1.8 0 0 1 1.374 0a1.465 1.465 0 0 1 1.04.427c.213.213.236.4.213.425-.047.024-.142-.118-.354-.26a1.639 1.639 0 0 0-.922-.283A1.819 1.819 0 0 0 .406.5C.17.616.028.711 0 .687z" className="faq-svg-liz-12" data-name="Shape" transform="translate(17.216 10.202)"/>
                        <path id="Shape-63" d="M0 0c.213.118.378.213.567.307a1.429 1.429 0 0 0 .5.189.508.508 0 0 0 .189 0 .483.483 0 0 0 .209-.118A5.559 5.559 0 0 0 1.961 0a1.061 1.061 0 0 1-.236.638.853.853 0 0 1-.308.262.751.751 0 0 1-.217.069.638.638 0 0 1-.213 0A1.161 1.161 0 0 1 .354.591 1.11 1.11 0 0 1 0 0z" className="faq-svg-liz-20" data-name="Shape" transform="translate(12.874 18)"/>
                        <path id="Shape-64" d="M15.354.5a8.259 8.259 0 0 0-1.748-.5c-.472 0-.213 2.622-5.906 5.693h-.046C1.961 2.622 2.22 0 1.748 0A8.259 8.259 0 0 0 0 .5a28.909 28.909 0 0 1 .543 4.768C.567 6.591.118 7.913.142 8.929c.047 2.835 2.2 10.89 2.2 10.89a17.241 17.241 0 0 0 5.315.85H7.7a17.977 17.977 0 0 0 5.315-.85s2.15-8.055 2.2-10.89c.024-.992-.425-2.339-.4-3.661A26.6 26.6 0 0 1 15.354.5z" className="faq-svg-liz-21" data-name="Shape" transform="translate(6.331 30.165)"/>
                        <path id="Shape-65" d="M17.071 11.2C16.929 6.047 14.449.024 14.449.024a57.169 57.169 0 0 1-5.811.354.142.142 0 0 0-.095.022C8.52.4 8.5.378 8.449.378A57.619 57.619 0 0 1 2.5 0 40.005 40.005 0 0 0 .016 11.2c-.094 3.118.26 9.661.52 13.63s1.2 23.433 1.7 27.094a4.784 4.784 0 0 0 4.866.4c.047-.709 1.2-34.89 1.2-34.89s.118-.85.26-2.15c.142 1.323.26 2.15.26 2.15s1.157 34.181 1.2 34.89a4.794 4.794 0 0 0 4.866-.4c.5-3.661 1.417-23.126 1.7-27.094.223-3.972.577-10.515.483-13.63z" className="faq-svg-liz-22" data-name="Shape" transform="translate(5.536 47.386)"/>
                        <path id="Shape-66" d="M.375.9a8.347 8.347 0 0 1 1.04-.9 20.237 20.237 0 0 1 1.606 7.063A4.738 4.738 0 0 1 .375 9.78c-.59.165-.401-8.434 0-8.88z" className="faq-svg-liz-23" data-name="Shape" transform="translate(5.365 55.512)"/>
                        <path id="Shape-67" d="M2.663.9a8.347 8.347 0 0 0-1.04-.9A20.237 20.237 0 0 0 .017 7.063 4.738 4.738 0 0 0 2.663 9.78c.567.165.378-8.434 0-8.88z" className="faq-svg-liz-23" data-name="Shape" transform="translate(19.684 55.512)"/>
                        <path id="Shape-68" d="M3.851 8.646a3.187 3.187 0 0 1-.307-1.536v-.023c0-.52.024-1.252-.024-1.961a2.981 2.981 0 0 0-.071-.709 2.147 2.147 0 0 0-.5-1.276c-.591-.449-.5-1.228-.472-2.457 0-.165-.26-.5-.213-.685 0 0-1.181.142-1.937.165C.166 1.724.1 3.165.048 4.323v.047C0 5.433 0 6.283.025 6.827a6.266 6.266 0 0 0 .189 2.551c.425.661 2.386 3.591 2.717 3.52.307-.094.094-.8.094-.8.661.661 1.465 1.016 1.2-.8a11.315 11.315 0 0 1-.945-2.079c1.039 1.441 1.157 2.2 1.559 2.126.383-.077-.444-1.92-.988-2.699z" className="faq-svg-liz-10" data-name="Shape" transform="translate(3.448 61.441)"/>
                        <path id="Shape-69" d="M0 2.362a2.359 2.359 0 0 1 .5.969c.047.165.118.331.165.543a3.6 3.6 0 0 0 .213.591 3.012 3.012 0 0 0 .354.591 1.238 1.238 0 0 0 .236.26c.047.024.094.071.118.071h.024v-.025a.179.179 0 0 1 .024-.094v-.213a3.55 3.55 0 0 0-.047-.472c-.047-.307-.118-.638-.189-.921-.047-.142-.071-.283-.118-.425a2.236 2.236 0 0 1-.118-.425 4.828 4.828 0 0 1-.024-1.535A1.976 1.976 0 0 0 .994.331L.923.189A.326.326 0 0 0 .852.094L.805 0A.146.146 0 0 1 .9.047a1.931 1.931 0 0 1 .189.213 1.936 1.936 0 0 1 .26 1.016 6.348 6.348 0 0 0 .094 1.464 7.885 7.885 0 0 1 .449 1.819 3.524 3.524 0 0 1 .047.5.969.969 0 0 1-.024.26.3.3 0 0 1-.024.142c0 .024-.024.047-.024.071a.326.326 0 0 0-.071.094.268.268 0 0 1-.189.071.35.35 0 0 1-.165-.024c-.094-.024-.142-.094-.213-.142a1.678 1.678 0 0 1-.282-.311 3.013 3.013 0 0 1-.354-.661A3.823 3.823 0 0 1 .4 3.921c-.044-.189-.091-.378-.138-.543A7.774 7.774 0 0 0 0 2.362z" className="faq-svg-liz-20" data-name="Shape" transform="translate(4.652 64.984)"/>
                        <path id="Shape-70" d="M.127 1.49c-.543 2.764.827 10.441.992 12.969s2.362-1.276 2.362-1.276.307-5.858.283-7.441-.4-3.331-.354-4.3S.67-1.274.127 1.49z" className="faq-svg-liz-10" data-name="Shape" transform="translate(2.472 48.92)"/>
                        <path id="Shape-71" d="M1.088 8.646a3.187 3.187 0 0 0 .307-1.536v-.023c0-.52-.024-1.252.024-1.961a2.981 2.981 0 0 1 .071-.709 2.147 2.147 0 0 1 .5-1.276c.591-.449.5-1.228.472-2.457 0-.165.26-.5.213-.685 0 0 1.181.142 1.937.165.165 1.559.236 3 .283 4.157v.049c.047 1.063.047 1.913.024 2.457a6.266 6.266 0 0 1-.189 2.551c-.425.661-2.386 3.591-2.717 3.52-.307-.094-.094-.8-.094-.8-.661.661-1.465 1.016-1.2-.8a11.315 11.315 0 0 0 .945-2.079C.615 10.654.5 11.409.1 11.339c-.382-.071.445-1.914.988-2.693z" className="faq-svg-liz-10" data-name="Shape" transform="translate(19.652 61.441)"/>
                        <path id="Shape-72" d="M1.984 2.339c.047.024-.165.378-.307 1.039-.047.165-.094.354-.142.543s-.118.425-.189.638a4.512 4.512 0 0 1-.354.661 1.156 1.156 0 0 1-.283.307.824.824 0 0 1-.209.142.35.35 0 0 1-.165.024c-.071 0-.118-.047-.189-.071a.326.326 0 0 1-.071-.094.087.087 0 0 1-.024-.071.3.3 0 0 1-.024-.142.969.969 0 0 1-.027-.26 3.524 3.524 0 0 1 .047-.5A11.378 11.378 0 0 1 .5 2.74a6.427 6.427 0 0 0 .091-1.464A1.638 1.638 0 0 1 .85.26a1.931 1.931 0 0 1 .189-.213C1.087 0 1.11 0 1.134 0a.146.146 0 0 1-.047.094.326.326 0 0 0-.071.094L.945.331a2.092 2.092 0 0 0-.145.945 4.827 4.827 0 0 1-.02 1.535 2.856 2.856 0 0 0-.118.425c-.047.142-.071.283-.118.425-.071.307-.142.614-.189.921a3.2 3.2 0 0 0-.047.472v.213a.142.142 0 0 0 .024.094v.024h.022c.024 0 .071-.047.118-.071a1.238 1.238 0 0 0 .236-.26 3.907 3.907 0 0 0 .354-.591 3.6 3.6 0 0 0 .213-.591c.071-.189.118-.378.165-.543a2.751 2.751 0 0 1 .544-.99z" className="faq-svg-liz-20" data-name="Shape" transform="translate(21.402 65.008)"/>
                        <path id="Shape-73" d="M3.639 1.49c.543 2.764-.827 10.441-.992 12.969S.285 13.182.285 13.182-.022 7.324 0 5.741s.4-3.331.354-4.3 2.765-2.715 3.285.049z" className="faq-svg-liz-10" data-name="Shape" transform="translate(21.802 48.92)"/>
                        <g id="Group-8" data-name="Group" transform="translate(21.732 61.89)">
                          <path id="Shape-74" d="M2.835 1.11H.236A.237.237 0 0 1 0 .874V.236A.254.254 0 0 1 .236 0h2.6a.237.237 0 0 1 .236.236v.638a.254.254 0 0 1-.237.236z" className="faq-svg-liz-24" data-name="Shape" transform="translate(.047 .496)"/>
                          <path id="Shape-75" d="M.212 1.707h-.1c-.077 0-.128-.071-.1-.118L.16.1A.1.1 0 0 1 .288.006h.1c.077 0 .128.071.1.118L.34 1.612a.1.1 0 0 1-.128.095z" className="faq-svg-liz-25" data-name="Shape" transform="translate(2.805 .206)"/>
                        </g>
                      </g>
                    </g>
                  </g>
                  <text id="Order_cancellation_-" className="faq-svg-liz-27" data-name="Order cancellation -" transform="translate(736 426)">
                    <tspan x="0" y="13">Order cancellation - terms</tspan><tspan x="0" y="31">and conditions</tspan>
                  </text>
                  <text id="How_do_I_return_an_i" className="faq-svg-liz-27" data-name="How do I return an i" transform="translate(736 482)">
                    <tspan x="0" y="13">How do I return an item</tspan><tspan x="0" y="31">that I didn’t like?</tspan>
                  </text>
                  <circle id="Oval_6" cx="4.5" cy="4.5" r="4.5" fill="#05bf50" stroke="#f5f2f2" strokeMiterlimit="10" data-name="Oval 6" transform="translate(750 240)"/>
                  <text id="I_have_not_received" className="faq-svg-liz-27" data-name="I have not received" transform="translate(736 535)">
                    <tspan x="0" y="13">I have not received my </tspan><tspan x="0" y="31">refund</tspan>
                  </text>
                  <text id="I_have_a_different_i" className="faq-svg-liz-27" data-name="I have a different i" transform="translate(762 593)">
                    <tspan x="0" y="13">I have a different issue</tspan>
                  </text>
                  <g id="quetion_help_copy" data-name="quetion help copy" transform="translate(740 595)">
                    <g id="Group-9" data-name="Group" transform="translate(0 .092)">
                      <path id="Shape-76" fill="none" stroke="#6353d8" strokeMiterlimit="10" strokeWidth=".5" d="M6.356 12.791a6.383 6.383 0 1 1 6.355-6.383 6.377 6.377 0 0 1-6.355 6.383zm0-3.155a.578.578 0 1 0 0 1.156.578.578 0 0 0 .578-.578.586.586 0 0 0-.578-.579zm-.009-6.988a2.448 2.448 0 0 1 1.611.623 1.534 1.534 0 0 1 .546 1.4 1.945 1.945 0 0 1-1.14 1.627l-.02.012-.157.094a2.22 2.22 0 0 0-.844.789 2.861 2.861 0 0 0-.266 1.657.289.289 0 0 0 .289.294.284.284 0 0 0 .171-.056.291.291 0 0 0 .113-.283 2.278 2.278 0 0 1 .194-1.323 1.667 1.667 0 0 1 .646-.587l.072-.044a2.745 2.745 0 0 0 1.515-2.082 2.124 2.124 0 0 0-.727-1.922 3 3 0 0 0-2-.777 2.7 2.7 0 0 0-2.74 2.65.289.289 0 1 0 .578 0 2.121 2.121 0 0 1 2.159-2.072z" data-name="Shape"/>
                    </g>
                  </g>
                  <path id="Line" d="M0 1h223" className="faq-svg-liz-30" transform="translate(720 472)"/>
                  <path id="Line_Copy" d="M0 1h223" className="faq-svg-liz-30" data-name="Line Copy" transform="translate(720 525)"/>
                  <path id="Line_Copy_2" d="M0 1h223" className="faq-svg-liz-30" data-name="Line Copy 2" transform="translate(720 578)"/>
                  <text id="Here_are_a_few_FAQs" data-name="Here are a few FAQs" className="faq-svg-liz-40" fill="#646262" transform="translate(729 355)">
                    <tspan x="0" y="15">Here are a few FAQs that </tspan><tspan x="0" y="34">might help</tspan>
                  </text>
                  <g id="Rectangle_11" fill="none" stroke="#fff" strokeDasharray="2" strokeMiterlimit="10" data-name="Rectangle 11" transform="translate(916 216)">
                    <rect width="76" height="27" className="faq-svg-liz-33" rx="1"/>
                    <rect width="75" height="26" x=".5" y=".5" className="faq-svg-liz-34" rx=".5"/>
                  </g>
                </g>
              </svg>
            </div>
          </div>


        </div>


      </div>
    )
  }
}

export default Tabs;