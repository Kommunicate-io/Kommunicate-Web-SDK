import React, { Component } from 'react';
import Notification from '../model/Notification';


class WhenYouAreOnline extends Component {

	state = {
		showOfflinePrefs: false,
		upDownIcon: "icon-arrow-down icons font-2xl d-block mt-4 text-right"
	}

  methodToShowOfflinePrefs = (e) => {
  	e.preventDefault();
  	if(this.state.showOfflinePrefs){
  		this.setState({
  			showOfflinePrefs: false,
  			upDownIcon: "icon-arrow-down icons font-2xl d-block mt-4 text-right"
  		})
  	}else{
  		this.setState({
  			showOfflinePrefs: true,
  			upDownIcon: "icon-arrow-up icons font-2xl d-block mt-4 text-right"
  		})
  	}
  }

	render(){
		return (
      <div className="cursor-is-pointer">
        <div className="row">
          <div className="col-6">
            <h4 className="when-you-are-online-heading"> When you are offline <span className="offline-indicator"></span></h4>
            <p className="ask-your-user-to">Ask your user to leave a message so that you can get back to them later</p>
          </div>
          <div className="col-6" onClick={this.methodToShowOfflinePrefs}>
            <i className={this.state.upDownIcon}></i>
          </div>
        </div>
				<div className = {
	        this.state.showOfflinePrefs === true
	          ? "form-group row"
	          : "n-vis"
	    		}
	        style={{ marginLeft: "0" }}>
	        <h3 className="welcome-preview">Preview:</h3>
	  		</div>
			</div>
		)
	}

}

export default WhenYouAreOnline;