import React from 'react';
import 'core-js';
// import App from './components/App';
import ReactDOM from 'react-dom';
import { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { createBrowserHistory } from 'history';
import ThirdPartyScripts from '../utils/ThirdPartyScripts';
import {ActiveCampaign} from '../utils/ActiveCampaign';

// Containers
import Full from './../containers/Full/'

// Views
import Login from '../views/Pages/Login/'
import Register from '../views/Pages/Register/'
import Page404 from '../views/Pages/Page404/'
import Page500 from '../views/Pages/Page500/'
import SetUpPage from '../views/Pages/SetUpPage'
import ApplozicUserSignUp from '../views/Pages/ApplozicUserSignUp'
import PasswordReset from '../views/Pages/PasswordReset/'
import 'react-notifications/lib/notifications.css';
import {NotificationContainer} from 'react-notifications'
import CommonUtils from '../utils/CommonUtils';
import ApplicationList from '../views/Pages/ApplicationList/ApplicationList';


// const history = createBrowserHistory();

class App extends Component {
  static defaultProps ={ hideSkip : false }
  constructor(props,defaultProps){
    super(props,defaultProps)
  }
  state = {
    loading: true
  };
  componentDidMount() {
    setTimeout(() => this.setState({ loading: false }), 1500); // simulates an async action, and hides the spinner
  }

  render() {

    const { loading } = this.state;
    if(loading) { // if your component doesn't have to wait for an async action, remove this block 
      return null; // render null when app is not ready
    }

    return (
      
      <div>
      <NotificationContainer />
      <ThirdPartyScripts/>
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" name="Login Page" component={Login}/>
          <Route exact path="/signup" name="Register Page" component={Register}/>
          <Route exact path="/setUpPage" name="SetUpPage" render={ ({history}) => CommonUtils.getUserSession() ? <SetUpPage hideSkipForNow={false} history={history}/>: <Redirect to={{pathname: '/signup'}}/> }/>
          <Route exact path="/installation" name="Installation" render={() => <SetUpPage hideSkipForNow={true} />} />
          <Route exact path="/404" name="Page 404" component={Page404}/>
          <Route exact path="/500" name="Page 500" component={Page500}/>
          <Route exact path="/password/update" name = "Update Password" component = {PasswordReset}/>
          <Route exact path='/applozicsignup' name='Applozic User Sign Up' component={ApplozicUserSignUp} />
          <Route exact path="/apps" name="Select Application" component={ApplicationList} />
          <Route path="/" name="Home" render={ ({history}) =>  CommonUtils.getUserSession() ?<Full history ={history}/> : <Redirect to={{pathname: '/login'}}/> }/>
          
        </Switch>
      </BrowserRouter>
      </div>
    )
  }
}

export default App
