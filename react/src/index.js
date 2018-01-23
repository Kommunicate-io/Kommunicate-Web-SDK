import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { createBrowserHistory } from 'history';
import ThirdPartyScripts from './utils/ThirdPartyScripts';

// Containers
import Full from './containers/Full/'

// Views
import Login from './views/Pages/Login/'
import Register from './views/Pages/Register/'
import Page404 from './views/Pages/Page404/'
import Page500 from './views/Pages/Page500/'
import SetUpPage from './views/Pages/SetUpPage'
import ApplozicUserSignUp from './views/Pages/ApplozicUserSignUp'
import PasswordReset from './views/Pages/PasswordReset/'
import 'react-notifications/lib/notifications.css';
import {NotificationContainer} from 'react-notifications'
import CommonUtils from './utils/CommonUtils';

// const history = createBrowserHistory();

class App extends Component {
  static defaultProps ={ hideSkip : false }
  constructor(props,defaultProps){
    super(props,defaultProps)
  }

  render() {
    return (
      <div>
        <NotificationContainer />
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" name="Login Page" component={Login}/>
          <Route exact path="/signup" name="Register Page" component={Register}/>
          <Route exact path="/setUpPage" name="SetUpPage" render={ ({history}) => CommonUtils.getUserSession() ? <SetUpPage history={history}/>: <Redirect to={{pathname: '/signup'}}/> }/>
          <Route exact path="/installation" name="Installation" render={() => <SetUpPage hideSkipForNow={this.props.hideSkip} />} />
          <Route exact path="/404" name="Page 404" component={Page404}/>
          <Route exact path="/500" name="Page 500" component={Page500}/>
          <Route exact path="/password/update" name = "Update Password" component = {PasswordReset}/>
          <Route exact path='/applozicsignup' name='Applozic User Sign Up' component={ApplozicUserSignUp} />
          <Route path="/" name="Home" render={ ({history}) =>  CommonUtils.getUserSession() ?<Full history ={history}/> : <Redirect to={{pathname: '/login'}}/> }/>
        </Switch>
      </BrowserRouter>
      <ThirdPartyScripts/>
      </div>
    )
  }
}

ReactDOM.render((
  <App />
), document.getElementById('root'))
