import React, { Component } from 'react';
import axios from 'axios';
import validator from 'validator';
import  {getConfig,getEnvironmentId,get} from '../../config/config.js';
import {Modal} from 'react-bootstrap';
import  {Button}  from 'react-bootstrap';
import Dropdown from 'react-dropdown';
import {SplitButton, MenuItem} from 'react-bootstrap';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import AutoSuggest from './AutoSuggest'
import Welcome from './Welcome'

//using moment-timezone to get a list of all the timezones...
import moment from 'moment-timezone';

//using jstz to get client timezone...
import jstz from 'jstz';

import {postAutoReply} from '../../utils/kommunicateClient'

class Autoreply extends Component {

  constructor(props){
    super(props);

    this.state = {
     days:'',
     activeTab: '2',
     mon:false,
     tue:false,
     wed:false,
     thu:false,
     fri:false,
     sat:false,
     sun:false,
     closetime:'6:00',
     opentime:'9:00',
     msg:'',
     timezone: jstz.determine().name(),
     timezonearray: moment.tz.names()
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {

    this.setState({timezonearray: moment.tz.names()});
    this.setState({timezone: jstz.determine().name()})

    // var getTimeZone = getConfig().applozicPlugin.getTimeZoneUrl;

    // axios({
    //        method: 'get',
    //        url:getTimeZone
    //  }).then(function(response){
    //        var list =(response.data);
    //        for(var i = 0, size = list.length; i < size ; i++){
    //          _this.state.timezonearray.push(list[i])
    //         }
    // _this.setState({timezonearray: _this.state.timezonearray});
    // });
  }

  handleSubmit(event) {
    event.preventDefault();
    var autoreplyUrl =getConfig().applozicPlugin.autoreplyUrl;
    var username = localStorage.getItem("loggedinUser");
    var formdata =  {
      "applicationId": localStorage.getItem("applicationId"),
      "workingHours": [],
      "timezone": this.state.timezone,
      "offHoursMessage": this.state.msg
    }

    if(this.state.mon === true){
      formdata.workingHours.push(
        {day: "monday", openTime: this.state.opentime, closeTime: this.state.closetime}
      );
    }
    if(this.state.tue === true){
      formdata.workingHours.push(
        {day: "tuesday", openTime: this.state.opentime, closeTime: this.state.closetime}
      );
    }
    if(this.state.wed === true){
      formdata.workingHours.push(
        {day: "wednesday", openTime: this.state.opentime, closeTime: this.state.closetime}
      );
    }
    if(this.state.thu === true){
      formdata.workingHours.push(
        {day: "thursday", openTime: this.state.opentime, closeTime: this.state.closetime}
      );
    }
    if(this.state.fri === true){
      formdata.workingHours.push(
        {day: "friday", openTime: this.state.opentime, closeTime: this.state.closetime}
      );
    }
    if(this.state.sat === true){
      formdata.workingHours.push(
        {day: "saturday", openTime: this.state.opentime, closeTime: this.state.closetime}
      );
    }
    if(this.state.sun === true){
      formdata.workingHours.push(
        {day: "sunday", openTime: this.state.opentime, closeTime: this.state.closetime}
      );
    }

    console.log(formdata);

    postAutoReply(formdata);


  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  resetAutoReply = (e) => {
    e.preventDefault();
    this.setState({
      mon:false,
      tue:false,
      wed:false,
      thu:false,
      fri:false,
      sat:false,
      sun:false,
      opentime:'9:00',
      closetime:'6:00',
      msg:'',
      timezone: jstz.determine().name(),
      timezonearray: moment.tz.names()
    })
  }

  render() {

    let timezonearray_id =[];

    for(let i = 0; i <= this.state.timezonearray.length; i++){
      timezonearray_id.push(i);
    }

    let time_option_id = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];

    let time_options = [
      {name: '0:00'},
      {name: '1:00'},
      {name: '2:00'},
      {name: '3:00'},
      {name: '4:00'},
      {name: '5:00'},
      {name: '6:00'},
      {name: '7:00'},
      {name: '8:00'},
      {name: '9:00'},
      {name: '10:00'},
      {name: '11:00'},
      {name: '12:00'},
      {name: '13:00'},
      {name: '14:00'},
      {name: '15:00'},
      {name: '16:00'},
      {name: '17:00'},
      {name: '18:00'},
      {name: '19:00'},
      {name: '20:00'},
      {name: '21:00'},
      {name: '22:00'},
      {name: '23:00'},
      {name: '24:00'}
    ];

    return (
      <div className="animated fadeIn">
        <div className="row">
          <div className="col-md-12 mb-8">
            <Nav tabs>
              <NavItem >
                <NavLink style ={{display:"none"}}
                  className={classnames({ active: this.state.activeTab === '1' })}
                  onClick={() => { this.toggle('1'); }}>
                  OFF HOURS
                </NavLink>
              </NavItem>
              <NavItem hidden= {false} >
                <NavLink
                  className={classnames({ active: this.state.activeTab === '2' })}
                  onClick={() => { this.toggle('2'); }}
                >
                  WELCOME MESSAGE
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '3' })}
                  onClick={() => { this.toggle('3'); }}
                >
                  AUTO SUGGEST
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <div className="animated fadeIn">
                  <div className="row">
                    <form onSubmit={this.handleSubmit}>
                      <div className="col-md-12">
                        <div className="card">
                          <div className="card-header">
                          </div>
                          <div className="card-block">
                            <div id ="weekDays-selector" className="weekDays-selector">
                              <input type="checkbox" id="weekday-mon" value="mon" onClick = {(event) => this.setState({mon:!this.state.mon})}  checked={this.state.mon} className="weekday" />
                              <label htmlFor="weekday-mon">MON</label>
                              <input type="checkbox" id="weekday-tue" value="tue" onClick = {(event) => this.setState({tue:!this.state.tue})}  checked={this.state.tue} className="weekday" />
                              <label htmlFor="weekday-tue">TUE</label>
                              <input type="checkbox" id="weekday-wed" value="wed" onClick = {(event) => this.setState({wed:!this.state.wed})}  checked={this.state.wed} className="weekday" />
                              <label htmlFor="weekday-wed">WED</label>
                              <input type="checkbox" id="weekday-thu" value="thu" onClick = {(event) => this.setState({thu:!this.state.thu})} checked={this.state.thu} className="weekday" />
                              <label htmlFor="weekday-thu">THU</label>
                              <input type="checkbox" id="weekday-fri"value="fri" onChange = {(event) => this.setState({fri:!this.state.fri})} checked={this.state.fri} className="weekday" />
                              <label htmlFor="weekday-fri">FRI</label>
                              <input type="checkbox" id="weekday-sat" value="sat" onChange = {(event) => this.setState({sat:!this.state.sat})} checked={this.state.sat} className="weekday" />
                              <label htmlFor="weekday-sat">SAT</label>
                              <input type="checkbox" id="weekday-sun" value="sun" onChange = {(event) => this.setState({sun:!this.state.sun})} checked={this.state.sun} className="weekday" />
                              <label htmlFor="weekday-sun">SUN</label>
                            </div>
                            <div className="form-group row">
                              <label className="col-md-3 form-control-label">Time Zone</label>
                              <div className="col-md-9">
                                <select id="timezone" onChange = {(event) => this.setState({timezone:event.target.value})} value={this.state.timezone}>
                                  {timezonearray_id.map(id =>
                                    <option key={id} value={this.state.timezonearray[id]}> {this.state.timezonearray[id]} </option>
                                  )}
                                </select>
                              </div>
                            </div>
                            <div className="form-group row">
                              <label className="col-md-3 form-control-label">Open Time</label>
                              <div className="col-md-9">
                                <select id="opentime" onChange = {(event) => this.setState({opentime:event.target.value})} value={this.state.opentime}>
                                {time_option_id.map(id =>
                                 <option key={id} value={time_options[id].name}>{time_options[id].name}</option>
                                )}
                                </select>
                              </div>
                            </div>
                            <div className="form-group row">
                              <label className="col-md-3 form-control-label">Close Time</label>
                              <div className="col-md-9">
                                <select id="closetime" onChange = {(event) => this.setState({closetime:event.target.value})} value={this.state.closetime}>
                                  {time_option_id.map(id =>
                                  <option key={id} value={time_options[id].name}>{time_options[id].name}</option>
                                )}
                                </select>
                              </div>
                            </div>
                            <div className="form-group row">
                              <label className="col-md-3 form-control-label">Message</label>
                              <div className="col-md-9">
                                <textarea id="offhourmessage" rows="6" cols="60" onChange={(event) => this.setState({ msg: event.target.value })} value={this.state.msg} required></textarea>
                              </div>
                            </div>
                          </div>
                          <div className="card-footer">
                            <button type="submit" className="btn btn-sm btn-primary px-4" ><i className="fa fa-dot-circle-o"></i> Submit</button>
                            <button className="n-vis btn btn-sm btn-danger px-4" onClick={this.resetAutoReply}><i className="fa fa-ban"></i> Reset</button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </TabPane>
              <TabPane tabId="2">
                <Welcome/>
              </TabPane>
              <TabPane tabId="3">
                <AutoSuggest />
              </TabPane>
            </TabContent>
          </div>
        </div>
      </div>
    )
  }
}

export default Autoreply;
