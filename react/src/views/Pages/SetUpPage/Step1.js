import React, { Component } from 'react';

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
        <div className="row justify-content-center">
          <div className="col-md-10">
            <Integration />
          </div>
        </div>
        <div className="form-group">
          <button className="btn btn-sm btn-primary px-4" onClick={this.props.changeStep} hidden={this.state.hideNextBtn}> Next </button>
        </div>
      </form>
    )
  }
}

export default Step1