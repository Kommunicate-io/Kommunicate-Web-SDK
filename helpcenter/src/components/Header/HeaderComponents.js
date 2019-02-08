import React, { Component } from 'react';
import styled, { css } from 'styled-components';

export const HeaderComponent = styled.div `
    max-width: 100%;
    padding-bottom: 20px;
    background-image: url("/src/assets/svg/helpCenterBackgroundGraphic.svg");
    background-size: cover;
    padding-top: 20px;
    background-color: ${props => props.theme.kommunicatePrimary};
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
    justify-content: space-between;
    width: 100%;
`

export const TopbarLogoContainer = styled.div `
    width: 210px;
    height: auto;
    padding-right: 10px;
    position: relative;
    &:after{
        content: "Help Center";
        position: absolute;
        top: 50%;
        width: 100px;
        right: -50%;
        color: #fff;
        transform: translate(0% , -62%);
        font-size: 18px;
    }
`

export const HelpcenterHeading = styled.h1 `
    height: ${props => props.headingVisible ? '80px' :  '0px'};
    margin-top: ${props => props.headingVisible ? '50px' :  '0'};
    font-size: ${props => props.theme.helpcenterHeadingFontSize};
    font-weight: 700;
    transition: all .3s ease-in-out;
    text-align: center;
    color: ${props => props.theme.helpcenterHeadingFontColor};
    overflow: hidden;
`

export const TopbarLogo = styled.a `
    width: 100%;
    height: 100%;
    display: inline-block;
    cursor: pointer;
    &:after{
        content: "|";
        position: absolute;
        top: 50%;
        width: 100px;
        right: -43%;
        font-weight: 300;
        color: #fff;
        transform: translate(0% , -62%);
        font-size: 30px;
    }
`

export const SearchBarContainer = styled.div`
    max-width: 992px;
    margin: 0 auto;
    width: 100%;
`

