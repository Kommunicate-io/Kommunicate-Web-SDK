import styled, { css } from 'styled-components';

const CloudsWrapper = styled.div`
    background: linear-gradient(to bottom, #d1eeff 0%,#ffefd3 100%); 
    left: 0;
    right: 0;
    top: 0;
    height: 100vh;
	padding-top: 50px;
	position: fixed;
    z-index: -1;
    overflow: hidden;
`;

const CloudAnimWrapper = styled.div``

const Cloud = styled.div`
    background: #fff;
	border-radius: 100px;
    box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1);
	height: 90px;
	position: relative;
    width: 350px;
    backface-visibility: visible;
    
    &:after, &:before {
        background: #fff;
        content: '';
        position: absolute;
        z-index: -1;
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

const Waves = styled.div`
    width: 100%;
    height: 50vh;
    min-height: 10em;
    position: fixed;
    bottom: 0;
    transform: rotate(180deg);
    @media (max-width:600px) {
        height: 60vh;
    }
    
`

const Wave = styled.div `
    width: calc(100% + 4em);
    height: 100%;
    position: absolute;
    left: -2em;
    background: bottom center repeat-x;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
` 
const PageNotFoundHeading = styled.h1`
    font-size: 52px;
    font-weight: 900;
    letter-spacing: 2.3px;
    text-align: center;
    color: #4a4a4a;
    margin-top: 15%;
    
    @media (max-width:1366px) {
        margin-top: 10%;
    }
`

const ErrorBlockContainer = styled.div`
    height: 166.9px;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    margin-top: 20%;
    z-index: 3;
    position: absolute;
    bottom: -26%;
    left: 50%;
    transform: translate(-50%,-50%) rotate(180deg);
`
const ErrorBlock = styled.div`
    padding: 0 20px;
    & svg{
        height: 206.9px;
        @media (max-width:600px) {
            width: 90px;
        }
    }
`
const FooterContainer = styled.div`
    position: absolute;
    bottom: 4%;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    overflow: hidden;
    
    &>div:not(:last-child){
        margin: 20px 0;
    }
    &>div:last-child{
        margin: -15px 0;
    }
    @media (max-width:1440px) {
        bottom: 1%;
    }
`

const PageNotFoundMessage = styled.h2`
    font-size: 28px;
    font-weight: 400;
    letter-spacing: 1.2px;
    text-align: center;
    color: #4a4a4a;

    @media (max-width:600px) {
        font-size: 18px;
        padding: 0 10px;
    }
`

const PageNotFoundWrapper = styled.div`
    overflow: hidden;
`

const PageNotFoundCtaContainer = styled.div``

const PoweredByContainer = styled.div``

export {
    CloudsWrapper,
    CloudAnimWrapper,
    Cloud,
    Waves,
    Wave,
    PageNotFoundHeading,
    ErrorBlockContainer,
    ErrorBlock,
    PageNotFoundMessage,
    PageNotFoundCtaContainer,
    FooterContainer,
    PoweredByContainer,
    PageNotFoundWrapper
}
