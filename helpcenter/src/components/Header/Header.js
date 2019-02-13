import React, { Component } from 'react';
import {HeaderComponent, HeaderTopbar, TopbarLogoContainer, TopbarLogo, HelpcenterHeading, SearchBarContainer, HeaderWrapper, SearchIconContainer} from './HeaderComponents';
import { Container } from '../Container/Container';
import  Button  from '../Button/Button';
import HelpQuerySearch from './HeaderSearch'
import { SearchLogo } from '../../assets/svg/svgAssets'


export const Header =  (props)=>  (
      <HeaderComponent >
        <Container>
          <HeaderWrapper >
            <HeaderTopbar>
              <TopbarLogoContainer>
                  <TopbarLogo href="/" ><img src={props.logoUrl} alt=""/></TopbarLogo>
              </TopbarLogoContainer>
                <Button>{props.contactSupportButtonText}</Button>
            </HeaderTopbar >
                <HelpcenterHeading headingVisible={!location.pathname.includes('article')}>{props.HelpcenterHeadingText}</HelpcenterHeading>
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

Header.defaultProps = {
  logoUrl : "/src/assets/svg/kommunicateLogoWhite.svg",
  contactSupportButtonText: "Contact Support",
  HelpcenterHeadingText:"Hi. How can we help?"
}
