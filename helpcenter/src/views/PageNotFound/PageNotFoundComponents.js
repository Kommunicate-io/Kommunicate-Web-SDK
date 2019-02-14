import styled, { css } from 'styled-components';

const CloudsWrapper = styled.div`
    background: #F0F7FF;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    height: 50vh;
	padding-top: 50px;
	position: fixed;
	z-index: -1;
`;

const CloudAnimWrapper = styled.div``

const Cloud = styled.div`
    background: ${props=> props.theme.headerBackground};
	border-radius: 100px;
    box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1);
	height: 90px;
	position: relative;
    width: 350px;
    
    &:after, &:before {
        background: ${props=> props.theme.headerBackground};
        content: '';
        position: absolute;
        z-indeX: -1;
    }

    &:after {
        border-radius: 100px;
        height: 100px;
        left: 50px;
        top: -50px;
        width: 100px;
    }

    &:before {
        border-radius: 200px;
        width: 180px;
        height: 180px;
        right: 50px;
        top: -90px;
    }
`

export {
    CloudsWrapper,
    CloudAnimWrapper,
    Cloud
}
