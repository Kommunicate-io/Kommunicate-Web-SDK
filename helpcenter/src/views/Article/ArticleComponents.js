import styled, { css } from 'styled-components';

export const ArticleWrapper = styled.div`
    width: 100%;
    max-width: 992px;
    background: #fff;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
    margin: 22px auto;
    padding: 40px 60px;

    &>svg{
        position: absolute;
        top: -5px;
        right: 42px;
    }
` 

export const ArticleHeading = styled.h1`
    font-size: ${props=> props.theme.articleHeadingFontSize};
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: 0.8px;
    color: #4a4a4a;
    padding: 0 14px;
`

export const ArticleContent = styled.div`
    margin-top: 20px;
`