import React, { Component } from 'react';
import {HeaderWrapper, HeaderTopbar, TopbarLogoContainer, TopbarLogo} from './HeaderComponents';
import { Container } from '../Container/Container'

export const Header =  (props)=>  (
      <HeaderWrapper>
        <Container>
          <HeaderTopbar>
            <TopbarLogoContainer>
              <TopbarLogo><img src={props.logoUrl} alt=""/></TopbarLogo>
            </TopbarLogoContainer>
          </HeaderTopbar>
        </Container>
      </HeaderWrapper>        
    )

Header.defaultProps = {
  logoUrl : "/src/assets/svg/kommunicateLogoWhite.svg"
}
