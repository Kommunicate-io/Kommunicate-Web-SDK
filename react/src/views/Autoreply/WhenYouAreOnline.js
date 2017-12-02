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
            <h4> When you are online </h4>
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
	        <div>
	        	<h3>Preview:</h3>
	        </div>
	        <div>
	        	<button>Anonymous User</button>
	        	<button>Known User</button>
	        </div>
	        <div className="form-group row">
	        	<div className="col-3">
	        		<p>Mesage for anonymous users</p>
	        		<textarea
                className="form-group script-text-area"
                rows="5"
                readOnly
              />
              <button>Anonymous User</button>
	        		<button>Known User</button>
	        	</div>
	        	<div className="col-1">
	        	</div>
	        	<div className="col-3">
	        		<p>Mesage for known users</p>
	        		<textarea
                className="form-group script-text-area"
                rows="5"
                readOnly
              />
              <div className="row">
              	<button>Anonymous User</button>
	        			<button>Known User</button>
              </div>
	        	</div>
	        </div>
	  		</div>
			</div>
		)
	}

}

export default WhenYouAreOnline;