import React, { Component, PropTypes } from 'react';

class Checkbox extends Component {
//   state = {
//     isChecked: false,
//   }

//   toggleCheckboxChange = () => {
//     const { handleCheckboxChange, label } = this.props;

//     this.setState(({ isChecked }) => (
//       {
//         isChecked: !isChecked,
//       }
//     ));

//     handleCheckboxChange(label);
//   }


// static propTypes = {
//     checked: React.PropTypes.bool,
// 	disabled: React.PropTypes.bool,
// 	idCheckbox: React.PropTypes.string.isRequired,
// 	label: React.PropTypes.string.isRequired,
//   };
  static defaultProps = {
    checked: false,
    disabled: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      checked: props.checked,
    };
  };

  _handleChange = () => {
    this.setState({
      checked: !this.state.checked,
    });
  };

  render() {
    // const { label } = this.props;
    // const { idCheckbox } = this.props;
	// const { isChecked } = this.state;
	
	const { disabled } = this.props;
	const { label } = this.props;
	const { idCheckbox } = this.props;
    const { checked } = this.state;

    return (
      <div className="checkbox">
		<input id={idCheckbox} type='checkbox' className="checkbox-input" value={label} checked={checked} disabled={disabled} onChange={this._handleChange} />
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

//    label: PropTypes.string.isRequired,
//    idCheckbox: PropTypes.string.isRequired,
//   handleCheckboxChange: PropTypes.func.isRequired,
};

export default Checkbox;