import React, { Component } from 'react';
import {HeaderComponent, HeaderTopbar, TopbarLogoContainer, TopbarLogo, HelpcenterHeading, SearchBarContainer, HeaderWrapper, SearchIconContainer, BackButtonContainer} from './HeaderComponents';
import { Container } from '../Container/Container';
import  Button  from '../Button/Button';
import HelpQuerySearch from './HeaderSearch'
import { SearchLogo, BackButton } from '../../assets/svgAssets';
import { withRouter } from 'react-router-dom';
import { CommonUtils } from '../../utils/CommonUtils'



class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      searchQuery: '',
      faqList: '',
      searchedFaqList: '',
      isDropDownOpen: true,
      value: '',
      settings : {}
    };
  }

  navigateHome = () =>{
    let appId = CommonUtils.getUrlParameter(window.location.search,"appId"); 
    this.props.history.push({
      pathname: '/'
    });
  }

  navigateBack = () =>{
    window.history.length > 1 && history.back()
  }

  componentDidMount = () => {
    this.setState({
      settings: CommonUtils.getItemFromLocalStorage(CommonUtils.getHostNameFromUrl()),
    });
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
                <TopbarLogo ><img src={this.state.settings.logo} alt=""/></TopbarLogo>
              </TopbarLogoContainer>
                {/* <Button>{props.contactSupportButtonText}</Button> */}
              </HeaderTopbar >
                <HelpcenterHeading headingVisible={window.location.pathname === "/" && !CommonUtils.getUrlParameter(window.location.search,"q")}>{this.state.settings.heading}</HelpcenterHeading>
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

export default withRouter(Header);


