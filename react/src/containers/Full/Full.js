import React, { Component } from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom'
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';

import Dashboard from '../../views/Dashboard/'
import Users from '../../views/Users/'
import Conversations from '../../views/Conversations/'
import Reports from '../../views/Reports/'
import Bot from '../../views/Bot/'
import Install from '../../views/Settings/Installation'
import Admin from '../../views/Admin/'
import Team from '../../views/Team/'
import Autoreply from '../../views/Autoreply/'
import Welcome from '../../views/Autoreply/Welcome/Welcome.js'
import AwayMessage from '../../views/Autoreply/AwayMessage/AwayMessage.js'
import AutoSuggest from '../../views/Autoreply/AutoSuggest.js'
import Download from '../../views/Download/Download.js'
import Faq from '../../views/Faq/'
import Billing from '../../views/Billing/'
import Integrations from '../../views/Integrations/Integrations.js'

import LoggedInAuthentication from  '../../views/Pages/Login/LoggedInAuthentication'
import CommonUtils from '../../utils/CommonUtils';
import SettingsSidebar from '../../components/SettingsSidebar/SettingsSidebar';
import AgentAssignemnt from '../../views/Routing/AgentAssignment';


class Full extends Component {

  
  constructor (props) {
    super(props)
     //_this =this;
    let imageLink = CommonUtils.getUserSession().imageLink;
    this.state = { 
      imageLink: imageLink,
      hideInvitedMemberBar: true,
      invitedBy: '',
      displayName: ''
    }
    this.updateProfilePic  = this.updateProfilePic.bind(this);
    this.updateUserDisplay  = this.updateUserDisplay.bind(this);
  }

  updateProfilePic(url) { 
    this.setState({
      imageLink: url==null ? "/img/avatars/default.png": url
    });
   }
  componentWillMount(){
    window.appHistory = this.props.history;
    const search = window.location.href;
    let invitedBy = CommonUtils.getUrlParameter(search, 'referer');
    if (invitedBy && invitedBy !== "" && invitedBy !== "undefined") {
      this.setState({
        hideInvitedMemberBar: false,
        invitedBy: invitedBy
      })
    }
    let userSession = CommonUtils.getUserSession()
    if(userSession){
      this.setState(
        {displayName:(userSession.name !=="undefined") ? userSession.name:userSession.userName}
      )
      
    }
    
  }
  componentDidMount() {
    
    if(CommonUtils.getUserSession()){
      window.chatLogin();
    }
  }
  updateUserDisplay(name){
    this.setState(
      {displayName:name}
    )
  }

  closeInvitedMemberBar = e => {
    this.setState({hideInvitedMemberBar:true});
  }


  render() {

    const currentPath = window.location.pathname;

    return (
      <div className="app" suppressContentEditableWarning={true}> 
        <Header profilePicUrl={this.state.imageLink} displayName={this.state.displayName}/>
        <div className="integration-invited-team-div text-center" hidden={this.state.hideInvitedMemberBar}>
          <p>You were invited by <span>{this.state.invitedBy}</span>. You may start with <Link to="/install">Kommunicate Installation</Link> or set up your <Link to="/profile">Profile</Link></p>
          <div className="dismiss-icon" onClick={this.closeInvitedMemberBar}>&#xd7;</div>
        </div>
        <div className="app-body">
          <Sidebar {...this.props}/>
          {currentPath.includes('/settings') ? <SettingsSidebar {...this.props}/> : null}
          
          <main className="main">
            <Breadcrumb />
            <div className="container-fluid">
              <Switch >
                <Route path="/dashboard" name="Dashboard"  component={Dashboard}/>
                <Route exact path="/users" name="Tables" component={Users}/>
                <Route exact path="/conversations" name="Conversations" component={Conversations}/>
                <Route exact path="/reports" name="Reports" component={Reports}/>
                <Route exact path="/bot" name="Bot" component={Bot}/>
                <Route exact path="/settings/profile" name="Admin" render={()=>{
                   return <Admin updateProfilePicUrl={this.updateProfilePic} profilePicUrl={this.state.imageLink} updateUserDisplay={this.updateUserDisplay} />
                }}/>
                <Route exact path="/faq" name="Faq" component={Faq}/>
                <Route exact path="/settings/team" name="Team" component={Team}/>
                <Route exact path="/settings/autoreply" name="Autoreply" component={Autoreply}/>
                <Route exact path="/settings/welcome-message" name="Welcome" component={Welcome}/>
                <Route exact path="/settings/away-message" name="AwayMessage" component={AwayMessage}/>
                <Route exact path="/settings/message-shortcuts" name="AutoSuggest" component={AutoSuggest}/>
                <Route exact path="/settings/install" name="Install" component={Install}/>
                <Route exact path="/settings/agent-app" name="Download" component={Download}/>
                <Route exact path="/settings/agent-assignment" name="AgentAssignment" component={AgentAssignemnt}/>
                <Route exact path="/settings/billing" name="Billing" component={Billing}/>
                <Route exact path="/settings/integrations" name="Billing" component={Integrations}/>
                }}/> 
                
                <Redirect from="/" to="/dashboard"/>

              </Switch>
            </div>
          </main>
          <Aside updateProfilePicUrl={this.updateProfilePic}/>
        </div>
        {/* <Footer /> */}
      </div>
    );
  }
}

export default Full;
