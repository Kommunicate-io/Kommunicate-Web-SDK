import React, {Component} from 'react';

import LinkPopover from './LinkPopover';

class MessageSection extends Component {

	constructor(props) {
        super(props);
        console.log(props);
    }

	state = {
		msg: ''
	}

	handleChange = (e) => {
		this.setState({msg: e.target.value})
		this.props.getMessage(this.state.msg)
	}

	render() {
		console.log(this.props);
		return (
			<div>
				<div className="form-group row">
					<div className="col-11">
						<div className="form-group welcome-msg-textarea-btn-container">
		    			<textarea
		                	className="form-group script-text-area welcome-message-textarea"
		                	value={this.state.msg}
		                	onChange={this.handleChange}
		                	rows="5"
		            	/>
			            {
			          	 // <button className="welcome-msg-textarea-button"><i className="icon-link icons"></i> Insert Link </button>
		        		}
			    			<LinkPopover />
		    			</div>
					</div>
					<div className="col-1">
	      				<i className="fa fa-trash-o fa-lg"></i>
	      			</div>
	      		</div>
			</div>	
		)
	}
}

export default MessageSection