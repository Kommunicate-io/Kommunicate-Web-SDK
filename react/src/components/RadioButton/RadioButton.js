import React, { Component, PropTypes } from 'react';
import styled, { css, withTheme } from 'styled-components';
// import './RadioButton.css';

const RadioButtonLabel = styled.label`
    display: block;
    position: relative;
    margin-bottom: 12px;
    cursor: pointer;
    user-select: none;
`;
const RadioButtonInput = styled.input`
    position: absolute;
    opacity: 0;
    cursor: pointer;
`;
const RadioButtonWrapper = styled.div`
    display: flex;
`;
const RadioButtonChecker = styled.div`
    border: 2px solid #b3b3b3;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 9px;
    top: 10px;
    height: 17px;
    width: 17px;
    background-color: #eee;
    border-radius: 50%;

    &::after {
        content: "";
        position: absolute;
        display: none;
        top: 3px;
        left: 3px;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: ${props => props.theme.primary};
    }
`;

const RadioButtonContainer = styled.div`
    ${RadioButtonInput}:checked ~ ${RadioButtonWrapper} ${RadioButtonChecker} { 
        background-color: white;
        border: 2px solid ${props => props.theme.primary};
    }
    ${RadioButtonInput}:checked ~ ${RadioButtonWrapper} ${RadioButtonChecker}::after { 
        display: block;
    }
`;

class RadioButton extends Component {

    static defaultProps = {
        checked: false,
        disabled: false,
    };
    render() {

        const { disabled, label, dataValue, idRadioButton, cssClass, checked, handleOnChange } = this.props;
        const currentpath = window.location.pathname;

        return (
            <RadioButtonContainer className={cssClass + " radiobutton"}>
                <RadioButtonLabel className="radio-button-container" htmlFor={idRadioButton} >
                    <RadioButtonInput id={idRadioButton} type='radio' value={label} data-value={dataValue} checked={checked} disabled={disabled} onChange={handleOnChange} />
                    <RadioButtonWrapper className="radio-wrapper">
                        <RadioButtonChecker className="checkmark" style={(currentpath.includes('billing')) ? {top: '10px'} : {top:'12px'}}></RadioButtonChecker>
                        {label}
                    </RadioButtonWrapper>
                    
                </RadioButtonLabel>
            </RadioButtonContainer>
        );
    }
}

// RadioButton.propTypes = {
//     checked: React.PropTypes.boolean,
//     disabled: React.PropTypes.boolean,
//     label: React.PropTypes.isRequired,
//     handleOnChange: React.PropTypes.func.isRequired,

// };

export default withTheme(RadioButton);