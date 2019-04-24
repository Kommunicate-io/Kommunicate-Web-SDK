import styled from 'styled-components';

const Container = styled.div``;

const Wrapper = styled.div`
    position: absolute;
    top: -30px;
    right: 0px;

    &:hover {
        cursor: pointer;
    }
`;
const Header = styled.h3`
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 0.3px;
    color: #6c6a6a;
`;
const Hr = styled.hr`
    margin: 20px -20px;
`;
const Text = styled.span`
    text-transform: uppercase;
    color: #FFF;
    font-size: 12px;
`;
const IconWrapper = styled.span`
    & svg {
        vertical-align: middle;
        margin-top: -1px;
        color: #FFF;
        height: 17px;
    }
`;

module.exports = { 
    Container,
    Wrapper,
    Header,
    Text,
    IconWrapper,
    Hr
}