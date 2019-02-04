import React, { Component } from 'react'
import {SettingsHeader} from '../../components/SettingsComponent/SettingsComponents';
import {CompanyInfoContainer} from './companyStyle'


const CompanyInfo = props => (
    <CompanyInfoContainer >
        <p className="input-field-title">Company Name:</p>
        <input type="text" id="km-company-name" placeholder="Enter Company Name" value={props.companyName} />
        <p className="input-field-title">Company URL:</p>
        <input type="text" id="km-company-url" placeholder="Enter Company URL" value={props.companyUrl} />
        <div className="km-company-btn-wrapper">
            <button data-button-text={props.buttonText} className="km-button km-button--primary km-company-save-btn" onClick={props.onButtonClick}>Save Changes</button>
            <button data-button-text="Cancel" className="km-button km-button--secondary km-company-cancel-btn" >Cancel</button>
        </div>    
        
    </CompanyInfoContainer >
)

class Company extends Component{
  constructor(props){
    super(props);
    this.state = {
     
    };
    
  }

  
  render() {
      return(
          <div>
              <SettingsHeader />
              <CompanyInfo />
          </div>
      )
  }
}

export default Company;