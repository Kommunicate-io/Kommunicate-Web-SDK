import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import styled, { withTheme, createGlobalStyle } from 'styled-components';
import CommonUtils from '../../utils/CommonUtils';
import './SettingsSidebar.css';
import SubSection from './SettingsSubSectionLinks.json';

const LinkContainer = styled.a`
    display: flex !important; 
    align-items: center;
    justify-content: flex-start;
`;

const InfoContainer = styled.div`
    width: 20px;
    height: 15px;
    margin-right: 5px;
`;

const InfoIcon = styled.div`
    width: 15px;
    height: 15px;
    font-size: 12px;
    line-height: 15px;
    border: 1px solid #666464;
    background-color: #666464;
    color: #FFF;
    border-radius: 50%;
    margin: 0 auto;
    text-align: center;
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
    .ss-nav-item:hover .ss-nav-link .info-icon, .ss-nav-link.active .info-icon {
        color: #666464;
        border: 1px solid #FFF;
        background-color: #FFF;
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
                                        <InfoContainer>
                                            <InfoIcon className="info-icon">?</InfoIcon>
                                        </InfoContainer>
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
