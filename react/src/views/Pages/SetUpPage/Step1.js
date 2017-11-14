import React, { Component } from 'react';

import {getJsCode, getJsInstructions} from '../../../utils/customerSetUp';

import Notification from '../../model/Notification';
import MultiEmail from '../../MultiEmail/';

class Step1 extends Component {

	constructor(props) {
		super(props);

    this.state = {
      hideNextBtn:false
    }

    this.jsScript = getJsCode();
    this.jsInstructions = getJsInstructions();
	}

  componentDidMount() {
    
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

    const texAreaStyle = { 
      "backgroundColor": "#FFF",
      "color":"#000"
    }

  	return (
      <form>
        <MultiEmail template="SEND_KOMMUNICATE_SCRIPT" />
        <div className="row">
          <div className="form-group col-md-5">
            <textarea style={texAreaStyle} className="form-control" rows='16' value={this.jsInstructions} readOnly />
          </div>
          <div className="form-group col-md-7">
            <textarea style={texAreaStyle} className="form-control" rows='16' value={getJsCode()} readOnly />
          </div>
        </div>
        <div className="form-group"> 
          <button className="btn btn-sm btn-primary px-4" onClick={this.props.changeStep} hidden = {this.state.hideNextBtn}> Next </button>
        </div>
      </form>
  	)
  }
}

export default Step1