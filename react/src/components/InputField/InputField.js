import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Label, Input } from 'reactstrap';


const InputField = (props) => (
	<div className="km-input-label-group">
        <div className="input-label-div">
            <Input
                className="input"
                id={props.id}
                name={props.name}
                type={props.inputType}
                value={props.value}
                onChange={props.onChange}
                onKeyPress={props.onKeyPress}
                onBlur={props.onBlur}
                placeholder=" "
                required={props.required} />
            <Label className="label-for-input">{props.title}</Label>
        </div>
        <div className="input-error-div" hidden={props.hideErrorMessage}>
            <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" x="0px" y="0px" viewBox="0 0 16 16" width="16px" height="16px">
                <path fill="#ED1C24" id="Error-Icon" className="st0" d="M0,8c0-4.4,3.6-8,8-8c4.4,0,8,3.6,8,8s-3.6,8-8,8C3.6,16,0,12.4,0,8z M9.3,10.7  c0.4,0.4,1,0.4,1.4,0c0.4-0.4,0.4-1,0-1.4L9.4,8l1.3-1.3c0.4-0.4,0.4-1,0-1.4c-0.4-0.4-1-0.4-1.4,0L8,6.6L6.7,5.3  c-0.4-0.4-1-0.4-1.4,0c-0.4,0.4-0.4,1,0,1.4L6.6,8L5.3,9.3c-0.4,0.4-0.4,1,0,1.4c0.4,0.4,1,0.4,1.4,0L8,9.4L9.3,10.7z"/>
            </svg>
            <p className="input-error-message">{props.errorMessage}</p>
        </div>
	</div>
);

InputField.propTypes = {
    inputType: PropTypes.oneOf(['text', 'number', 'email', 'url', 'password']).isRequired,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	onKeyPress: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
	value: PropTypes.oneOfType([
		PropTypes.string,
        PropTypes.number,
	]).isRequired,
    placeholder: PropTypes.string,
    errorMessage: PropTypes.string.isRequired,
    hideErrorMessage: PropTypes.bool.isRequired,
};

export default InputField;