import React, { Component } from 'react';

import {patchCustomerInfo} from '../../../utils/kommunicateClient' 
import { Link } from 'react-router-dom';
import Notification from '../../model/Notification';

import ImageUploader from '../../Admin/ImageUploader'

class Step2 extends Component {

  constructor(props) {
    super(props)

    this.state = {
      role: '',
      contact_no:'',
      company_name:'',
      company_size:'',
      industry: '',
      industryOthers: ''
    }
  }

  finishSetUp = (e) => {

    e.preventDefault();

    const customerInfo = {
      role: this.state.role,
      contactNo: this.state.contact_no,
      companyName: this.state.company_name,
      companySize: this.state.company_size,
      industry: (this.state.industry === "Other" ) ? this.state.industryOthers : this.state.industry,
    }

    patchCustomerInfo(customerInfo, localStorage.getItem("loggedinUser"))
      .then(response => {
        if(response.data.code === 'SUCCESS'){
          // alert(response.data.message);
          Notification.info("Setup completed successfully");
          // window.location = '/dashboard'
        }
      }).catch(err => {Notification.error(err)});
    // window.location = '/dashboard';
    this.props.history.push('/dashboard');
  }

  render() {
  	return (
      <form className="form-horizontal" onSubmit={this.finishSetUp}>
        <ImageUploader />
        <div className="form-group row">
          <label className="col-md-3 form-control-label" htmlFor="role-input">Role</label>
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
        </div>
      </form>
  	)
  }
}

export default Step2