import React, { Component } from 'react'
import {SettingsHeader} from '../../components/SettingsComponent/SettingsComponents';
import {CompanyInfoContainer} from './companyStyle'
import { getCustomerInfo, patchUserInfo, patchCustomerInfo } from '../../utils/kommunicateClient'
import CommonUtils from '../../utils/CommonUtils';
import Notification from '../model/Notification';


const CompanyInfo = props => (
    <CompanyInfoContainer >
        <p className="input-field-title">Company Name:</p>
        <input type="text" id="km-company-name" placeholder="Enter Company Name" value={props.companyName} onChange={(e) => {props.companyInputValue(e, "companyName")}} />
        <p className="input-field-title">Company URL:</p>
        <input type="text" id="km-company-url" placeholder="Enter Company URL" value={props.companyUrl} onChange={(e) => {props.companyInputValue(e, "companyUrl")}} />
        <div className="km-company-btn-wrapper" >
            <button data-button-text={props.buttonText} className="km-button km-button--primary km-company-save-btn" onClick={props.updateCustomerInfo}>Save Changes</button>
            <button data-button-text="Cancel" className="km-button km-button--secondary km-company-cancel-btn" >Cancel</button>
        </div>    
        
    </CompanyInfoContainer >
)

class Company extends Component{
  constructor(props){
    super(props);
    this.state = {
        companyName:"",
        companyUrl:""
    };
    
  }
  componentDidMount = () => {
    this.getUserInfo();
  }
  companyInputValue = (e,key) => {
    this.setState({[key] : e.target.value});
  }
  getUserInfo = () => {
    let userSession = CommonUtils.getUserSession();
    getCustomerInfo(userSession.adminUserName)
    .then(response => {
      if (response.data.code === 'SUCCESS') {
        this.setState({
            companyName:response.data.data.companyName,
            companyUrl:userSession.application.websiteUrl ? userSession.application.websiteUrl : ""
        })
      }
    }).catch(err => { console.log(err) });
  }
  updateCustomerInfo = () => {
      let userSession = CommonUtils.getUserSession();
      let customerInfo = {
          applicationId: userSession.application.applicationId,
          companyName: this.state.companyName,
          websiteUrl: this.state.companyUrl
      }
      patchCustomerInfo(customerInfo, userSession.adminUserName)
          .then(response => {
              if (response.data.code === 'SUCCESS') {
                  Notification.success("Company details updated");
                  userSession.application.websiteUrl = this.state.companyUrl;
                  CommonUtils.setUserSession(userSession)
              }
          }).catch(err => {
              console.log(err);
              Notification.error("There is a problem while updating company details. Try again");
          });
  }
  render() {
      return(
          <div>
              <SettingsHeader />
              <CompanyInfo companyName = {this.state.companyName} companyUrl={this.state.companyUrl} companyInputValue = {this.companyInputValue} updateCustomerInfo = {this.updateCustomerInfo}/>
          </div>
      )
  }
}

export default Company;