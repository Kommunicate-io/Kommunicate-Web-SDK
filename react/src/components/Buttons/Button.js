import styled, { css } from "styled-components";
import theme from "styled-theming";
import PropTypes from 'prop-types';


const buttonCssResets = css`
    border: none;
    margin: 0;
    padding: 0;
    width: auto;
    overflow: visible;

    background: transparent;

    /* inherit font & color from ancestor */
    /* color: inherit; */
    /* font: inherit; */

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

const buttonNecessaryCss = css`
    height: 36px;
    border-radius: 3px;
    padding: 0px 16px;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    min-width: 70px;
    transition: all 0.3s ease-out;
`;

const buttonHoverState = css`
    background-color: #3c3b7b;
    color: #FFFFFF;
`;
const buttonFocusState = css`
    outline: none;
`;

const Button = styled.button`
    ${buttonCssResets}
    ${buttonNecessaryCss}
    color: ${props => props.primary ? props.theme.textOnPrimaryColor : props.theme.textOnSecondaryColor};
    background-color: ${props => props.primary ? props.theme.primary : props.theme.secondary};

    &:hover {
        ${buttonHoverState}
    }

    &:focus {
        ${buttonFocusState}
    }
`;

// Button.propTypes = {
//     variant: PropTypes.oneOf(["default", "primary", "success", "warning"])
// };

// Button.defaultProps = {
//     variant: "default",
// };

export default Button;