import React, { Component } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Dropdown, DropdownMenu, DropdownItem, Progress } from 'reactstrap';
import  {getConfig} from '../../config/config.js';
import CommonUtils from '../../utils/CommonUtils';
import './Dashboard.css';

const brandPrimary =  '#5c5aa7';
const brandSuccess =  '#18A9B7';
const brandInfo =     '#D13351';
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
      monthly: [],
      chart: {
        labels: [],
        datasets: [
          {
            label: '',
            backgroundColor: 'rgba(92,90,167,0.25)',
            borderColor: '#5c5aa7',
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: [],
          }
        ]
      },
      chartMonthly: {
        labels: [],
        datasets: [
          {
            label: 'Users',
            backgroundColor: 'rgba(92,90,167,0.25)',
            borderColor: '#5c5aa7',
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: [],
          },
          {
            label: 'MAU',
            backgroundColor: 'rgba(92,90,167,0.25)',
            borderColor: '#5c5aa7',
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: [],
          },
          {
            label: 'Conversations',
            backgroundColor: 'rgba(92,90,167,0.25)',
            borderColor: '#5c5aa7',
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: [],
          },
          {
            label: 'Messages',
            backgroundColor: 'rgba(92,90,167,0.25)',
            borderColor: '#5c5aa7',
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: [],
          }
        ]
      },
      mainChart: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
        datasets: [
          {
            label: 'Users',
            backgroundColor: 'rgba(92,90,167,0.25)',
            borderColor: '#5c5aa7',
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: [],
          /*  fillColor: "rgba(134,132,247,0.25)",
            strokeColor: "rgba(120,220,220,1)",
            pointColor: "rgba(120,220,220,1)",
            pointStrokeColor: "#f11",
            pointHighlightFill: "#f11",
            pointHighlightStroke: "rgba(120,220,220,1)",*/
          },
          {
            label: 'MAU',
            backgroundColor: 'rgba(92,90,167,0.25)',
            borderColor: '#5c5aa7',
            pointHoverBackgroundColor: '#fff',
            borderWidth: 1,
            data: [],
            fillColor: "rgba(134,132,247,0.25)",
          },
          {
            label: 'Conversations',
            backgroundColor: 'rgba(92,90,167,0.25)',
            borderColor: '#5c5aa7',
            pointHoverBackgroundColor: '#fff',
            borderWidth: 1,
            data: [],
            fillColor: "rgba(134,132,247,0.25)",
          },
          {
            label: 'Messages',
            backgroundColor: 'rgba(92,90,167,0.25)',
            borderColor: '#5c5aa7',
            pointHoverBackgroundColor: '#fff',
            borderWidth: 1,
            data: [],
            fillColor: "rgba(134,132,247,0.25))",
          }
        ]
      }
    };
    this.mainChartOpts = {
      // tooltips: {
      //   backgroundColor: '#fff',
      //   titleFontSize: 14,
      //   titleFontColor: '#000',
      //   bodyFontColor: '#000',
      //   footerFontColor:'#000',

      // },
      responsive: true,
      
      maintainAspectRatio: false,
      legend: {
        display: true
      },
      scales: {
        xAxes: [{
          gridLines: {
            drawOnChartArea: true,
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
          backgroundColor: 'rgba(255,255,255,1)',
          borderWidth: 3,
          radius: 2,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3,
        }
      }
    }

    this.showChart = this.showChart.bind(this);

  }
  findMax=(a,b,c)=>{
  return a>=b?(a>=c?a:c):(b>=c?b:c);
  }
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  showChart(e) {
    e.preventDefault();
    console.log('The link was clicked.');

    var cards = document.getElementsByClassName("card-stats");

    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.remove('active');
    }

    let currentTarget = e.currentTarget;
    currentTarget.classList.add('active');
    let metric = currentTarget.getAttribute("data-metric");
    console.log(metric);

    if (metric == 1) {
      this.state.chart.labels = this.state.chartMonthly.labels;
      this.state.chart.datasets.label = 'MAU';
      this.state.chart.datasets[0].data = this.state.chartMonthly.datasets[metric].data;
    } else {
      this.state.chart.labels = this.state.mainChart.labels;
      this.state.chart.datasets.label = 'Users';
      this.state.chart.datasets[0].data = this.state.mainChart.datasets[metric].data;
    }

    this.setState({
      chart: this.state.chart
    });
  }

  componentDidMount() {

  //  var env = getEnvironmentId();
    var getAppKeyUrl = getConfig().applozicPlugin.getAppKeyUrl;
    let userSession = CommonUtils.getUserSession();
    var application = userSession.application;
    var that = this;
    var endTime = new Date().getTime();
    var startDate = new Date();
    startDate.setDate(1);
    var startTime = startDate.getTime();
    const apzToken = userSession.apzToken;
    const statsUrl = getConfig().applozicPlugin.statsUrl.replace(":appKey",application.key);

    var userDataMonthly = [];
    var mauDataMonthly = [];
    var messageDataMonthly = [];
    var channelDataMonthly = [];

    var labelMonthly = [];
    //rest/ws/stats/filter?appKey=agpzfmFwcGxvemljchgLEgtBcHBsaWNhdGlvbhiAgICAuqiOCgw&startTime=1498847400000&endTime=1501352999000
    axios.get(statsUrl, {headers:{"Apz-AppId": application.applicationId, "Apz-Token":"Basic "+apzToken,"Access-Token":userSession.password,"Authorization":"Basic "+userSession.authorization,"Content-Type":"application/json","Apz-Product-App":true}})
          .then(function(response){
            if(response.status==200){
                var data = response.data;
                //console.log(data);

                if (data.length > 0) {

                  for(var i = 0; i < data.length; i++) {
                    var obj = data[i];
                    console.log(obj);
                    var datetime = new Date(obj.month);
                    labelMonthly.push(MONTH_NAMES[datetime.getMonth()]);
                    userDataMonthly.push(obj.newUserCount);
                    mauDataMonthly.push(obj.activeUserCount);
                    channelDataMonthly.push(obj.channelCount);
                    messageDataMonthly.push(obj.newMessageCount);
                    //that.state.chartUperLimit=that.findMax(that.state.chartUperLimit,obj.messageCount,obj.userCount);
                  }

                  var chartMonthly = that.state.chartMonthly;
                  chartMonthly.labels = labelMonthly;
                  chartMonthly.datasets[0].data = userDataMonthly;
                  chartMonthly.datasets[1].data = mauDataMonthly;
                  chartMonthly.datasets[2].data = channelDataMonthly;
                  chartMonthly.datasets[3].data = messageDataMonthly;

                  that.state.chart.labels = labelMonthly;
                  that.state.chart.datasets.label = 'Users';
                  that.state.chart.datasets[0].data = userDataMonthly;

                  that.setState({
                    chartMonthly: chartMonthly
                  });

                  var stat = data[data.length - 1];
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

    axios.get(getConfig().applozicPlugin.statsFilterUrl.replace(":appKey",application.key) + "&startTime=" + startTime + "&endTime=" + endTime, {headers:{"Apz-AppId": application.applicationId, "Apz-Token":"Basic "+apzToken,"Content-Type":"application/json","Authorization":"Basic "+userSession.authorization,"Apz-Product-App":true}})
      .then(function(response){
        if(response.status==200){
            var data = response.data;
            var messageData = [];
            var userData = [];
            var channelData = [];
            if (data.length > 0) {
              for(var i = 0; i < data.length; i++) {
                var obj = data[i];
                console.log(obj);
                var datetime = new Date(obj.onDateTime);
                for (var j = messageData.length; j< datetime.getDate(); j++) {
                  userData.push(0);
                  channelData.push(0);
                  messageData.push(0);
                }
                messageData.push(obj.messageCount);
                userData.push(obj.userCount);
                channelData.push(obj.channelCount);
                that.state.chartUperLimit=that.findMax(that.state.chartUperLimit,obj.messageCount,obj.userCount);
              }
            }

            var mainChart = that.state.mainChart;
            mainChart.datasets[0].data = userData;
            mainChart.datasets[2].data = channelData;
            mainChart.datasets[3].data = messageData;
            that.setState({
              'mainChart': mainChart
            });
           }else{
           }
    });
  }

  render() {
    return (
      <div className="animated fadeIn dashboard-card">
        <div className="row">
          <div className="col-sm-6 col-lg-3 text-center">
            <div className="card card-inverse card-stats card-stats--users active" data-metric="0" onClick={this.showChart}>
              <div className="card-block pb-0">
                <p className="card-main-title">Users</p>
                <h4 className="card-stats-value" data-metric="0">{this.state.newUsers}</h4>
{/* Uncomment below line to see last month user text. Do the same thing for below two cards.*/}
                {/* <p className="card-sub-title">205 Users last month</p> */}
              </div>
              <div className="vertical-line"></div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3 text-center">
            <div className="card card-inverse card-stats card-stats--mau" data-metric="1" onClick={this.showChart}>
              <div className="card-block pb-0">
              <p className="card-main-title">Monthly Active Users</p>
                <h4 className="card-stats-value">{this.state.active}</h4>
                {/* <p className="card-sub-title">205 Users last month</p> */}
              </div>
              
            </div>
          </div>

          <div className="col-sm-6 col-lg-3 text-center">
            <div className="card card-inverse card-stats card-stats--conversations" data-metric="2" onClick={this.showChart}>
              <div className="card-block pb-0">
                <p className="card-main-title">Conversations</p>
                <h4 className="card-stats-value">{this.state.conversations}</h4>
{/* Uncomment below line to see last month user text. Do the same thing for below two cards.*/}
                {/* <p className="card-sub-title">205 Users last month</p> */}
              </div>
              <div className="vertical-line"></div>
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

          <div className="col-sm-6 col-lg-3 text-center">
            <div className="card card-inverse card-stats card-stats--messages" data-metric="3" onClick={this.showChart}>
              <div className="card-block pb-0">
              <p className="card-main-title">Messages</p>
                <h4 className="card-stats-value">{this.state.messages}</h4>
                {/* <p className="card-sub-title">205 Users last month</p> */}
              </div>
              <div className="vertical-line"></div>
            </div>
          </div>

        </div>

        <div className="card">
          <div className="card-block">
            <div className="row">
              {/* <div className="col-sm-5">
                <h4 className="card-title mb-0">Traffic</h4>
                <div className="small text-muted">This Month</div>
              </div> */}
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
            <div className="chart-wrapper" style={{height: 200 + 'px', marginTop: 40 + 'px'}}>
              <Line data={this.state.chart} options={this.mainChartOpts} height={200}/>
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

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default Dashboard;
