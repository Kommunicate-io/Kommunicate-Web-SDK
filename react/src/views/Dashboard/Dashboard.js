import React, { Component } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Dropdown, DropdownMenu, DropdownItem, Progress } from 'reactstrap';
import  {getConfig} from '../../config/config.js';

const brandPrimary =  '#20a8d8';
const brandSuccess =  '#63c2de';
const brandInfo =     '#f8cb00';
const brandDanger =   '#f86c6b';

// Main Chart

var elements = 27;

const numOfSteps= 5;

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      active: 0,
      online: 0,
      leads: 0,
      newUsers: 0,
      assigned: 0,
      messages: 0,
      conversations :0,
      uperlimit:0,
      interval:0,
      chartUperLimit:0,
      mainChart: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
        datasets: [
          {
            label: 'Messages Dataset',
            backgroundColor: 'transparent',
            borderColor: brandInfo,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: []
          },
          {
            label: 'Users Dataset',
            backgroundColor: 'transparent',
            borderColor: brandSuccess,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 1,
            data: []
          }
        ]
      }
    };
    this.mainChartOpts = {
      maintainAspectRatio: false,
      legend: {
        display: true
      },
      scales: {
        xAxes: [{
          gridLines: {
            drawOnChartArea: false,
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            maxTicksLimit: 5,
            //stepSize: Math.ceil(this.state.chaertUperLimit/numOfSteps),
            //max: this.state.chartUperLimit
          }
        }]
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3,
        }
      }
    }
  }
  findMax=(a,b,c)=>{
  return a>=b?(a>=c?a:c):(b>=c?b:c);
  }
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  componentDidMount() {

  //  var env = getEnvironmentId();
    var getAppKeyUrl =getConfig().applozicPlugin.getAppKeyUrl;
    var application = JSON.parse(localStorage.getItem('application'));
    var that = this;
    var endTime = new Date().getTime();
    var startDate = new Date();
    startDate.setDate(1);
    var startTime = startDate.getTime();
    const apzToken = localStorage.apzToken!="undefined"?localStorage.apzToken:"ZGV2YXNoaXNoQGFwcGxvemljLmNvbTprbm93bGVkZ2UxMjM=";
    const statsUrl = getConfig().applozicPlugin.statsUrl.replace(":appKey",application.key);

    //rest/ws/stats/filter?appKey=agpzfmFwcGxvemljchgLEgtBcHBsaWNhdGlvbhiAgICAuqiOCgw&startTime=1498847400000&endTime=1501352999000
    axios.get(statsUrl, {headers:{"Apz-AppId": application.applicationId, "Apz-Token":"Basic "+apzToken,"Access-Token":localStorage.password,"Authorization":"Basic "+localStorage.authorization,"Content-Type":"application/json","Apz-Product-App":true}})
          .then(function(response){
            if(response.status==200){
                var data = response.data;
                console.log(data);
                if (data.length > 0) {
                  var stat = data[0];
                  that.setState({
                    'newUsers': stat.newUserCount,
                    'conversations' :stat.channelCount,
                    'messages': stat.newMessageCount,
                    'active': stat.activeUserCount || 0,
                    'leads': '0',
                    'online': '0',
                    'assigned': '0',
                  });
                }
               }else{
               }
          });

    axios.get(getConfig().applozicPlugin.statsFilterUrl.replace(":appKey",application.key) + "&startTime=" + startTime + "&endTime=" + endTime, {headers:{"Apz-AppId": application.applicationId, "Apz-Token":"Basic "+apzToken,"Content-Type":"application/json","Authorization":"Basic "+localStorage.authorization,"Apz-Product-App":true}})
      .then(function(response){
        if(response.status==200){
            var data = response.data;
            console.log(data);
            var messageData = [];
            var userData = [];
            if (data.length > 0) {
              for(var i = 0; i < data.length; i++) {
                var obj = data[i];
                var datetime = new Date(obj.onDateTime);
                for (var j = messageData.length; j< datetime.getDate(); j++) {
                  messageData.push(0);
                  userData.push(0);
                }
                messageData.push(obj.messageCount);
                userData.push(obj.userCount);
                console.log("messsgaeCount",obj.messageCount);
                that.state.chartUperLimit=that.findMax(that.state.chartUperLimit,obj.messageCount,obj.userCount);

              }
            }

            var mainChart = that.state.mainChart;
            mainChart.datasets[0].data = messageData;
            mainChart.datasets[1].data = userData;
            that.setState({
              'mainChart': mainChart
            });
           }else{
           }
    });
  }

  render() {
    return (
      <div className="animated fadeIn">
        <div className="row">
          <div className="col-sm-6 col-lg-4">
            <div className="card card-inverse card-primary">
              <div className="card-block pb-0">
                <h4 className="mb-0">{this.state.newUsers}</h4>
                <p>Users</p>
              </div>
            </div>
          </div>

          {/*
          <div className="col-sm-6 col-lg-4">
            <div className="card card-inverse card-info">
              <div className="card-block pb-0">
                <h4 className="mb-0">{this.state.conversations}</h4>
                <p>Conversations</p>
              </div>
            </div>
          </div>
          */}

          <div className="col-sm-6 col-lg-4">
            <div className="card card-inverse card-warning">
              <div className="card-block pb-0">
                <h4 className="mb-0">{this.state.messages}</h4>
                <p>Messages</p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-4">
            <div className="card card-inverse card-danger">
              <div className="card-block pb-0">
                <h4 className="mb-0">{this.state.active}</h4>
                <p>Monthly Active Users</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-block">
            <div className="row">
              <div className="col-sm-5">
                <h4 className="card-title mb-0">Traffic</h4>
                <div className="small text-muted">This Month</div>
              </div>
              {/*}
              <div className="col-sm-7 hidden-sm-down">
                <button type="button" className="btn btn-primary float-right"><i className="icon-cloud-download"></i></button>
                <div className="btn-toolbar float-right" role="toolbar" aria-label="Toolbar with button groups">
                  <div className="btn-group mr-3" data-toggle="buttons" aria-label="First group">
                    <label className="btn btn-outline-secondary">
                      <input type="radio" name="options" id="option1"/> Day
                    </label>
                    <label className="btn btn-outline-secondary active">
                      <input type="radio" name="options" id="option2" defaultChecked/> Month
                    </label>
                    <label className="btn btn-outline-secondary">
                      <input type="radio" name="options" id="option3"/> Year
                    </label>
                  </div>
                </div>
              </div>
              */}
            </div>
            <div className="chart-wrapper" style={{height: 300 + 'px', marginTop: 40 + 'px'}}>
              <Line data={this.state.mainChart} options={this.mainChartOpts} height={300}/>
            </div>
          </div>
          {/*
          <div className="card-footer">
            <ul>
              <li>
                <div className="text-muted">Visits</div>
                <strong>29.703 Users (40%)</strong>
                <Progress className="progress-xs mt-2" color="success" value="40" />
              </li>
              <li className="hidden-sm-down">
                <div className="text-muted">Unique</div>
                <strong>24.093 Users (20%)</strong>
                <Progress className="progress-xs mt-2" color="info" value="20" />
              </li>
              <li>
                <div className="text-muted">Pageviews</div>
                <strong>78.706 Views (60%)</strong>
                <Progress className="progress-xs mt-2" color="warning" value="60" />
              </li>
              <li className="hidden-sm-down">
                <div className="text-muted">New Users</div>
                <strong>22.123 Users (80%)</strong>
                <Progress className="progress-xs mt-2" color="danger" value="80" />
              </li>
              <li className="hidden-sm-down">
                <div className="text-muted">Bounce Rate</div>
                <strong>40.15%</strong>
                <Progress className="progress-xs mt-2" color="primary" value="40" />
              </li>
            </ul>
          </div>
          */}
        </div>

      </div>
    )
  }
}

export default Dashboard;
