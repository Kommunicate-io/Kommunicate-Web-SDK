import 'core-js';
import ReactDOM from 'react-dom'
import { render } from 'react-dom'
import React, { Fragment } from 'react'
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
import {setTag} from '../src/sentry/sentry'
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import theme from './assets/theme/theme';


const enableSentry = getConfig().thirdPartyIntegration.sentry.enable;

enableSentry && Sentry.init({
 dsn: getConfig().thirdPartyIntegration.sentry.dsn
});
enableSentry && Sentry.configureScope((scope) => {
  setTag(scope);
});

const GlobalStyle = createGlobalStyle`
  .product {
    display: none;
  }
  .product.product-${CommonUtils.getProduct()} {
    display: block;
  }
  .product.product-${CommonUtils.getProduct()}-table-cell {
    display: table-cell;
  }
  .km-button--primary, .km-button--primary a {
    background-color: ${props => props.theme.buttons.primaryBG};
  }
  .km-button--secondary, .km-button--primary a {
    border: solid 1px ${props => props.theme.buttons.secondaryText};
    color: ${props => props.theme.buttons.secondaryText};
  }
  .km-button--primary:hover {
    background-color: ${props => props.theme.buttons.hover};
  }
  .km-button--secondary:hover {
    border: solid 1px ${props => props.theme.buttons.secondaryText};
    color: ${props => props.theme.buttons.secondaryText};
  }
  .brand-color {
    color: ${props => props.theme.primary} !important;
  }
  .brand-color--border, .ui.secondary.pointing.menu .active.item {
    border-color: ${props => props.theme.primary} !important;
  }
  .brand-color:hover, .brand-color:focus {
    color: ${props => props.theme.buttons.hover} !important;
    outline: none;
  }
  .switch-enable-automatic > .switch-input:checked ~ .switch-label {
    background: ${props => props.theme.primary} !important;
    border-color: ${props => props.theme.primary};
  }
  .hr {
    border-top: 4px solid ${props => props.theme.primary};
  }
`;

// const store = createStore(rootReducer, applyMiddleware(logger)

ReactDOM.render(
  <Provider store={store}> 
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <Fragment>
          <GlobalStyle/>
          <App />
        </Fragment>
      </ThemeProvider>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);