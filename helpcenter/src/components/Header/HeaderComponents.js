import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { StyleUtils } from '../../utils/StyleUtils';

export const HeaderComponent = styled.div `
    max-width: 100%;
    padding-bottom: 50px;
    background-image:  url("./assets/svg/helpCenterBackgroundGraphic.svg"), linear-gradient(51deg, ${props=> props.theme.gradientColor}, ${props=> props.theme.primaryColor});
    background-size: cover;
    padding-top: 20px;
    box-shadow: ${props => props.theme.boxShadowHeader};
    transition: all .3s;

`
export const HeaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    transition: all 3s;
    min-height: 100px;
    backface-visibility: hidden;
`

export const HeaderTopbar = styled.div `
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
`

export const TopbarLogoContainer = styled.div `
    width: 210px;
    height: auto;
    padding-right: 10px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-around;
    cursor: pointer;
    &:after{
        content: "Helpcenter";
        position: absolute;
        top: 50%;
        width: 120px;
        right: -50%;
        color: ${props => props.theme.helpcenterHeadingFontColor};
        transform: translate(0% , -62%);
        font-size: 18px;
    }
    ${StyleUtils.mediaQuery.phone`
            &:after{
               display: none;
            }
    `}
`

export const HelpcenterHeading = styled.h1 `
    height: ${props => props.headingVisible ? '80px' :  '0px'};
    margin-top: ${props => props.headingVisible ? '10px' :  '0'};
    margin-bottom: ${props => props.headingVisible ? '-20px' :  '0'};
    font-size: ${props => props.theme.helpcenterHeadingFontSize};
    font-weight: 700;
    transition: all .3s ease-in-out;
    text-align: center;
    color: ${props => props.theme.helpcenterHeadingFontColor};
    overflow: hidden;

    ${StyleUtils.mediaQuery.tablet`
        font-size: ${props => props.theme.helpcenterHeadingFontSizeTablet};    
    `}
    ${StyleUtils.mediaQuery.phone`
        font-size: ${props => props.theme.helpcenterHeadingFontSizeMobile};    
    `}
`

export const TopbarLogo = styled.span `
    width: 100%;
    height: 100%;
    display: inline-block;
    cursor: pointer;
    &:after{
        content: "|";
        position: absolute;
        top: 50%;
        width: 130px;
        right: -43%;
        font-weight: 300;
        color: ${props => props.theme.helpcenterHeadingFontColor};
        transform: translate(0% , -62%);
        font-size: 30px;
    }
    ${StyleUtils.mediaQuery.phone`
            &:after{
               display: none;
            }
    `}

    & img {
        width: 150px;
        height: 75px;
    }
`

export const SearchBarContainer = styled.div`
    max-width: 992px;
    margin: 0 auto;
    width: 100%;
    opacity: .98;
    box-shadow: 3px 11px 25px 0 rgba(0, 0, 0, 0.3);
    margin-top: 50px;
    position: relative;
`
export const SearchIconContainer = styled.div`
    position: absolute;
    z-index: 100;
    left: 16px;
    top: 50%;
    transform: translateY(-45%);
    
    & svg{
        height: 20px;
        width: 22px;
    } 
`
export const BackButtonContainer = styled.span`
    margin-right: 20px;
    margin-top: -5px;
    padding-left: 10px;
    display: none;
    cursor: pointer;
    ${StyleUtils.mediaQuery.phone`
            display: inline;
    `}
`

export const ClearButtonWrapper = styled.div`
    transition: all .3s;
    cursor: pointer;
    position: absolute;
    background: #fff;
    right: 0;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    border-radius: 5px;
    max-height: 57px;
    &:hover{
        background: #eee;
    }
    &:active, &:focus{
        background: #ddd;
    }
`

export const MenuWrapper = styled.div`
`

export const SeeAllButton = styled.div`
    background: #fff;
    padding: 15px;
    text-align: center;
    font-size: 18px;
    color: #9b9b9b;
    cursor: pointer;
`
export const SearchBox = styled.input.attrs(() => ({ type: "text" }))`
    width: calc(100% - 85px);
    background: #fff;
    outline: none;
    border: none;
    font-size: 18px;
    padding: 18px 10px 18px 45px;
    &::-ms-clear {
    display: none;
}

`
export const SearchBoxWrapper = styled.div`
    width: 100%;
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
`

export const SearchResultsWrapper = styled.div`
    width: 100%;
    background: #fff;
    border-radius: 4px;
    box-shadow: 3px 11px 25px 0 rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 115%;
    overflow: hidden;
`
export const SearchResults = styled.div`
    padding: 15px 30px;
    border-bottom: 1px solid #ddd;
    font-size: 18px;
    cursor: pointer;
`

export const NoResultFoundMenuButton = styled.div`
    background: #fff;
    padding: 20px;
    text-align: center;
    font-size: 18px;
    color: #9b9b9b;
`

export const SearchBarLoaderWrapper = styled.div `
    position: absolute;
    width: 45px;
    right: 46px;
    top: 50%;
    transform: translateY(-50%);
`
export const SearchBarLoader = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: searchbarLoading .4s linear infinite alternate;
    position: relative;
    left: 6px;
`
