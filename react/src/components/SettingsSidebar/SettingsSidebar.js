import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './SettingsSidebar.css';

class SettingsSidebar extends Component {
 
    handleClick(e) {
        e.preventDefault();
        e.target.parentElement.classList.toggle('open');
    }

    render() {
        return (
            <div className="settings-sidebar text-center">
                <p className="settings-title">Settings</p>
                <p className="hr"></p>
                <div className="settings-sidebar-nav">
                    <ul className="ss-nav">
                        {/* <li className="ss-nav-item autoreply-link">
                            <NavLink to={'/autoreply'} className="ss-nav-link" activeClassName="active">Auto replies</NavLink>
                        </li> */}
                        <li className="ss-nav-item welcome-link">
                            <NavLink to={'/welcome-message'} className="ss-nav-link" activeClassName="active">Welcome Message</NavLink>
                        </li>
                        <li className="ss-nav-item message-shortcut-link">
                            <NavLink to={'/message-shortcuts'} className="ss-nav-link" activeClassName="active">Message Shortcuts</NavLink>
                        </li>
                        <li className="ss-nav-item integrations-link">
                            <NavLink to={'/settings/integration'} className="ss-nav-link" activeClassName="active">Integrations</NavLink>
                        </li>
                        <li className="ss-nav-item team-link">
                            <NavLink to={'/team'} className="ss-nav-link" activeClassName="active">Team</NavLink>
                        </li>
                        <li className="ss-nav-item profile-link">
                            <NavLink to={'/admin'} className="ss-nav-link" activeClassName="active">Profile</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }


}

export default SettingsSidebar;