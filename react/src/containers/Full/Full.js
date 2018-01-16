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
import Integration from '../../views/Settings/Integration/'
import Admin from '../../views/Admin/'
import Team from '../../views/Team/'
import Autoreply from '../../views/Autoreply/'
import LoggedInAuthentication from  '../../views/Pages/Login/LoggedInAuthentication'
import CommonUtils from '../../utils/CommonUtils';
import SettingsSidebar from '../../components/SettingsSidebar/SettingsSidebar';


class Full extends Component {

  
  constructor (props) {
    super(props)
     //_this =this;
    let imageLink = CommonUtils.getUserSession().imageLink;
    this.state = { 
      imageLink: imageLink
    }
    this.updateProfilePic  = this.updateProfilePic.bind(this);
    console.log("profilePicUrl",this.state.imageLink)
  }

  updateProfilePic(url) { 
    this.setState({
      imageLink: url==null ? "/img/avatars/default.png": url
    });
    console.log("profilePicUrl updated",this.state.imageLink)
   }
  componentWillMount(){
    window.appHistory = this.props.history;
  }
  componentDidMount() {
    
    if(CommonUtils.getUserSession()){
      console.log("userloggedin initializng chat");
      window.chatLogin();
    }
  }

  render() {

    const currentPath = window.location.pathname;

    return (
      <div className="app"> 
        <Header profilePicUrl={this.state.imageLink}/>
        <div className="app-body">
          <Sidebar {...this.props}/>
          {(currentPath.includes('integration') || currentPath.includes('admin') || currentPath.includes('team') || currentPath.includes('autoreply')) ? <SettingsSidebar {...this.props}/> : null}
          
          <main className="main">
            <Breadcrumb />
            <div className="container-fluid">
              <Switch >
                <Route path="/dashboard" name="Dashboard"  component={Dashboard}/>
                <Route exact path="/users" name="Tables" component={Users}/>
                <Route exact path="/conversations" name="Conversations" component={Conversations}/>
                <Route exact path="/reports" name="Reports" component={Reports}/>
                <Route exact path="/bot" name="Bot" component={Bot}/>
                <Route exact path="/admin" name="Admin" render={()=>{
                   return <Admin updateProfilePicUrl={this.updateProfilePic} profilePicUrl={this.state.imageLink}/>
                }}/>
                <Route exact path="/team" name="Team" component={Team}/>
                <Route exact path="/autoreply" name="Autoreply" component={Autoreply}/>
                <Route exact path="/settings/integration" name="Integration" component={Integration}/>
                }}/> 
                  
                
                <Redirect from="/" to="/dashboard"/>

              </Switch>
            </div>
          </main>
          <Aside updateProfilePicUrl={this.updateProfilePic}/>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Full;
