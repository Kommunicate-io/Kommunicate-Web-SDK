import React, { Component } from 'react';
import { PoweredBy, PoweredByLink } from './PoweredByKommunicateComponents';
import { KommunicateLogo } from '../../assets/svg/svgAssets';
import { CommonUtils } from '../../utils/CommonUtils';


export default class PoweredByKommunicate extends Component {
    render() {
        return (
               <PoweredBy>
                   <PoweredByLink href={CommonUtils.getKommunicateWebsiteUrl()} target="_blank"> <KommunicateLogo  fillcolor={"#cacaca"}/> Powered by Kommunicate </PoweredByLink>
               </PoweredBy>
        )
    }
}


