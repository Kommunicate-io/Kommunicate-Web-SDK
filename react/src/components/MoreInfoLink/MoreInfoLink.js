import React, { Component } from 'react';
import './MoreInfoLink.css'
import {MoreInfoLinkSvg} from '../../assets/svg/svgs'

export const MoreInfoLink = (props) => {
    return ( <p>{props.descriptionLabel}  
        <a href={props.url} target="_blank" className="more-info-link"> {props.Linklabel} 
         <MoreInfoLinkSvg />  
        </a> 
    </p> );
}
