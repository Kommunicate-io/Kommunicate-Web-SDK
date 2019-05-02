import React, { Component } from 'react'
import {SettingsHeader} from '../../components/SettingsComponent/SettingsComponents';
import {CompanyInfoContainer, CompanyRestrictionBannerContainer, CompanyContainer, CompanyBlockButtonContainer, CompanyModalTitleContainer} from './companyStyle'
import { getCustomerInfo, patchUserInfo, patchCustomerInfo } from '../../utils/kommunicateClient'
import CommonUtils from '../../utils/CommonUtils';
import Notification from '../model/Notification';
import Banner from '../../components/Banner';
import {ROLE_TYPE} from '../../utils/Constant'
import isURL from 'validator/lib/isURL';
import {BlockButton} from '../../components/GeneralFunctionComponents/GeneralFunctionComponents'
import CompanySectionModal from './CompanySectionModal'
import {getAppSetting, updateAppSetting} from '../../utils/kommunicateClient'
import LockBadge from '../../components/LockBadge/LockBadge';
import AnalyticsTracking from '../../utils/AnalyticsTracking';


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
        openModal:false,
        modal:"",
        customUrl:"",
    };
  }
  componentDidMount = () => {
    let userSession = CommonUtils.getUserSession();
    this.setState({companyInfoEditable : userSession.roleType != ROLE_TYPE.AGENT })  
    this.getUserInfo();
    this.getAppSettings();
  }
  companyInputValue = (e,key) => {  
    this.setState({
        [key] : e.target.value,
    },this.updateButtonStatus(e.target.value, key));
  }
  updateButtonStatus = (inputValue, key) => {
    this.setState({buttonDisabled:inputValue == this.state[key+"Copy"] })
  }
  getAppSettings = () => {
    getAppSetting().then(response => {
      if(response.status == 200 && response.data.response) {
        response.data.response.domainUrl && this.setState({customUrl:response.data.response.domainUrl})
      }
    }).catch(err => {
      console.log(err);
    })
  }

  updateSettings = (data) => {
    updateAppSetting(data).then(response => {
        if(response.status == 200 && response.data.code == "SUCCESS") {
            typeof data.domainUrl != "undefined" && this.setState({customUrl: data.domainUrl})
            Notification.success("Custom URL updated");
            AnalyticsTracking.acEventTrigger("customDomainMain");
        }
      }).catch(err => {
        console.log(err);
      })
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
  isCustomUrlFeatureRestricted = () => {
      return !(CommonUtils.isEnterprisePlan() || CommonUtils.isTrialPlan());
  }

  controlModal = (e) => {
    !this.state.openModal && this.setState({modal: e.target.dataset.blockButton}) 
    this.setState({ openModal: this.isCustomUrlFeatureRestricted() ? false : !this.state.openModal });
  }
  render() {
      return(
          <CompanyContainer className="animated fadeIn">
              <CompanyRestrictionBannerContainer>
                <Banner appearance="warning" hidden={this.state.companyInfoEditable} heading={"You need admin permissions to update your company details."}/>
              </CompanyRestrictionBannerContainer>
              <SettingsHeader />
              <CompanyInfo companyName = {this.state.companyName} companyUrl={this.state.companyUrl} companyInputValue = {this.companyInputValue} updateCustomerInfo = {this.updateCustomerInfo} setPreviousValue={this.setPreviousValue}
              buttonDisabled = {this.state.buttonDisabled} companyInfoEditable = {this.state.companyInfoEditable}/>
                <CompanyBlockButtonContainer>
                    { this.isCustomUrlFeatureRestricted() &&
                        <LockBadge className={"lock-with-text"} text={"Available in Enterprise plan"} history={this.props.history} onClickGoTo={"/settings/billing"}/>
                    }
                    <BlockButton title = {"Get a custom domain URL"} subTitle = {"Get a custom domain URL for your Kommunicate account."} description={"Example: kommunicate.yourwebsite.com"} onClickOfBlock = {this.controlModal} name="customUrl"/>
                    
                </CompanyBlockButtonContainer>
             { this.state.openModal &&
                  <CompanySectionModal openModal = {this.state.openModal} controlModal = {this.controlModal} modal={this.state.modal} customUrl = {this.state.customUrl} updateSettings = {this.updateSettings} />
             }
          </CompanyContainer>
      )
  }
}

export default Company;