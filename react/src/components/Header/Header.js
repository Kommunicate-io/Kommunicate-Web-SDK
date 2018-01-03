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
      changeStatusLabel: "Go Away",
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
    if(this.state.status === "1"){
      goAway(userSession.userName, userSession.application.applicationId).then(response => {
        console.log(response);
        this.setState({
          status: userSession.availability_status,
          changeStatusLabel: "Go Online"
        });
      });
    }else{
      goOnline(userSession.userName, userSession.application.applicationId).then(response => {
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
          {
            // <a href ="" target="_blank" className = "a-undecorated a-unclickable"/>
          }
          <img src="/img/logo01.svg" height="50" width="50"></img>
          <span className= "brand-name">KOMMUNICATE</span>
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
                  <span className={CommonUtils.getUserSession().availability_status === "1" ? "online-indicator-profile-pic": null}></span>
                </div>
                <span className="d-md-down-none">{this.state.displayName}</span>
              </button>
              <DropdownMenu className="dropdown-menu-right">
                <DropdownItem>
                  <p className="header-user-name">{this.state.displayName}</p>
                  <p className="header-user-email">{CommonUtils.getUserSession().userName}</p>
                  <span className="header-user-online"> {CommonUtils.getUserSession().availability_status === "1" ? "You are online" : "You are away"} <span className={this.state.status === "1" ? "online-indicator": null }></span></span>
                </DropdownItem>
                <DropdownItem style={{'display':'none'}} onClick={this.toggleStatus}> {CommonUtils.getUserSession().availability_status === "1" ? "Go Away" : "Go Online"} </DropdownItem>
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
