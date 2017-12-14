import React, { Component } from 'react';
import Notification from '../model/Notification';

import ChatPreview from './ChatPreview';
import UserPopover from './UserPopover';

import LinkPopover from './LinkPopover';


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

  toggle = () =>  {
  		this.setState({
      	popover1Open: !this.state.popover1Open
    	});
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
	        	<div className="col-6">
	        		<h3 className="welcome-preview text-right">Preview:</h3>
	        	</div>
	        	<div className="col-6">
	        	</div>
	        </div>
	        <div className="form-group row">
	        	<div className="col-4">
	        		<UserPopover 
	        			title="Message for anonymous users"
	        			message="Users whose contact details are not available with you will be shown this message"
	        		/>
	        		<div className="welcome-msg-textarea-btn-container">
	        			<textarea
		                	className="form-group script-text-area welcome-message-textarea"
		                	rows="5"
		            	/>
			            {
			          	 // <button className="welcome-msg-textarea-button"><i className="icon-link icons"></i> Insert Link </button>
		        		}
	        			<LinkPopover />
	        		</div>
	        	</div>
	        	<div className="col-1">
	        	</div>
	        	<div className="col-4">
		            <ChatPreview />
	        	</div>
	        </div>
	        <div className="form-group row">
	        	<div className="col-4">
              <button className="welcome-buttons">Add another message</button>
	        		<button className="welcome-buttons">Add lead generation template</button>
	        	</div>
	        </div>
	        <div className="form-group row">
	        	<div className="col-4">
	        	{
	        		<UserPopover 
	        			title="Message for known users"
	        			message="Users whose email ID/Phone number are available with you will be shown this message"
	        		/>
	        	}
	        		<div className="welcome-msg-textarea-btn-container">
	        			<textarea
		                className="form-group script-text-area welcome-message-textarea"
		                rows="5"
		            	/>
		          	{
		          		//<button className="welcome-msg-textarea-button" id="Popover2" onClick={this.toggle}><i className="icon-link icons"></i> Insert Link </button>
	        		}
	        		<LinkPopover />
	        		</div>
	        	</div>
	        	<div className="col-1">
	        	</div>
	        	<div className="col-4">
		            <ChatPreview />
	        	</div>
	        </div>
	        <div className="form-group row">
	        	<div className="col-4">
              <button className="welcome-buttons">Add another message</button>
	        		<button className="welcome-buttons">Add input field</button>
	        	</div>
	        </div>
	  		</div>
			</div>
		)
	}

}

export default WhenYouAreOnline;