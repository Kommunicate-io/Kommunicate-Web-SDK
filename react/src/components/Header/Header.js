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
        <svg xmlns='http://www.w3.org/2000/svg' id='Layer_1' viewBox='0 0 352.7 316.7'>
    <path className='km-logo-final-logo-beta-0' d='M348.5,302.2V121.2c0-65.4-53-118.3-118.3-118.3H122.5C57.1,2.8,4.1,55.8,4.1,121.2 c0,65.4,53,118.4,118.4,118.4H239c0,0,9.5,0.6,15.2,2.6c5.5,2,11.5,6.8,11.5,6.8l72,59.3c0,0,6.5,5.6,8.9,4.5 C349,311.5,348.5,302.2,348.5,302.2z M125.8,145.3c0,7.9-6.9,14.3-15.4,14.3S95,153.2,95,145.3V94.5c0-7.9,6.9-14.3,15.4-14.3 s15.4,6.4,15.4,14.3V145.3z M191.7,169.3c0,7.9-6.9,14.3-15.4,14.3c-8.5,0-15.4-6.4-15.4-14.3V70.5c0-7.9,6.9-14.3,15.4-14.3 c8.5,0,15.4,6.4,15.4,14.3V169.3z M257.6,145.3c0,7.9-6.9,14.3-15.4,14.3c-8.5,0-15.4-6.4-15.4-14.3V94.5c0-7.9,6.9-14.3,15.4-14.3 c8.5,0,15.4,6.4,15.4,14.3V145.3z'
    />
</svg>
        		{/* <span className="beta-text">Beta</span> */}
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
                {
                <DropdownItem onClick={this.toggleStatus}> {CommonUtils.getUserSession().availability_status === 1 ? "Go Away" : "Go Online"} </DropdownItem>
                }
                <DropdownItem><Link className="nav-link" style={{color: "#000"}} to="/profile"> Profile</Link></DropdownItem>
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
