import React, { Component } from 'react';

import { patchCustomerInfo } from '../../../utils/kommunicateClient'
import { Link } from 'react-router-dom';
import Notification from '../../model/Notification';
import ImageUploader from '../../Admin/ImageUploader'
import Modal from 'react-modal';
import '../../Admin/Admin.css';
import { getResource } from '../../../config/config.js';
import isURL from 'validator/lib/isURL';

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
      website_url: '',
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
      imageFile: localStorage.getItem("imageLink") == null ? getResource().defaultImageUrl : localStorage.getItem("imageLink")

    }
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.updateProfileImgUrl  = this.updateProfileImgUrl.bind(this);
  }
  updateProfileImgUrl(url) { 
    this.setState({
      imageFile: url==null ? "/img/avatars/default.png": url
    });
    console.log("profilePicUrl updated",this.state.imageLink)
   }

  finishSetUp = (e) => {

    e.preventDefault();

    var websiteURL = this.state.website_url;

    if(!isURL(websiteURL)) {
      Notification.warning("Invalid URL.");
      return;
    } else {
      const customerInfo = {
        applicationId: localStorage.getItem('applicationId'),
        websiteUrl: this.state.website_url,
        name: this.state.name,
        role: this.state.role,
        contactNo: this.state.contact_no,
        companyName: this.state.company_name,
        companySize: this.state.company_size,
        industry: (this.state.industry === "Other") ? this.state.industryOthers : this.state.industry,
      }
    
    
    console.log(customerInfo);

    patchCustomerInfo(customerInfo, localStorage.getItem("loggedinUser"))
      .then(response => {
        if (response.data.code === 'SUCCESS') {
          // alert(response.data.message);
          Notification.info("Setup completed successfully");
          // window.location = '/dashboard'
        }
      }).catch(err => { Notification.error(err) });
    // window.location = '/dashboard';
    this.props.history.push('/dashboard');
    }
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
                  <form className="form-horizontal">

                  <div className="col-lg-12 text-center setup-profile-div">
                <div className="step-number-div">
                   2/2
                </div>
                <h1 className="setup-heading">Profile Setup</h1>
                <h4 className="setup-sub-heading">Setting up your company name, profile photo, designation etc.</h4>

                <div className="company-url-main-div flex text-center">
                    <span className="url-http-text">https://</span>
                    <div className="group form-group company-url-form-group">
                        <input className="input" type="text" id="website-url" name="website-url" placeholder=" " required value={this.state.website_url} onChange={(event) => { this.setState({ website_url: event.target.value }) }} />
                        <label className="label-for-input email-label">www.mycompany.com</label>
                    </div>
                </div>

                <h2 className="setup-integration-later-text">Rest of the profile can also be set up from <span>Settings > Profile</span> later</h2>

                <div className="button-link-container">
                    <a>
                      <Link to="/dashboard" className=" skip-link"> Skip for now</Link>
                    </a>
                </div>
                <hr></hr>
      </div>

                    <div className="form-group row">
                      {/* <div className="col-md-2">
                      </div> */}
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
                              <input className="input" type="text" id="name-input" name="name-input" placeholder=" " required value={this.state.name} onChange={(event) => { this.setState({ name: event.target.value }) }} />
                              <label className="label-for-input email-label">Your Name</label>
                            </div>

                            {/* <label className="form-control-label" htmlFor="role-input">Designation</label>
                            <input type="text" id="role-input" name="role-input" className="form-control input-field" placeholder="Role within the organization" value={this.state.role} onChange={(event) => { this.setState({ role: event.target.value }) }} /> */}

                            <div className="group form-group email-form-group">
                              <input className="input" type="text" id="role-input" name="role-input" placeholder=" " required value={this.state.role} onChange={(event) => { this.setState({ role: event.target.value }) }} />
                              <label className="label-for-input email-label">Designation</label>
                            </div>

                            {/* <label className="form-control-label" htmlFor="number-input">Contact No.</label>
                            <input type="number" id="number-input" maxLength="20" name="number-input" className="form-control input-field" placeholder="Enter your contact number" value={this.state.contact_no} onChange={(event) => { this.setState({ contact_no: event.target.value }) }} /> */}

                            <div className="group form-group email-form-group">
                              <input className="input" type="number" id="number-input" maxLength="20" name="number-input" placeholder=" " required value={this.state.contact_no} onChange={(event) => { this.setState({ contact_no: event.target.value }) }} />
                              <label className="label-for-input email-label">Contact No.</label>
                            </div>

                            {/* <label className="form-control-label" htmlFor="company-name">Company Name</label>
                            <input type="text" id="company-name" name="company-name" className="form-control input-field" placeholder="Enter your company Name" value={this.state.company_name} onChange={(event) => { this.setState({ company_name: event.target.value }) }} /> */}

                            <div className="group form-group email-form-group">
                              <input className="input" type="text" id="company-name" name="company-name" placeholder=" " required value={this.state.company_name} onChange={(event) => { this.setState({ company_name: event.target.value }) }} />
                              <label className="label-for-input email-label">Company Name</label>
                            </div>

                            {/* <label className="form-control-label" htmlFor="industry">Industry Type</label>
                            <select id="industry" name="industry" className="form-control input-field" onChange={(event) => { this.setState({ industry: event.target.value }) }} value={this.state.industry}>
                              <option value="0">Please select</option>
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
                            </select> */}


                            <div className="group form-group selectt">
                              <select className="select" id="industry" name="industry" onChange={(event) => { this.setState({ industry: event.target.value }) }} value={this.state.industry}>
                                <option value="0" >Please select</option>
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
                              <label className="label-for-input email-label">Industry Type</label>
                            </div>


                            <div className={((this.state.industry === "Other") ? 'form-group group' : 'n-vis')}>
                              {/* <label className="form-control-label" htmlFor="Otherindustry">Other Industry</label>
                              <input type="text" id="industry-others" name="industry-others" onChange={(event) => this.setState({ industryOthers: event.target.value })} value={this.state.industryOthers} className="form-control input-field" placeholder="Enter your Industry" /> */}
                              <input className="input" type="text" id="industry-others" name="industry-others" onChange={(event) => this.setState({ industryOthers: event.target.value })} value={this.state.industryOthers} placeholder=" "/>
                              <label className="label-for-input email-label">Other Industry</label>
                            </div>

                            {/* <label className="form-control-label" htmlFor="company-size">Company-size</label>
                            <select id="company-size" name="company-size" className="form-control input-field" onChange={(event) => { this.setState({ company_size: event.target.value }) }} value={this.state.company_size}>
                              <option value="0">Please select</option>
                              <option value="10">10</option>
                              <option value="20">20</option>
                              <option value="50">50</option>
                              <option value="100">100</option>
                              <option value="500">500</option>
                            </select> */}


                            <div className="group form-group selectt">
                              <select className="select" id="company-size" name="company-size" onChange={(event) => { this.setState({ company_size: event.target.value }) }} value={this.state.company_size}>
                              <option value="0">Please select</option>
                              <option value="10">10</option>
                              <option value="20">20</option>
                              <option value="50">50</option>
                              <option value="100">100</option>
                              <option value="500">500</option>
                              </select>
                              <label className="label-for-input email-label">Company Size</label>
                            </div>


                            <div className="form-group setup-btn-group">
                              {/* <div className="row">
                                <a>
                                  <Link to="/dashboard" className=" px-4"> Skip Setup</Link>
                                </a>
                                <div>
                                  <button className="btn btn-sm btn-primary px-4"> Finish Setup </button>
                                </div>
                              </div> */}
                              
                                <div>
                                  <button className="btn btn-sm btn-primary px-4 btn-primary-custom"> Finish Setup </button>
                                </div>
                              
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>



                  </form>
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


        {/* <ImageUploader />
        <div className="form-group row">
          <label className="col-md-3 form-control-label" htmlFor="role-input"></label>
          <div className="col-md-9">
            <input type="text" id="role-input" name="role-input" className="form-control" placeholder="Role within the organization" value={this.state.role} onChange={(event) => {this.setState({role: event.target.value})}} />
            <span className="help-block">Please enter your role within the organization</span>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-md-3 form-control-label" htmlFor="number-input">Contact No.</label>
          <div className="col-md-9">
            <input type="number" id="number-input" maxLength="20" name="number-input" className="form-control" placeholder="Enter your contact number" value={this.state.contact_no} onChange={(event) => {this.setState({contact_no: event.target.value})}} />
            <span className="help-block">Please enter your contact number</span>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-md-3 form-control-label" htmlFor="company-name">Company Name</label>
          <div className="col-md-9">
            <input type="text" id="company-name" name="company-name" className="form-control" placeholder="Enter your company Name" value={this.state.company_name} onChange={(event) => {this.setState({company_name: event.target.value})}}/>
            <span className="help-block">Please enter your company name</span>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-md-3 form-control-label" htmlFor="industry">Industry Type</label>
          <div className="col-md-9">
            <select id="industry" name="industry" className="form-control" onChange={(event) => {this.setState({industry: event.target.value})}} value={this.state.industry}>
              <option value="0">Please select</option>
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
          </div>
        </div>
        <div className={((this.state.industry === "Other" ) ? 'form-group row' : 'n-vis')}>
          <label className="col-md-3 form-control-label" htmlFor="Otherindustry">Other Industry</label>
          <div className="col-md-9">
            <input type="text" id="industry-others" name="industry-others" onChange = {(event) => this.setState({industryOthers:event.target.value})} value={this.state.industryOthers} className="form-control" placeholder="Enter your Industry"/>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-md-3 form-control-label" htmlFor="company-size">Company-size</label>
          <div className="col-md-9">
            <select id="company-size" name="company-size" className="form-control" onChange={(event) => {this.setState({company_size: event.target.value})}} value={this.state.company_size}>
              <option value="0">Please select</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
               <option value="500">500</option>
            </select>
          </div>
        </div>
        <div className="form-group text-center">
          <div className="row">
          <a className="col-6 text-right">
              <Link to="/dashboard" className=" px-4"> Skip Setup</Link>
            </a>
            <div className="col-6 text-left">
              <button className="btn btn-sm btn-primary px-4"> Finish Setup </button>
            </div>
          </div>
        </div>*/}
      </form>
    )
  }
}

export default Step2