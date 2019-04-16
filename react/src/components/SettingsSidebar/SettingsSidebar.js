import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import CommonUtils from '../../utils/CommonUtils';
import './SettingsSidebar.css';
import styled, { withTheme, createGlobalStyle } from 'styled-components';

const LinkContainer = styled.a`
    display: flex !important; 
    align-items: center;
    justify-content: flex-start;
`;

const InfoContainer = styled.div`
    width: 20px;
    height: 15px;
    margin-right: 5px;
`;

const InfoIcon = styled.div`
    width: 15px;
    height: 15px;
    font-size: 12px;
    line-height: 15px;
    border: 1px solid #666464;
    background-color: #666464;
    color: #FFF;
    border-radius: 50%;
    margin: 0 auto;
    text-align: center;
`;

const GlobalSettingSidebarStyle = createGlobalStyle`
    .ss-nav-link.active {
        background-color: ${props => props.theme.primary};
        color: #FFF;
    }
    .ss-nav-item:hover {
        background-color: ${props => props.theme.primary};
    }
    .ss-nav-item:hover .ss-nav-link {
        color: #FFF;
        text-decoration: none;
    }
    .ss-nav-item:hover .ss-nav-link .info-icon, .ss-nav-link.active .info-icon {
        color: #666464;
        border: 1px solid #FFF;
        background-color: #FFF;
    }
`;

class SettingsSidebar extends Component {
    constructor(props){
        super(props);
        this.state={
            isKommunicateDashboard:CommonUtils.isKommunicateDashboard(),
            isApplozicTrialExpired: CommonUtils.isProductApplozic() && CommonUtils.isExpiredPlan()
        }
    }

    handleClick(e) {
        e.preventDefault();
        e.target.parentElement.classList.toggle('open');
    }

