import styled, { css } from 'styled-components';

export const PoweredBy = styled.div`
    margin: 30px auto;
    width: 100%;
    display: flex;
    align-items: center;
`

export const PoweredByLink = styled.a`
    display: flex;
    align-items: center;
    margin: 20px auto;
    width: auto;
    text-decoration: none;
    color: #cacaca;

    & > svg{
        margin-right: 8px;
    }

    &:hover{
        text-decoration: underline;
    }

`