import React, { Component, PropTypes } from 'react';

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
            <input type="checkbox" className="switch-input" onChange={handleOnChange} checked={checked}/>
            <span className="switch-label"></span>
            <span className="switch-handle"></span>
    </label>
      </div>
    );
  }
}

SliderToggle.propTypes = {
	checked: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    handleOnChange: React.PropTypes.func.isRequired,
};

export default SliderToggle;