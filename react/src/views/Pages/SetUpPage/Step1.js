import React, { Component } from 'react';
import isURL from 'validator/lib/isURL';
import Notification from '../../model/Notification';
class Step1 extends Component {
    
    constructor(props) {
        super(props)
        this.state={
            websiteUrl:'',
            name:'',
            isCompanyUrlError:'',
            nextStep:2
        }
    this.submitCompanyUrlOnly = this.submitCompanyUrlOnly.bind(this);
    this.onFocusOfCompanyName = this.onFocusOfCompanyName.bind(this);
    this.websiteUrlCheck = this.websiteUrlCheck.bind(this);
    
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
        document.getElementById("customer-name").focus();
        }
      }
    }
    comapnyNameValidationOnEnter = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if(document.getElementById("customer-name").value ===""|| document.getElementById("customer-name").value === null){
          this.comapnyNameValidation(); 
          return;
        } else {
          document.getElementById("submit-btn").click();
        }
      }
    }
    websiteUrlCheck(){
      document.getElementById("website-url").className = 'input km-error-input';
      document.getElementById("url-http-text").className = 'url-http-text km-error-input';
      document.getElementById('mySpan').innerHTML = 'Invalid URL';
      document.getElementById("emptyerror1").className = 'input-error-div km-url-error vis';
    }
    submitCompanyUrlOnly(e){
        e.preventDefault();
        if(document.getElementById("website-url").value ===""|| document.getElementById("website-url").value === null){
          this.comapnyUrlValidation();
          return;
        }
        if(document.getElementById("customer-name").value ===""|| document.getElementById("customer-name").value === null){
          this.comapnyNameValidation(); 
          return;
        }
        if(!isURL(this.state.websiteUrl)) {    
        this.websiteUrlCheck();
        return;
        }
        let data={websiteUrl:this.state.websiteUrl,
            name:this.state.name};
            this.props.moveToNextStep(data,
            this.state.nextStep);
    }
    
    comapnyUrlValidation(){
        document.getElementById('mySpan').innerHTML = 'This field is mandatory';
        document.getElementById("emptyerror1").className = 'input-error-div km-url-error vis';
        document.getElementById("website-url").className = 'input km-error-input';
        document.getElementById("url-http-text").className = 'url-http-text km-error-input';
    }
    comapnyNameValidation(){
        document.getElementById("emptyerror2").className = 'input-error-div vis';
        document.getElementById("customer-name").className = 'input km-error-input'; 
    }
    hideAllErrors (){
        document.getElementById("emptyerror1").className = ' n-vis';
        document.getElementById("website-url").className = 'input';
        document.getElementById("url-http-text").className = 'url-http-text';
        document.getElementById("emptyerror2").className = 'n-vis';
        document.getElementById("customer-name").className = 'input customer-name';
  }

  onFocusOfCompanyName (e){
    if(document.getElementById("website-url").value ===""|| document.getElementById("website-url").value === null){
        document.getElementById('mySpan').innerHTML = 'This field is mandatory';
        document.getElementById("emptyerror1").className = 'input-error-div km-url-error vis';
        document.getElementById("website-url").className = 'input km-error-input';
        document.getElementById("url-http-text").className = 'url-http-text km-error-input';
        return;
      }
      else if(!isURL(document.getElementById("website-url").value)) {
        this.websiteUrlCheck();
      }
      else{
        this.hideAllErrors ();
      }
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
    render() {
        return (
            <form >
            <div className="col-lg-12 text-center setup-profile-div">
                <div className="step-number-div">1/3</div>
                <h1 className="setup-heading">Profile Setup</h1>
                <h4 className="setup-sub-heading">Setting up your name and website URL so that your customers know who they are talking to</h4>
                <div className="company-url-main-div flex text-center">
                    <span id ="url-http-text"className="url-http-text">https://</span>
                    <div className="group form-group company-url-form-group">
                        <input className="input" type="text" id="website-url" name="website-url" placeholder=" " required onKeyPress={this.comapnyUrlValidationOnEnter} onBlur={(event) => this.onBlur(event.target.value)} onFocus={this.hideAllErrors} value={this.state.websiteUrl} onChange={(event) => { this.setState({ websiteUrl: event.target.value }) }} />
                        <label className="label-for-input email-label">www.mycompany.com</label>
                        <span id="emptyerror1" className="input-error-div n-vis">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                <g id="Page-1" fill="none" fill-rule="evenodd">
                                  <g id="Framework" transform="translate(-77 -805)" fill="#ED1C24">
                                    <g id="Wrong-Value-with-Notification" transform="translate(77 763)">
                                      <g id="Error-Notification" transform="translate(0 40)">
                                        <path d="M0,10 C0,5.582 3.581,2 8,2 C12.418,2 16,5.582 16,10 C16,14.418 12.418,18 8,18 C3.581,18 0,14.418 0,10 Z M9.315,12.718 C9.702,13.105 10.331,13.105 10.718,12.718 C11.106,12.331 11.106,11.702 10.718,11.315 L9.41,10.007 L10.718,8.698 C11.105,8.311 11.105,7.683 10.718,7.295 C10.33,6.907 9.702,6.907 9.315,7.295 L8.007,8.603 L6.694,7.291 C6.307,6.903 5.678,6.903 5.291,7.291 C4.903,7.678 4.903,8.306 5.291,8.694 L6.603,10.006 L5.291,11.319 C4.903,11.707 4.903,12.335 5.291,12.722 C5.678,13.11 6.307,13.11 6.694,12.722 L8.007,11.41 L9.315,12.718 Z" id="Error-Icon"></path>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </svg>
                              <span id="mySpan"className="input-error-message">This field is mandatory</span>
                            </span>
                    </div>
                </div>
                <div className="company-url-main-div flex text-center">
                    <div className="group form-group form-group-user-name">
                        <input className="input customer-name" type="text" id="customer-name" name="name" placeholder=" " required onKeyPress={this.comapnyNameValidationOnEnter} onBlur={(event) => this.onBlur(event.target.value)}  onkeypress="onenter()"onFocus={this.onFocusOfCompanyName} value={this.state.name} onChange={(event) => { this.setState({ name: event.target.value }) }} />
                        <label className="label-for-input email-label">Your Name</label>
                        <span id="emptyerror2" className="input-error-div n-vis">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                <g id="Page-1" fill="none" fill-rule="evenodd">
                                  <g id="Framework" transform="translate(-77 -805)" fill="#ED1C24">
                                    <g id="Wrong-Value-with-Notification" transform="translate(77 763)">
                                      <g id="Error-Notification" transform="translate(0 40)">
                                        <path d="M0,10 C0,5.582 3.581,2 8,2 C12.418,2 16,5.582 16,10 C16,14.418 12.418,18 8,18 C3.581,18 0,14.418 0,10 Z M9.315,12.718 C9.702,13.105 10.331,13.105 10.718,12.718 C11.106,12.331 11.106,11.702 10.718,11.315 L9.41,10.007 L10.718,8.698 C11.105,8.311 11.105,7.683 10.718,7.295 C10.33,6.907 9.702,6.907 9.315,7.295 L8.007,8.603 L6.694,7.291 C6.307,6.903 5.678,6.903 5.291,7.291 C4.903,7.678 4.903,8.306 5.291,8.694 L6.603,10.006 L5.291,11.319 C4.903,11.707 4.903,12.335 5.291,12.722 C5.678,13.11 6.307,13.11 6.694,12.722 L8.007,11.41 L9.315,12.718 Z" id="Error-Icon"></path>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </svg>
                              <span className="input-error-message">This field is mandatory</span>
                            </span>
                    </div>
                </div>
                <div className="company-url-main-div flex text-center">
                    <button id ="submit-btn"className="btn btn-sm btn-primary px-4 btn-primary-custom"onClick={this.submitCompanyUrlOnly}> Save and continue </button>
                </div>
            </div>
        </form>
        )
    }
}
export default Step1