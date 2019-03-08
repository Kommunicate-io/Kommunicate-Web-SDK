import * as React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styled, { withTheme } from 'styled-components';


/**
 * Props for MultiToggleSwitch are as follows:
 * @param {Array} options   (Required) Ordered array of options to render. Explained further below.
 * @param {Any} selectedOption   (Required) The selectedOption can be anything like string or number 
 * @param {Function} onSelectOption   (Optional) onChange function to handle change of selected option
 * @param {Any} label   (Optional) Label can be anything you want to render as a heading above the toggle switches. This can include html, react components, strings, numbers, etc.
 * @param {String} className   (Optional) Optional style class to apply to toggle component.
 */

/**
 * Possible values in options array for MultiToggleSwitch are as follows:
 * @param {Any} value   (Required) Value passed by prop onSelectOption.
 * @param {String or React Component} displayName   (Optional) Label rendered on toggle for each option. If omitted, value prop will be used.
 * @param {String} optionClass   (Optional) Class to apply to toggle when option is selected.
 * @param {Boolean} isDisabled   (Optional) Viewable but not selectable.
 */


const MultiToggleSwitch = ({
    selectedOption,
    options,
    onSelectOption,
    className,
    label
}) => {
    // If required variables aren't passed, return empty
    if (!options || selectedOption === null) return null;

    const numOptions = options.length;

    const columnWidth = numOptions ? 100 / numOptions : numOptions;

    const isSelectedOption = option => option.value == selectedOption;

    const getSelectedIndex = () => {
        const indexFound = options.findIndex(option => isSelectedOption(option));
        return indexFound > -1 ? indexFound : 0;
    };

    const createToggleOption = (...args) => {
        const { value, displayName, isDisabled } = args[0];

        const selectOption = () => onSelectOption(value);

        const optionClass = classNames("toggle-option", {
            selected: isSelectedOption(args[0]),
            optionDisabled: isDisabled
        });

        const optionStyle = {
            width: `${columnWidth}%`
        };

        return (
            <div
                key={args[1]}
                onClick={isDisabled ? null : selectOption}
                className={optionClass}
                style={optionStyle}
            >
                {displayName || value}
            </div>
        );
    };

    const toggleClass = classNames("toggle-container");
    const toggleStyle = {
        width: `${columnWidth}%`,
        transform: `translateX(${100 * getSelectedIndex()}%)`,
        WebkitTransform: `translateX(${100 * getSelectedIndex()}%)`,
        MozTransform: `translateX(${100 * getSelectedIndex()}%)`,
        msTransform: `translateX(${100 * getSelectedIndex()}%)`
    };

    const selectedToggleClass = classNames(
        "toggle-background",
        options[getSelectedIndex()].optionClass
    );

    const renderLabel = label ? <label>{label}</label> : null;

    return (
        <ToggleWrapper className={className}>
            {renderLabel}
            <div className={toggleClass}>
                {options.map(createToggleOption)}
                <div className={selectedToggleClass} style={toggleStyle} />
            </div>
        </ToggleWrapper>
    );
};

MultiToggleSwitch.propTypes = {
    className: PropTypes.any,
    options: PropTypes.array.isRequired,
    selectedOption: PropTypes.any.isRequired,
    onSelectOption: PropTypes.func,
    label: PropTypes.any
};


const ToggleWrapper = styled.div`
    margin: 0.5em auto;

    & label {
        padding: 0.3em;
        font-size: 17px;
        display: block;
        text-align: center;
    }
    & .toggle-container {
        width: 100%;
        position: relative;
        background: #ffffff;
        border: 1px solid #eeeeee;
        border-radius: 30px;
    }
    & .toggle-container .toggle-option {
        display: inline-block;
        position: relative;
        z-index: 1;
        text-align: center;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
        transition: all 0.5s ease-in-out;
        color: #807b77;
        font-size: 16px;
    }
    & .toggle-container .toggle-option.selected {
        color: #ffffff;
        cursor: initial;
    }
    & .toggle-container .toggle-background {
        position: absolute;
        height: 100%;
        bottom: 0;
        left: 0;
        transition: all 0.4s ease-in-out;
        background: ${props => props.theme.primary};
        border-radius: 30px;
    }
    & .option-disabled {
        background: #e6e6e6;
        cursor: no-drop !important;
    }
`;


export default withTheme(MultiToggleSwitch);