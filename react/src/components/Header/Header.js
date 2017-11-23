import React, { Component } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import {Link} from 'react-router-dom' ;

class Header extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      //imageLink: localStorage.getItem("imageLink") == null ? "/img/avatars/default.png" : localStorage.getItem("imageLink"),
      displayName: localStorage.getItem("name")!=="undefined"?localStorage.getItem("name"):localStorage.getItem("loggedinUser")
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
var imageLink = localStorage.getitem("imageLink")==undefined?"/img/avatars/6.jpg":localStorage.getitem("imageLink");
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
        <button className="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" onClick={this.mobileSidebarToggle}>&#9776;</button>
        <Link className="a-undecorated" redirect to ="/dashboard">
        <a href ="" target="_blank" className = "a-undecorated a-unclickable"/> <img src="/img/logo01.svg" height="50" width="50"></img>
        <span className= "brand-name">KOMMUNICATE</span></Link>
        <ul className="nav navbar-nav ml-auto">
          <li className="nav-item d-md-down-none">
            <Link className="nav-link" redirect to="/conversations"><i className="icon-bell"></i><span className="badge badge-pill badge-danger chat-launcher-icon">0</span></Link>
          </li>
          <li className="nav-item">
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <button onClick={this.toggle} className="nav-link dropdown-toggle" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded={this.state.dropdownOpen}>
                <img src= { this.props.profilePicUrl } className="img-avatar" alt={this.state.displayName}/>
                <span className="d-md-down-none">{this.state.displayName}</span>
              </button>

              <DropdownMenu className="dropdown-menu-right">
                <DropdownItem>
                  <p>{localStorage.getItem("name")}</p>
                  <p>{localStorage.getItem("loggedinUser")}</p>
                </DropdownItem>
                <DropdownItem> Go Offline </DropdownItem>
                <DropdownItem> Profile </DropdownItem>
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
