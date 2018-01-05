import React, { Component } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import {Link} from 'react-router-dom' ;

import {goAway, goOnline} from '../../utils/kommunicateClient'
import CommonUtils from '../../utils/CommonUtils';

class Header extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    let userSession = CommonUtils.getUserSession();
    this.state = {
      changeStatusLabel: userSession.availability_status === 1 ? "Go Away": "Go Online",
      status: userSession.availability_status,
      dropdownOpen: false,
      displayName: userSession.name !=="undefined" ? userSession.name:userSession.userName
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  }

  logout(e){
    window.logout();
    if (typeof window.$kmApplozic !== "undefined" && typeof window.$kmApplozic.fn !== "undefined" && window.$kmApplozic.fn.applozic("getLoggedInUser")) {
      window.$kmApplozic.fn.applozic('logout');           
    }
    if (typeof window.$applozic !== "undefined" && typeof window.$applozic.fn !== "undefined" && window.$applozic.fn.applozic("getLoggedInUser")) {
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
        userSession.availability_status = 0
        this.setState({
          status: userSession.availability_status,
          changeStatusLabel: "Go Online"
        });
      });
    }else{
      goOnline(userSession.userName, userSession.application.applicationId).then(response => {
        userSession.availability_status = 1
        this.setState({
          status: userSession.availability_status,
          changeStatusLabel: "Go Away"
        });
      });
    }
  }

  render() {
    return (
      <header className="app-header navbar">
        <button className="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" onClick={this.mobileSidebarToggle}>&#9776;</button>
        <Link className="a-undecorated" to ="/dashboard">
        <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360.7 316.7">
        <path className="km-logo-final-logo-beta-0" d="M347.8,302.9V121.8c0-65.4-53-118.3-118.3-118.3H121.8C56.4,3.5,3.4,56.5,3.4,121.8 c0,65.4,53,118.4,118.4,118.4h116.6c0,0,9.5,0.6,15.2,2.6c5.5,2,11.5,6.8,11.5,6.8l72,59.3c0,0,6.5,5.6,8.9,4.5 C348.3,312.2,347.8,302.9,347.8,302.9z M125.1,146c0,7.9-6.9,14.3-15.4,14.3s-15.4-6.4-15.4-14.3V95.2c0-7.9,6.9-14.3,15.4-14.3 s15.4,6.4,15.4,14.3V146z M191,170c0,7.9-6.9,14.3-15.4,14.3s-15.4-6.4-15.4-14.3V71.2c0-7.9,6.9-14.3,15.4-14.3S191,63.3,191,71.2 V170z M256.9,146c0,7.9-6.9,14.3-15.4,14.3c-8.5,0-15.4-6.4-15.4-14.3V95.2c0-7.9,6.9-14.3,15.4-14.3c8.5,0,15.4,6.4,15.4,14.3V146 z"
        />
        <polygon className="km-logo-final-logo-beta-1" points="126.7,240.2 126.7,251.3 144.2,240.1"
        />
        <path className="km-logo-final-logo-beta-1" d="M347.1,109.2l10.2-6.6h-11.1C346.3,102.7,347,107.4,347.1,109.2z"
        />
        <polygon className="km-logo-final-logo-beta-2" points="357.3,102.7 357.3,188.7 261.5,251.3 126.7,251.3"
        />
        <g>
            <path className="km-logo-final-logo-beta-3" d="M220.6,210.4l9.7-6.3c4.4-2.9,8.1-4.3,10.9-4.4c2.8,0,5.1,1.3,6.9,4.1c1.2,1.9,1.8,3.7,1.7,5.4 c-0.1,1.8-0.8,3.2-2.1,4.4l0.1,0.2c2.3-0.8,4.2-0.9,5.9-0.3c1.7,0.6,3.1,2,4.4,4c1.8,2.8,2.3,5.7,1.2,8.7c-1,2.9-3.3,5.5-6.8,7.8 l-11.7,7.6L220.6,210.4z M235.2,218.4l3.8-2.5c1.8-1.2,2.9-2.3,3.4-3.4c0.4-1.1,0.3-2.3-0.6-3.5c-0.8-1.2-1.8-1.8-3-1.7 c-1.2,0-2.8,0.7-4.7,1.9l-3.5,2.3L235.2,218.4z M238.6,223.7l5.3,8.1l4.3-2.8c1.8-1.2,2.9-2.4,3.4-3.7c0.4-1.3,0.2-2.6-0.8-4 c-1.7-2.6-4.4-2.7-8.1-0.3L238.6,223.7z"
            />
            <path className="km-logo-final-logo-beta-3" d="M288.2,210.9l-18,11.6L250,191.3l18-11.6l3.5,5.4l-11.4,7.4l4.4,6.9l10.6-6.8l3.5,5.4l-10.6,6.8l5.2,8.1 l11.4-7.4L288.2,210.9z"
            />
            <path className="km-logo-final-logo-beta-3" d="M306.8,198.9l-6.6,4.3l-16.7-25.7L275,183l-3.6-5.5l23.6-15.3l3.6,5.5l-8.5,5.5L306.8,198.9z"
            />
            <path className="km-logo-final-logo-beta-3" d="M339.2,177.9l-7.1-6l-11.4,7.4l2.6,8.9l-7.1,4.6l-9.3-38.5l8.1-5.2l31.4,24.2L339.2,177.9z M326.9,167.4 c-6.5-5.4-10.1-8.4-10.9-9.1c-0.8-0.7-1.5-1.3-1.9-1.7c0.7,2.1,2.3,7.5,4.7,16.1L326.9,167.4z"
            />
        </g>
    </svg>
        </Link>
        <ul className="nav navbar-nav ml-auto">
          <li className="nav-item d-md-down-none">
            <Link className="nav-link" to="/conversations"><i className="icon-bell"></i><span className="badge badge-pill badge-danger chat-launcher-icon">0</span></Link>
          </li>
          <li className="nav-item">
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <button onClick={this.toggle} className="nav-link dropdown-toggle" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded={this.state.dropdownOpen}>
                <div style={{display: "inline-block"}}>
                  <img src= { this.props.profilePicUrl } className="img-avatar" alt={this.state.displayName}/>
                  <span className={CommonUtils.getUserSession().availability_status === 1 ? "online-indicator-profile-pic": null}></span>
                </div>
                <span className="d-md-down-none">{this.state.displayName}</span>
              </button>
              <DropdownMenu className="dropdown-menu-right">
                <DropdownItem>
                  <p className="header-user-name">{this.state.displayName}</p>
                  <p className="header-user-email">{CommonUtils.getUserSession().userName}</p>
                  <p><span className="header-user-online"> You are online</span></p>
                  <span className="header-user-online"> {CommonUtils.getUserSession().availability_status === 1 ? "You are online" : "You are away"}</span><span className={this.state.status === "1" ? "online-indicator": null }></span>
                </DropdownItem>
                <DropdownItem onClick={this.toggleStatus}> {CommonUtils.getUserSession().availability_status === 1 ? "Go Away" : "Go Online"} </DropdownItem>
                <DropdownItem><Link className="nav-link" style={{color: "#000"}} to="/admin"> Profile</Link></DropdownItem>
                <DropdownItem onClick={ this.logout }> Logout </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </li>
          {/*
          <li className="nav-item d-md-down-none">
            <a className="nav-link navbar-toggler aside-menu-toggler" href="/conversations" type="button">&9776;</a>
          </li>
          */}
        </ul>
      </header>
    )
  }
}

export default Header;
