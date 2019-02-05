

import styled  from 'styled-components'

const BlockButtonContainer =  styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 998px;
    padding: 15px 20px 15px 0px;
    transition: all .3s;
    cursor: pointer;
    
    &:hover{
        background-color: #f0efff;
        padding: 15px 10px 15px 10px;
    }
`
const BlockButtonTextWrapper =  styled.div`
    & > h2 {
        font-size: 18px;
        color: #242424;
        font-weight: 400;
    }
    & > p {
        font-size: 16px;
        color: #adabab;
        margin-bottom: 0px;
    } 
` 
const BlockButtonArrowWrapper =styled.div`

`

export {
    BlockButtonContainer,
    BlockButtonTextWrapper,
    BlockButtonArrowWrapper
}