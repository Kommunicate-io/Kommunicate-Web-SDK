import React, { Component } from 'react';
import Notification from '../model/Notification';

class ChatPreview extends Component {

	render() {
		return (
			<div className="user-chat-preview">
      	<div style={{height: "127px"}}>
      	</div>
      	<div className="user-reply-section">
      		<img className="user-reply-section" src="../img/user-reply-section.png" alt="Preview Image" />
      	</div>
      </div>
		)
	}
}

export default ChatPreview;