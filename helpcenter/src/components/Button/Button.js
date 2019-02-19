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
const brandedButton = (prop) => {
    if (prop.branded) {
        return css `
        border-color:${props=> props.theme.primaryColor};
        background-color:${props=> props.theme.primaryColor};
        border-width: 2px;
        font-weight: ${props=> props.theme.fontBold};
        color:#fff;
        letter-spacing: .8px;
        font-size: 18px;
        box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.3);
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
    padding: 11px 25px;
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
  ${brandedButton}
`
export default Button;