import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import CommonUtils from '../../utils/CommonUtils';
import './SettingsSidebar.css';

class SettingsSidebar extends Component {
    constructor(props){
        super(props);
        this.state={
            isKommunicateDashboard:CommonUtils.isKommunicateDashboard()
        }
    }

    handleClick(e) {
        e.preventDefault();
        e.target.parentElement.classList.toggle('open');
    }

    render() {
        return (
            <div className="settings-sidebar text-center">
                <p className="settings-title">Settings</p>
                <hr className="hrr"/>
                <div className="settings-sidebar-nav">
                    <ul className="ss-nav">
                        <li className="ss-nav-title">
                            PERSONAL
                        </li>
                        <li className="ss-nav-item profile-link">
                            <NavLink to={'/settings/profile'} className="ss-nav-link" activeClassName="active">Profile</NavLink>
                        </li>
                        {this.state.isKommunicateDashboard?
                        <li className="ss-nav-item profile-link">
                            <NavLink to={'/settings/email-notifications'} className="ss-nav-link" activeClassName="active">Email Notifications</NavLink>
                        </li>
                        :null}
                        {this.state.isKommunicateDashboard?<li className="ss-nav-title">
                            TEAM
                        </li>:null
                        }
                        {this.state.isKommunicateDashboard?
                        <li className="ss-nav-item welcome-link">
                            <NavLink to={'/settings/welcome-message'} className="ss-nav-link ac-trigger-links" activeClassName="active">Welcome Message</NavLink>
                        </li>:null
                        }
                        
                        {this.state.isKommunicateDashboard?
                        <li className="ss-nav-item welcome-link">
                            <NavLink to={'/settings/away-message'} className="ss-nav-link ac-trigger-links" id="ac-away-message" activeClassName="active">Away Message</NavLink>
                        </li>: null
                        }
                        {this.state.isKommunicateDashboard? 
                        <li className="ss-nav-item message-shortcut-link">
                            <NavLink to={'/settings/message-shortcuts'} className="ss-nav-link ac-trigger-links" id="ac-quick-replies" activeClassName="active">Quick Replies</NavLink>
                        </li>:null
                        }
                        <li className="ss-nav-item team-link">
                            <NavLink to={'/settings/team'} className="ss-nav-link ac-trigger-links" id="ac-teammates" activeClassName="active">Teammates</NavLink>
                        </li>
                        
                        {this.state.isKommunicateDashboard?
                        <li className="ss-nav-item agent-assignment-link">
                            <NavLink to={'/settings/agent-assignment'} className="ss-nav-link ac-trigger-links" id="ac-conversation-routing" activeClassName="active">Conversation Routing</NavLink>
                        </li>:null
                        }
                        <li className="ss-nav-title">
                            CONFIGURATION
                        </li>
                        {this.state.isKommunicateDashboard?
                        <li className="ss-nav-item connect-support-email-link">
                            <NavLink to={'/settings/mailbox'} className="ss-nav-link ac-trigger-links" id="ac-connect-support-email" activeClassName="active">Mailbox</NavLink>
                        </li>:null
                        }
                        <li className="ss-nav-item integrations-link">
                            <NavLink to={'/settings/install'} className="ss-nav-link" activeClassName="active">Install</NavLink>
                        </li>
                        {this.state.isKommunicateDashboard?
                        <li className="ss-nav-item integrations-link">
                            <NavLink to={'/settings/chat-widget-customization'} className="ss-nav-link" activeClassName="active">Chat Widget</NavLink>
                        </li>:null
                        }
                        {/* hiding billing section */
                        this.state.isKommunicateDashboard?
                        <li className="ss-nav-item billing-link ">
                            <NavLink to={'/settings/billing'} className="ss-nav-link" activeClassName="active">Billing</NavLink>
                        </li>:null
                        }
                        <li className="ss-nav-item">
                            <NavLink to={'/settings/pushnotification'} className="ss-nav-link" activeClassName="active">Push Notifications</NavLink>
                        </li>
                        <li className="ss-nav-item">
                            <NavLink to={'/settings/email-fallback'} className="ss-nav-link" activeClassName="active">Fallback Emails</NavLink>
                        </li>
                        <li className="ss-nav-item">
                            <NavLink to={'/settings/webhooks-security'} className="ss-nav-link" activeClassName="active">Webhooks &amp; Security</NavLink>
                        </li>
                        {this.state.isKommunicateDashboard?
                        <li className="ss-nav-title">
                            DOWNLOAD
                        </li>:null}
                        {this.state.isKommunicateDashboard?
                        <li className="ss-nav-item agent-app-link">
                            <NavLink to={'/settings/agent-app'} className="ss-nav-link" activeClassName="active">Agent app</NavLink>
                        </li>:null
                        }
                        {/**help */
                         !this.state.isKommunicateDashboard?
                        <li className="ss-nav-item agent-app-link">
                            <NavLink to={'/settings'} className="ss-nav-link" activeClassName="active">help</NavLink>
                        </li>:null
                        }

                    </ul>
                </div>
            </div>
        )
    }


}

export default SettingsSidebar;
