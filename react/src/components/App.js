import React from 'react';
// import App from './components/App';
import ReactDOM from 'react-dom';
import { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { createBrowserHistory } from 'history';
import ThirdPartyScripts from '../utils/ThirdPartyScripts';
import AnalyticsTracking from '../utils/AnalyticsTracking';
import * as Sentry from '@sentry/browser';
import { getConfig } from '../config/config';

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
//import 'react-notifications/lib/notifications.css';
import {NotificationContainer} from 'react-notifications'
import CommonUtils from '../utils/CommonUtils';
import ApplicationList from '../views/Pages/ApplicationList/ApplicationList';
import {setTag} from '../../src/sentry/sentry'
import {getAppSetting} from '../../src/utils/kommunicateClient'
import { connect } from 'react-redux'
import * as Actions from '../actions/applicationAction';
import * as ClearReduxAction from '../actions/index'
import {Subscribe, Unsubscribe} from '../views/Pages/subscription/Subscribe';
import {KM_RELEASE_VERSION} from '../../src/utils/Constant'



// const history = createBrowserHistory();
const enableSentry = getConfig().thirdPartyIntegration.sentry.enable;
class App extends Component {

  constructor(props,defaultProps){
    super(props,defaultProps);
    this.state = {
       error: null,
       loading: true
      }
  }
  componentDidMount() {
    this.props.logInStatus && this.getAppSettings()
    setTimeout(() => this.setState({ loading: false }), 1500); 
    // simulates an async action, and hides the spinner
    !CommonUtils.isLatestKmVersionOnLocalStorage() && this.props.logInStatus && this.logoutForOlderVersion()
  }

  logoutForOlderVersion = () => {
    this.props.resetStore();
    sessionStorage.clear();
    localStorage.clear();
    // CommonUtils.deleteCookie(COOKIES.KM_LOGGEDIN_USER_ID);
    this.props.resetStore();
    window.history.pushState({
      urlPath: '/login'
    }, "", '/login');
    return;
  };

  getAppSettings = () => {
    return Promise.resolve(getAppSetting().then(response => {
      if(response.status == 200 && response.data.response) {
        this.props.updateAppSettings(response.data.response)
      }
    })).catch(err => {
      // console.log(err);
    })
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    enableSentry && Sentry.withScope((scope) => {
      setTag (scope);
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      Sentry.captureException(error);
    });
    
  }

  render() {
    const currentPath = window.location.pathname;
    let mixpanelEvent = currentPath;
    if (currentPath.startsWith("/conversations/")) {
        mixpanelEvent = "/conversations/thread";
    }

    AnalyticsTracking.trackMixpanel(mixpanelEvent);

    const { loading } = this.state;
    if(loading) { // if your component doesn't have to wait for an async action, remove this block 
      return null; // render null when app is not ready
    }

    return <div>
            {!(currentPath.includes("/subscribe") || currentPath.includes("/unsubscribe")) ? <div>
                    <NotificationContainer />
                    <ThirdPartyScripts />
                </div> : null}
            <BrowserRouter>
                <Switch>
                    <Route path="/login" name="Login Page" component={Login} />
                    <Route path="/subscribe" name="Subscribe" component={Subscribe} />
                    <Route path="/unsubscribe" name="Subscribe" component={Unsubscribe} />
                    <Route exact path="/signup" name="Register Page" component={Register} />
                    <Route exact path="/setUpPage" name="SetUpPage" render={({ history }) => (CommonUtils.getUserSession() ? <SetUpPage hideSkipForNow={false} history={history} /> : <Redirect to={{ pathname: "/signup" }} />)} />
                    <Route exact path="/installation" name="Installation" render={() => <SetUpPage hideSkipForNow={true} />} />
                    <Route exact path="/404" name="Page 404" component={Page404} />
                    <Route exact path="/500" name="Page 500" component={Page500} />
                    <Route exact path="/password/update" name="Update Password" component={PasswordReset} />
                    <Route exact path="/applozicsignup" name="Applozic User Sign Up" component={ApplozicUserSignUp} />
                    <Route exact path="/apps" name="Select Application" component={ApplicationList} />
                    <Route path="/" name="Home" render={data => {
                            return CommonUtils.getUserSession() ? <Full history={data.history} application={CommonUtils.getUserSession().application} /> : <Redirect to={"/login?referrer=" + data.location.pathname} />;
                        }} />
                </Switch>
            </BrowserRouter>
        </div>;
    }
} 
App.defaultProps ={ hideSkip : false }
const mapStateToProps = state => ({
  logInStatus:state.login.logInStatus
})

const mapDispatchToProps = dispatch => {
  return {
    updateAppSettings: payload => dispatch(Actions.updateApplicationData('SAVE_APP_SETTINGS', payload)),
    resetStore: payload => dispatch(ClearReduxAction.resetStore())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)
