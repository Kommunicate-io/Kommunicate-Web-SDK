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
                        <li className="ss-nav-item">
                            <NavLink to={'/autoreply'} className="ss-nav-link" activeClassName="active">Auto replies</NavLink>
                        </li>
                        <li className="ss-nav-item">
                            <NavLink to={'/settings/integration'} className="ss-nav-link" activeClassName="active">Integrations</NavLink>
                        </li>
                        <li className="ss-nav-item">
                            <NavLink to={'/team'} className="ss-nav-link" activeClassName="active">Team</NavLink>
                        </li>
                        <li className="ss-nav-item">
                            <NavLink to={'/admin'} className="ss-nav-link" activeClassName="active">Profile</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }


}

export default SettingsSidebar;