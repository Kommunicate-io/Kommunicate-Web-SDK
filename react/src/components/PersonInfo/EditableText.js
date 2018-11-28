import React, { Component } from "react";
import PropTypes from 'prop-types';
import ApplozicClient from "../../utils/applozicClient";
import Notification from '../../views/model/Notification';
import { SubmitSvg, CancelSvg } from '../../views/Faq/LizSVG';
import './PersonInfo.css';

class EditableText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      isInEditMode: false,
      renderChild: this.props.children? true:false,
      inputBoxMouseDown:false,
    };
    this.changeEditMode = this.changeEditMode.bind(this);
    this.onKeyPressHandler = this.onKeyPressHandler.bind(this);
    this.updateComponentValue = this.updateComponentValue.bind(this);
    this.submitComponentValue = this.submitComponentValue.bind(this);
    this.updateMouseDownFlag = this.updateMouseDownFlag.bind(this);
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
  isValidNo(value) {
    if (value.length > 40) {
      Notification.error("Number length should be less than 40");
      return false;
    } else {
      return true;
    }
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
        isInEditMode: !this.state.isInEditMode,
        inputBoxMouseDown: true
      });
  };
  onKeyPressHandler = (e) => {
    if (e.key === 'Enter') {
      this.updateComponentValue();
    }
  }
  updateMouseDownFlag =() =>{
    this.setState({
      inputBoxMouseDown: false 
    });
  }
  submitComponentValue =(e)=>{
      this.updateComponentValue(e);
      this.setState({
        inputBoxMouseDown: true 
      });
  }

  updateComponentValue = (e) => {
    if (this.state.inputBoxMouseDown) {
      return;
    } else {
    var text = this.refs[this.props.reference].value;
    if (text && !this.isValid(this.props.reference, text)) {
      return;
    }
    this.setState({
      isInEditMode: !this.state.isInEditMode,
      inputBoxMouseDown: false 
    });
    if (text === this.state.value) {
      return;
    }
    var params = {
      ofUserId: this.props.keyname,
      userDetails: {}
    };
    params.userDetails[this.props.reference] = text;
    ApplozicClient.updateUserDetail(params)
      .then(result => {
        if (result && result.data && result.data.status === "success") {
          this.setState({
            value: text
          })
          if (this.props.reference === 'email' || this.props.reference === 'displayName') {
            this.setState({
              renderChild: false
            })
          }
          if (this.props.reference !== 'displayName') {
            document.getElementById(this.props.id).classList.remove("km-sidebar-user-data-notfound");
            document.getElementById(this.props.id).classList.add("km-sidebar-user-data-found");
          }
          var list = document.querySelectorAll(".person.active .name");
          for (var i = 0; i < list.length; i++) {
            if(this.props.reference === 'displayName'){
            list[i].innerText = document.getElementsByClassName("km-sidebar-display-name")[0].innerHTML;
            }
          }
        }
      })
    }
  };

  renderEditView = () => {
    const style = {
      width: "100%",
      textAlign: "left",
      padding:"5px"
    };
    return (
      <div className={this.props.style}>
        <input
          style={style}
          type= {this.props.inputType?this.props.inputType :"text" }
          autoFocus="true"
          key={this.props.keyname}
          ref={this.props.reference}
          placeholder={this.state.value || this.props.placeholder}
          defaultValue={this.state.value}
          onKeyPress={this.onKeyPressHandler}
          className ="km-edit-input"
          onBlur={this.updateComponentValue}
          onFocus ={this.updateMouseDownFlag}
          maxLength={40}
        />
        <button className ="km-cancel-postion" onMouseDown={this.changeEditMode}>
          <CancelSvg />
        </button>
        <button className ="km-submit-postion" onMouseDown={this.submitComponentValue}>
          <SubmitSvg />
        </button>
      </div>
    );
  };

  renderDefaultView = () => {
    return (
      <div className={this.props.reference === "displayName" ? "km-dispalyname-wrapper" : ""}>
        <div onClick={this.changeEditMode} className={this.props.reference !== "displayName" ? "km-edit" : ""}>
          <p id={this.props.id} className={this.props.style}>{this.state.value || this.props.placeholder}</p>
        </div>
        {this.state.renderChild ? this.props.children : null}
      </div>
    );
  };

  render() {
    return this.state.isInEditMode
      ? this.renderEditView()
      : this.renderDefaultView();
  }
}
EditableText.propTypes = {
  keyname: PropTypes.string.isRequired,
  reference:PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  inputType:PropTypes.string,
  id:PropTypes.string
};
export default EditableText;
