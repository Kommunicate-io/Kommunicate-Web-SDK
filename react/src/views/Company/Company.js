import React, { Component } from 'react'
import {SettingsHeader} from '../../components/SettingsComponent/SettingsComponents';
import {CompanyInfoContainer, CompanyRestrictionBannerContainer, CompanyContainer, CompanyBlockButtonContainer} from './companyStyle'
import { getCustomerInfo, patchUserInfo, patchCustomerInfo } from '../../utils/kommunicateClient'
import CommonUtils from '../../utils/CommonUtils';
import Notification from '../model/Notification';
import Banner from '../../components/Banner/Banner';
import {ROLE_TYPE} from '../../utils/Constant'
import isURL from 'validator/lib/isURL';
import {BlockButton} from '../../components/GeneralFunctionComponents/GeneralFunctionComponents'
import CompanySectionModal from './CompanySectionModal'

const CompanyInfo = props => (
    <CompanyInfoContainer >
        <p className="input-field-title">Company Name:</p>
        <input type="text" id="km-company-name" disabled ={!props.companyInfoEditable} placeholder="Enter Company Name" value={props.companyName} onChange={(e) => {props.companyInputValue(e, "companyName")}} />
        <p className="input-field-title">Company URL:</p>
        <input type="text" id="km-company-url" disabled ={!props.companyInfoEditable} placeholder="Enter Company URL" value={props.companyUrl} onChange={(e) => {props.companyInputValue(e, "companyUrl")}} />
        <div className="km-company-btn-wrapper" >
            <button data-button-text={props.buttonText} disabled={props.buttonDisabled} className="km-button km-button--primary km-company-save-btn" onClick={props.updateCustomerInfo}>Save Changes</button>
            <button data-button-text="Cancel" disabled={props.buttonDisabled} className="km-button km-button--secondary km-company-cancel-btn" onClick={props.setPreviousValue}>Cancel</button>
        </div>    
        
    </CompanyInfoContainer >
)

class Company extends Component{
  constructor(props){
    super(props);
    this.state = {
        companyName:"",
        companyUrl:"",
        companyNameCopy:"",
        companyUrlCopy:"",
        buttonDisabled:true,
        companyInfoEditable:true,
        openModal:false
    };
  }
  componentDidMount = () => {
    let userSession = CommonUtils.getUserSession();
    this.setState({companyInfoEditable : userSession.roleType != ROLE_TYPE.AGENT })  
    this.getUserInfo();
  }
  companyInputValue = (e,key) => {  
    this.setState({
        [key] : e.target.value,
    },this.updateButtonStatus(e.target.value, key));
  }
  updateButtonStatus = (inputValue, key) => {
    this.setState({buttonDisabled:inputValue == this.state[key+"Copy"] })
  }
  getUserInfo = () => {
    let userSession = CommonUtils.getUserSession();
    getCustomerInfo(userSession.adminUserName)
    .then(response => {
      if (response.data.code === 'SUCCESS') {
        this.setState({
            companyName:response.data.data.companyName,
            companyUrl:userSession.application.websiteUrl ? userSession.application.websiteUrl : "",
            companyNameCopy:response.data.data.companyName,
            companyUrlCopy:userSession.application.websiteUrl ? userSession.application.websiteUrl : "",
        })
      }
    }).catch(err => { console.log(err) });
  }
  updateCustomerInfo = () => {
      let userSession = CommonUtils.getUserSession();
      if( !this.state.companyName || !this.state.companyUrl) {
        Notification.error("Company Name and URL is mandatory")
        return
      } else if(!isURL(this.state.companyUrl)) {
        Notification.error("Invalid URL");
        return
      }
      let customerInfo = {
          applicationId: userSession.application.applicationId,
          companyName: this.state.companyName,
          websiteUrl: this.state.companyUrl
      }
      patchCustomerInfo(customerInfo, userSession.adminUserName)
          .then(response => {
              if (response.data.code === 'SUCCESS') {
                  Notification.success("Company details updated");
                  this.setState({
                    companyName:this.state.companyName,
                    companyUrl:this.state.companyUrl,
                    companyNameCopy:this.state.companyName,
                    companyUrlCopy:this.state.companyUrl,
                    buttonDisabled:true
                  })
                  userSession.application.websiteUrl = this.state.companyUrl;
                  CommonUtils.setUserSession(userSession)
              }
          }).catch(err => {
              console.log(err);
              Notification.error("We encountered a problem while updating company details. Please try again.");
          });
  }
  setPreviousValue = () => {
      this.setState({
          companyName:this.state.companyNameCopy,
          companyUrl:this.state.companyUrlCopy,
          buttonDisabled:true
      })
  }
  controlModal = () => {
    this.setState({ openModal: !this.state.openModal });
  }
  render() {
      return(
          <CompanyContainer>
              <CompanyRestrictionBannerContainer>
                <Banner indicator={"warning"} hidden={this.state.companyInfoEditable} text={"You need admin permissions to update your company details"} />
              </CompanyRestrictionBannerContainer>
              <SettingsHeader />
              <CompanyInfo companyName = {this.state.companyName} companyUrl={this.state.companyUrl} companyInputValue = {this.companyInputValue} updateCustomerInfo = {this.updateCustomerInfo} setPreviousValue={this.setPreviousValue}
              buttonDisabled = {this.state.buttonDisabled} companyInfoEditable = {this.state.companyInfoEditable}/>
                <CompanyBlockButtonContainer>
                    <BlockButton title = {"Get a custom domain URL"} subTitle = {"Get a custom domain URL for your Kommunicate account."} description={"Example: kommunicate.yourwebsite.com"} onClickOfBlock = {this.controlModal} />
                </CompanyBlockButtonContainer>
              <CompanySectionModal openModal = {this.state.openModal} controlModal = {this.controlModal}/>
          </CompanyContainer>
      )
  }
}

export default Company;