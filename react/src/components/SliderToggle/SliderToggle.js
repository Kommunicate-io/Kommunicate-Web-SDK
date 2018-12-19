import React, { Component } from 'react';
import PropTypes from 'prop-types'

class SliderToggle extends Component {
  static defaultProps = {
    checked: false,
    disabled: false,
  };

  render() {
	const { disabled } = this.props;
	const { handleOnChange } = this.props;
    const { checked } = this.props;

    return (
      <div className="slider-toggle">
		<label className="switch switch-3d switch-enable-automatic">
            <input type="checkbox" className="switch-input" onChange={handleOnChange} checked={checked} disabled = {disabled}/>
            <span className="switch-label"></span>
            <span className="switch-handle"></span>
    </label>
      </div>
    );
  }
}

SliderToggle.propTypes = {
	checked: PropTypes.bool,
    disabled: PropTypes.bool,
    handleOnChange: PropTypes.func.isRequired,
};

export default SliderToggle;