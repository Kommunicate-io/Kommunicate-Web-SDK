import React, { Component } from 'react';
import  {getEnvironmentId,get} from '../../config/config.js';
import {patchCustomerInfo, patchUserInfo, getCustomerInfo, getUserInfo, sendProfileImage, updateApplozicUser, changePassword } from '../../utils/kommunicateClient'
import Notification from '../model/Notification';
import ImageUploader from './ImageUploader'
import './Admin.css';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import AvatarEditor from 'react-avatar-editor'
import PasswordAccordion from './PasswordAccordion';
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
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
      imageFile: '',
      modalIsOpen: false
      
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.industries = ['Please select', 'E-commerce', 'Marketplaces', 'SaaS', 'E-learning', 'Healthcare', 'On-Demand Services', 'Social', 'Fin Tech', 'Entertainment', 'Gaming', 'Travel' , 'Other'];
    //this.handlePassword = this.handlePassword.bind(this);
    //this.validatePassword = this.validatePassword.bind(this);
    //this.clearPasswordfields = this.clearPasswordfields.bind(this)
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);   
  }
  
  openModal() {
    this.setState({modalIsOpen: true});
  }



  closeModal() {
    this.setState({modalIsOpen: false});
  }

  handleKeyPress(event) {
    var num = this.state.contact;
    if (isNaN(num))
    {
      alert("Must input numbers");
      this.setState({contact: ''})
      return;
    }
  }

  handleSubmit(e) {
  
    e.preventDefault();

    console.log('handle submit')

    const customerInfo = {
      "name" : this.state.name,
      "role" : this.state.role,
      "email" : this.state.email,
      "contactNo" : this.state.contact,
      "companyName": this.state.companyname,
      "companySize":this.state.companysize,
      "industry": this.state.industry === "Other" ? this.state.industryOthers : this.state.industry,
      "applicationId": localStorage.getItem('applicationId')
    }

    if(localStorage.getItem("isAdmin") === 'true'){
      patchCustomerInfo(customerInfo, localStorage.getItem("loggedinUser"))
          .then(response => {
            console.log(response)
            if(response.data.code === 'SUCCESS'){
              Notification.info(response.data.message)
            }
          }).catch(err => {
            console.log(err);
            alert(err);
          });
    }else{
      patchUserInfo(customerInfo, localStorage.getItem("loggedinUser"), localStorage.getItem("applicationId"))
          .then(response => {
            console.log(response)
            if(response.data.code === 'SUCCESS'){
              Notification.info(response.data.message)
            }
          }).catch(err => {
            console.log(err);
            alert(err);
          });
    }
  }

  handleReset(e){
    e.preventDefault();
  }
  
  
  componentWillMount() {

    console.log("Admin will mount");
    console.log(localStorage.getItem("isAdmin"))

    if(localStorage.getItem("isAdmin") === 'true'){
      console.log("isAdmin")
      getCustomerInfo(localStorage.getItem("loggedinUser"))
          .then(response => {
            console.log(response)
            if(response.data.code === 'SUCCESS'){
              const customerInfo = response.data.data;
              this.setState({
                name: customerInfo.name ? customerInfo.name:'' ,
                role: customerInfo.role ? customerInfo.role:'',
                email: customerInfo.email ? customerInfo.email:'' ,
                contact: customerInfo.contactNo ? customerInfo.contactNo:'',
                companyname: customerInfo.companyName ? customerInfo.companyName: '',
                industry: this.industries.includes(customerInfo.industry) ? customerInfo.industry:'Other',
                companysize: customerInfo.companySize ? customerInfo.companySize:''
              });
              if(this.state.industry === 'Other'){
                this.setState({industryOthers: customerInfo.industry ? customerInfo.industry:''})
              }
            }
          }).catch(err => {alert(err)});
    }else{
      console.log("isNotAdmin")

      getUserInfo(localStorage.getItem("loggedinUser"), localStorage.getItem("applicationId"))
          .then(response => {
            console.log(response)
            if(response.data.code === 'SUCCESS'){
              const customerInfo = response.data.data;
              this.setState({
                name: customerInfo.name ? customerInfo.name:'' ,
                role: customerInfo.role ? customerInfo.role:'',
                email: customerInfo.email ? customerInfo.email:'' ,
                contact: customerInfo.contactNo ? customerInfo.contactNo:'',
                companyname: customerInfo.companyName ? customerInfo.companyName: '',
                industry: this.industries.includes(customerInfo.industry) ? customerInfo.industry:'Other',
                companysize: customerInfo.companySize ? customerInfo.companySize:''
              });
              if(this.state.industry === 'Other'){
                this.setState({industryOthers: customerInfo.industry ? customerInfo.industry:''})
              }
            }
          }).catch(err => {console.log(err)});
    }
  }


  render() {
    return (

        <div className="animated fadeIn">

          <div className="row">

            <div className="col-md-12">
              
              <div className="card">
                <div className="card-block">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="brand-header">
                        <h5>Profile</h5>
                      </div>
                    </div>
                  </div>
                  <form className="form-horizontal" autocomplete="off">
                    <div className="form-group row">
                      <div className="col-md-4">
                      <ImageUploader
                          handleImageFiles={this.handleImageFiles}
                          invokeImageUpload={this.invokeImageUpload}
                          uploadImageToS3={this.uploadImageToS3}
                          updateProfilePicUrl={this.props.updateProfilePicUrl}
                        /> 
                        {/*
                        <img src="/img/avatars/default.png" className="default-dp"></img><br/>
                        <div className="edit-dp-btn">
                          <br/><h5 className="change-courser" onClick={this.openModal}>Edit Display Photo</h5>
                          
                          <Modal
                              isOpen={this.state.modalIsOpen}

                              onRequestClose={this.closeModal}
                              style={customStyles}
                              contentLabel="Example Modal"
                              >

                            <div className="change-courser" onClick={this.closeModal}>close</div>
                            <div>I am a modal</div>
                            <div className="row">
                              <ImageUploader
                                  handleImageFiles={this.handleImageFiles}
                                  invokeImageUpload={this.invokeImageUpload}
                                  uploadImageToS3={this.uploadImageToS3}
                                  updateProfilePicUrl={this.props.updateProfilePicUrl}
                                  />
                            </div>
                          </Modal> 
                        </div>*/}
                      </div>
                      <div className="col-md-8">
                        <div className="row">
                          <div className="col-md-6">
                            <label className="form-control-label" htmlFor="admin-name">Name</label>
                            <input type="text" id="admin-name" name="admin-name" onChange = {(event) => this.setState({name:event.target.value})} value={this.state.name} className="form-control input-field" placeholder="Enter your name"/><br/>
                            <label className="form-control-label" htmlFor="email-input">Email</label>
                            <input type="email" id="email-input" name="email-input" onChange = {(event) => this.setState({email:event.target.value})} value={this.state.email} className="form-control input-field" placeholder="Enter Email" required/><br/>
                            <label className="form-control-label" htmlFor="role-input">Designation</label>
                            <input type="text" id="role-input" name="role-input" onChange = {(event) => this.setState({role:event.target.value})} value={this.state.role} className="form-control input-field" placeholder="Role within the organization"/><br/>
                            <label className="form-control-label label-contact" htmlFor="number-input">Contact Number (optional)</label>
                            <input type="text" id="number-input" maxLength="10" name="number-input" onKeyPress={this.handleKeyPress} onChange = {(event) => this.setState({contact:event.target.value})} value={this.state.contact} className="form-control input-field" placeholder="Enter contact no."/><br/>
                            <button className="btn-primary" autoFocus={true} type="submit" onClick={this.handleSubmit}>Save changes </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-10">
                        <hr className="divider" />
                      </div>
                    </div>
                    
                  </form>
                  
                  <PasswordAccordion />
                    
                    
                   
                     
                 


                    {/*
                     <div className="form-group row">
                     <label className="col-md-3 form-control-label" htmlFor="admin-name">Display Name</label>
                     <div className="col-md-9">
                     <input type="text" id="admin-name" name="admin-name" onChange = {(event) => this.setState({name:event.target.value})} value={this.state.name} className="form-control" placeholder="Enter your name"/>
                     <span className="help-block">Enter your name</span>
                     </div>
                     </div>
                     <div className="form-group row">
                     <label className="col-md-3 form-control-label" htmlFor="email-input">Email</label>
                     <div className="col-md-9">
                     <input type="email" id="email-input" name="email-input" onChange = {(event) => this.setState({email:event.target.value})} value={this.state.email} className="form-control" placeholder="Enter Email" required/>
                     <span className="help-block">Please enter your email</span>
                     </div>
                     </div>
                     <div className="form-group row">
                     <label className="col-md-3 form-control-label" htmlFor="role-input">Designation</label>
                     <div className="col-md-9">
                     <input type="text" id="role-input" name="role-input" onChange = {(event) => this.setState({role:event.target.value})} value={this.state.role} className="form-control" placeholder="Role within the organization"/>
                     <span className="help-block">Please enter your role within the organization</span>
                     </div>
                     </div>
                     <div className="form-group row">
                     <label className="col-md-3 form-control-label" htmlFor="number-input">Contact No.</label>
                     <div className="col-md-9">
                     <input type="text" id="number-input" maxLength="10" name="number-input" onKeyPress={this.handleKeyPress} onChange = {(event) => this.setState({contact:event.target.value})} value={this.state.contact} className="form-control" placeholder="Enter contact no."/>
                     <span className="help-block">Please enter your contact number</span>
                     </div>
                     </div>
                     <div className="form-group row">
                     <label className="col-md-3 form-control-label" htmlFor="company-name">Company Name</label>
                     <div className="col-md-9">
                     <input type="text" id="company-name" onChange = {(event) => this.setState({companyname:event.target.value})} name="company-name" value={this.state.companyname} className="form-control" placeholder="Company Name"/>
                     <span className="help-block">Please enter your company name</span>
                     </div>
                     </div>
                     <div className="form-group row">
                     <label className="col-md-3 form-control-label" htmlFor="industry">Industry Type</label>
                     <div className="col-md-9">
                     <select id="industry" name="industry" onChange = {(event) => this.setState({industry:event.target.value})} value={this.state.industry} className="form-control">
                     {this.industries.map(industry => <option key={industry} value={industry}>{industry}</option>)}
                     </select>
                     </div>
                     </div>
                     <div className={((this.state.industry === "Other" )  ? 'form-group row' : 'n-vis')}>
                     <label className="col-md-3 form-control-label" htmlFor="Otherindustry">Other Industry</label>
                     <div className="col-md-9">
                     <input type="text" id="industry-others" name="industry-others" onChange = {(event) => this.setState({industryOthers:event.target.value})} value={this.state.industryOthers} className="form-control" placeholder="Enter your Industry"/>
                     </div>
                     </div>
                     <div className="form-group row">
                     <label className="col-md-3 form-control-label" htmlFor="company-size">Company-size</label>
                     <div className="col-md-9">
                     <select id="company-size" onChange = {(event) => this.setState({companysize:event.target.value})} value={this.state.companysize} name="company-size" className="form-control">
                     <option value="0">Please select</option>
                     <option value="10">10</option>
                     <option value="20">20</option>
                     <option value="50">50</option>
                     <option value="100">100</option>
                     <option value="500">500</option>
                     </select>
                     </div>
                     </div>*/}
                  
                </div>
                {/*
                 <div className="card-footer">
                 <button type="submit" className="btn btn-sm btn-primary" onClick={this.handleSubmit}><i className="fa fa-dot-circle-o"></i> Submit</button>
                 <button type="reset" className="n-vis btn btn-sm btn-danger" onClick={this.handleReset}><i className="fa fa-ban"></i> Reset</button>
                 </div> */}
              </div>
            </div>
          </div>
        </div>
    )
  }
}

export default Forms;
