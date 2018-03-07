import React, { Component, PropTypes } from 'react';
import './RadioButton.css';

class RadioButton extends Component {

    static defaultProps = {
        checked: false,
        disabled: false,
    };
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         checked: props.checked,
    //     };
    // };

    // _handleChange = () => {
    //     this.setState({
    //         checked: !this.state.checked,
    //     });
    // };

    render() {

        const { disabled } = this.props;
        const { label } = this.props;
        const { idRadioButton } = this.props;
        const { checked } = this.props;
        const { handleOnChange } = this.props;

        return (
            <div className="radiobutton">
                <label className="radio-button-container" htmlFor={idRadioButton} >
                    <input id={idRadioButton} type='radio' value={label} checked={checked} disabled={disabled} onChange={handleOnChange} />
                    <span className="checkmark"></span>
                    {label}
                </label>
            </div>
        );
    }
}

RadioButton.propTypes = {
    checked: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    idCheckbox: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    handleOnChange: React.PropTypes.func.isRequired,

};

export default RadioButton;