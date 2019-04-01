import styled, { withTheme } from 'styled-components';

const Title = styled.div`
    & > .bot-integration-title {
            font-size: 22px;
            letter-spacing: 1.5px;
            color: #242424;
    }
    & > hr {
            margin-right: -2rem;
            margin-left: -2rem;
    }
    & .bot-integration-sub-title {
            font-size: 16px;
            letter-spacing: 0.6px;
            color: #4a4a4a;
    }
`;
const Instruction = styled.div`
    display: flex;
    margin-bottom:19px;
    
    & > .instruction-order-circle {
            width: 20px;
            height: 20px;
            border-radius: 11.5px;
            background-color: ${props => props.theme.primary};
            text-align: center;
            margin-right: 11px;
    }
    & .instruction-order {
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 0.2px;
            text-align: center;
            color: #ffffff;
    }
    & .instruction {
           
            font-size: 14px;
            line-height: normal;
            letter-spacing: 0.3px;
            color: #666464;
    }
    & .Linkify {
        max-width: 90%;
    }
    & .Linkify a {
        color: ${props => props.theme.primary};
    }
`;
const Footer = styled.div`
    text-align: right;
    margin-top: 40px;

    & > .bot-integration-cancel-button {
         margin-right: 16px;
    }
`;
const BotProfileContainer = styled.div`
    display: flex;
    margin-top: 43px;
    & > .bot-name-wrapper {
            margin-left: 43px;
            width:50%;
    }
    & > .bot-name-wrapper p {
            margin-bottom: 11px;
    }
    & > .bot-name-wrapper #input-bot-integration-name {
            width: 100%;
    }
    & > .km-edit-bot-image-wrapper {
            overflow: hidden;
            border-radius: 61%;
            position: relative;
            width: 105px;
            height: 105px;
            cursor: pointer;
            margin-left:20px
    }
    & > .bot-name-wrapper > input {
            height: 40px;
            padding: 16px;
    }
    & > .bot-name-wrapper > input::placeholder  {
            font-size: 14px;
            color: #cacaca;
    }
    & > .bot-name-wrapper > p {
            font-size: 17px;
            letter-spacing: 0.3px;
            color: #616366;
    }
    & .km-edit-bot-image-wrapper:hover .bot-image-update {
        opacity: 0.7;
      }
    & .bot-image-update {
        text-align: center;
        position: absolute;
        background: black;
        opacity: 0;
        z-index: 100;
        color: white;
        bottom: -2px;
        left: 50%;
        display: block;
        width: 100%;
        transform: translate(-50%);
        text-transform: capitalize;
        height: 31px;
        padding: 4px 0 0 0;
        font-size: 14px;
        transition: .3s;
        letter-spacing: 0.8px;
    }
    & .km-hide-input-element {
        opacity: 0.0;
        position: absolute;
        top:0;
        left: 0;
        bottom: 0;
        right:0;
        width:100%;
        height:100%;
        font-size: 0px;
        cursor: pointer;
    }   
`;
const BotIntegrationInputFieldsContainer = styled.div`
    & > .input-field-title {
        font-size: 17px;
        letter-spacing: 0.3px;
        color: #616366;
        margin-top: 18.5px;
    }
    & > #bot-integration-input-field-1 {
        width: 99%;
    }
    & > #bot-integration-input-field-2 , #bot-integration-input-field-3 {
        width: 40%;
    }
    & input {
        height: 40px;
        padding: 16px;
    }
    & input:focus {
        outline: none;
    }
    & input::placeholder  {
        font-size: 14px;
        color: #cacaca;
    }
    & label {
        font-size: 15px;
        letter-spacing: 0.3px;
        color: #616366;
        margin-right:6px;
    }
    & > .bot-integration-input-field-3-label {
        margin-left: 20px;
    }
`;
export {
    Title,
    Instruction,
    Footer,
    BotProfileContainer,
    BotIntegrationInputFieldsContainer
}