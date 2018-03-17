import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'

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
    const currentPath = window.location.pathname;
    return (
      <div className="sidebar">
        <nav className="sidebar-nav">
          <ul className="nav">
            {/* <li className="nav-item">
              <NavLink to={'/dashboard'} className="nav-link" activeClassName="active"><i className="icon-speedometer"></i> Dashboard</NavLink>
            </li> */}
            <li className="nav-item">
              <NavLink to={'/dashboard'} className="nav-link" activeClassName="active" data-rh="Dashboard" data-rh-at="right" data-tip="Dashboard" data-effect="solid" data-place="right"><svg xmlns='http://www.w3.org/2000/svg' id='Layer_1' viewBox='0 0 44.5 27.8'>
    <path className='cls-1' d='M24,10.1C11.1,10.1,1.8,20.6,1.8,33.4H17.9a6.4,6.4,0,0,0,12.1,0H46.2C46.2,20.6,36.9,10.1,24,10.1ZM11.2,31H7.2a16.7,16.7,0,0,1,7-13.6l1.5,3.8A12.8,12.8,0,0,0,11.2,31Zm14.7,4.1a3.3,3.3,0,0,1-4.6-1.2l-.2-.5h0v-.2L13.8,14.2,26.5,29.8l.3.3h0l.3.4A3.3,3.3,0,0,1,25.9,35.1ZM24,18.1a12.8,12.8,0,0,0-5.2,1.1l-2.5-3.1A16.8,16.8,0,0,1,40.8,31H36.8A12.8,12.8,0,0,0,24,18.1Z'
    transform='translate(-1.8 -10.1)' />
</svg></NavLink>
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
            {/* <li className="nav-item">
              <NavLink to={'/conversations'} className="nav-link" activeClassName="active"><i className="icon-speech"></i> Conversations</NavLink>
            </li> */}
            <li className="nav-item">
              <NavLink to={'/conversations'} className="nav-link" activeClassName="active" data-tip="Conversations" data-effect="solid" data-place="right"><svg xmlns='http://www.w3.org/2000/svg' id='Layer_1' viewBox='0 0 45.8 40'>
    <path className='cls-1' d='M45.7,4H2.3c-.7,0-1.2.8-1.2,1.7V35.2c0,.9.5,1.7,1.2,1.7H19.6l3.7,6.7a.9.9,0,0,0,1.5,0l3.6-6.7H45.7c.7,0,1.2-.8,1.2-1.7V5.7C46.9,4.8,46.4,4,45.7,4ZM26.1,29.4H8.2a1.4,1.4,0,0,1,0-2.8H26.1a1.4,1.4,0,0,1,0,2.8Zm13.6-7.5H8.2a1.3,1.3,0,0,1-1.1-1.4,1.3,1.3,0,0,1,1.1-1.4H39.8a1.3,1.3,0,0,1,1.1,1.4A1.3,1.3,0,0,1,39.8,21.9Zm0-7.6H8.2a1.3,1.3,0,0,1-1.1-1.4,1.3,1.3,0,0,1,1.1-1.4H39.8a1.3,1.3,0,0,1,1.1,1.4A1.3,1.3,0,0,1,39.8,14.3Z'
    transform='translate(-1.1 -4)' />
</svg></NavLink>
            </li>
            {/* <li className="nav-item">
              <NavLink to={'/users'} className="nav-link" activeClassName="active"><i className="icon-user"></i> Customers</NavLink>
            </li> */}
            <li className="nav-item">
              <NavLink to={'/users'} className="nav-link" activeClassName="active" data-tip="Customers" data-effect="solid" data-place="right"><svg xmlns='http://www.w3.org/2000/svg' id='Layer_1' viewBox='0 0 45.8 34.6'>
    <path className='cls-1' d='M12.1,33.5c4.5-1.3,6.1-2.6,6.5-3.1V27.9l-.5-.4a5.7,5.7,0,0,1-1.4-3.6A3.6,3.6,0,0,1,15.2,22a4.5,4.5,0,0,1,.3-3.2,10.6,10.6,0,0,1-.8-3.2,9.3,9.3,0,0,1,1.1-5.2,5.3,5.3,0,0,0-3-.1,6.5,6.5,0,0,0-3.1,1.8,7,7,0,0,0-2,5.4A8.4,8.4,0,0,0,8.4,20a3.3,3.3,0,0,0-.3,2.3,2.5,2.5,0,0,0,1.1,1.4,4.2,4.2,0,0,0,1,2.7l.5.4v2.2c-.3.3-1.4,1.5-5.3,2.6a6.9,6.9,0,0,0-3.6,3.1,6.4,6.4,0,0,0-.7,2.1.8.8,0,0,0,.2.6.8.8,0,0,0,.6.3H7.1v-.2A9.2,9.2,0,0,1,12.1,33.5Z'
    transform='translate(-1.1 -6.7)' />
    <path className='cls-1' d='M46.9,36.9a6.4,6.4,0,0,0-.7-2.1,6.8,6.8,0,0,0-3.7-3.1c-3.9-1.2-5-2.3-5.3-2.6v-2l.4-.4a4.4,4.4,0,0,0,1.1-2.8,2.2,2.2,0,0,0,1.4-1.7,2.9,2.9,0,0,0-.6-2.4c1-3,1-4.9-.1-6.4a3.7,3.7,0,0,0-2.3-1.4h-.5a6,6,0,0,0-4.3-1.7c1.4,2,1.4,4.5.2,8.3a4.2,4.2,0,0,1,.7,3.2,3.3,3.3,0,0,1-1.8,2.4A6.1,6.1,0,0,1,30,27.7l-.4.4v2.1c.5.5,2.1,1.8,6.5,3.1a9.2,9.2,0,0,1,5,4.2v.2h4.9a.9.9,0,0,0,.8-.9Z'
    transform='translate(-1.1 -6.7)' />
    <path className='cls-1' d='M41.1,40.6a.3.3,0,0,1,0,.1.6.6,0,0,1-.6.6H7.7l-.4-.2a.6.6,0,0,1-.1-.5A7.7,7.7,0,0,1,8,38.1v-.2a8.4,8.4,0,0,1,4.2-3.5c5-1.5,6.6-3,7-3.5h.1V27.4h-.2l-.5-.4h0a4.9,4.9,0,0,1-1.2-3.2v-.3h-.2a2.7,2.7,0,0,1-1.3-1.5,3.7,3.7,0,0,1,.3-2.6v-.4a10.3,10.3,0,0,1-.8-3.2A8.5,8.5,0,0,1,18.1,9a7.9,7.9,0,0,1,3.7-2.1l1.5-.2a7.4,7.4,0,0,1,4.9,2.1H29a4.4,4.4,0,0,1,2.4,1.3l.2.3c1.3,1.7,1.3,4.1.1,7.8v.2l.2.2a3.3,3.3,0,0,1,.6,2.7,2.4,2.4,0,0,1-1.5,1.9h-.3v.3a5.2,5.2,0,0,1-1.3,3.3h0l-.5.5h-.2v2.9h.1c.5.6,2.1,2,7.1,3.5a8.3,8.3,0,0,1,4.3,3.6v.2a7.8,7.8,0,0,1,.8,2.5Z'
    transform='translate(-1.1 -6.7)' />
</svg></NavLink>
            </li>
            {/*
            <li className="nav-item">
              <NavLink to={'/reports'} className="nav-link" activeClassName="active"><i className="icon-notebook"></i> Reports</NavLink>
            </li>
            */}
            {/* <li className="nav-item">
              <NavLink to={'/bot'} className="nav-link" activeClassName="active"><i className="icon-magic-wand"></i> Bot <span className="badge badge-info n-vis">NEW</span></NavLink>
            </li> */}
            <li className="nav-item">
              <NavLink to={'/bot'} className="nav-link" activeClassName="active"  data-tip="Bot Integration" data-effect="solid" data-place="right"><svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 42 46.4" className="bot-icon-svg">
    <path className="cls-1" d="M40,18.6A18.8,18.8,0,0,0,25,9.3V6.2a2.8,2.8,0,1,0-2.3,0V9.3A18.8,18.8,0,0,0,7.4,18.9,11.5,11.5,0,0,0,7.4,37l.5.8a6.8,6.8,0,0,1-.2,5.8c-1.5,3.2-2.8,3.5-2.8,3.5s6.9.8,11.8-1.7h0a18.8,18.8,0,0,0,23.4-8A11.5,11.5,0,0,0,40,18.6ZM32.4,37.3H15.6a9.4,9.4,0,0,1,0-18.7H32.4a9.4,9.4,0,0,1,0,18.7Z"
    transform="translate(-3 -.8)" />
    <circle className="cls-1" cx="12.4" cy="27.1" r="2.5" />
    <circle className="cls-1" cx="29.7" cy="27.1" r="2.5" />
</svg></NavLink>
            </li>

            {/* <li className="divider"></li>
            <li className="nav-title">
              Settings
            </li> */}
            {/* <li className="nav-item">
              <NavLink to={'/settings/integration'} className="nav-link" activeClassName="active"><i className="fa fa-gear"></i> Integration</NavLink>
            </li> */}
                  <li className="nav-item">

                    <NavLink to={'/profile'} className={(currentPath.includes('install') || currentPath.includes('profile') || currentPath.includes('team') || currentPath.includes('message-shortcuts') || currentPath.includes('agent-app') || currentPath.includes('away-message') || currentPath.includes('welcome-message'))  ? "nav-link active" : "nav-link"} activeClassName="active" data-tip="Settings" data-effect="solid" data-place="right"><svg xmlns='http://www.w3.org/2000/svg' id='Layer_1' viewBox='0 0 46 46'>

                      <path className='cls-1' d='M41,28.9a15.9,15.9,0,0,1-1.5,3.7l2.5,6-3.3,3.3-6-2.5A16,16,0,0,1,28.9,41l-2.6,6H21.6l-2.5-6a15.9,15.9,0,0,1-3.7-1.5l-6,2.5L6.1,38.6l2.5-6A15.9,15.9,0,0,1,7,28.9L1,26.4V21.6l6-2.5a15.9,15.9,0,0,1,1.5-3.7l-2.5-6L9.4,6.1l6,2.5A15.9,15.9,0,0,1,19.1,7l2.6-6h4.7l2.5,6a15.9,15.9,0,0,1,3.7,1.5l6-2.5,3.3,3.3-2.5,6A15.9,15.9,0,0,1,41,19.1l6,2.6v4.7ZM31.1,24A7.1,7.1,0,1,0,24,31.1,7.1,7.1,0,0,0,31.1,24Z'
    transform='translate(-1 -1)' />
                    </svg></NavLink>
                  </li>
            {/* <li className="nav-item">
              <NavLink to={'/team'} className="nav-link" activeClassName="active"><i className="icon-people"></i> Team</NavLink>
            </li> */}
                  {/* <li className="nav-item">
                    <NavLink to={'/team'} className="nav-link" activeClassName="active"><i className="icon-people"></i></NavLink>
                  </li> */}
            {/* <li className="nav-item">
              <NavLink to={'/autoreply'} className="nav-link" activeClassName="active"><i className="icon-people"></i>Configuration</NavLink>
            </li> */}
                  {/* <li className="nav-item">
                    <NavLink to={'/autoreply'} className="nav-link" activeClassName="active"><i className="icon-people"></i></NavLink>
                  </li> */}
            {/* <li className="nav-item">
             <NavLink to={'/admin'} className="nav-link" activeClassName="active"><i className="icon-magic-wand"></i>Profile</NavLink>
            </li> */}
                  {/* <li className="nav-item">
                  <NavLink to={'/admin'} className="nav-link" activeClassName="active"><i className="icon-magic-wand"></i></NavLink>
                  </li> */}
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
            <li className="nav-item">
              <NavLink to={'/faq'} className="nav-link" activeClassName="active" data-tip="FAQ" data-effect="solid" data-place="right"><svg xmlns='http://www.w3.org/2000/svg' id='Layer_1' viewBox='0 0 45.8 40'>
    <path className='cls-1' d='M45.7,4H2.3c-.7,0-1.2.8-1.2,1.7V35.2c0,.9.5,1.7,1.2,1.7H19.6l3.7,6.7a.9.9,0,0,0,1.5,0l3.6-6.7H45.7c.7,0,1.2-.8,1.2-1.7V5.7C46.9,4.8,46.4,4,45.7,4ZM26.1,29.4H8.2a1.4,1.4,0,0,1,0-2.8H26.1a1.4,1.4,0,0,1,0,2.8Zm13.6-7.5H8.2a1.3,1.3,0,0,1-1.1-1.4,1.3,1.3,0,0,1,1.1-1.4H39.8a1.3,1.3,0,0,1,1.1,1.4A1.3,1.3,0,0,1,39.8,21.9Zm0-7.6H8.2a1.3,1.3,0,0,1-1.1-1.4,1.3,1.3,0,0,1,1.1-1.4H39.8a1.3,1.3,0,0,1,1.1,1.4A1.3,1.3,0,0,1,39.8,14.3Z'
    transform='translate(-1.1 -4)' />
</svg></NavLink>
            </li>
            <li className="nav-item">
              <NavLink to={'/billing'} className="nav-link" activeClassName="active" data-tip="Billing" data-effect="solid" data-place="right"><svg xmlns='http://www.w3.org/2000/svg' id='Layer_1' viewBox='0 0 45.8 40'>
                  <path className='cls-1' d='M45.7,4H2.3c-.7,0-1.2.8-1.2,1.7V35.2c0,.9.5,1.7,1.2,1.7H19.6l3.7,6.7a.9.9,0,0,0,1.5,0l3.6-6.7H45.7c.7,0,1.2-.8,1.2-1.7V5.7C46.9,4.8,46.4,4,45.7,4ZM26.1,29.4H8.2a1.4,1.4,0,0,1,0-2.8H26.1a1.4,1.4,0,0,1,0,2.8Zm13.6-7.5H8.2a1.3,1.3,0,0,1-1.1-1.4,1.3,1.3,0,0,1,1.1-1.4H39.8a1.3,1.3,0,0,1,1.1,1.4A1.3,1.3,0,0,1,39.8,21.9Zm0-7.6H8.2a1.3,1.3,0,0,1-1.1-1.4,1.3,1.3,0,0,1,1.1-1.4H39.8a1.3,1.3,0,0,1,1.1,1.4A1.3,1.3,0,0,1,39.8,14.3Z'
                  transform='translate(-1.1 -4)' />
                </svg>
              </NavLink>
            </li>
          </ul>
        </nav>
        <ReactTooltip />
      </div>
      
    )
  }
}

export default Sidebar;
