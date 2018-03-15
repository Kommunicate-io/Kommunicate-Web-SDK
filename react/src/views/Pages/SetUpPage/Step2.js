import React, { Component } from 'react';

import { patchCustomerInfo } from '../../../utils/kommunicateClient'
import { Link } from 'react-router-dom';
import Notification from '../../model/Notification';
import ImageUploader from '../../Admin/ImageUploader'
import Modal from 'react-modal';
import '../../Admin/Admin.css';
import { getResource } from '../../../config/config.js';
import isURL from 'validator/lib/isURL';
import CommonUtils from '../../../utils/CommonUtils';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    overflow: 'hidden',
    height: '450px',
    width: '600px'
  }
};
class Step2 extends Component {

  constructor(props) {
    super(props)

    this.state = {
      websiteUrl: '',
      name: '',
      role: '',
      contact_no: '',
      company_name: '',
      company_size: '',
      industry: '',
      industryOthers: '',
      imageFile: '',
      modalIsOpen: false,
      scale: 1.2,
      imageFile: CommonUtils.getUserSession().imageLink,
      isCompanyUrlError: true,
      nextStep:3
    }
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.updateProfileImgUrl = this.updateProfileImgUrl.bind(this);
  }
  updateProfileImgUrl(url) {
    this.setState({
      imageFile: url == null ? "/img/avatars/default.png" : url
    });
    console.log("profilePicUrl updated", this.state.imageLink)
  }

