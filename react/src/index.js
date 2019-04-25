import 'core-js';
import ReactDOM from 'react-dom'
import React from 'react'
import App from './components/App';
import {BrowserRouter} from 'react-router-dom';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './store/store';
import * as Sentry from '@sentry/browser'
import { getConfig } from '../src/config/config'
import CommonUtils from '../src/utils/CommonUtils';
import {setTag} from '../src/sentry/sentry'
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import theme from './assets/theme/theme';
import {KM_RELEASE_VERSION} from '../src/utils/Constant'


const enableSentry = getConfig().thirdPartyIntegration.sentry.enable;

enableSentry && Sentry.init({
 dsn: getConfig().thirdPartyIntegration.sentry.dsn,
 release: KM_RELEASE_VERSION
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
  a {
    color: ${props => props.theme.primary};
  }
  .input:focus, .select:focus, input:focus, select:focus {
    border: 1px solid ${props => props.theme.primary};
  }

  /* Custom classes for theming the dashboard */
  .km-conversation-icon-active{
      background: #${primaryColor}!important;
      border: 2px solid #${primaryColor}!important;
  }
  .km-custom-text-color{
    color: #${primaryColor}!important;
  }
  .km-custom-bg{
    background: #${primaryColor}!important;
  }
  .card-inner-block.active{
    border-top-color: #${primaryColor}!important;
  }
`;

let CustomTheme;
const primaryColor = CommonUtils.getUrlParameter(window.location.href,"primaryTheme") || CommonUtils.getItemFromLocalStorage('kmCustomTheme');

let getTheme = () =>{

 if(primaryColor){
  CommonUtils.setItemInLocalStorage('kmCustomTheme',primaryColor);
  //Adding custom color to global theme object
  theme.primary = `#${primaryColor}`;
  theme.primaryLight = `#${primaryColor}`;
  theme.buttons.primaryBG = `#${primaryColor}`;
  theme.buttons.secondaryText = `#${primaryColor}`;

  CustomTheme = createGlobalStyle`
  /* Custom classes for theming the dashboard */
  .km-conversation-icon-active{
      background: #${primaryColor}!important;
      border: 2px solid #${primaryColor}!important;
  }
  .km-custom-text-color{
    color: #${primaryColor}!important;
  }
  .km-custom-bg{
    background: #${primaryColor}!important;
  }
  .card-inner-block.active{
    border-top-color: #${primaryColor}!important;
  }`; 
 }else{
    CommonUtils.setItemInLocalStorage('kmCustomTheme',primaryColor);
 }
  return theme;
};

// const store = createStore(rootReducer, applyMiddleware(logger)

ReactDOM.render(
  <Provider store={store}> 
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={getTheme()}>
        <BrowserRouter>
          <GlobalStyle/>
          {
            primaryColor && <CustomTheme/>
          }
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);