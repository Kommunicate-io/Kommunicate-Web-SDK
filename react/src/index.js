import ReactDOM from 'react-dom'
import { render } from 'react-dom'
import React from 'react'
import App from './components/App'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers'
import logger from 'redux-logger'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './store/store';
import * as Sentry from '@sentry/browser'
import { getConfig } from '../src/config/config'
import CommonUtils from '../src/utils/CommonUtils';

const enableSentry = getConfig().thirdPartyIntegration.sentry.enable;

enableSentry && Sentry.init({
 dsn: getConfig().thirdPartyIntegration.sentry.dsn
});
enableSentry && Sentry.configureScope((scope) => {
  let userSession = CommonUtils.getUserSession();
  scope.setTag("applicationId", userSession.application.applicationId);
  scope.setTag("userId", userSession.userName);
  scope.setUser({
      id: userSession.application.applicationId,
      username: userSession.userName
  });
});
// const store = createStore(rootReducer, applyMiddleware(logger)

ReactDOM.render(
  <Provider store={store}> 
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);