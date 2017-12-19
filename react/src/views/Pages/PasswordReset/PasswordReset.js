
import React from 'react';
import {updatePassword} from '../../../utils/kommunicateClient';
import {getConfig} from '../../../config/config';
import CommonUtils from '../../utils/CommonUtils';

class PasswordReset extends React.Component{

  constructor(props){
    super(props);
    this.initialState = {
      newPassword:"",
      confirmPassword:"",
      headerText:"Reset Your Password",
      subText:'Choose a strong password.. ',
      loginButtonText:'Submit',
      code:null
    }
    this.state=this.initialState;
  }
  componentWillMount(){
    const search = this.props.location.search;
    /*const params = new URLSearchParams(search);
    const code = params.get('code');*/

    const code = CommonUtils.getUrlParameter(search, 'code');
    if (code) {
        this.state.code = code;
    }
  }

  componentDidMount(){
   // console.log("compponent did mount");
  }
  setNewPassword= (event)=>{
  this.setState({newPassword:event.target.value});
  }
  setConfirmPassword= (event)=>{
  this.setState({confirmPassword:event.target.value});
  }

  updatePassword = (event)=>{
    if(this.state.newPassword === this.state.confirmPassword){
      updatePassword({newPassword:this.state.newPassword,code:this.state.code}).then(result=>{
        console.log("update password response",result);
        if(result.data.code==="SUCCESS"){
        alert("Password updated successfully. Please login!");
        //window.location(getConfig().homeUrl+"/login");
        this.props.history.replace('/login');
        }else if(result.data.code==="CODE_EXPIRED"){
          alert("password reset link is expired. Please generate new link.")
        }else{
          throw new Error("error");
        }
      }).catch(err=>{
        console.log(err);
        alert("something went wrong");
      });
    }else{
      alert("password do not matach!");
    }

  }

  render(){
    return (
     <div className="app flex-row align-items-center">

        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card-group mb-0">
                <div className="card p-4">
                  <div className="card-block">
                    <h1>{this.state.headerText}</h1>
                    <p className="text-muted">{this.state.subText}</p>
                    <div className="input-group mb-3" >
                      <span className="input-group-addon"><i className="icon-lock"></i></span>
                       <input type="password" className="form-control" placeholder="Enter New Password"  onChange = { this.setNewPassword } value={ this.state.newPassword } onBlur ={this.state.handleUserNameBlur}/>
                    </div>


                    <div className="input-group mb-3" >
                      <span className="input-group-addon"><i className="icon-lock"></i></span>
                       <input type="password" className="form-control" placeholder="Confirm Password"  onChange = { this.setConfirmPassword } value={ this.state.confirmPassword } onBlur ={this.state.handleUserNameBlur}/>
                    </div>
                    <div className="row">
                      <div className="col-3">
                        <button id="submit-button" type="button" className="btn btn-primary px-3 km-login-btn" onClick={(event) => this.updatePassword(event)}>Submit</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PasswordReset;
