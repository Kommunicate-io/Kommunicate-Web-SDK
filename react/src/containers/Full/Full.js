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
class Full extends Component {

  constructor (props) {
    super(props)
    this.state = { 
      imageLink:localStorage.getItem("imageLink") == null ? "/img/avatars/default.png" : localStorage.getItem("imageLink")
    }
    var updateProfilePic  = this.updateProfilePic.bind(this);
    console.log("profilePicUrl",this.state.imageLink)
  }

  updateProfilePic (url) { 
    this.setState({
      imageLink: url 
    });
    console.log("profilePicUrl updated",this.state.imageLink)
   }
  componentWillMount(){
    window.appHistory = this.props.history;
  }
  componentDidMount() {
    
    if(localStorage.loggedinUser != 'undefined'){
      console.log("userloggedin initializng chat");
      window.chatLogin();
    }
  }

  render() {
    return (
      <div className="app"> 
        <Header profilePicUrl={this.state.imageLink}/>
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            <Breadcrumb />
            <div className="container-fluid">
              <Switch >
                <Route path="/dashboard" name="Dashboard"  component={Dashboard}/>
                <Route exact path="/users" name="Tables" component={Users}/>
                <Route exact path="/conversations" name="Conversations" component={Conversations}/>
                <Route exact path="/reports" name="Reports" component={Reports}/>
                <Route exact path="/bot" name="Bot" component={Bot}/>
                <Route exact path="/admin" name="Admin" component={Admin}/>
                <Route exact path="/team" name="Team" component={Team}/>
                <Route exact path="/autoreply" name="Autoreply" component={Autoreply}/>
                <Route exact path="/settings/integration" name="Integration" component={Integration}/>
                <Redirect from="/" to="/dashboard"/>

              </Switch>
            </div>
          </main>
          <Aside />
        </div>
        <Footer />
      </div>
    );
  }
}

export default Full;
