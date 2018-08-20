//How to use Banner Component?

//import Banner from '../../components/Banner/Banner';
//Ex:  <Banner  indicator = {"warning"} isVisible= {true} text = {"You need Admin permissions to edit this section"}/>

//To display warning banner, indicator = "warning" and text = "banner text"
//To display success banner, indicator = "success" and text = "banner text"
//To display error banner, indicator = "error" and text = "banner text"
//isVisible = false(hide)/true(visible) 


import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './Banner.css';

export default class Banner extends Component {
  static defaultProps = {
    indicator: 'default',
    isVisible: false,
  };
  componentWillMount() {
      
  }

  render() {
    const { indicator, text, isVisible } = this.props;

    return (
      <div className="container km-banner-component" aria-hidden={!isVisible} hidden={isVisible} role="alert">
        <div className={indicator === 'default' ? "km-banner km-default-banner row" : 
                        indicator === 'success' ? "km-banner km-success-banner row" :
                        indicator === 'warning' ? "km-banner km-warning-banner row" :
                        indicator === 'error' ? "km-banner km-error-banner row" : "km-banner"
                        } >

            <div className="col-lg-1">
              {   indicator == "warning" &&
              <svg className="warning-icon-svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
              <path fill="#464444" fill-rule="nonzero" d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zM6.8 6.96v5.28a1.2 1.2 0 1 0 2.4 0V6.96a1.2 1.2 0 1 0-2.4 0zm1.2-2a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z"/>
              </svg>
              }        
            </div>
            <div className="col-lg-11">
              {text}
            </div>
        </div>
      </div>
    );
  }
}

Banner.propTypes = {
    indicator: PropTypes.string.isRequired,
    isVisible: PropTypes.bool,
};