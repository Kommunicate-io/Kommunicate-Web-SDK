import React, { Component, PropTypes } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import {Link} from 'react-router-dom' ;
import { NavLink } from 'react-router-dom';
import {goAway, goOnline} from '../../utils/kommunicateClient'
import CommonUtils from '../../utils/CommonUtils';

class TurnOnAwayMode extends Component {
  render() {
    return(
      <span>Turn on <strong>Away</strong> mode</span>
    );
  }
}
class TurnOnOnlineMode extends Component {
  render() {
    return(
      <span><span className="away">Away</span> <span>Go <strong>Online</strong></span></span>
    );
  }
}

export default class ProfileImageName extends Component {

    static defaultProps={
        displayName: '',
        hideDisplayName: false
      }
      constructor(props) {
        super(props);
    
        this.toggle = this.toggle.bind(this);
        let userSession = CommonUtils.getUserSession();
        this.state = {
          changeStatusLabel: userSession.availabilityStatus === 1 ? <TurnOnAwayMode />: <TurnOnOnlineMode />,
          status: userSession.availabilityStatus,
          dropdownOpen: false,
        };
      }

    toggle() {
        this.setState({
          dropdownOpen: !this.state.dropdownOpen
        });
      }

      logout(e){
        window.logout();
        if (typeof window.$kmApplozic !== "undefined" && typeof window.$kmApplozic.fn !== "undefined" &&typeof window.$kmApplozic.fn.applozic!=="undefined"&& window.$kmApplozic.fn.applozic("getLoggedInUser")) {
          window.$kmApplozic.fn.applozic('logout');           
        }
        if (typeof window.$applozic !== "undefined" && typeof window.$applozic.fn !== "undefined" &&typeof window.$applozic.fn.applozic!=="undefined"&& window.$applozic.fn.applozic("getLoggedInUser")) {
          window.$applozic.fn.applozic('logout');       
        }
        sessionStorage.clear();
        localStorage.clear();
        //window.location="/login";
        window.appHistory.replace('/login');
      }

      toggleStatus = () => {
        let userSession = CommonUtils.getUserSession();
        if(this.state.status === 1){
          goAway(userSession.userName, userSession.application.applicationId).then(response => {
            console.log(response);
            userSession.availabilityStatus = 0
            this.setState({
              status: userSession.availabilityStatus,
              changeStatusLabel: <TurnOnOnlineMode />
            });
          });
        }else{
          goOnline(userSession.userName, userSession.application.applicationId).then(response => {
            userSession.availabilityStatus = 1
            this.setState({
              status: userSession.availabilityStatus,
              changeStatusLabel: <TurnOnAwayMode />
            });
          });
        }
      }


    render() {
        return (
            <div>
                <Dropdown className="sidebar-profile-dropdown" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <button onClick={this.toggle} className="nav-link dropdown-toggle" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded={this.state.dropdownOpen}>
                        <div style={{ display: "inline-block" }}>
                            <img src={this.props.profilePicUrl} className="img-avatar" alt={this.props.displayName} />
                            <span className={CommonUtils.getUserSession().availabilityStatus === 1 ? "online-indicator-profile-pic" : null}></span>
                        </div>
                        <span className="d-md-down-none" hidden={this.props.hideDisplayName}>{this.props.displayName}</span>
                    </button>
                    <DropdownMenu className="dropdown-menu-right sidebar-profile-dropdown--fixed">
                        <DropdownItem>
                            <p className="header-user-name">{this.props.displayName}</p>
                            <p className="header-user-email">{CommonUtils.getUserSession().userName}</p>
                            <p><span className="header-user-online"> You are online</span></p>
                            <span className="header-user-online"> {CommonUtils.getUserSession().availabilitStatus === 1 ? "You are online" : "You are away"}</span><span className={this.state.status === "1" ? "online-indicator" : null}></span>
                        </DropdownItem>
                        {
                            <DropdownItem onClick={this.toggleStatus}> {CommonUtils.getUserSession().availabilityStatus === 1 ? <TurnOnAwayMode /> : <TurnOnOnlineMode />} </DropdownItem>
                        }

                        <DropdownItem><Link style={{ color: "#000" }} to="/settings/profile"> Profile</Link></DropdownItem>
                        <DropdownItem onClick={this.logout}> Logout </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        );
    }
}