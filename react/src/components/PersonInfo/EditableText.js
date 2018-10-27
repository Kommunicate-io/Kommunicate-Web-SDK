import React, { Component } from "react";
import ApplozicClient from "../../utils/applozicClient";
import { SubmitSvg, CancelSvg } from '../../views/Faq/LizSVG';;

class EditableText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      isInEditMode: false
    };
    this.changeEditMode = this.changeEditMode.bind(this);
    this.updateComponentValue = this.updateComponentValue.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value != nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  changeEditMode = () => {
    this.setState({
      isInEditMode: !this.state.isInEditMode
    });
  };

  updateComponentValue = e => {
    this.setState({
      isInEditMode: false,
      value: e.target.value
    });
    var params = {
      ofUserId: this.props.keyname,
      userDetails: {}
    };
    params.userDetails[this.props.reference] = e.target.value;
    ApplozicClient.updateUserDetail(params);
  };

  renderEditView = () => {
    const style = {
      width: "60%",
      textAlign: "center"
    };
    return (
      <div className={this.props.style}>
        <input
          style={style}
          type="text"
          key={this.props.keyname}
          ref={this.props.reference}
          placeholder={this.state.value}
        />
        <button onClick={this.changeEditMode}>
          <CancelSvg />
        </button>
        <button onClick={this.updateComponentValue}>
          <SubmitSvg />
        </button>
      </div>
    );
  };

  renderDefaultView = () => {
    return (
      <div onClick={this.changeEditMode}>
        <p id ={this.props.style} className={this.props.style}>{this.state.value}</p>
      </div>
    );
  };

  render() {
    return this.state.isInEditMode
      ? this.renderEditView()
      : this.renderDefaultView();
  }
}
export default EditableText;
