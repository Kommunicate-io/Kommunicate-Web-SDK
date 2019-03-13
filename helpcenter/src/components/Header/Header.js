import React, { Component } from 'react';
import {HeaderComponent, HeaderTopbar, TopbarLogoContainer, TopbarLogo, HelpcenterHeading, SearchBarContainer, HeaderWrapper, SearchIconContainer, BackButtonContainer} from './HeaderComponents';
import { Container } from '../Container/Container';
import  Button  from '../Button/Button';
import HelpQuerySearch from './HeaderSearch'
import { SearchLogo, BackButton } from '../../assets/svgAssets';
import { withRouter } from 'react-router-dom';
import { CommonUtils } from '../../utils/CommonUtils'
import { HelpCenterData } from '../../context/HelpcenterDataContext'


class Header extends Component {
  static contextType = HelpCenterData;

  navigateHome = () =>{
    if(this.props.location.pathname==='/' && !this.props.location.search){
      return false;
    }
    this.props.history.push({
      pathname: '/'
    });
  }

  navigateBack = () =>{
    window.history.length > 1 && history.back()
  }  
  
  render(){
    return(
      <HeaderComponent >
        <Container>
          <HeaderWrapper >
            <HeaderTopbar>
              {
                (window.location.pathname.includes('article') || CommonUtils.getUrlParameter(window.location.search,"q"))  &&  <BackButtonContainer onClick={this.navigateBack}> <BackButton/> </BackButtonContainer>
              }
              <TopbarLogoContainer onClick={this.navigateHome} >
                <TopbarLogo ><img src={this.context.helpCenter.helpCenter.logo} alt=""/></TopbarLogo>
              </TopbarLogoContainer>
                {/* <Button>{props.contactSupportButtonText}</Button> */}
              </HeaderTopbar >
                <HelpcenterHeading headingVisible={window.location.pathname === "/" && !CommonUtils.getUrlParameter(window.location.search,"q")}>{this.context.helpCenter.helpCenter.heading}</HelpcenterHeading>
              <SearchBarContainer >
              <SearchIconContainer>
                <SearchLogo/>
              </SearchIconContainer>
                <HelpQuerySearch/>
            </SearchBarContainer>
          </HeaderWrapper>
      </Container>
      </HeaderComponent>        
    )
  }
}

Header.contextType = HelpCenterData;
export default Object.assign(withRouter(Header), { contextType: undefined });




