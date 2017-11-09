import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios';
import  {getConfig,getEnvironmentId,get} from '../../config/config.js';
import BotDescription from './BotDescription.js';
class Tabs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTab: '1',
      descriptionType :"ADD_BOT",
      descriptionHeader:"Step 1",
      userid: '',
      username: '',
      password:'',
      role :'',
      bot: '',
      ctoken: '',
      platform:'api.ai',
      dtoken :''
    };
  this.handleSubmit = this.handleSubmit.bind(this);
  this.handleClick = this.handleClick.bind(this);
  this.toggle = this.toggle.bind(this);
   };

     handleClick (event){
     event.preventDefault();
     var applicationId =localStorage.getItem("applicationId");
     var authorization =localStorage.getItem("authorization");
     var password = localStorage.getItem("password");
     var device = atob(authorization);
     var devicekey = device.split(":")[1];
     var env = getEnvironmentId();
     var userDetailUrl =getConfig().applozicPlugin.userDetailUrl;
     var data = {
            "clientToken" : this.state.ctoken,
            "devToken" : this.state.dtoken,
            "aiPlatform" : this.state.platform,
            "botname":this.state.bot
        }

        axios({
         method: 'post',
         url:userDetailUrl,
         data:{
               "userIdList" : [data.botname]
             },
             headers: {
               "Application-Key": applicationId,
              "Authorization":"Basic "+authorization,
              "Content-Type": "application/json",
              "Device-Key" : devicekey,
              "Access-Token": password
             }
          })
      .then(function(response){
       if(response.status==200 ){
          console.log("success");
           axios({
         method: 'post',
         url:'http://dashboard-test.applozic.com:5454/bot/'+response.data.response[0].id+'/configure',
         data:JSON.stringify(data),
         headers: {
          "Content-Type": "application/json",
         }
          })
      .then(function(response){
       if(response.status==200 ){
          alert("Bot configured successfully");
          }
       });
          }
       });
     }
     // creating bot
    handleSubmit(event) {
        var applicationId =localStorage.getItem("applicationId");
        var username = localStorage.getItem("loggedinUser");
        var password = localStorage.getItem("password");
        var env = getEnvironmentId();
        var registerClientUrl =get(env).applozicPlugin.registerClientUrl;
        var addBotUrl =get(env).applozicPlugin.addBotUrl;
        var formData = {
            "userId" : this.state.userid,
            "displayName" : this.state.username,
            "password" : this.state.password,
            "roleName" : this.state.role,
            "applicationId": applicationId,
            "authenticationTypeId":1
        }
            axios({
            method: 'post',
            url: registerClientUrl,
            data:JSON.stringify(formData),
            headers: {
            'Content-Type': 'application/json'
            }
        })
          .then(function(response){
           if(response.status==200 ){
            var data = {"name": formData.displayName,
              "key": response.data.userKey,
              "brokerUrl": response.data.brokerUrl,
              "accessToken": formData.password,
              "applicationKey": applicationId,
              "authorization": btoa(formData.userid+':'+response.data.deviceKey)
            }
               axios({
            method: 'post',
            url: addBotUrl,
            data:JSON.stringify(data),
            headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
            }
        })
          .then(function(response){
           if(response.status==201 ){
            alert("Bot successfully created");
         }
       });
         }
    });
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    return (
      <div className="animated fadeIn">
        <div className="row">
          <div className="col-md-6 mb-4">
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '1' })}
                  onClick={() => { this.toggle('1'); this.state.descriptionType = "ADD_BOT",this.state.descriptionHeader="Step 1"}}
                >
                  Add Bot
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '2' })}
                  onClick={() => { this.toggle('2'); this.state.descriptionType = "CONFIGURE_BOT", this.state.descriptionHeader="Step 2"}}
                >
                  Configure Bot
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <div className="animated fadeIn">
        <div className="row">
        <div className="col-md-12">
            <div className="card">
              <div className="card-block">
                <form className="form-horizontal">
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="hf-userid">Bot Id</label>
                    <div className="col-md-9">
                      <input type="text" id="hf-userid" name="hf-userid"  onChange = {(event) => this.setState({userid:event.target.value})} className="form-control" placeholder="Enter unique bot id"/>
                      <span className="help-block">Please enter unique bot id</span>
                    </div>
                  </div>
                   <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="hf-userid">Display Name</label>
                    <div className="col-md-9">
                      <input type="text" id="hf-username" onChange = {(event) => this.setState({username:event.target.value})} name="hf-username" className="form-control" placeholder="Enter Username"/>
                      <span className="help-block">Please enter your username</span>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="hf-password">Password</label>
                    <div className="col-md-9">
                      <input type="password" id="hf-password"  onChange = {(event) => this.setState({password:event.target.value})} name="hf-password" className="form-control" placeholder="Enter Password.."/>
                      <span className="help-block">Please enter your password</span>
                    </div>
                  </div>
                  <div className="form-group row" hidden>
                    <label className="col-md-3 form-control-label" htmlFor="hf-role">Role</label>
                    <div className="col-md-9">
                      <input type="text" id="hf-role" name="hf-role"  onChange = {(event) => this.setState({role:event.target.value})}className="form-control" placeholder="Enter Role"/>
                      <span className="help-block">Please enter your role</span>
                    </div>
                  </div>
                </form>
              </div>
               <div className="card-footer">
                <button type="submit" className="btn btn-sm btn-primary" onClick ={this.handleSubmit}><i className="fa fa-dot-circle-o"></i> Submit</button>
                <button type="reset" className="btn btn-sm btn-danger n-vis"><i className="fa fa-ban"></i> Reset</button>
              </div>
              </div>
              </div>
              </div>
            </div>
              </TabPane>
              <TabPane tabId="2">
                 <div className="animated fadeIn">
       <form>
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-block">
                <form action="" method="post" className="form-horizontal">
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="bot">Bot Id</label>
                    <div className="col-md-9">

                      <input type="text"  onChange = {(event) => this.setState({bot:event.target.value})}  id="bot"  className="form-control" placeholder="Enter Bot id"/>

                    </div>
                  </div>
              <div hidden>
                  <select id="platform" onChange = {(event) => this.setState({platform:event.target.value})} >
                  <option selected="" >Api.ai</option>
                  <option value="Api.ai" >Api.ai</option>
                  <option value="Message.ai">Message.ai</option>
                  </select>
             </div>
             <div></div>
              <div></div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="ctoken">Client Token</label>
                    <div className="col-md-9">
                      <input type="text" id="ctoken" name="ctoken"  onChange = {(event) => this.setState({ctoken:event.target.value})} className="form-control" placeholder="Enter Client Token.."/>

                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="hf-dtoken">Dev Token</label>
                    <div className="col-md-9">
                      <input type="text" value={this.state.dtoken} onChange = {(event) => this.setState({dtoken:event.target.value})} id="hf-dtoken" name="hf-dtoken" className="form-control"
                  placeholder="Enter Dev.."/>

                    </div>
                  </div>
                </form>
              </div>
              <div className="card-footer">
                <button type="submit" className="btn btn-sm btn-primary" onClick={(event) => this.handleClick(event)}><i className="fa fa-dot-circle-o"></i> Submit</button>
                <button type="reset" className="btn btn-sm btn-danger n-vis"><i className="fa fa-ban"></i> Reset</button>
              </div>
            </div>
          </div>
        </div>
        </form>
      </div>
              </TabPane>
            </TabContent>
          </div>
          <div className="col-md-6 mb-4">
            <BotDescription type ={this.state.descriptionType} header={this.state.descriptionHeader} />
          </div>
        </div>
      </div>
    )
  }
}

export default Tabs;
