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
    }
    submitCompanyUrlOnly(e){
        e.preventDefault();
        if(!isURL(this.state.websiteUrl)) {
            Notification.warning("Invalid URL.");
            return;
        }
        let data={websiteUrl:'https://'+this.state.websiteUrl,
            name:this.state.name};
            this.props.moveToNextStep(data,
            this.state.nextStep);
    }

    render() {
        return (
            <form onSubmit={this.submitCompanyUrlOnly} >
            <div className="col-lg-12 text-center setup-profile-div">
                <div className="step-number-div">1/3</div>
                <h1 className="setup-heading">Profile Setup</h1>
                <h4 className="setup-sub-heading">Setting up your name and website URL so that your customers know who they are talking to</h4>
                <div className="company-url-main-div flex text-center">
                    <span className="url-http-text">https://</span>
                    <div className="group form-group company-url-form-group">
                        <input className="input" type="text" id="website-url" name="website-url" placeholder=" " required value={this.state.websiteUrl} onChange={(event) => { this.setState({ websiteUrl: event.target.value }) }} />
                        <label className="label-for-input email-label">www.mycompany.com</label>
                    </div>
                </div>
                <div className="company-url-main-div flex text-center">
                    <div className="group form-group form-group-user-name">
                        <input className="input customer-name" type="text" id="customer-name" name="name" placeholder=" " required value={this.state.name} onChange={(event) => { this.setState({ name: event.target.value }) }} />
                        <label className="label-for-input email-label">Your Name</label>
                    </div>
                </div>
                <div className="company-url-main-div flex text-center">
                    <button className="btn btn-sm btn-primary px-4 btn-primary-custom"> Save and continue </button>
                </div>
            </div>
        </form>
        )
    }
}
export default Step1