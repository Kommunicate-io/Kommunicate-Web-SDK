import styled, { css } from 'styled-components';

const buttonCssResets = css `
    border: none;
    margin: 0;
    padding: 0;
    width: auto;
    overflow: visible;
    background: transparent;
    /* Normalize 'line-height'. Cannot be changed from 'normal' in Firefox 4+. */
    line-height: normal;
    /* Corrects font smoothing for webkit */
    -webkit-font-smoothing: inherit;
    -moz-osx-font-smoothing: inherit;
    /* Corrects inability to style clickable 'input' types in iOS */
    -webkit-appearance: none;
    /* Remove excess padding and border in Firefox 4+ */
    &::-moz-focus-inner {
        border: 0;
        padding: 0;
    }
`;

const buttonDisabledState = (prop) => {
    if (prop.disabled) {
        return css `
        &:hover{
            &:after {
            left: -100%;
            transition: all 550ms cubic-bezier(0.19, 1, 0.22, 1);
            }
        }
        opacity: 0.5;
        cursor: default;
    `;
    }

}
const buttonHoverState = (prop) => {
    return css `
    &:after {
        left: 120%;
        transition: all 550ms cubic-bezier(0.19, 1, 0.22, 1);
    }
`;
}


const Button = styled.button `
    ${buttonCssResets} /* To Remove all default css from the button */
    outline: none;
    font-size: ${props => props.theme.buttonFontSize};
    background: none;
    outline: none;
    border: none;
    border-radius: ${props => props.theme.borderRadius};
    box-shadow: none;
    color: ${props => props.theme.buttonTextColor};
    border: 1px solid;
    overflow: hidden;
    position: relative;
    padding: 10px 20px;
    cursor: pointer;

  &:after {
    background: #fff;
    content: "";
    height: 155px;
    left: -75px;
    opacity: .2;
    position: absolute;
    top: -50px;
    transform: rotate(35deg);
    transition: all 550ms cubic-bezier(0.19, 1, 0.22, 1);
    width: 50px;
  }

  &:hover {
    ${buttonHoverState}
  }

  &:disabled{
    ${buttonDisabledState} 
  }
`
export default Button;