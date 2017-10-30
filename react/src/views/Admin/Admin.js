import React, { Component } from 'react';
import  {getEnvironmentId,get} from '../../config/config.js';

import {patchCustomerInfo, getCustomerInfo, getUserInfo} from '../../utils/kommunicateClient' 

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
      industryOthers: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.industries = ['Please select', 'E-commerce', 'Marketplaces', 'SaaS', 'E-learning', 'Healthcare', 'On-Demand Services', 'Social', 'Fin Tech', 'Entertainment', 'Gaming', 'Travel' , 'Other'];
  }

handleKeyPress(event) {
      var num = this.state.contact;
        if (isNaN(num))
        {
          alert("Must input numbers");
          return false;
        }
    }

  handleSubmit(e) {

    e.preventDefault();
      
    const customerInfo = {
      "name" : this.state.name,
      "role" : this.state.role,
      "email" : this.state.email,
      "contactNo" : this.state.contact,
      "companyName": this.state.companyname,
      "companySize":this.state.companysize,
      "industry": this.state.industry === "Other" ? this.state.industryOthers : this.state.industry
    }

    if(localStorage.getItem("isAdmin") === 'true'){
      patchCustomerInfo(customerInfo, localStorage.getItem("loggedinUser"))
        .then(response => {
          if(response.data.code === 'SUCCESS'){
            alert(response.data.message)
          }
        }).catch(err => {alert(err)});
    }else{
        // patchUserInfo()
      }
  }

  handleReset(e){
    e.preventDefault();
  }

  invokeImageUpload = (e) => {
    e.preventDefault()

    let hiddenImageInputElem = document.getElementById("hidden-image-input-element");
    
    if(hiddenImageInputElem){
      hiddenImageInputElem.click()
    }
  }

  handleImageFiles = (e) => {
    e.preventDefault()

    const files = e.target.files;
    const file = files[0];

    let img = document.createElement("img")
    img.height = 90
    img.width = 60
    img.classList.add("obj")
    img.file = file

    let thumbnail = document.getElementById("thumbnail")
    while(thumbnail.hasChildNodes()) {
       thumbnail.removeChild(thumbnail.firstChild)
    }
    thumbnail.appendChild(img)

    let reader = new FileReader()
    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
    reader.readAsDataURL(file)
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
              <div className="card-header">
                <strong>Admin Profile Form</strong>
              </div>
              <div className="card-block">
                <form method= "patch" onSubmit={this.handleSubmit} encType="multipart/form-data" className="form-horizontal">
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="admin-name">Admin Name</label>
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
                    <label className="col-md-3 form-control-label" htmlFor="role-input">Role</label>
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
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="email-input">Upload Image</label>
                    <div className="col-md-9">
                      <input type="file" accept="image/*" className="form-control" id="hidden-image-input-element" name="image-input" onChange={this.handleImageFiles} style={{display:"none"}} />
                      <button type="submit" className="btn btn-sm btn-primary" id="image-input-button" onClick={this.invokeImageUpload}><i className="icon-cloud-upload"></i> Upload Image</button>
                      <div id="thumbnail">
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button type="submit" className="btn btn-sm btn-primary"><i className="fa fa-dot-circle-o"></i> Submit</button>
                    <button type="reset" className="btn btn-sm btn-danger" onClick={this.handleReset}><i className="fa fa-ban"></i> Reset</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          </div>
      </div>
    )
  }
}

export default Forms;
