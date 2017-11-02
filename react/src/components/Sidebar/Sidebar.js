import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'

class Sidebar extends Component {

  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  }

  // secondLevelActive(routeName) {
  //   return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
  // }

  render() {
    return (
      <div className="sidebar">
        <nav className="sidebar-nav">
          <ul className="nav">
            <li className="nav-item">
              <NavLink to={'/dashboard'} className="nav-link" activeClassName="active"><i className="icon-speedometer"></i> Dashboard</NavLink>
            </li>
            {/*
            <li className="nav-title">
              UI Elements
            </li>
            */}
            {/*
            <li className={this.activeRoute("/icons")}>
              <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-star"></i> Icons</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <NavLink to={'/icons/font-awesome'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Font Awesome</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/icons/simple-line-icons'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Simple Line Icons</NavLink>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <NavLink to={'/widgets'} className="nav-link" activeClassName="active"><i className="icon-calculator"></i> Widgets <span className="badge badge-info">NEW</span></NavLink>
            </li>
            <li className="nav-item">
              <NavLink to={'/charts'} className="nav-link" activeClassName="active"><i className="icon-pie-chart"></i> Charts</NavLink>
            </li>
            */}
            <li className="nav-item">
              <NavLink to={'/conversations'} className="nav-link" activeClassName="active"><i className="icon-speech"></i> Conversations</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to={'/users'} className="nav-link" activeClassName="active"><i className="icon-user"></i> Customers</NavLink>
            </li>
            {/*
            <li className="nav-item">
              <NavLink to={'/reports'} className="nav-link" activeClassName="active"><i className="icon-notebook"></i> Reports</NavLink>
            </li>
            */}
            <li className="nav-item">
              <NavLink to={'/bot'} className="nav-link" activeClassName="active"><i className="icon-magic-wand"></i> Bot <span className="badge badge-info n-vis">NEW</span></NavLink>
            </li>

            <li className="divider"></li>
            <li className="nav-title">
              Settings
            </li>
            <li className="nav-item">
              <NavLink to={'/settings/integration'} className="nav-link" activeClassName="active"><i className="fa fa-gear"></i> Integration</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to={'/team'} className="nav-link" activeClassName="active"><i className="icon-people"></i> Team</NavLink>
            </li>
            <li className="nav-item">
                         <NavLink to={'/autoreply'} className="nav-link" activeClassName="active"><i className="icon-people"></i>Configuration</NavLink>
                      </li>
            <li className="nav-item">
             <NavLink to={'/admin'} className="nav-link" activeClassName="active"><i className="icon-magic-wand"></i>Profile</NavLink>
            </li>
            {/*
            <li className="nav-item nav-dropdown">
              <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-star"></i> Pages</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <NavLink to={'/login'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Profile</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/login'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/register'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Register</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/404'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Error 404</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/500'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Error 500</NavLink>
                </li>
              </ul>
            </li>
            */}
          </ul>
        </nav>
      </div>
    )
  }
}

export default Sidebar;
