import React, { Component } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import {Link} from 'react-router-dom' ;

class Header extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      imageLink :localStorage.getItem("imageLink")==null?"img/avatars/default.png":localStorage.getItem("imageLink"),
      displayName: localStorage.getItem("loggedinUser")
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

/*  getImageLink(){
var imageLink = localStorage.getitem("imageLink")==undefined?"img/avatars/6.jpg":localStorage.getitem("imageLink");
return imageLink;
  }*/
  logout(e){
    window.logout();
    localStorage.clear();
    //window.location="/login";
    window.appHistory.replace('/login');
  }

  render() {
    return (
      <header className="app-header navbar">
        <button className="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" onClick={this.mobileSidebarToggle}>&9776;</button>
       <a href ="https://www.kommunicate.io" target="_blank" className = "a-undecorated"> <img src="/img/km-logo.png" height="50" width="33"></img>
        <span className= "brand-name">KOMMUNICATE</span></a>
        <ul className="nav navbar-nav d-md-down-none">
          <li className="nav-item">
            <button className="nav-link navbar-toggler sidebar-toggler" type="button" onClick={this.sidebarToggle}></button>
          </li>
          <li className="nav-item px-3">
            <Link className="nav-link" redirect to ="/dashboard">Dashboard</Link>
          </li>
          <li className="nav-item px-3">
            <Link className="nav-link"redirect to="/users">Users</Link>
          </li>
          <li className="nav-item px-3">
            <Link className="nav-link" redirect to="/conversations">Conversations</Link>
          </li>
        </ul>
        <ul className="nav navbar-nav ml-auto">
          <li className="nav-item d-md-down-none">
            <Link className="nav-link" redirect to="/conversations"><i className="icon-bell"></i><span className="badge badge-pill badge-danger chat-launcher-icon">0</span></Link>
          </li>
          <li className="nav-item">
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <button onClick={this.toggle} className="nav-link dropdown-toggle" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded={this.state.dropdownOpen}>
                <img src= { this.state.imageLink } className="img-avatar" alt={this.state.displayName}/>
                <span className="d-md-down-none">{this.state.displayName}</span>
              </button>

              <DropdownMenu className="dropdown-menu-right">
                <DropdownItem onClick={ this.logout }><i className="fa fa-lock"></i> Logout</DropdownItem>

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
