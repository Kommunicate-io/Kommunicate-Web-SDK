import React, { Component } from 'react'
import './LearnMoreButton.css'
import CommonUtils from '../../utils/CommonUtils';
import { Link } from 'react-router-dom';
import { LearnMore } from '../../views/Faq/LizSVG';
import PropTypes from 'prop-types';


export default class LearnMoreButton extends Component {
    render(){
        const {url,label} = this.props;
        return ( 
            <div className="learn-more-wrapper">
            <a href={url} target="_blank" ><span>{label}</span>  <LearnMore /> </a>
            </div>
         );
    }
  
}

LearnMoreButton.propTypes = {
    url: PropTypes.string,
    label:PropTypes.string
}