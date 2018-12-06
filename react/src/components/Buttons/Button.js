import styled, { css } from "styled-components";
import Colors from '../../assets/theme/colors';

const buttonCssResets = css`
    border: none;
    margin: 0;
    padding: 0;
    width: auto;
    overflow: visible;
    background: transparent;
    /* inherit font & color from ancestor */
    color: inherit;
    font: inherit;
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
    height: 40px;
    border-radius: 3px;
    padding: 0px 16px;
    font-weight: 400;
    text-align: center;
    min-width: 70px;
    transition: all 0.3s ease-out;
`;

const buttonHoverState = (prop) => {
    /* Default is Primary */
    if(prop.link) {
        return css`
            background-color: transparent;
            border: none;
            text-decoration: underline;
            color: ${props => props.theme.primary};
            box-shadow: none;
        `;
    } else if(prop.secondary) {
        return css`
            background-color: ${props => props.theme.buttons.secondaryBG};
            color: ${props => props.theme.buttons.secondaryText};
            box-shadow: 0 2px 5px 0 ${props => props.theme.buttons.shadow};
        `;
    } else if(prop.danger) {
        return css`
            background-color: ${props => props.theme.buttons.dangerBG};
            color: ${props => props.theme.buttons.primaryText};
            box-shadow: 0 2px 5px 0 ${props => props.theme.buttons.shadow};
        `;        
    } else {
        return css`
            background-color: ${props => props.theme.buttons.primaryBG};
            color: ${props => props.theme.buttons.primaryText};
            box-shadow: 0 2px 5px 0 ${props => props.theme.buttons.shadow};
        `;
    }
} 
const buttonFocusState = css`
    outline: none;
`;

const buttonDisabledState = (prop) => {
    if(prop.secondary && prop.disabled) {
        return css`
            background-color: ${Colors.CommonColors.White};
            color: ${props => props.theme.buttons.disabledText};
            border: 1px solid ${props => props.theme.buttons.disabledBG};
            cursor: default;
            &:hover {
                box-shadow: none;
            }
        `;
    } else if(prop.disabled) {
        return css`
            background-color: ${props => props.theme.buttons.disabledBG};
            color: ${Colors.CommonColors.White};
            cursor: default;
            &:hover {
                box-shadow: none;
            }
        `;
    }
}

const buttonTextColor = (prop) => {
    /* Default is Primary*/
    if(prop.link) {
        return css`
            color: ${props => props.theme.primary};
        `;
    }
    if (prop.secondary) {
        return css`
            color: ${props => props.theme.buttons.secondaryText};
        `;
    } else if (prop.danger) {
        return css`
            color: ${props => props.theme.buttons.primaryText};
        `;
    } else {
        return css`
            color: ${props => props.theme.buttons.primaryText};
        `;
    }
}

const buttonBackgroundColor = (prop) => {
    /* Default is Primary*/
    if(prop.link) {
        return css`
            background-color: transparent;
            border: none;
        `;
    } else if (prop.secondary) {
        return css`
            background-color: ${props => props.theme.buttons.secondaryBG};
            border: 1px solid ${props => props.theme.buttons.primaryBG};
        `;
    } else if (prop.danger) {
        return css`
            background-color: ${props => props.theme.buttons.dangerBG};
        `;
    } else {
        return css`
            background-color: ${props => props.theme.buttons.primaryBG};
        `;
    }
}

const largeButton = (prop) => {
    if(prop.large) {
        return css`
            width: 100%;
        `;
    } else {
        return css`
            width: auto;
        `;
    }
}

const buttonFont = (prop) => {
    if(prop.fontSize) {
        return css`
            font-size: ${prop.fontSize};
        `;
    } else {
        return css`
            font-size: 15px;
        `;
    }
}

const Button = styled.button`
    ${buttonCssResets} /* To Remove all default css from the button */
    ${buttonNecessaryCss}
    ${buttonTextColor}
    ${buttonBackgroundColor}
    ${largeButton}
    ${buttonFont}
    &:hover {
        ${buttonHoverState}
    }

    &:focus {
        ${buttonFocusState}
    }

    &:disabled {
        ${buttonDisabledState}
    }
`;

export default Button;