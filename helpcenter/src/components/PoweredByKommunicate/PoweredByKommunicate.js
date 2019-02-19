import React, { Component } from 'react';
import { PoweredBy, PoweredByLink } from './PoweredByKommunicateComponents';
import { KommunicateLogo } from '../../assets/svgAssets';
import { CommonUtils } from '../../utils/CommonUtils';


export default class PoweredByKommunicate extends Component {
    render(props) {
        return (
               <PoweredBy>
                   <PoweredByLink href={CommonUtils.getKommunicateWebsiteUrl()} target="_blank"> <KommunicateLogo  fillcolor={this.props.fill}/> <span style={{color:this.props.textColor}}>Powered by Kommunicate</span> </PoweredByLink>
               </PoweredBy>
        )
    }
}


