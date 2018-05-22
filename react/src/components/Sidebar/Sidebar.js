import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import SettingsSidebar from '../SettingsSidebar/SettingsSidebar';
import ProfileImageName from '../Header/ProfileImageName';
import CommonUtils from '../../utils/CommonUtils';


class Sidebar extends Component {

  constructor (props) {
    super(props)
     //_this =this;
    // let imageLink = CommonUtils.getUserSession().imageLink;
    this.state = {
      // imageLink: this.props.profilePicUrl,
      // displayName: ''
    };
  }

  componentWillMount() {
    let userSession = CommonUtils.getUserSession()
    if(userSession){
      this.setState(
        {displayName:(userSession.name !=="undefined") ? userSession.name:userSession.userName}
      )
      
    }
  }

  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
  }

  hideUnreadCountOnConversationTab(){
    window.$kmApplozic("#km-allconversatiom-unread-icon").removeClass("vis").addClass("n-vis");
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  }

  // secondLevelActive(routeName) {
  //   return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
  // }


  updateProfilePic(url) { 
    this.setState({
      imageLink: url==null ? "/img/avatars/default.png": url
    });
   }

   updateUserDisplay(name){
    this.setState(
      {displayName:name}
    )
  }

  launchSideboxChat() {
    // window.Kommunicate.loadConversationwithAgent();
    // window.Kommunicate.createNewConversation();
    // window.Kommunicate.openLastConversation();
    // window.$applozic.fn.applozic('loadConversationwithAgent');


    // window.Kommunicate.openConversationList();
    // window.Kommunicate.mckLaunchSideboxChat();
    
    window.$applozic.fn.applozic('mckLaunchSideboxChat');
    document.querySelector('.faq-common').classList.add('n-vis');
    
    // document.getElementById('mck-sidebox-launcher').classList.add('n-vis');
    // document.getElementById('mck-sidebox-launcher').classList.add('force-hide');
    // document.getElementById('mck-sidebox-launcher').classList.remove('vis');
    document.getElementById('mck-away-msg-box').classList.remove('vis');
    document.getElementById('mck-away-msg-box').classList.add('n-vis');
  }

  render() {

    const currentPath = window.location.pathname;
    var settingsSidebarShow, sidebarWidth;
    if (currentPath.includes('/dashboard') || currentPath.includes('/conversations') || currentPath.includes('/users') || currentPath.includes('/bot') || currentPath.includes('/faq') || currentPath.includes('/integrations')) {
      settingsSidebarShow = " ";
    } else {
      settingsSidebarShow = <SettingsSidebar />;
    }

    return (
      <div className="sidebar">
        <nav className="sidebar-nav">
          <ul className="nav">

            <li className="nav-item logo-nav">
              <div className="km-logo-circle-bg">
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 352.7 316.7'>
                  <path className='km-logo-final-logo-beta-0' d='M348.5,302.2V121.2c0-65.4-53-118.3-118.3-118.3H122.5C57.1,2.8,4.1,55.8,4.1,121.2 c0,65.4,53,118.4,118.4,118.4H239c0,0,9.5,0.6,15.2,2.6c5.5,2,11.5,6.8,11.5,6.8l72,59.3c0,0,6.5,5.6,8.9,4.5 C349,311.5,348.5,302.2,348.5,302.2z M125.8,145.3c0,7.9-6.9,14.3-15.4,14.3S95,153.2,95,145.3V94.5c0-7.9,6.9-14.3,15.4-14.3 s15.4,6.4,15.4,14.3V145.3z M191.7,169.3c0,7.9-6.9,14.3-15.4,14.3c-8.5,0-15.4-6.4-15.4-14.3V70.5c0-7.9,6.9-14.3,15.4-14.3 c8.5,0,15.4,6.4,15.4,14.3V169.3z M257.6,145.3c0,7.9-6.9,14.3-15.4,14.3c-8.5,0-15.4-6.4-15.4-14.3V94.5c0-7.9,6.9-14.3,15.4-14.3 c8.5,0,15.4,6.4,15.4,14.3V145.3z' fill="#5C5AA7"/>
                </svg>
              </div>
            </li>

            {/* Dashboard Link */}
            <li className="nav-item">
              <NavLink to={'/dashboard'} className="nav-link" activeClassName="active" data-rh="Dashboard" data-rh-at="right" data-tip="Dashboard" data-effect="solid" data-place="right">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g data-name="Group 5">
                    <path fill="none" d="M0 0h24v24H0z" data-name="Rectangle 1" />
                    <g data-name="Group 1">
                        <path fill="#FFF" d="M9.951 7.909h3.158v12.122H9.951z" className="cls-2" />
                        <path fill="#FFF" d="M15.902 3.97h3.158v15.98h-3.158zM4 12.332h3.158v7.698H4z" className="cls-2"
                        data-name="Rectangle-path" />
                    </g>
                </g>
            </svg>
              </NavLink>
            </li>
            {/* Conversations Link */}
            <li className="nav-item" onClick={this.hideUnreadCountOnConversationTab} >
              <NavLink to={'/conversations'} className="nav-link" activeClassName="active" data-tip="Conversations" data-effect="solid" data-place="right">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g data-name="Group 4">
                    <path fill="none" d="M0 0h24v24H0z" data-name="Rectangle 2" />
                    <path fill="#FFFFFF" d="M2 5.288v11.377a1.183 1.183 0 0 0 1.159 1.288h6.474l2.222 2.361a1.039 1.039 0 0 0 1.643 0l2.029-2.361h5.314A1.183 1.183 0 0 0 22 16.665V5.288A1.183 1.183 0 0 0 20.841 4H3.159A1.183 1.183 0 0 0 2 5.288zm11.111 9.66H4.319a.524.524 0 0 1-.483-.644.485.485 0 0 1 .483-.644h8.792c.29 0 .483.215.483.644a.667.667 0 0 1-.483.644zm6.377-3.542H4.319q-.58 0-.58-.644 0-.483.58-.644h15.266a.524.524 0 0 1 .483.644.588.588 0 0 1-.58.644zm0-3.435H4.319q-.58-.161-.58-.644c0-.322.193-.644.483-.644h15.266a.524.524 0 0 1 .483.644c.097.322-.193.537-.483.644z"
                    data-name="Path 1" />
                </g>
            </svg>
            <span id="km-allconversatiom-unread-icon" className="km-allconversatiom-unread-icon n-vis"></span>
              </NavLink>
            </li>
            {/* Customers Link */}
            <li className="nav-item">
              <NavLink to={'/users'} className="nav-link" activeClassName="active" data-tip="Customers" data-effect="solid" data-place="right">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g data-name="Group 8">
                    <path fill="none" d="M0 0h24v24H0z" data-name="Rectangle 6" />
                    <g data-name="customer icon">
                        <path fill="#FFF" d="M21.993 17.962a3.146 3.146 0 0 0-.339-1.03 3.427 3.427 0 0 0-1.841-1.551 5.824 5.824 0 0 1-2.686-1.3v-.971a2.715 2.715 0 0 0 .211-.212 2.163 2.163 0 0 0 .563-1.406 1.118 1.118 0 0 0 .7-.847 1.429 1.429 0 0 0-.284-1.18c.5-1.506.48-2.449-.06-3.173a1.885 1.885 0 0 0-1.133-.702 2.191 2.191 0 0 0-.247-.038 3.059 3.059 0 0 0-2.141-.842c.694.969.729 2.208.113 4.113a2.049 2.049 0 0 1 .333 1.607 1.636 1.636 0 0 1-.904 1.18 2.988 2.988 0 0 1-.772 1.811c-.067.074-.138.148-.213.22v1.057a7.949 7.949 0 0 0 3.278 1.536 4.619 4.619 0 0 1 2.5 2.1c.02.036.037.073.056.11h2.466a.426.426 0 0 0 .4-.426.263.263 0 0 0 0-.056z"
                        className="cls-2" />
                        <path fill="#FFF" d="M19.074 19.814a.139.139 0 0 1 0 .028.317.317 0 0 1-.283.315H2.284a.284.284 0 0 1-.217-.093.286.286 0 0 1-.067-.225 3.791 3.791 0 0 1 .432-1.285c.02-.036.04-.071.062-.107a4.22 4.22 0 0 1 2.135-1.731c2.518-.744 3.318-1.47 3.545-1.747l.053-.065-.008-.453-.019-1.174-.1-.068a1.674 1.674 0 0 1-.236-.2c-.005-.01-.012-.01-.019-.019a2.406 2.406 0 0 1-.6-1.593v-.126l-.109-.065a1.361 1.361 0 0 1-.636-.742 1.805 1.805 0 0 1 .165-1.315l.042-.088-.035-.092a5.051 5.051 0 0 1-.411-1.57A4.111 4.111 0 0 1 6.8 5.046a4.171 4.171 0 0 1 .689-.9 4 4 0 0 1 1.873-1.055 3.281 3.281 0 0 1 .767-.092 3.743 3.743 0 0 1 2.448 1.02l.059.054.08.007a2.438 2.438 0 0 1 .29.045 2.222 2.222 0 0 1 1.194.661c.042.047.084.1.125.15.642.861.656 2.015.043 3.86l-.039.119.08.1a1.613 1.613 0 0 1 .318 1.32 1.214 1.214 0 0 1-.773.926l-.132.06v.144a2.543 2.543 0 0 1-.657 1.649l-.008.007a3.387 3.387 0 0 1-.251.255l-.076.068v1.434l.056.065c.242.278 1.072 1 3.557 1.737a4.167 4.167 0 0 1 2.157 1.767c.02.034.039.069.058.106a3.838 3.838 0 0 1 .412 1.246z"
                        className="cls-2" data-name="Shape" />
                    </g>
                </g>
            </svg>
              </NavLink>

            </li>
            {/* Bot Link */}
            <li className="nav-item">
              <NavLink to={'/bot'} className="nav-link" activeClassName="active" data-tip="Bot Integration" data-effect="solid" data-place="right">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g data-name="Group 9">
                    <path fill="none" d="M0 0h24v24H0z" data-name="Rectangle 5" />
                    <g data-name="bot icon" transform="translate(2 1)">
                        <path fill="#FFFFFF" d="M2.16 21.78a12.341 12.341 0 0 1-1.26-.058c.006 0 .622-.135 1.331-1.639a3.137 3.137 0 0 0 .081-2.7c-.079-.127-.151-.249-.22-.374a5.342 5.342 0 0 1 .025-8.5 8.917 8.917 0 0 1 3.009-3.15 9.014 9.014 0 0 1 4.28-1.365V2.5a1.318 1.318 0 0 1-.76-1.185 1.33 1.33 0 0 1 2.661 0 1.31 1.31 0 0 1-.807 1.201V4a8.938 8.938 0 0 1 7.139 4.339 5.34 5.34 0 0 1 .026 8.847 8.918 8.918 0 0 1-3.208 3.185 9.07 9.07 0 0 1-7.929.552 10.067 10.067 0 0 1-4.368.857zM6.007 8.352a4.392 4.392 0 0 0 0 8.784h7.986a4.392 4.392 0 0 0 0-8.784z"
                        className="cls-2" />
                        <ellipse fill="#FFFFFF" cx="1.182" cy="1.164" className="cls-2" rx="1.182" ry="1.164"
                        transform="translate(4.727 11.54)" />
                        <ellipse fill="#FFFFFF" cx="1.182" cy="1.164" className="cls-2" data-name="Oval" rx="1.182"
                        ry="1.164" transform="translate(12.957 11.54)" />
                    </g>
                </g>
            </svg>
              </NavLink>
            </li>
            {/* Integrations Link */}
            <li className="nav-item">
              <NavLink to={'/integrations'} className="nav-link" activeClassName="active" data-tip="Integrations" data-effect="solid" data-place="right">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25.363 25.363">
              <g data-name="Group 10">
                  <path fill="none" d="M.707.707h24v24h-24z" data-name="Rectangle 4" />
                  <g data-name="P6-cross platform" transform="rotate(-45 19.92 7.508)">
                      <path fill="#FFFFFF" d="M8.911 11.931a5.936 5.936 0 0 1-4.877-3.983H.093V4.327h3.883A5.936 5.936 0 0 1 8.911.163z"
                      className="cls-2" />
                      <rect fill="#FFFFFF" width="3.558" height="1.349" className="cls-3" rx="0.675" transform="translate(10.274 3.912)"
                      />
                      <rect fill="#FFFFFF" width="3.558" height="1.349" className="cls-3" rx="0.675" transform="translate(10.274 7.588)"
                      />
                      <path fill="#FFFFFF" d="M13.375.163a5.936 5.936 0 0 1 4.877 3.983h3.941v3.621H18.31a5.936 5.936 0 0 1-4.935 4.164z"
                      className="cls-2" />
                  </g>
              </g>
            </svg>
              </NavLink>
            </li>
            {/* FAQ Link */}
            <li className="nav-item">
              <NavLink to={'/faq'} className="nav-link" activeClassName="active" data-tip="FAQ" data-effect="solid" data-place="right">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g data-name="Group 7">
                  <path fill="none" d="M0 0h24v24H0z" data-name="Rectangle 3"/>
                  <path fill="#fff" d="M8.712 3L4.5 5.811A1.178 1.178 0 0 0 4 6.8v12.734a.763.763 0 0 0 .744.827h13.971a.741.741 0 0 0 .744-.744V3.744A.741.741 0 0 0 18.715 3zM8.63 4.24l-.248 2.976-3.473-.165zm3.885 11.739H7.72a.652.652 0 0 1-.661-.661.711.711 0 0 1 .661-.661h4.795a.6615.6615 0 1 1 0 1.323zm3.059-3.72H7.72a.6615.6615 0 0 1 0-1.323h7.854a.652.652 0 0 1 .661.661c.083.331-.248.662-.661.662z" data-name="Path 2"/>
                </g>
              </svg>
              </NavLink>
            </li>

          </ul>
          {/* Options at the bottom of the Sidebar: Profile, Help and Settings */}
          <ul className="nav">
            {/* Settings Link */}
            <li className="nav-item">
              <NavLink to={'/settings/profile'} className={currentPath.includes('/settings/') ? "nav-link active" : "nav-link"} activeClassName="active" data-tip="Settings" data-effect="solid" data-place="right">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g data-name="Group 3">
                    <path fill="none" d="M0 0h24v24H0z" data-name="Rectangle 7" />
                    <path fill="#fff" d="M13.022 22h-2.044l-1.089-2.6a6.927 6.927 0 0 1-1.622-.667l-2.6 1.067-1.445-1.444 1.067-2.6a6.906 6.906 0 0 1-.667-1.622L2 13.022v-2.044l2.6-1.089a6.9 6.9 0 0 1 .667-1.622L4.2 5.667l1.444-1.445 2.6 1.067a6.923 6.923 0 0 1 1.622-.667L10.978 2h2.045l1.089 2.6a6.886 6.886 0 0 1 1.622.667l2.6-1.067 1.444 1.444-1.067 2.6a6.892 6.892 0 0 1 .667 1.622L22 10.978v2.045l-2.6 1.089a6.892 6.892 0 0 1-.667 1.622l1.067 2.6-1.444 1.444-2.6-1.067a6.892 6.892 0 0 1-1.622.667L13.022 22zM12 8.933A3.067 3.067 0 1 0 15.067 12 3.07 3.07 0 0 0 12 8.933z"
                    data-name="settings icon" />
                </g>
            </svg>
              </NavLink>
            </li>
            {/* Help Link */}
            <li className="nav-item">
            <a href="javascript:void(0)" id="sidebar-sidebox-help-icon"  
            onClick={this.launchSideboxChat} 
                className="nav-link  n-vis" data-tip="Help" data-effect="solid" data-place="right">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g data-name="Group 2">
                  <path fill="none" d="M0 0h24v24H0z" data-name="Rectangle 8" />
                  <path fill="#fff" d="M12 22A10.011 10.011 0 0 1 2 12 10.011 10.011 0 0 1 12 2a10.011 10.011 0 0 1 10 10 10.011 10.011 0 0 1-10 10zm0-5a1 1 0 0 0-1 1 1 1 0 0 0 1 1 1 1 0 0 0 1-1 1 1 0 0 0-1-1zm0-5a1 1 0 0 0-1 .985V15a1 1 0 0 0 1 1 1 1 0 0 0 1-1v-.782a.5.5 0 0 1 .35-.472 3.981 3.981 0 0 0 2.535-4.7 3.952 3.952 0 0 0-2.957-2.942 4.3 4.3 0 0 0-.95-.108 3.989 3.989 0 0 0-3.983 3.949v.148a.988.988 0 0 0 .982.9 1 1 0 0 0 1-1 2.015 2.015 0 0 1 2-1.96 2.017 2.017 0 0 1 2 1.958A2 2 0 0 1 12 12z"
                  data-name="Exclusion 1" />
                </g>
              </svg>
            </a>
            
            </li>
            {/* Profile Link */}
            <li className="nav-item">
                <ProfileImageName profilePicUrl={this.props.profilePicUrl} displayName={this.props.displayName} hideDisplayName={true}/>
            </li>
          </ul>
        </nav>
        <ReactTooltip />
        { settingsSidebarShow }
        

      </div>

    )
  }
}

export default Sidebar;
