import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {getJsCode, getJsInstructions} from '../../../utils/customerSetUp';

import Notification from '../../model/Notification';
import MultiEmail from '../../MultiEmail/';
import Install from '../../Settings/Installation/';
import CommonUtils from '../../../utils/CommonUtils';

class Step3 extends Component {
 static defaultProps ={ hideSkipForNow : true }
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
       localStorage.setItem("agentId",params.agentId||"default_agent_id");
       localStorage.setItem("agentName",params.agentName||"agent_display_name");

       let userSession = CommonUtils.getUserSession();
       if (!userSession.application) {
          console.log("application not found in user session, creating {}");
          userSession.application = {};
       }
       userSession.application.applicationId = params.applicationId||"your _application_id";
       CommonUtils.setUserSession(userSession);

       this.setState({
        hideNextBtn : true
       })
       }
  }
  jumpToDashboard = (e) => {
		e.preventDefault()
    // this.props.history.push('/dashboard');
    window.location.assign("/dashboard");
	}

  render() {
    return (
      <form className="step-3-form">
        <div className="col-lg-12 text-center">
          {/* <div className={this.props.hideSkipForNow? "n-vis" : "step-number-div" }>
            3/3
          </div> */}
          <h1 className="setup-heading">{this.props.pageTitle}Add Kommunicate to your product</h1>
          <h4 className={this.props.hideSkipForNow? "n-vis" : "setup-sub-heading"}>I will do it <a href="javascript:void(0);" onClick={this.jumpToDashboard}>later</a> </h4>
          {/* <h2 className="setup-integration-later-text">Installation instructions can also be found inside <span>Settings > CONFIGURATION > Install</span> later</h2> */}
        </div>
        <div className="row justify-content-center">
          <div className="col-md-12">
            <Install customerInfo={this.props.customerInfo}cardSize={12}/>
            <div className="form-group text-center">
              <button className={this.props.hideSkipForNow? "n-vis" : "km-button km-button--primary step-1-submit-btn"} onClick={this.jumpToDashboard} hidden={this.state.hideNextBtn}>Go to dashboard</button>
              <div className="button-link-container text-center">
                <MultiEmail template="SEND_KOMMUNICATE_SCRIPT" />
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }
}

export default Step3