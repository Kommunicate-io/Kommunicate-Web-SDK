import styled, { css } from 'styled-components';

export const BreadCrumbWrapper = styled.div`
    display: flex;
    align-items: center;
    color: ${props => props.theme.breadCrumbTextColor};
    margin: -10px 0 20px;
    width: 90%;
    flex-wrap: wrap;
`

export const BreadCrumbItem = styled.span`
   cursor: pointer;
    margin: 20px 0;
    white-space: pre-wrap;
    margin: 2px 0;
    display: inline-block;

    &:hover{
        text-decoration: underline;
    }
`

export const BreadCrumbArrow = styled.span`
    padding: 0 5px;
`
