import React, { Component } from "react";
import ApplozicClient from "../../utils/applozicClient";
import Notification from '../../views/model/Notification';
import { SubmitSvg, CancelSvg } from '../../views/Faq/LizSVG';;

class EditableText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldValue: this.props.value,
      isInEditMode: false
    };
    this.changeEditMode = this.changeEditMode.bind(this);
    this.onKeyPressHandler = this.onKeyPressHandler.bind(this);
    this.updateComponentValue = this.updateComponentValue.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value != nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  isValid(key, value){
    switch(key){
      case 'email':
        return this.isValidateEmail(value);
      case "phoneNumber":
        return this.isValidNo(value)
      default:
        return true;
    }
  }
  isValidNo(value){
    var phNoReg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if(phNoReg.test(value)){
      return true;
    }
    Notification.error("You have entered an invalid No!");
    return false;
  }

  isValidateEmail = (email) => {
    var mailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.length > 100 ) {
      Notification.error("Email length should be less than 100");
      return false;
    }
    if(!mailformat.test(email)){
      Notification.error("You have entered an invalid email address!");
      return false;
    }
    return true
  }

  changeEditMode = () => {
    this.setState({
      isInEditMode: !this.state.isInEditMode
    });
  };
  onKeyPressHandler = (e) => {
    if (e.key === 'Enter') {
      this.updateComponentValue();
    }
  }

  updateComponentValue = (e) => {
    var text = this.refs[this.props.reference].value;
    if (!this.isValid(this.props.reference,text)){
      return;
    }
    this.setState({
      isInEditMode: !this.state.isInEditMode
    });
    if (text == this.state.oldValue) {
      return;
    }
    var params = {
      ofUserId: this.props.keyname,
      userDetails: {}
    };
    params.userDetails[this.props.reference] = text;
    ApplozicClient.updateUserDetail(params)
      .then(result => {
        if (result && result.data && result.data.status == "success") {
          this.setState({
            oldValue: text
          })
        }
      })
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
          autoFocus="true"
          key={this.props.keyname}
          ref={this.props.reference}
          placeholder={this.state.oldValue || this.props.placeholder}
          defaultValue={this.state.oldValue}
          onKeyPress={this.onKeyPressHandler}
          onBlur={this.updateComponentValue}
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
        <p id={this.props.style} className={this.props.style}>{this.state.oldValue || this.props.placeholder}</p>
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
