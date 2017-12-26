import React, { Component } from 'react';
import validator from 'validator';
import axios from 'axios';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import  {getConfig} from '../../../config/config.js';
import './radio.css'

class SelectSteps extends Component {

  constructor(props) {
    super(props);
    this.state={
      isHidden:false
    }
  }

  componentWillMount(){
	   if(this.props.location && this.props.location.pathname ==="/installation"){
		this.state.isHidden = true;
	
	   }
	}

  render() {
    return (
      <div className='card' style={{'marginTop': '90px'}} >
        {/*
          <div className="form-group text-center" style={{'margin': '40px 0'}}>
            <label className="radio-inline">
              <input type="radio" className="option-input radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" checked={this.props.step === 1 ? true:false} readOnly /> Step 1
            </label>
            <label className="radio-inline">
              <input type="radio" className="option-input radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" checked={this.props.step === 2 ? true:false} readOnly /> Step 2
            </label>
          </div>
        */}
        {/* <div className="form-group text-center" style={{'margin': '40px 0'}} hidden = {this.state.isHidden}>
          <div style={{"width":"50%", "margin":"0 auto", "display":"flex"}}>
            <div className="step-1-circle" style={this.props.step === 1 ? {"backgroundColor":"#20a8d8"}:{"backgroundColor":"#4dbd74"}}>
              <div style={{"marginTop":"13px"}}><i className="icon-envelope"></i></div>
            </div>
            <div className={this.props.step === 1 ? "progress-bar custom-progress-bar-1": "progress-bar bg-success custom-progress-bar-1"} role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
            <div className="progress-bar custom-progress-bar-2" style={this.props.step === 1 ? {"backgroundColor":"#C0C0C0"}:{"backgroundColor":"#20a8d8"}} role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
            <div className="step-2-circle" style={this.props.step === 1 ? {"backgroundColor":"#C0C0C0"}:{"backgroundColor":"#20a8d8"}}>
              <div style={{"marginTop":"13px"}}><i className="icon-user"></i></div>
            </div>
          </div>
        </div> */}

        {/* <div className="col-lg-12 text-center">
                <div className="step-number-div">
                   {this.props.step}/2
                </div>
                <h1 className="setup-heading">{this.props.pageTitle}Integration</h1>
                <h4 className="setup-sub-heading">Integrate Kommunicate to your product within <strong>2 minutes</strong></h4>
                <h2 className="setup-integration-later-text">Integration instructions can also be found inside <span>Settings > Integrations</span> later</h2>
                <div className="button-link-container">
                    <button type="submit" className="send-instruction-btn">Send instructions to team</button>
                    <a href="#/" className="skip-link floating-abs-right">Skip for now</a>
                </div>
                <hr></hr>
            </div> */}


      </div>
    )
  }
}

export default SelectSteps