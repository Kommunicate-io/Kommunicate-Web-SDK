import styled, { css } from 'styled-components';

const flex = css`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;

const LabelContainer = styled.div`
    ${flex}    
    width: 100%;
    max-width: 150px;
    margin-right: 15px;
`;
const InputGroupContainer = styled.div`
    margin: 20px 0;
    ${flex}
`;
const Label = styled.label`
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.6px;
    color: #4a4a4a;
    margin: 0 5px 0 0;
`;  
const Input = styled.input`
    max-width: 450px;
    padding: 7px 10px 7px;
    min-width: 250px;
`;
const ButtonGroup = styled.div`
    margin-top: 50px;
    ${flex}
    justify-content: flex-end;

    & button:last-child {
        margin-left: 20px;
    }
`;
const P = styled.p`
    font-size: 14px;
    color: #393a39;
`;

export {
    LabelContainer,
    InputGroupContainer,
    Label,
    Input,
    ButtonGroup,
    P
}