import React, { Component } from 'react';
import Notification from '../model/Notification';


class WhenYouAreOnline extends Component {

	state = {
		showOfflinePrefs: false,
		upDownIcon: "icon-arrow-down icons font-2xl d-block mt-4 text-right"
	}

  methodToShowPrefs = (e) => {
  	e.preventDefault();
  	if(this.state.showPrefs){
  		this.setState({
  			showPrefs: false,
  			upDownIcon: "icon-arrow-down icons font-2xl d-block mt-4 text-right"
  		})
  	}else{
  		this.setState({
  			showPrefs: true,
  			upDownIcon: "icon-arrow-up icons font-2xl d-block mt-4 text-right"
  		})
  	}
  }

	render(){
		return (
      <div className="cursor-is-pointer">
        <div className="row">
          <div className="col-6">
            <h4> When you are offline </h4>
            <p className="ask-your-user-to">Ask your user to leave a message so that you can get back to them later</p>
          </div>
          <div className="col-6">
            <i className={this.state.upDownIcon}></i>
          </div>
        </div>
				<div className = {
	        this.state.showOfflinePrefs === true
	          ? "form-group row"
	          : "n-vis"
	    		}
	        style={{ marginLeft: "0" }}>
	        <h3>Preview:</h3>
	  		</div>
			</div>
		)
	}

}

export default WhenYouAreOnline;