  finishSetUp = (e) => {
    e.preventDefault();
    if(document.getElementById("number-input").value ===""|| document.getElementById("number-input").value === null){
      document.getElementById("emptyerror").className = 'input-error-div vis';
      document.getElementById("number-input").className = 'input km-error-input';
      return;
    }
    document.getElementById("emptyerror").className = 'n-vis';
    let userSession = CommonUtils.getUserSession();
    const customerInfo = {
      applicationId: userSession.application.applicationId,
      websiteUrl: this.props.customerInfo.websiteUrl,
      name: this.props.customerInfo.name,
      role: this.state.role,
      contactNo: this.state.contact_no,
      companyName: this.state.company_name,
      companySize: this.state.company_size,
      industry: (this.state.industry === "Other") ? this.state.industryOthers : this.state.industry,
    }
    console.log(customerInfo);
    patchCustomerInfo(customerInfo, CommonUtils.getUserSession().userName)
      .then(response => {
        if (response.data.code === 'SUCCESS') {
          console.log("Setup completed successfully");
        }
      }).catch(err => { console.log('userInfo not saved') });
      userSession.name = customerInfo.name;
      userSession.adminDisplayName = customerInfo.name;
      CommonUtils.setUserSession(userSession)
     this.props.moveToNextStep(customerInfo,this.state.nextStep)
  }
  onFocus (){
    document.getElementById("emptyerror").className = 'n-vis';
    document.getElementById("number-input").className = 'input';
}
  
  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }
  render() {
    return (
      <form className="form-horizontal">
        <div className="animated fadeIn">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-block">
                  <div className="form-horizontal">
                    <div className="col-lg-12 text-center setup-profile-div">
                      <div className="step-number-div">2/3</div>
                      <h1 className="setup-heading">Profile Setup</h1>
                      <h4 className="setup-sub-heading">Setting up your company name, profile photo, designation etc.</h4>
                    </div>
                    <div className="form-group row">
                      <div className="col-md-6 text-center pt-100">
                        <img src={this.state.imageFile} className="default-dp"></img><br />
                        <div className="edit-dp-btn">
                          <br /><h5 className="change-courser" onClick={this.openModal}>Edit Display Photo</h5>
                          <div className="about-dp">Your customers will see this photo</div>
                          <Modal
                            isOpen={this.state.modalIsOpen}

                            onRequestClose={this.closeModal}
                            style={customStyles}
                            contentLabel="Example Modal"
                          >
                            <div className="change-courser close-icon pull-right" onClick={this.closeModal}>X</div>
                            <div className="row">
                              <ImageUploader
                                handleImageFiles={this.handleImageFiles}
                                invokeImageUpload={this.invokeImageUpload}
                                uploadImageToS3={this.uploadImageToS3}
                                updateProfileImgUrl={this.updateProfileImgUrl}
                                handleClose={this.closeModal}
                              />
                            </div>
                          </Modal>
                        </div>

                      </div>
                      <div className="col-md-4">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="group form-group email-form-group">
                              <input className="input" type="text" id="company-name" required name="company-name" placeholder=" " onFocus={this.onFocus} value={this.state.company_name} onChange={(event) => { this.setState({ company_name: event.target.value }) }} />
                              <label className="label-for-input email-label">Company <span className="km-italic">(Optional)</span></label>
                            </div>
                            <div className="group form-group email-form-group">
                              <input className="input" type="text" id="role-input" required name="role-input" placeholder=" " onFocus={this.onFocus} value={this.state.role} onChange={(event) => { this.setState({ role: event.target.value }) }} />
                              <label className="label-for-input email-label">Designation <span className="km-italic">(Optional)</span></label>
                            </div>
                            <div className="group form-group email-form-group">
                            <input className="input" type="number" id="number-input" required maxLength="20" minLength="10" name="number-input" placeholder=" "  value={this.state.contact_no} onChange={(event) => { this.setState({ contact_no: event.target.value }) }} />
                              <label className="label-for-input email-label">Contact No.</label>
                              <div id="emptyerror" className="input-error-div n-vis">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                <g id="Page-1" fill="none" fill-rule="evenodd">
                                  <g id="Framework" transform="translate(-77 -805)" fill="#ED1C24">
                                    <g id="Wrong-Value-with-Notification" transform="translate(77 763)">
                                      <g id="Error-Notification" transform="translate(0 40)">
                                        <path d="M0,10 C0,5.582 3.581,2 8,2 C12.418,2 16,5.582 16,10 C16,14.418 12.418,18 8,18 C3.581,18 0,14.418 0,10 Z M9.315,12.718 C9.702,13.105 10.331,13.105 10.718,12.718 C11.106,12.331 11.106,11.702 10.718,11.315 L9.41,10.007 L10.718,8.698 C11.105,8.311 11.105,7.683 10.718,7.295 C10.33,6.907 9.702,6.907 9.315,7.295 L8.007,8.603 L6.694,7.291 C6.307,6.903 5.678,6.903 5.291,7.291 C4.903,7.678 4.903,8.306 5.291,8.694 L6.603,10.006 L5.291,11.319 C4.903,11.707 4.903,12.335 5.291,12.722 C5.678,13.11 6.307,13.11 6.694,12.722 L8.007,11.41 L9.315,12.718 Z" id="Error-Icon"></path>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </svg>
                              <span className="input-error-message">This field is mandatory</span>
                            </div>
                            </div>
                            <div className="group form-group selectt">
                              <select className="select" id="industry" name="industry" onChange={(event) => { document.getElementById("km-industry1").className = 'n-vis'; document.getElementById("km-industry2").className = 'n-vis';this.setState({ industry: event.target.value }) }} value={this.state.industry}>
                                <option value="0" >Please select a value</option>
                                <option value="E-commerce">E-commerce</option>
                                <option value="Marketplaces">Marketplaces</option>
                                <option value="SaaS">SaaS</option>
                                <option value="E-learning">E-learning</option>
                                <option value="Healthcare"> Healthcare</option>
                                <option value="On-Demand Services">On-Demand Services</option>
                                <option value="Social">Social</option>
                                <option value="Fin Tech">Fin Tech</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Gaming"> Gaming</option>
                                <option value="Travel">Travel</option>
                                <option value="Other"> Any Other (Please specify)</option>
                              </select>
                              <label id="km-industry1"className="label-for-input email-label km-label1">Industry Type</label>
                              <label id="km-industry2"className="label-for-input email-label km-label3">(Optional)</label>
                            </div>


                            <div className={((this.state.industry === "Other") ? 'form-group group' : 'n-vis')}>
                              <input className="input" type="text" id="industry-others" name="industry-others" onChange={(event) => this.setState({ industryOthers: event.target.value })} value={this.state.industryOthers} placeholder=" " />
                              <label className="label-for-input email-label">Other Industry</label>
                            </div>
                            <div className="group form-group selectt">
                              <select className="select" id="company-size" name="company-size" onChange={(event) => { document.getElementById("km-label1").className = 'n-vis'; document.getElementById("km-label2").className = 'n-vis';this.setState({ company_size: event.target.value }) }} value={this.state.company_size}>
                                <option value="0">Please select a value</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="500">500</option>
                              </select>
                              {/* <label className="label-for-input email-label">Company Size</label> */}
                              <label id ="km-label1"className="label-for-input email-label km-label1">Company Size</label>
                              <label id ="km-label2" className="label-for-input email-label km-label2">(Optional)</label>
                            </div>
                            <div className="form-group setup-btn-group">
                              <div>
                                <button className="btn btn-sm btn-primary px-4 btn-primary-custom"onClick={this.finishSetUp}>Save and continue </button>                               
                                {/* <a className="step2-skip-link" onClick={this.finishSetUp}>Skip for now</a> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }
}

export default Step2