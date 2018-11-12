import React, { Component } from 'react';
import { patchCustomerInfo, patchUserInfo, getCustomerInfo, getUserInfo } from '../../utils/kommunicateClient'
import Notification from '../model/Notification';
import ImageUploader from './ImageUploader'
import './Admin.css';
import Modal from 'react-modal';
import PasswordAccordion from './PasswordAccordion';
import CommonUtils from '../../utils/CommonUtils';
import {SettingsHeader} from '../../../src/components/SettingsComponent/SettingsComponents';




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

class Forms extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      role: '',
      email: '',
      contact: '',
      companyname: '',
      companysize: '',
      industry: '',
      industryOthers: '',
      modalIsOpen: false,
      scale: 1.2,
      imageFile: CommonUtils.getUserSession().imageLink
     
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.industries = ['Please select', 'E-commerce', 'Marketplaces', 'SaaS', 'E-learning', 'Healthcare', 'On-Demand Services', 'Social', 'Fin Tech', 'Entertainment', 'Gaming', 'Travel', 'Other'];
    //this.handlePassword = this.handlePassword.bind(this);
    //this.validatePassword = this.validatePassword.bind(this);
    //this.clearPasswordfields = this.clearPasswordfields.bind(this)
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleScale = this.handleScale.bind(this);

  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  handleKeyPress(event) {
    var num = this.state.contact;
    if (isNaN(num)) {
      alert("Must input numbers");
      this.setState({ contact: '' })
      return;
    }
  }

  updateKommunicateSupportUser = (user) => {
    //update name in applozic db for user created under kommunicate-support app
    window.$applozic.fn.applozic('updateUser', {
      data: user, success: function (response) {
      }, error: function (error) {
        console.log(error);
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    console.log('handle submit');
    let userSession = CommonUtils.getUserSession();

    const customerInfo = {
      "name": this.state.name,
      "role": this.state.role,
      "email": this.state.email,
      "contactNo": this.state.contact,
      "companyName": this.state.companyname,
      "companySize": this.state.companysize,
      "industry": this.state.industry === "Other" ? this.state.industryOthers : this.state.industry,
      "applicationId": userSession.application.applicationId
    }
    let user = {
      'email': this.state.email, 
      'displayName': this.state.name, 
      'phoneNumber':this.state.contact
    };

        
    if (userSession.isAdmin) {
      patchCustomerInfo(customerInfo, CommonUtils.getUserSession().userName)
        .then(response => {
          if (response.data.code === 'SUCCESS') {
            this.updateKommunicateSupportUser(user)
            userSession.adminDisplayName=this.state.name;
            CommonUtils.setUserSession(userSession);
            Notification.info(response.data.message)      
          }
        }).catch(err => {
          console.log(err);
          alert(err);
        });
    } else {
      patchUserInfo(customerInfo, CommonUtils.getUserSession().userName, userSession.application.applicationId)
        .then(response => {
          if (response.data.code === 'SUCCESS') {
            this.updateKommunicateSupportUser(user)
            Notification.info(response.data.message)
          }
        }).catch(err => {
          console.log(err);
          alert(err);
        });
    }
    userSession.name=this.state.name;
    userSession.email=this.state.email;
    CommonUtils.setUserSession(userSession);
    this.props.updateUserDisplay(this.state.name);
  }

  handleReset(e) {
    e.preventDefault();
  }
  handleScale(event) {
    this.setState({
      scale: event.target.value / 100
    })
  }


  componentWillMount() {
    var userSession = CommonUtils.getUserSession();
    if (userSession.isAdmin) {
      return Promise.resolve(getCustomerInfo(CommonUtils.getUserSession().userName))
        .then(response => {
          if (response.data.code === 'SUCCESS') {
            const customerInfo = response.data.data;
            this.setState({
              name: customerInfo.name ? customerInfo.name : '',
              role: customerInfo.role ? customerInfo.role : '',
              email: customerInfo.email ? customerInfo.email : '',
              contact: customerInfo.contactNo ? customerInfo.contactNo : '',
              companyname: customerInfo.companyName ? customerInfo.companyName : '',
              industry: this.industries.includes(customerInfo.industry) ? customerInfo.industry : 'Other',
              companysize: customerInfo.companySize ? customerInfo.companySize : ''
            });
            if (this.state.industry === 'Other') {
              this.setState({ industryOthers: customerInfo.industry ? customerInfo.industry : '' })
            }
          }
        }).catch(err => { alert(err) });
    } else {
      console.log("isNotAdmin")

      return Promise.resolve(getUserInfo(CommonUtils.getUserSession().userName, userSession.application.applicationId))
        .then(response => {
          if (response.data.code === 'SUCCESS') {
            const customerInfo = response.data.data;
            this.setState({
              name: customerInfo.name ? customerInfo.name : '',
              role: customerInfo.role ? customerInfo.role : '',
              email: customerInfo.email ? customerInfo.email : '',
              contact: customerInfo.contactNo ? customerInfo.contactNo : '',
              companyname: customerInfo.companyName ? customerInfo.companyName : '',
              industry: this.industries.includes(customerInfo.industry) ? customerInfo.industry : 'Other',
              companysize: customerInfo.companySize ? customerInfo.companySize : ''
            });
            if (this.state.industry === 'Other') {
              this.setState({ industryOthers: customerInfo.industry ? customerInfo.industry : '' })
            }
          }
        }).catch(err => { console.log(err) });
    }
  }


  render() {
    return (

      <div className="animated fadeIn km-profile-section-container">
      <div className="km-heading-wrapper">
					<SettingsHeader  />
				</div>	
        <div className="row km-profile-wrapper">

          <div className="col-md-12">

            <div className="card">
              <div className="card-block">
                <form className="form-horizontal" autoComplete="off">
                  <div className="form-group row">
                    
                    <div className="col-md-6 col-sm-12">
                      <div className="row">
                        <div className="col-md-9 col-sm-12">
                          <label className="form-control-label" htmlFor="admin-name">Name:</label>
                          <input type="text" id="admin-name" name="admin-name" onChange={(event) => this.setState({ name: event.target.value })} value={this.state.name} className="form-control input-field" placeholder="Enter your name" /><br />

                          <label className="form-control-label" htmlFor="email-input">Email:</label>
                          <input type="email" id="email-input" name="email-input" onChange={(event) => this.setState({ email: event.target.value })} value={this.state.email} className="form-control input-field" placeholder="Enter Email" disabled /><br />

                          <label className="form-control-label" htmlFor="role-input">Designation:</label>
                          <input type="text" id="role-input" name="role-input" onChange={(event) => this.setState({ role: event.target.value })} value={this.state.role} className="form-control input-field" placeholder="Role within the organization" /><br />

                          <label className="form-control-label" htmlFor="number-input">Contact Number (optional):</label>
                          <input type="text" id="number-input" maxLength="20" name="number-input" onKeyPress={this.handleKeyPress} onChange={(event) => this.setState({ contact: event.target.value })} value={this.state.contact} className="form-control input-field" placeholder="Enter contact number" /><br />

                          <button className="km-button km-button--primary" autoFocus={true} type="submit" onClick={this.handleSubmit}>Save changes </button>
                        </div>
                      </div>
                    </div>


                    <div className="col-md-4 display-photo-wrapper">

                      {/* <ImageUploader
                          handleImageFiles={this.handleImageFiles}
                          invokeImageUpload={this.invokeImageUpload}
                          uploadImageToS3={this.uploadImageToS3}
                          updateProfilePicUrl={this.props.updateProfilePicUrl}
                        /> */}

                      <div className="display-photo-wrapper-container text-center">
                        <img src={ this.props.profilePicUrl } className="default-dp change-courser"  onClick={this.openModal}/> 

                        <div className="edit-dp-btn">
                          <span className="change-courser" onClick={this.openModal}>Edit Display Photo</span>
                          <div className="about-dp">Your customers will see this photo</div>

                          <Modal
                            isOpen={this.state.modalIsOpen}
                            ariaHideApp={false}
                            onRequestClose={this.closeModal}
                            style={customStyles} >
                            <div>
                              <ImageUploader
                                handleImageFiles={this.handleImageFiles}
                                invokeImageUpload={this.invokeImageUpload}
                                uploadImageToS3={this.uploadImageToS3}
                                updateProfilePicUrl={this.props.updateProfilePicUrl}
                                handleClose={this.closeModal}
                              />
                            </div>
                          </Modal>
                        </div>
                      </div>

                      

                      </div>

                  </div>
                  <hr className="divider" />

                </form>

                <PasswordAccordion />

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Forms;

