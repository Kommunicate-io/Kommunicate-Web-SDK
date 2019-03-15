import React, { Component } from 'react';
import { patchCustomerInfo } from '../../../utils/kommunicateClient'
import '../../Admin/Admin.css';
import isURL from 'validator/lib/isURL';
import CommonUtils from '../../../utils/CommonUtils';
import applozicClient from '../../../utils/applozicClient';
import { connect } from 'react-redux'
import * as Actions from '../../../actions/signupAction';
import Button from '../../../components/Buttons/Button';
import { ErrorIcon } from '../../../assets/svg/svgs';

class Step2 extends Component {

  constructor(props) {
    super(props)

    this.state = {
      websiteUrl: '',
      name: '',
      role: '',
      contact_no: '',
      websiteUrl:'',
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
    this.handleChange = this.handleChange.bind(this);
    this.websiteUrlCheck = this.websiteUrlCheck.bind(this);
  }
  updateProfileImgUrl(url) {
    this.setState({
      imageFile: url == null ? "/img/avatars/default.png" : url
    });
  }

  handleChange(event) {
    document.getElementById("number-input").required = false;
    const number = (event.target.validity.valid) ? event.target.value : this.state.contact_no ;
    this.setState({ contact_no: number})
    document.getElementById("number-input").required = true;
  }

  websiteUrlCheck(){
      document.getElementById("website-url").className = 'input km-error-input';
      document.getElementById('mySpan').innerHTML = 'Invalid URL';
      document.getElementById("emptyerror1").className = 'input-error-div km-url-error vis';
	}

	comapnyNameValidation(){
        document.getElementById("emptyerror2").className = 'input-error-div vis';
        document.getElementById("customer-name").className = 'input km-error-input'; 
    }

	comapnyNameValidationOnEnter = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			if(document.getElementById("customer-name").value ===""|| document.getElementById("customer-name").value === null){
				this.comapnyNameValidation(); 
				return;
			} else {
				document.getElementById("website-url").focus();
			}
		}
	}

	onFocusName() {
		document.getElementById('emptyerror2').className = 'n-vis';
		document.getElementById("customer-name").className = 'input customer-name';
	}

  finishSetUp = (e) => {
    e.preventDefault();
	if (document.getElementById("customer-name").value === "" || document.getElementById("customer-name").value === null) {
        this.comapnyNameValidation();
        return;
	}
	
    if(!isURL(this.state.websiteUrl)) {
        this.websiteUrlCheck();
        return;
    }
    let userSession = CommonUtils.getUserSession();
    const customerInfo = {
      email: userSession.email,
      applicationId: userSession.application.applicationId,
      websiteUrl: this.state.websiteUrl,
      name: this.state.name,
      role: this.props.customerInfo.role,
      contactNo: this.props.customerInfo.contact_no,
      companyName: this.state.company_name,
      companySize: this.state.company_size,
      industry: (this.state.industry === "Other") ? this.state.industryOthers : this.state.industry,
      subscription: CommonUtils.isProductApplozic() ? 'applozic' : 'startup' //change this to subscription plan id if the subscription plan comes to signup flow in future
    }
    patchCustomerInfo(customerInfo, CommonUtils.getUserSession().userName)
      .then(response => {
        if (response.data.code === 'SUCCESS') {
          this.reDirectToDashboard();
        }
      }).catch(err => { console.log('userInfo not saved') });
      applozicClient.createKommunicateSupportUser({
        "userId": userSession.userName,
        "deviceType":0,
        "applicationId": "kommunicate-support",
        "authenticationTypeId": 1,
        "email":userSession.email||userSession.userName,
        "displayName":customerInfo.name
      }).then(res=>{
        console.log("kommunicate user created successfully");
      }).catch(e=>{
        console.log("error while creating support user",e);
      });
      userSession.name = customerInfo.name;
      userSession.adminDisplayName = customerInfo.name;
      userSession.application.websiteUrl = customerInfo.websiteUrl
      userSession.contactNo = customerInfo.contactNo;
      CommonUtils.setUserSession(userSession);
      // this.props.moveToNextStep(customerInfo,this.state.nextStep)
  }
  onFocus (){
    document.getElementById("emptyerror").className = 'n-vis';
    document.getElementById("number-input").className = 'input';
}

onComapnyNameFocus(){
  document.getElementById("emptyerrorforCompanyName").className = 'n-vis';
  document.getElementById("company-name").className = 'input';
}