    render() {
        return (
            <div className="settings-sidebar text-center">
            <GlobalSettingSidebarStyle />
                <p className="settings-title">Settings</p>
                <hr className="hrr"/>
                <div className="settings-sidebar-nav">
                    { this.state.isApplozicTrialExpired ? 
                    <ul className="ss-nav">
                        <li className="ss-nav-title">
                            CONFIGURATION
                        </li>
                        <li className="ss-nav-item billing-link ">
                            <NavLink to={'/settings/billing'} className="ss-nav-link" activeClassName="active">Billing</NavLink>
                        </li>
                    </ul> :
                    <ul className="ss-nav">
                        {this.state.isKommunicateDashboard &&
                            <li className="ss-nav-title">
                                PERSONAL
                            </li>
                        }
                        <li className="ss-nav-item profile-link">
                            <NavLink to={'/settings/profile'} className="ss-nav-link" activeClassName="active">Profile</NavLink>
                        </li>
                        {this.state.isKommunicateDashboard && 
                            <li className="ss-nav-item profile-link">
                                <NavLink to={'/settings/email-notifications'} className="ss-nav-link" activeClassName="active">Email Notifications</NavLink>
                            </li>
                        }
                        {this.state.isKommunicateDashboard && 
                            <li className="ss-nav-title">
                                TEAM
                            </li>
                        }
                        <li className="ss-nav-item company-link">
                            <NavLink to={'/settings/company'} className="ss-nav-link ac-trigger-links" activeClassName="active">Company</NavLink>
                        </li>
                        {this.state.isKommunicateDashboard && 
                            <li className="ss-nav-item welcome-link">
                                <NavLink to={'/settings/welcome-message'} className="ss-nav-link ac-trigger-links" activeClassName="active">Welcome Message</NavLink>
                            </li>
                        }
                        
                        {this.state.isKommunicateDashboard && 
                            <li className="ss-nav-item welcome-link">
                                <NavLink to={'/settings/away-message'} className="ss-nav-link ac-trigger-links" id="ac-away-message" activeClassName="active">Away Message</NavLink>
                            </li>
                        }
                        {this.state.isKommunicateDashboard && 
                            <li className="ss-nav-item welcome-link">
                                <NavLink to={'/settings/csat-ratings'} className="ss-nav-link ac-trigger-links" id="ac-conversation-ratings" activeClassName="active">CSAT Ratings</NavLink>
                            </li>
                        }
                        {this.state.isKommunicateDashboard &&  
                            <li className="ss-nav-item message-shortcut-link">
                                <NavLink to={'/settings/quick-replies'} className="ss-nav-link ac-trigger-links" id="ac-quick-replies" activeClassName="active">Quick Replies</NavLink>
                            </li>
                        }
                        <li className="ss-nav-item team-link">
                            <NavLink to={'/settings/team'} className="ss-nav-link ac-trigger-links" id="ac-teammates" activeClassName="active">Teammates</NavLink>
                        </li>
                        
                        {this.state.isKommunicateDashboard && 
                            <li className="ss-nav-item agent-assignment-link">
                                <NavLink to={'/settings/conversation-rules'} className="ss-nav-link ac-trigger-links" id="ac-conversation-routing" activeClassName="active">Conversation Rules</NavLink>
                            </li>
                        }
                        {this.state.isKommunicateDashboard && 
                            <li className="ss-nav-item agent-assignment-link">
                                <NavLink to={'/settings/conversation-auto-closing'} className="ss-nav-link ac-trigger-links" id="ac-conversation-rules" activeClassName="active">Auto-resolve conversations</NavLink>
                            </li>
                        }
                        <li className="ss-nav-title">
                            CONFIGURATION
                        </li>
                        {this.state.isKommunicateDashboard && 
                            <li className="ss-nav-item connect-support-email-link">
                                <NavLink to={'/settings/mailbox'} className="ss-nav-link ac-trigger-links" id="ac-connect-support-email" activeClassName="active">Mailbox</NavLink>
                            </li>
                        }
                        <li className="ss-nav-item integrations-link">
                            <NavLink to={'/settings/install'} className="ss-nav-link" activeClassName="active">Install</NavLink>
                        </li>
                        {this.state.isKommunicateDashboard && 
                            <li className="ss-nav-item integrations-link">
                                <NavLink to={'/settings/chat-widget-customization'} className="ss-nav-link" activeClassName="active">Chat Widget</NavLink>
                            </li>
                        }
                        <li className="ss-nav-item billing-link ">
                            <NavLink to={'/settings/billing'} className="ss-nav-link" activeClassName="active">Billing</NavLink>
                        </li>
                        <li className="ss-nav-item">
                            <NavLink to={'/settings/pushnotification'} className="ss-nav-link" activeClassName="active">Push Notifications</NavLink>
                        </li>
                        <li className="ss-nav-item">
                            <NavLink to={'/settings/email-fallback'} className="ss-nav-link" activeClassName="active">Fallback Emails</NavLink>
                        </li>
                        <li className="ss-nav-item">
                            <NavLink to={'/settings/webhooks-security'} className="ss-nav-link" activeClassName="active">Webhooks &amp; Security</NavLink>
                        </li>
                        {this.state.isKommunicateDashboard && 
                            <li className="ss-nav-title">
                                DOWNLOAD
                            </li>
                        }
                        { this.state.isKommunicateDashboard &&
                            <li className="ss-nav-item agent-app-link">
                                <NavLink to={'/settings/agent-app'} className="ss-nav-link" activeClassName="active">Agent app</NavLink>
                            </li>
                        }
                        {/**help */
                         !this.state.isKommunicateDashboard &&
                            <li className="ss-nav-item agent-app-link">
                                <LinkContainer href="https://answers.applozic.com/" className="ss-nav-link" target="_blank">
                                    <InfoContainer>
                                        <InfoIcon className="info-icon">?</InfoIcon>
                                    </InfoContainer>
                                Help
                                </LinkContainer>
                            </li>
                        }

                    </ul>                     
                }
                </div>
            </div>
        )
    }


}

export default withTheme(SettingsSidebar);
