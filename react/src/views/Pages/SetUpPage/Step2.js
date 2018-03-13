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


  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }
  render() {
    return (
      <form className="form-horizontal" onSubmit={this.finishSetUp}>
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
                              <input className="input" type="text" id="company-name" name="company-name" placeholder=" "  value={this.state.company_name} onChange={(event) => { this.setState({ company_name: event.target.value }) }} />
                              <label className="label-for-input email-label">Company <span>(Optional)</span></label>
                            </div>
                            <div className="group form-group email-form-group">
                              <input className="input" type="text" id="role-input" name="role-input" placeholder=" "  value={this.state.role} onChange={(event) => { this.setState({ role: event.target.value }) }} />
                              <label className="label-for-input email-label">Designation <span>(Optional)</span></label>
                            </div>
                            <div className="group form-group email-form-group">
                              <input className="input" type="tel" pattern="^\d{10}$" required id="number-input" name="number-input" placeholder=" "  value={this.state.contact_no}  onChange={(event) => { this.setState({ contact_no: event.target.value }) }} />
                              <label className="label-for-input email-label">Contact No.</label>
                            </div>
                            <div className="group form-group selectt">
                              <select className="select" id="industry" name="industry" onChange={(event) => { this.setState({ industry: event.target.value }) }} value={this.state.industry}>
                                <option value="0" ></option>
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
                              <label className="label-for-input email-label km-label1">Industry Type</label>
                              <label className="label-for-input email-label km-label3">(Optional)</label>
                            </div>


                            <div className={((this.state.industry === "Other") ? 'form-group group' : 'n-vis')}>
                              <input className="input" type="text" id="industry-others" name="industry-others" onChange={(event) => this.setState({ industryOthers: event.target.value })} value={this.state.industryOthers} placeholder=" " />
                              <label className="label-for-input email-label">Other Industry</label>
                            </div>
                            <div className="group form-group selectt">
                              <select className="select" id="company-size" name="company-size" onChange={(event) => { this.setState({ company_size: event.target.value }) }} value={this.state.company_size}>
                                <option value="0"></option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="500">500</option>
                              </select>
                              {/* <label className="label-for-input email-label">Company Size</label> */}
                              <label className="label-for-input email-label km-label1">Company Size</label>
                              <label className="label-for-input email-label km-label2">(Optional)</label>
                            </div>
                            <div className="form-group setup-btn-group">
                              <div>
                                <button className="btn btn-sm btn-primary px-4 btn-primary-custom">Save and continue </button>                               
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