onContactNumberFocus (){
  document.getElementById("emptyerror").className = 'n-vis';
  document.getElementById("number-input").className = 'input';
}

comapnyUrlValidationOnEnter = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    if(document.getElementById("website-url").value ===""|| document.getElementById("website-url").value === null){
      this.comapnyUrlValidation();
      return;
    }
    if (!isURL(document.getElementById("website-url").value)) {
      this.websiteUrlCheck();
    }else{
    document.getElementById("step-2-submit-btn").click();
    }
  }
}
comapnyUrlValidation(){
  document.getElementById('mySpan').innerHTML = 'This field is mandatory';
  document.getElementById("emptyerror1").className = 'input-error-div km-url-error vis';
  document.getElementById("website-url").className = 'input km-error-input';
}

hideAllErrors (){
  document.getElementById("emptyerror1").className = ' n-vis';
  document.getElementById("website-url").className = 'input';
}

  onBlur() {
    if(document.getElementById("website-url").value ===""|| document.getElementById("website-url").value === null){
      this.comapnyUrlValidation();
      return;
    }
    if (!isURL(document.getElementById("website-url").value)) {
      this.websiteUrlCheck();
    }
  }
  reDirectToDashboard() {
    window.location.assign("/dashboard");
    localStorage.setItem("KM_ONBOARDING","true");
    this.props.updateStatus(actionType.onboardingStatus, true);
    this.props.updateStatus(actionType.modalOnboardingStatus, false);
    this.props.updateStatus(actionType.trialDaysLeftOnboardingStatus, true);
  }
  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }
  render() {
	return (
      	<form className="form-horizontal">
			<div className="col-lg-12 text-center setup-profile-div step-2-div">
				<h1 className="setup-heading">Setting up your profile</h1>
				<h4 className="setup-sub-heading">{ CommonUtils.isKommunicateDashboard() ? "Let your chat users know who they are talking to" : "Help us know more about you" }</h4>
			</div>
			<div className="form-group row">
				<div className="col-md-12">
					<div className="row">
						<div className="col-md-12">
							<div className="company-url-main-div group text-center">
								<div className="group form-group form-group-user-name">
									<input className="input customer-name" type="text" id="customer-name" name="name" placeholder=" " required onKeyPress={this.comapnyNameValidationOnEnter} value={this.state.name} onFocus={this.onFocusName} onChange={(event) => { this.setState({ name: event.target.value }) }} />
									<label className="label-for-input email-label">Your full name</label>
									<span id="emptyerror2" className="input-error-div n-vis">
										<ErrorIcon />
										<span className="input-error-message">This field is mandatory</span>
									</span>
								</div>
							</div>
							<div className="company-url-main-div text-center">
								<div className="group form-group">
									<input className="input" type="text" id="website-url" name="website-url" placeholder=" " required onKeyPress={this.comapnyUrlValidationOnEnter} onBlur={(event) => this.onBlur(event.target.value)} onFocus={this.hideAllErrors} value={this.state.websiteUrl} onChange={(event) => { this.setState({ websiteUrl: event.target.value }) }} />
									<label className="label-for-input email-label">Company website</label>
									<span id="emptyerror1" className="input-error-div n-vis">
										<ErrorIcon />
										<span id="mySpan"className="input-error-message">This field is mandatory</span>
									</span>
								</div>
							</div>
							<div className="form-group setup-btn-group">
								<Button id="step-2-submit-btn" className="step-1-submit-btn" onClick={this.finishSetUp}>Start using {CommonUtils.isKommunicateDashboard() ? "Kommunicate" : "Applozic"}</Button>
                <p>Enjoy your 30 day trial :)</p>
							</div>
						</div>
					</div>
				</div>
			</div>
      </form>
    )
  }
}

const actionType = {
  onboardingStatus: "UPDATE_KM_ON_BOARDING_STATUS",
  modalOnboardingStatus: "UPDATE_KM_ON_BOARDING_MODAL_STATUS",
  trialDaysLeftOnboardingStatus: "UPDATE_KM_TRIAL_DAYS_LEFT_ON_BOARDING_STATUS"
}

const mapDispatchToProps = dispatch => {
  return {
    updateStatus: (type, payload) =>  dispatch(Actions.updateDetailsOnSignup(type, payload))
  }
}
export default connect(null, mapDispatchToProps)(Step2)
