//How to use Banner Component?

//import Banner from '../../components/Banner/Banner';
//Ex:  <Banner  indicator = {"warning"} hidden= {true} text = {"You need Admin permissions to edit this section"}/>

//To display warning banner, indicator = "warning" and text = "banner text"
//To display success banner, indicator = "success" and text = "banner text"
//To display error banner, indicator = "error" and text = "banner text"
//hidden = false(hide)/true(visible) 


import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './Banner.css';
import { BannerIcons } from '../../assets/svg/svgs';

export default class Banner extends Component {
  static defaultProps = {
    indicator: 'default',
    hidden: false,
  };

  render() {
    const { indicator, text, hidden } = this.props;

    return (
      <div className="container km-banner-component" hidden={hidden} role="alert">
        <div className={indicator === 'default' ? "km-banner km-default-banner row" : 
                        indicator === 'success' ? "km-banner km-success-banner row" :
                        indicator === 'warning' ? "km-banner km-warning-banner row" :
                        indicator === 'error' ? "km-banner km-error-banner row" : "km-banner"
                        } >

            <div className="col-sm-1">
              <BannerIcons />     
            </div>
            <div className="col-sm-11">
              {text}
            </div>
        </div>
      </div>
    );
  }
}

Banner.propTypes = {
    indicator: PropTypes.string.isRequired,
    hidden: PropTypes.bool,
};