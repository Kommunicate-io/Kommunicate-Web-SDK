import styled, { css } from 'styled-components';
import { StyleUtils } from '../../utils/StyleUtils'

export const ArticleWrapper = styled.div`
    width: 100%;
    max-width: 992px;
    background-color: #fff;
    /* background-image: url("./assets/svg/ArticlePageTag.svg"); */
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
    margin: 22px auto;
    padding: 40px 60px;
    background-repeat: no-repeat;
    background-position: 95% -2px;
    ${StyleUtils.mediaQuery.tablet`
        padding: 40px;
    `}
    ${StyleUtils.mediaQuery.phone`
        padding: 30px;
    `}
` 

export const ArticleHeading = styled.h1`
    font-size: ${props=> props.theme.articleHeadingFontSize};
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: 0.8px;
    color: #4a4a4a;
    line-height: 1.2;
    ${StyleUtils.mediaQuery.phone`
        font-size: 18px;
    `}
`

export const ArticleContent = styled.div`
    font-size: 16px;
    margin-top: 20px;
    color: #858585;
    
    ${StyleUtils.mediaQuery.phone`
        font-size: 12px;
    `}
`