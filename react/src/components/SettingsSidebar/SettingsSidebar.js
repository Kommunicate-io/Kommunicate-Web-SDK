import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import styled, { withTheme, createGlobalStyle } from 'styled-components';
import CommonUtils from '../../utils/CommonUtils';
import './SettingsSidebar.css';
import SubSection from './SettingsSubSectionLinks.json';
import { InfoIcon } from '../../assets/svg/svgs';

const LinkContainer = styled.a`
    display: flex !important; 
    align-items: center;
    justify-content: flex-start;
`;

const GlobalSettingSidebarStyle = createGlobalStyle`
    .ss-nav-link.active {
        background-color: ${props => props.theme.primary};
        color: #FFF;
        border-radius: 2px;
    }
    .ss-nav-item:hover {
        background-color: ${props => props.theme.primary};
        border-radius: 2px;
    }
    .ss-nav-item:hover .ss-nav-link {
        color: #FFF;
        text-decoration: none;
    }
    .ss-nav-item .ss-nav-link svg {
        margin-right: 5px;
        transition: all .3s;
    }
    .ss-nav-item:hover .ss-nav-link svg circle {
        fill: #fff;
    }
    .ss-nav-item:hover .ss-nav-link svg path:last-child {
        fill: #4a4a4a;
    }
`;

const BetaTag = styled.sup`
    font-size: 10px;
    color: #fff;
    border-radius: 2px;
    background-color: #f4264f;
    padding: 1px 4px;
    top: -0.8em;
    font-weight: 500;
`;

class SettingsSidebar extends Component {
    constructor(props){
        super(props);
        this.state={
            isKommunicateDashboard:CommonUtils.isKommunicateDashboard(),
            isApplozicTrialExpired: CommonUtils.isProductApplozic() && CommonUtils.isExpiredPlan()
        }
    }

    renderOnlyBillingSection = () => {
        let billing = "Billing";
        let settingsObj = SubSection.settings;
        for (var i = 0; i < settingsObj.length; i++){
            if (settingsObj[i].link == billing){
                return (
                    <Fragment>
                        <li className="ss-nav-title">
                            CONFIGURATION
                        </li>
                        <li className="ss-nav-item billing-link ">
                            <NavLink to={'/settings/billing'} className="ss-nav-link" activeClassName="active">Billing</NavLink>
                        </li>
                    </Fragment>
                )
            }
          }
    }

    render() {

        const currentSection = window.location.pathname.split("/")[1];
        const isBeta = currentSection.includes('helpcenter');

        return (
             SubSection[currentSection] ?
            <div className="settings-sidebar text-center">
                <GlobalSettingSidebarStyle />
                <p className="settings-title">{currentSection} {isBeta && <BetaTag>BETA</BetaTag>}</p>
                <hr className="hrr"/>
                <div className="settings-sidebar-nav">
                    <ul className="ss-nav">
                        {
                            this.state.isApplozicTrialExpired ? this.renderOnlyBillingSection() : SubSection[currentSection].map((data, index) => (
                                data.isLink ? <li className={data.dashboard !== "" ? "ss-nav-item product product-" + data.dashboard : "ss-nav-item"}  key={index}>
                                    {data.icon ? <LinkContainer href={data.linkTo} className="ss-nav-link" target="_blank">
                                        <InfoIcon />
                                        {data.link}
                                    </LinkContainer>
                                : <NavLink to={data.linkTo} className="ss-nav-link" activeClassName="active">{data.link}</NavLink>}
                                </li> : <li className={data.dashboard !== "" ? "ss-nav-title product product-" + data.dashboard : "ss-nav-title"} key={index}>
                                    {data.link}
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
            : null
        )
    }


}

export default withTheme(SettingsSidebar);
