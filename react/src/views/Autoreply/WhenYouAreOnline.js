import React, { Component } from 'react';
import Notification from '../model/Notification';


class WhenYouAreOnline extends Component {

	state = {
		showPrefs: false,
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
            <h4 className="when-you-are-online-heading"> When you are online <span className="online-indicator"></span></h4>
            <p className="start-solving-your-user">Start solving your users’ issues with this message </p>
          </div>
          <div className="col-6" onClick={this.methodToShowPrefs}>
            <i className={this.state.upDownIcon}></i>
          </div>
        </div>
				<div className = {
	        this.state.showPrefs === true
	          ? null
	          : "n-vis"
	    		}
	        style={{ marginLeft: "0" }}>
	        <div className="form-group row">
	        	<div className="col-12">
	        		<h3 className="welcome-preview">Preview:</h3>
	        	</div>
	        </div>
	        <div className="form-group row">
	        	<div className="col-12">
	        		<button className="welcome-user-button welcome-anonymous-user-button">Anonymous User</button>
	        		<button className="welcome-user-button welcome-known-user-button">Known User</button>
	        	</div>
	        </div>
	        <div className="form-group row">
	        	<div className="col-3">
	        		<p className="welcome-user-message">Mesage for anonymous users <i className="fa fa-info-circle fa-sm mt-4"></i></p>
	        		<textarea
                className="form-group script-text-area welcome-message-textarea"
                rows="5"
                readOnly
              />
	        	</div>
	        	<div className="col-1">
	        	</div>
	        	<div className="col-3">
	        		<p className="welcome-user-message">Mesage for known users <i className="fa fa-info-circle fa-sm mt-4"></i></p>
	        		<textarea
                className="form-group script-text-area welcome-message-textarea"
                rows="5"
                readOnly
              />
	        	</div>
	        </div>
	        <div className="form-group row">
	        	<div className="col-4">
              <button className="welcome-buttons">Add another message</button>
	        		<button className="welcome-buttons">Add input field</button>
	        	</div>
	        	<div className="col-5 text-left">
              <button className="welcome-buttons">Add another message</button>
	        	</div>
	        </div>
	  		</div>
			</div>
		)
	}

}

export default WhenYouAreOnline;