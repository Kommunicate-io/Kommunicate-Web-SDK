import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {getJsCode, getJsInstructions} from '../../../utils/customerSetUp';

import Notification from '../../model/Notification';
import MultiEmail from '../../MultiEmail/';
import Integration from '../../Settings/Integration/';

class Step1 extends Component {

	constructor(props) {
		super(props);

    this.state = {
      hideNextBtn:false
    }

    this.jsScript = getJsCode();
    this.jsInstructions = getJsInstructions();
	}

  componentDidMount(){
		//document.getElementById('instruction-display-area').innerHTML=getJsInstructions();
  }

  componentWillMount(){
    if(this.props.location && this.props.location.pathname ==="/installation" &&this.props.location.search){
      //const search = encodeURIComponent(this.props.location.search);
      let paramArray = this.props.location.search.substr(1).split("&");
      let params = {};
      for(var i=0;i<paramArray.length;i++){
        var item = paramArray[i].split("=");
        params[item[0]]=item[1];
      }
      console.log("search",params);
       localStorage.setItem("applicationId",params.applicationId||"your _application_id");
       localStorage.setItem("agentId",params.agentId||"default_agent_id");
       localStorage.setItem("agentName",params.agentName||"agent_display_name");
       this.setState({
        hideNextBtn : true
       })
       }
  }

  render() {
    return (
      <form>
        <div className="col-lg-12 text-center">
          <div className="step-number-div">
            1/2
          </div>
          <h1 className="setup-heading">{this.props.pageTitle}Integration</h1>
          <h4 className="setup-sub-heading">Integrate Kommunicate to your product within <strong>2 minutes</strong></h4>
          <h2 className="setup-integration-later-text">Integration instructions can also be found inside <span>Settings > Integrations</span> later</h2>
          <div className="button-link-container">
          <MultiEmail template="SEND_KOMMUNICATE_SCRIPT" />
            <a  className="skip-link">
            <Link to="/dashboard" className=" skip-link"> Skip for now</Link> 
            </a>
          </div>
          <hr></hr>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-10">
            <Integration cardSize={12}/>
            <div className="form-group">
          <button className="btn btn-sm btn-primary px-4 ml-40 btn-primary-custom" onClick={this.props.changeStep} hidden={this.state.hideNextBtn}> Next </button>
        </div>
          </div>
        </div>
        
      </form>
    )
  }
}

export default Step1