import React, {Component} from 'react';

import LinkPopover from './LinkPopover';

import {editInAppMsg} from '../../../utils/kommunicateClient'
import Notification from '../../model/Notification';


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

	insertLink = (textWithLink) => {

		this.setState(prevState => {
			return {msg: prevState.msg + " " + textWithLink}
		}, () => {this.props.getMessage(this.state.msg)})
	}

	_editInAppMsg = () => {
		editInAppMsg(this.props.id, this.state.msg)
			.then(response => {
				if(response){
  					Notification.success('Saved edited changes');
	  			}else {
	  				Notification.warning('Edited message not saved');
	  			}
			}).catch(err => {
				console.log(err);
				Notification.warning('Edited message not saved');
			})
	}

	render() {
		console.log(this.props)
		return (
			<div>
				<div className="form-group row">
					<div className="col-9">
						<div className="form-group welcome-msg-textarea-btn-container">
			    			<textarea
			                	className="form-group welcome-message-textarea"
			                	value={this.state.msg}
			                	onChange={this.handleChange}
			                	rows="5"
			            	/>
			            	<LinkPopover insertLink={this.insertLink}/>
				            {
				            	!this.props.editInAppMsg ? 
				            		<button className="welcome-msg-textarea-save-btn" style={{textAlign: "center"}} onClick={this.props.addMessageToChatPreview}> Save Changes </button> :
				            		<button className="welcome-msg-textarea-save-btn" style={{textAlign: "center"}} onClick={this._editInAppMsg}> Save Changes </button>
			        		}
		    			</div>
					</div>
					<div className={this.props.showDeleteBtn ? "col-3":"n-vis"}>
	      				<button onClick={this.props.deleteInAppMsg}><i className="fa fa-trash-o fa-lg"></i></button>
	      			</div>
	      		</div>
			</div>	
		)
	}
}

export default MessageSection