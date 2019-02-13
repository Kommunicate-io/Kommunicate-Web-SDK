import React, { Component } from 'react';
import {HeaderComponent, HeaderTopbar, TopbarLogoContainer, TopbarLogo, HelpcenterHeading, SearchBarContainer, HeaderWrapper, SearchIconContainer} from './HeaderComponents';
import { Container } from '../Container/Container';
import  Button  from '../Button/Button';
import HelpQuerySearch from './HeaderSearch'
import { SearchLogo } from '../../assets/svg/svgAssets';
import { withRouter } from 'react-router-dom';
import { CommonUtils } from '../../utils/CommonUtils'



class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      appId: '',
      searchQuery: '',
      faqList: '',
      searchedFaqList: '',
      isDropDownOpen: true,
      value: ''
    };
  }

  navigateHome = () =>{
    let appId = CommonUtils.getUrlParameter(window.location.search,"appId"); 
    let searchQuery = '?appId=' + appId;
    this.props.history.push({
      pathname: '/',
      search: searchQuery,
    });
  }
  
  render(){
    return(
      <HeaderComponent >
        <Container>
          <HeaderWrapper >
            <HeaderTopbar>
              <TopbarLogoContainer>
                <TopbarLogo onClick={this.navigateHome} ><img src={this.props.logoUrl} alt=""/></TopbarLogo>
              </TopbarLogoContainer>
                {/* <Button>{props.contactSupportButtonText}</Button> */}
              </HeaderTopbar >
                <HelpcenterHeading headingVisible={!location.pathname.includes('article')}>{this.props.HelpcenterHeadingText}</HelpcenterHeading>
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

Header.defaultProps = {
  logoUrl : "/src/assets/svg/kommunicateLogoWhite.svg",
  contactSupportButtonText: "Contact Support",
  HelpcenterHeadingText:"Hi. How can we help?"
}

export default withRouter(Header);


