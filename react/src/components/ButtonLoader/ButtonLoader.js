import styled, { css, keyframes  } from "styled-components";

const ButtonLoading = keyframes`
     0%{
        background-color: rgba(220,220,220, 1);
        box-shadow: 17px 0px 0px 0px rgba(220,220,220,0.2), 
                    34px 0px 0px 0px rgba(220,220,220,0.2);
      }
    50%{ 
        background-color: rgba(220,220,220, 0.4);
        box-shadow: 17px 0px 0px 0px rgba(220,220,220,2), 
                    34px 0px 0px 0px rgba(220,220,220,0.2);
    }
    100%{ background-color: rgba(220,220,220, 0.4);
        box-shadow: 17px 0px 0px 0px rgba(220,220,220,0.2), 
                    34px 0px 0px 0px rgba(220,220,220,1);
      }
`
const ButtonLoader = styled.div`
   z-index: 131;
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: ${ButtonLoading} .8s linear infinite alternate;
    position: absolute;
    left: calc(50% - 26px);
    display: ${props => (props.isVisible ? 'block' : 'none')};
    transform: translate(50%,-50%);
    top: 50%;
`;

export default ButtonLoader;