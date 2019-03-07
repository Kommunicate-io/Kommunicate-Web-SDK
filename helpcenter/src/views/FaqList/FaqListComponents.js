import styled, { css } from 'styled-components';
import { StyleUtils } from '../../utils/StyleUtils'
 
export const FaqListItem = styled.div`
    max-width: 992px;
    width: 100%;
    border-radius: ${props => props.theme.borderRadius};
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.3);
    background-color: ${props => props.theme.faqListBoxBg};
    padding: 30px 50px;
    margin: 20px auto;
    cursor: pointer;
    transition: all .25s;

    &:hover{
        box-shadow: 0 2px 14px 0 rgba(0,0,0,0.4);
    }

    ${StyleUtils.mediaQuery.tablet`
        padding:25px;
    `}
`

export const FaqListTitle = styled.h2`
    white-space: pre-line;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 6px 0;
    font-size: ${props => props.theme.faqListTitleFontSize};
    color: #4a4a4a;
    ${StyleUtils.mediaQuery.tablet`
        font-size: 16px;
    `}
`
export const FaqListContent = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 6px 0;
    font-size: ${props => props.theme.faqListContentFontSize};
    color: #858585;
    ${StyleUtils.mediaQuery.tablet`
        font-size: 14px;
    `}
`

export const TotalSearchedItems = styled.div`
    max-width: 992px;
    padding: 30px 0 8px;
    font-size: 18px;
    margin: 0 auto;
    color: #9b9b9b;
    font-weight: 600;

    & span{
        color: #5b5b5b;
    }
`

export const NoResultsFoundWrapper = styled.div `
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;

    & *{
        margin: 10px 0 0;
    }

    & svg{
        margin-top: 80px;
    }

    & span:not(:last-child){
        font-weight: 700;
        font-size: 24px;
        color: #4d4d4d;
    }
    
    & span:last-child{
        color: #7f7f7f;
        font-size: 20px;
    }
`