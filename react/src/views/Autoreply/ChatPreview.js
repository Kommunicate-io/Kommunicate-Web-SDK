import React, { Component } from 'react';
import Notification from '../model/Notification';

class ChatPreview extends Component {

      constructor(props) {
          super(props);
          console.log(props);
      }

	render() {
            console.log(this.props.chatPreviewComponents);
		return (
			<div className="user-chat-preview">
                  	<div style={{height: "127px"}}>
                              {
                                    this.props.chatPreviewComponents.map((chatPreviewComponent, i) => (<div key={i}>{chatPreviewComponent.component}</div>))
                              }
                  	</div>
                  	<div className="user-reply-section">
                  		<img className="user-reply-section" src="../img/user-reply-section.png" alt="Preview Image" />
                  	</div>
                  </div>
		)
	}
}

export default ChatPreview;