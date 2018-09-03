import React, {Component} from 'react';
import './IncomingEmailForward.css';
import CommonUtils from '../../utils/CommonUtils';
import Notification from '../../views/model/Notification';
import { Link } from 'react-router-dom';
import {acEventTrigger} from '../../utils/ActiveCampaign';

export default class IncomingEmailForward extends Component {

    constructor(props) {
        super(props);

        this.state = {
           copySuccess: "Copy"
        }
        
    }

    copyToClipboard = (e) => {
        e.preventDefault();
        this.textArea.select();
        document.execCommand("copy");
        e.target.focus();
        this.setState({ copySuccess: "Copy" });
        // setTimeout(() => { 
        //     this.setState({ copySuccess: "Copy" }); 
        // }, 5000);
        Notification.info("Email copied successfully!");
        acEventTrigger('ac-configure-mailbox');
      };

    render () {
        let currentUrl = window.location.hostname;
        let envVar;
        (currentUrl.includes('localhost') || currentUrl.includes('dashboard-test')) ? envVar = '+test' : envVar = '';

        let incomingEmailForwardEmailId = `support${envVar}+app.${CommonUtils.getUserSession().applicationId}@kommunicatemail.io`;
        return(
            <div className="animated fadeIn incoming-email-forward-div">
                <div className="row">
                    <div className="col-sm-12 col-md-8">
                        <div className="incoming-email-forward-container">
                            <h2 className="incoming-email-forward-heading">
                            You can reply to support emails from Kommunicate
                            </h2>
                            <p className="incoming-email-forward-description">In your email service provider settings, set up email forwarding from your support email address (example: support@yourcompany.com) to this email address:</p>
                        </div>
                        <div className="incoming-email-forward-email-id-container">
                            {/* <div className="incoming-email-forward-email-id"  > */}
                                <textarea ref={(textarea) => this.textArea = textarea} value={incomingEmailForwardEmailId} readOnly/>
                            {/* </div> */}
                            <div className="incoming-email-forward-copy-icon">
                            <button onClick={this.copyToClipboard}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path fill="none" d="M0 0h24v24H0z"/>
                                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4l6 6v10c0 1.1-.9 2-2 2H7.99C6.89 23 6 22.1 6 21l.01-14c0-1.1.89-2 1.99-2h7zm-1 7h5.5L14 6.5V12z" fill="#969393"/>
                                </svg>
                                {this.state.copySuccess}
                            </button>
                                
                            </div>
                        </div>
                        <div className="incoming-email-forward-helper-text-conntainer">
                            <p>Once this setup is done, your support emails will show up in the <Link to="/conversations">Conversation section.</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}