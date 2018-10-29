import React, { Component, PropTypes } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import {Link} from 'react-router-dom' ;
import { NavLink } from 'react-router-dom';
import {goAway, goOnline, updateUserStatus} from '../../utils/kommunicateClient'
import CommonUtils from '../../utils/CommonUtils';
import { COOKIES, USER_STATUS } from '../../utils/Constant';
import ReactTooltip from 'react-tooltip';
import { persistor} from '../../store/store';

class TurnOnAwayMode extends Component {
  render() {
    return(
        <span data-for='away-mode' data-tip className={this.props.className}>Turn on <strong>Away</strong> mode</span>
    );
  }
}
class TurnOnOnlineMode extends Component {
  render() {
    return(
      <span data-for='online-mode' data-tip className={this.props.className}><span className="away">Away</span> <span>Go <strong>Online</strong></span></span>
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
        let status = CommonUtils.getUserStatus();
        this.state = {
          changeStatusLabel: status === USER_STATUS.ONLINE ? <TurnOnAwayMode />: <TurnOnOnlineMode />,
          status: status,
          dropdownOpen: false,
          showDropdownMenu: false,
        };

        this.showDropdownMenu = this.showDropdownMenu.bind(this);
        this.hideDropdownMenu = this.hideDropdownMenu.bind(this);
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
        // clear the data persisted in storage
        persistor.purge()
        sessionStorage.clear();
        localStorage.clear();
        CommonUtils.deleteCookie(COOKIES.KM_LOGGEDIN_USER_ID);
        window.location.assign("/login");    
      }

      toggleStatus = (e) => {
        let userSession = CommonUtils.getUserSession();
        let status = !this.state.status ? USER_STATUS.ONLINE : USER_STATUS.AWAY;
        return Promise.resolve(updateUserStatus(status)).then(response => {
          CommonUtils.updateUserStatus(status);
          this.setState({
            status: status,
            changeStatusLabel: status ? <TurnOnOnlineMode /> : <TurnOnAwayMode />
          }, () => {
            ReactTooltip.rebuild()
          })
        }).catch(err => {
          console.log("Error while updating user status")
        });
      }
      goToProfile(e) {
        window.appHistory.push("/settings/profile");
      }
      goToBilling(e) {
        window.appHistory.push("/settings/billing");
      }
      goToApplicationsPage(e) {
        window.location.assign("/apps");
      }

      showDropdownMenu(event) {
        event.preventDefault();
        this.setState({ showDropdownMenu: true }, () => {
          document.addEventListener('click', this.hideDropdownMenu);
        }, () => {
          ReactTooltip.rebuild()
        });
      }

      hideDropdownMenu(event) {
        var elem = document.getElementById("go-away"), 
           elem2 = document.querySelector("span[data-tip]");
                  
          if (this.dropdownMenu.contains(event.target)) {

            if(event.target === elem || event.target === elem2) {
              this.setState({ showDropdownMenu: true }, () => {
                document.addEventListener('click', this.hideDropdownMenu);
              });
            } else {
              this.setState({ showDropdownMenu: false }, () => {
                document.removeEventListener('click', this.hideDropdownMenu);
              });
            }
          } else  {
            this.setState({ showDropdownMenu: false }, () => {
              document.removeEventListener('click', this.hideDropdownMenu);
            });
          }
      }
      


    render() {
      const userSession = CommonUtils.getUserSession();
      if(CommonUtils.getApplicationIds()) {
        var userAppsList = CommonUtils.getApplicationIds();
        userAppsList = Object.keys(userAppsList).length;
      } else {
        userAppsList = 0;
      }
      
        return (
            <div>
                {/* <Dropdown className="sidebar-profile-dropdown"  isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <button onClick={this.toggle} className="nav-link dropdown-toggle" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded={this.state.dropdownOpen}>
                        <div style={{ display: "inline-block" }}>
                            <img src={this.props.profilePicUrl} className="img-avatar" alt={this.props.displayName} />
                            <span className={CommonUtils.getUserSession().availabilityStatus === 1 ? "online-indicator-profile-pic" : null}></span>
                        </div>
                        <span className="d-md-down-none" hidden={this.props.hideDisplayName}>{this.props.displayName}</span>
                    </button>
                    <DropdownMenu className="dropdown-menu-right sidebar-profile-dropdown--fixed ">
                        <DropdownItem>
                            <p className="header-user-name">{this.props.displayName}</p>
                            <p className="header-user-email">{CommonUtils.getUserSession().userName}</p>
                            <p><span className="header-user-online"> You are online</span></p>
                            <span className="header-user-online"> {CommonUtils.getUserSession().availabilitStatus === 1 ? "You are online" : "You are away"}</span><span className={this.state.status === "1" ? "online-indicator" : null}></span>
                        </DropdownItem>
                        {
                            <DropdownItem onClick={this.toggleStatus} id="online-offline-status"> {CommonUtils.getUserSession().availabilityStatus === 1 ? <TurnOnAwayMode /> : <TurnOnOnlineMode />} </DropdownItem>
                        }

                        <DropdownItem onClick={this.goToProfile}>Profile</DropdownItem>
                        
                        <DropdownItem onClick={this.logout}> Logout</DropdownItem>
                    </DropdownMenu>
                </Dropdown> */}
                

                <button className="sidebar-profile-dropdown nav-link dropdown-toggle" onClick={this.showDropdownMenu} data-toggle="dropdown" type="button" aria-haspopup="true">
                  <div style={{ display: "inline-block", padding: "3px"}}>
                    <img src={this.props.profilePicUrl} className="img-avatar" />
                    <span className={CommonUtils.getUserStatus() === 1 ? "online-indicator-profile-pic" : null}></span>
                  </div>
                  <span className="d-md-down-none" hidden={this.props.hideDisplayName}>{this.props.displayName}</span>
                </button>
        
        
              <div tabIndex="-1" aria-hidden="false" role="menu"
                className={this.state.showDropdownMenu ? "menu dropdown-menu-right sidebar-profile-dropdown--fixed" : "n-vis"}
                ref={(element) => {
                  this.dropdownMenu = element;
                }}
              >
                <button className="dropdown-item" type="button" tabIndex="0" onClick={this.goToProfile}>
                  <p className="header-user-name km-text-overflow-ellipsis">{this.props.displayName}</p>
                  <p className="header-user-email km-text-overflow-ellipsis">{CommonUtils.getUserSession().userName}</p>
                  {/* <p><span className="header-user-online"> You are online</span></p> */}
                  {/* <span className="header-user-online"> {CommonUtils.getUserSession().availabilitStatus === 1 ? "You are online" : "You are away"}</span><span className={this.state.status === "1" ? "online-indicator" : null}></span> */}
                </button>

                <button className={userAppsList > 0 ? "dropdown-item app-list-dropdown-item vis" : "dropdown-item n-vis"} type="button" tabIndex="0" onClick={this.goToApplicationsPage}> 
                  <p className="application-name km-text-overflow-ellipsis">{userSession.application.name}</p>
                  <p className="switch-app-text km-text-overflow-ellipsis">Switch Application</p>
                </button>                

                <button className="dropdown-item" type="button" tabIndex="0" id="go-away" onClick={this.toggleStatus}>
                  {CommonUtils.getUserStatus() === 1 ? <div><TurnOnAwayMode className="vis" /><TurnOnOnlineMode className="n-vis" /></div> : <div><TurnOnAwayMode className="n-vis" /><TurnOnOnlineMode className="vis" /></div>}
                </button>

                {/* <button className="dropdown-item" type="button" tabIndex="0" onClick={this.goToProfile}> Profile </button> */}

                <button className="dropdown-item" type="button" tabIndex="0" onClick={this.goToBilling}> Billing </button>

                <button className="dropdown-item" type="button" tabIndex="0"  onClick={this.logout} id="logout"> Logout </button>
              </div>
              <ReactTooltip id='away-mode' type='dark' effect='solid' data-offset="{'left': 10}">
                <span>In away mode, you will be offline from all the conversation <br/> and no new conversation will be assigned to you.</span>
              </ReactTooltip>
              <ReactTooltip id='online-mode' type='dark' effect='solid' data-offset="{'left': 10}">
                <span>In online mode, you will appear online in all the conversations <br/> and new conversation will be assigned to you.</span>
              </ReactTooltip>
            </div>
        );
    }
}