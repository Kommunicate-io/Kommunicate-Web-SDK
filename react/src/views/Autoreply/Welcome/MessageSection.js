import React, {Component} from 'react';

import LinkPopover from './LinkPopover';

class MessageSection extends Component {

	constructor(props) {
        super(props);
    }

	state = {
		msg: this.props.messageValue ? this.props.messageValue: ''
	}

	handleChange = (e) => {
		this.setState({msg: e.target.value}, () => {this.props.getMessage(this.state.msg)})
	}

	render() {
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
			            	<LinkPopover />
				            {
				          	 <button className="welcome-msg-textarea-save-btn" style={{textAlign: "center"}} onClick={this.props.addMessageToChatPreview}> Save Changes </button>
			        		}
		    			</div>
					</div>
					<div className={this.props.showDeleteBtn ? "col-1":"n-vis"}>
	      				<button><i className="fa fa-trash-o fa-lg"></i></button>
	      			</div>
	      		</div>
			</div>	
		)
	}
}

export default MessageSection