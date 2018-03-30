import React, { Component } from 'react';
import axios from 'axios';
import '../Settings/Installation/Accordion.css';
import {changePassword } from '../../utils/kommunicateClient';
import Notification from '../model/Notification';
import './Admin.css';



class PasswordAccordion extends Component{

  
    constructor(props) {
        super(props);
        this.state =  {
          dropDown:false,
          currentPassword: '',
          newPassword: '',
          repeatPassword:''
        };
        this.data=this.props.data
        this.handleClick = this.handleClick.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.clearPasswordfields = this.clearPasswordfields.bind(this)
    }

    handleClick (e) { 
      e.preventDefault();
      this.setState({
        dropDown:!this.state.dropDown
      }); 
    }
    validatePassword(e){
        e.preventDefault();
        console.log('validate password')
        if(this.state.currentPassword.length < 1){
          Notification.info("Enter Your Current Password")
          console.log("Current password is not entered")
          return
        }
        else if(this.state.newPassword.length < 6){
          Notification.info("Your password must have at least 6 characters ")
          return
        }else{
         this.handlePassword(e)
        }
      }
      handlePassword(e){
        
        e.preventDefault();
        
        console.log('handle password')
        
        if (this.state.newPassword !== this.state.repeatPassword){
          Notification.info("Password does not match")
           
        return      
        }else{
          changePassword({
            oldPassword : this.state.currentPassword,
            newPassword: this.state.newPassword,
          })
          this.clearPasswordfields() 
          
        }
      }
      clearPasswordfields(){
        console.log('clear password')
        this.setState({
          currentPassword: '',
          newPassword: '',
          repeatPassword: '',
          rePassword: ''  
    
        })
      }
    //componentWillMount () {
    //  this.data=this.props.data
    ///}
   //componentDidMount(){
     // document.getElementById('content-area').innerHTML=this.data.content;
    //}

    render () {
        return (
           <div className="col-md-10">
                
           <div className="title" onClick={this.handleClick}>
           <div className="arrow-wrapper">
               <i className={this.state.dropDown? "fa fa-angle-down fa-rotate-180": "fa fa-angle-down"} ></i>
             </div>
              <span className="password-wrapper-header"> Change your password</span>  
           </div>
           <div className={this.state.dropDown? "content content-open" : "content"}>
             <div id="content-area" className={this.state.dropDown  ? "content-text content-text-open" : "content-text"}> 
             <form className="form-horizontal" autoComplete="off">

                      <div className="password-wrapper">
                        <div className="row">
                          <div className="col-md-12">
                          <div className="about-password-text">Your password must have at least 6 characters</div>
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-md-4">
                            <label className="form-control-label">Current Password</label>
                            <input type="password" id="current-password-input" onKeyPress={this.handleKeyPress} name="current-password-input" className="form-control input-field" onChange = {(event) => this.setState({currentPassword:event.target.value})} value={this.state.currentPassword} placeholder="Enter your current password"/><br/>
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-md-4">
                            <label className="form-control-label">New Password</label>
                            <input type="password" id="new-password-input" name="new-password-input" className="form-control input-field" onChange = {(event) => this.setState({newPassword:event.target.value})} value={this.state.newPassword} placeholder="Enter your new password"/><br/>
                          </div>
                          <div className="col-md-4">
                            <label className="form-control-label">Re-type New Password</label>
                            <input type="password" id="re-new-password-input" name="re-new-password-input" className="form-control input-field" onChange = {(event) => this.setState({repeatPassword:event.target.value})} value={this.state.repeatPassword} placeholder="Enter your new password"/><br/>
                          </div>
                          
                        </div>
                        <div className="form-group row">
                          <div className="col-md-4">
                            <button className="btn-primary" autoFocus={true} type="submit" onClick={this.validatePassword}>Save changes </button>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <hr className="divider" />
                        </div>
                      </div>
             </form>
             </div>
           </div>
         </div>
        );
       }    
}
export default PasswordAccordion;