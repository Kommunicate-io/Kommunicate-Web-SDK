import styled, { css } from 'styled-components';

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
`

export const FaqListTitle = styled.h2`
    white-space: pre;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 6px 0;
    font-size: ${props => props.theme.faqListTitleFontSize};
    color: #4a4a4a;
`
export const FaqListContent = styled.div`
    white-space: pre;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 6px 0;
    font-size: ${props => props.theme.faqListContentFontSize};
    color: #858585;
`