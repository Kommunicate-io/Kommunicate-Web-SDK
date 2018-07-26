import React, { Component } from 'react';
import PropTypes from 'prop-types'

class Checkbox extends Component {
  static defaultProps = {
    checked: false,
    disabled: false,
  };

  render() {


    const { disabled } = this.props;
    const { label } = this.props;
    const { idCheckbox } = this.props;
    const { checked } = this.props;
    const { handleOnChange } = this.props;

    return (
      <div className="checkbox">
        <input id={idCheckbox} type='checkbox' className="checkbox-input" value={label} checked={checked} disabled={disabled} onChange={handleOnChange} />
        <label htmlFor={idCheckbox} className="checkbox-label">
          <span></span>
          {label}
          <ins><i>{label}</i></ins>
        </label>
      </div>
    );
  }
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  idCheckbox: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  handleOnChange: PropTypes.func.isRequired,
};

export default Checkbox;