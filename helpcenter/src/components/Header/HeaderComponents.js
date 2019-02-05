import React, { Component } from 'react';
import styled, { css } from 'styled-components';

export const HeaderWrapper = styled.div `
  width:100vw;
  height: 250px;
  background-image: url("src/assets/svg/helpCenterBackgroundGraphic.svg");
  background-size: cover;
  padding: 20px;
  background-color: ${props => props.theme.kommunicatePrimary};
  box-shadow: ${props => props.theme.boxShadowHeader};
`

export const HeaderTopbar = styled.div `
    overflow: hidden;
`

export const TopbarLogoContainer = styled.div `
    width: 210px;
    height: auto;
    border-right: 1px solid #fff;
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

export const TopbarLogo = styled.a `
    width: 100%;
    height: 100%;
    display: inline-block;
`