import React, { Component } from 'react';
import { patchCustomerInfo, patchUserInfo, getCustomerInfo, getUserInfo } from '../../utils/kommunicateClient'
import ApplozicClient from '../../utils/applozicClient'
import Notification from '../model/Notification';
import ImageUploader from './ImageUploader'
import './Admin.css';
import Modal from 'react-modal';
import PasswordAccordion from './PasswordAccordion';
import CommonUtils from '../../utils/CommonUtils';
import {SettingsHeader} from '../../../src/components/SettingsComponent/SettingsComponents';
import Button from '../../components/Buttons/Button';

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
      imageFile: CommonUtils.getUserSession().imageLink,
      fileObject: {},
      hideRole:false,
      hideLoader:true,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.industries = ['Please select', 'E-commerce', 'Marketplaces', 'SaaS', 'E-learning', 'Healthcare', 'On-Demand Services', 'Social', 'Fin Tech', 'Entertainment', 'Gaming', 'Travel', 'Other'];
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleScale = this.handleScale.bind(this);

  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ 
      modalIsOpen: false,
      hideLoader : false 
    });
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
	    userSession.contactNo=this.state.contact;
            CommonUtils.setUserSession(userSession);
            Notification.info(response.data.message)      
          }
        }).catch(err => {
          console.log(err);
          alert(err);
        });
    }else if(CommonUtils.isApplicationAdmin(userSession)){
      ApplozicClient.updateUserDetail({ofUserId:userSession.userName, userDetails:user}).then(response=>{
        if (response.data.status === 'success') {
          this.updateKommunicateSupportUser(user)
          Notification.info("user updated successfully")
        }
      })
    } else {
      patchUserInfo(customerInfo, userSession.userName, userSession.application.applicationId)
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

  invokeImageUpload = (e) => {
    e.preventDefault()

    let hiddenImageInputElem = document.getElementById("hidden-image-input-element");

    if (hiddenImageInputElem) {
      hiddenImageInputElem.click()
    }
  };
  handleImageFiles = (e) => {
    var file_name = document.getElementById("hidden-image-input-element").value;
    var file_extn = file_name.split('.').pop().toLowerCase();
    console.log(file_name)
    console.log(file_extn)
    e.preventDefault()
    const files = e.target.files;
    const file = files[0];
    this.setState({ fileObject: file })
    console.log(file)
    let imageTypeRegex = /^image\//
    if (file && imageTypeRegex.test(file.type)) {
      if (file.size <= 5000000) {

        let img = document.createElement("img")
        img.height = 90
        img.width = 60
        img.classList.add("obj")
        img.file = file

        //thumbnail.appendChild(img)

        let reader = new FileReader()
        reader.onload = (function (aImg) { return function (e) { aImg.src = e.target.result; }; })(img);
        reader.readAsDataURL(file);

        this.openModal();

      } else if (file.size > 5000000) {
        Notification.info("Size exceeds 5MB")
        return
      }
    }
  }
  setCustomerProfile=(customerInfo)=>{
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

  hideLoader = () =>{
    this.setState({ hideLoader:true });
  }

  componentWillMount() {
    var userSession = CommonUtils.getUserSession();
    if (userSession.isAdmin) {
      return Promise.resolve(getCustomerInfo(CommonUtils.getUserSession().userName))
        .then(response => {
          if (response.data.code === 'SUCCESS') {
            this.setCustomerProfile(response.data.data);
          }
        }).catch(err => { alert(err) });
    } else if(CommonUtils.isApplicationAdmin(userSession)){
      let criteria ={
        applicationId : userSession.application.applicationId,
        userName : userSession.userName,
        accessToken : userSession.accessToken,
        isAdmin: CommonUtils.isApplicationAdmin(userSession),
        params:{
          roleNameList : "USER",
          userId:userSession.userName,
        }
        }
     ApplozicClient.getUserListByCriteria(criteria).then(result=>{
       if (result.status === 'success' && result.response.users.length>0) {
        result.response.users[0].name=result.response.users[0].displayName;
        result.response.users[0].contactNo=result.response.users[0].phoneNumber
        this.setCustomerProfile(result.response.users[0]);
        this.setState({hideRole:true})
      }

     })
    }else {
      console.log("isNotAdmin")
      return Promise.resolve(getUserInfo(CommonUtils.getUserSession().userName, userSession.application.applicationId))
        .then(response => {
          if (response.data.code === 'SUCCESS') {
            this.setCustomerProfile(response.data.data);
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
                <form className="form-horizontal" autoComplete="off">
                  <div className="form-group row">
                    <div className="col-md-7 col-sm-12">
                      <div className="row">
                        <div className="col-sm-12">
                          <label className="form-control-label" htmlFor="admin-name">Name:</label>
                          <input type="text" id="admin-name" name="admin-name" onChange={(event) => this.setState({ name: event.target.value })} value={this.state.name} className="form-control input-field" placeholder="Enter your name" /><br />

                          <label className="form-control-label" htmlFor="email-input">Email:</label>
                          <input type="email" id="email-input" name="email-input" onChange={(event) => this.setState({ email: event.target.value })} value={this.state.email} className="form-control input-field" placeholder="Enter Email" disabled /><br />

                          <label className="form-control-label" hidden={this.state.hideRole} htmlFor="role-input">Designation:</label>
                          <input type="text" id="role-input" hidden={this.state.hideRole} name="role-input" onChange={(event) => this.setState({ role: event.target.value })} value={this.state.role} className="form-control input-field" placeholder="Role within the organization" /><br hidden={this.state.hideRole} />

                          <label className="form-control-label" htmlFor="number-input">Contact Number (optional):</label>
                          <input type="text" id="number-input" maxLength="20" name="number-input" onKeyPress={this.handleKeyPress} onChange={(event) => this.setState({ contact: event.target.value })} value={this.state.contact} className="form-control input-field" placeholder="Enter contact number" /><br />

                          <Button autoFocus={true} type="submit" onClick={this.handleSubmit}>Save changes </Button>
                        </div>
                      </div>
                    </div>


                    <div className="col-md-5 display-photo-wrapper">

                      <div className="display-photo-wrapper-container text-center">
                      <div className=" ui tab loading show-loader profile-loader" hidden={this.state.hideLoader}></div>
                        <img src={ this.props.profilePicUrl } className="default-dp change-courser"  onClick={this.invokeImageUpload}/> 

                        <div className="edit-dp-btn">
                          <Button link className="change-courser" onClick={this.invokeImageUpload} style={{height: "20px"}}>Edit Display Photo</Button>
                          <div className="about-dp">Your customers will see this photo</div>

                          <input type="file" accept="image/*" className="form-control user-dp-input" id="hidden-image-input-element" name="file" onChange={this.handleImageFiles} />
                          <Modal
                            isOpen={this.state.modalIsOpen}
                            ariaHideApp={false}
                            onRequestClose={this.closeModal}
                            style={customStyles} 
                            >
                            <div>
                              <ImageUploader
                                allowZoomOut={true}
                                width={300}
                                height={300}
                                borderRadius={250}
                                profileImageUploader={true}
                                handleImageFiles={this.handleImageFiles}
                                invokeImageUpload={this.invokeImageUpload}
                                uploadImageToS3={this.uploadImageToS3}
                                updateProfilePicUrl={this.props.updateProfilePicUrl}
                                handleClose={this.closeModal}
                                fileObject={this.state.fileObject}
                                hideLoader={this.hideLoader}
                                color={[255, 255, 255, 0.6]}
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

                <hr className="divider" />
          </div>
        </div>
      </div>
    )
  }
}

export default Forms;

