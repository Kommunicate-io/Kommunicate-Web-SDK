import React, { Component, PropTypes } from 'react';

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
  checked: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  idCheckbox: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  handleOnChange: React.PropTypes.func.isRequired,
};

export default Checkbox;