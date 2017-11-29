import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios';
import  {getConfig,getEnvironmentId,get} from '../../config/config.js';
import BotDescription from './BotDescription.js';
import Notification from '../model/Notification';
import {getUsersByType,createCustomerOrAgent} from '../../utils/kommunicateClient';
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
      role :'BOT',
      bot: '',
      ctoken: '',
      platform:'api.ai',
      dtoken :'',
      // amap of {botId :botName}
      botOptionList:[],
     
    };
  this.applicationId = localStorage.getItem("applicationId");
  
  this.handleSubmit = this.handleSubmit.bind(this);
  this.handleClick = this.handleClick.bind(this);
  this.toggle = this.toggle.bind(this);
   };
   componentWillMount =()=>{
    //this.populateBotOptions();
   }
  componentDidMount=()=>{
    //console.log("options",this.state.botListInnerHtml);
  
  }

  clearBotForm = ()=>{
    this.state.userid="";
    this.state.username="";
    this.state.password="";
    this.state.bot="";
    this.state.ctoken="";
    this.setState({dtoken:""});
   }
   
     handleClick (event){
       var _this =this;
     event.preventDefault();
     var applicationId =localStorage.getItem("applicationId");
     var authorization =localStorage.getItem("authorization");
     var password = localStorage.getItem("password");
     var device = atob(authorization);
     var devicekey = device.split(":")[1];
     var env = getEnvironmentId();
     var userDetailUrl =getConfig().applozicPlugin.userDetailUrl;

     if(!this.state.bot){
       Notification.info("Please select a bot!!");
       return;
     }else if(!this.state.ctoken){
      Notification.info("Please enter the client token!!");
      return;
     }else if(!this.state.dtoken){
      Notification.info("Please select a developer token!!");
      return;
     }
     var data = {
            "clientToken" : this.state.ctoken,
            "devToken" : this.state.dtoken,
            "aiPlatform" : this.state.platform,
            "botname":this.state.bot.value
        }

        axios({
         method: 'post',
         url:userDetailUrl,
         data:{
               "userIdList" : [data.botname]
             },
             headers: {
              "Apz-Product-App": true,
              "Apz-Token": 'Basic ' + new Buffer(localStorage.getItem("loggedinUser")+':'+localStorage.getItem("password")).toString('base64'),
              "Content-Type": "application/json",
              "Apz-AppId":applicationId
             }
          })
      .then(function(response){
       if(response.status==200 ){
          console.log("success");
           axios({
         method: 'post',
         url:getConfig().applozicPlugin.addBotUrl+"/"+response.data.response[0].id+'/configure',
         data:JSON.stringify(data),
         headers: {
          "Content-Type": "application/json",
         }
          })
      .then(function(response){
       if(response.status==200 ){
        _this.clearBotForm();
          Notification.info("Bot configured successfully");
         
          }
       });
          }
       });
     }
     // creating bot
    handleSubmit(event) {
        var _this=this;

        if(!this.state.userid){
          Notification.info("Please enter a Bot Id !!");
          return;
        }else if(!this.state.username){
          Notification.info("Please select display name of the bot!!");
          return;
         }else if(!this.state.password){
         Notification.info("Please enter a password !!");
         return;
        }
        var applicationId =localStorage.getItem("applicationId");
        Promise.resolve(createCustomerOrAgent({userName:this.state.userid,type:2,applicationId:applicationId,password:this.state.password,name:this.state.username},"BOT"))
        .then(bot=>{
          Notification.info("Bot successfully created");
          _this.clearBotForm();
         }).catch(err=>{
           if(err.code=="USER_ALREADY_EXISTS"){
            Notification.info("Bot Id is already taken. try again.");
            return;
           }
          Notification.error("Something went wrong");
          console.log("err creating bot",err);
         })
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  populateBotOptions=()=>{
    var _this =this;
    Promise.resolve(getUsersByType(this.applicationId,2)).then(data=>{
      console.log("received data",data);
      //_this.state.botOptionList.push({"value":"","label":"Select",disabled:true,selected:true,clearableValue:false});
      data.forEach(function(elem){
        let botName =elem.name||elem.userName;
        let botId =elem.userName;
        //_this.state.botNameMap[botId] =botName;
        _this.state.botOptionList.push({value:botId,label:botName});
        _this.setState({botOptionList:_this.state.botOptionList});
      });
    }).catch(err=>{
      console.log("err while fetching bot list ",err);
    });
  }
  handleClickOnConfigureTab=()=>{
     this.toggle('2'); 
     this.state.descriptionType = "CONFIGURE_BOT";
     this.state.descriptionHeader="Step 2";
     this.state.botOptionList=[];
     this.populateBotOptions();
  }
  handleOnChangeforBotId =(e)=>{
        
        this.setState({userid:e.target.value});
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
                  onClick={this.handleClickOnConfigureTab}
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
                      <input type="text" id="hf-userid" name="hf-userid" 
                        onChange = {this.handleOnChangeforBotId} value={this.state.userid} className="form-control" placeholder="Enter unique bot id"/>
                      <span className="help-block">Please enter unique bot id</span>
                    </div>
                  </div>
                   <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="hf-userid">Display Name</label>
                    <div className="col-md-9">
                      <input type="text" id="hf-username" onChange = {(event) => this.setState({username:event.target.value})} value={this.state.username} name="hf-username" className="form-control" placeholder="Enter Username"/>
                      <span className="help-block">Please enter your username</span>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="hf-password">Password</label>
                    <div className="col-md-9">
                      <input type="password" id="hf-password"  onChange = {(event) => this.setState({password:event.target.value})} value ={this.state.password} name="hf-password" className="form-control" placeholder="Enter Password.."/>
                      <span className="help-block">Please enter your password</span>
                    </div>
                  </div>
                  <div className="form-group row" hidden>
                    <label className="col-md-3 form-control-label" htmlFor="hf-role">Role</label>
                    <div className="col-md-9">
                      <input type="text" id="hf-role" name="hf-role" onChange = {(event) => this.setState({role:event.target.value})} value = {this.state.role} className="form-control" placeholder="Enter Role"/>
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
                    <label className="col-md-3 form-control-label" htmlFor="bot">Select Bot</label>
                    <div className="col-md-9">
                    <Select
                      name="km-bot-id"
                      value={this.state.bot}
                      onChange={(value) => this.setState({bot:value})}
                      options={this.state.botOptionList}/>
                    </div>
                  </div>
              <div hidden>
                  <select id="platform" onChange = {(event) => this.setState({platform:event.target.value})} value ={this.state.platform} >
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
                      <input type="text" id="ctoken" name="ctoken"  onChange = {(event) => this.setState({ctoken:event.target.value})} value ={this.state.ctoken} className="form-control" placeholder="Enter Client Token.."/>

                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="hf-dtoken">Dev Token</label>
                    <div className="col-md-9">
                      <input type="text" value={this.state.dtoken} onChange = {(event) => this.setState({dtoken:event.target.value})} value ={this.state.dtoken} id="hf-dtoken" name="hf-dtoken" className="form-control"
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
