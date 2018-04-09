import React, { Component } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Dropdown, DropdownMenu, DropdownItem, Progress } from 'reactstrap';
import { getConfig } from '../../config/config.js';
import CommonUtils from '../../utils/CommonUtils';
import './Dashboard.css';
import EarlyBirdOffer from '../.../../../components/EarlyBirdOffer/EarlyBirdOffer';

const brandPrimary = '#5c5aa7';
const brandSuccess = '#18A9B7';
const brandInfo = '#D13351';
const brandDanger = '#f86c6b';

// Main Chart

var elements = 27;

const numOfSteps = 5;

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
      conversations: 0,
      uperlimit: 0,
      interval: 0,
      chartUperLimit: 0,
      monthly: [],
      currentMonth: '',
      lastMonthStats: {
        newUserCount: 0,
        activeUserCount: 0,
        channelCount: 0,
        newMessageCount: 0
      },
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
            label: 'Chat Users',
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
        labels: [],
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
            borderWidth: 2,
            data: []
          },
          {
            label: 'Conversations',
            backgroundColor: 'rgba(92,90,167,0.25)',
            borderColor: '#5c5aa7',
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: []
          },
          {
            label: 'Messages',
            backgroundColor: 'rgba(92,90,167,0.25)',
            borderColor: '#5c5aa7',
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: []
          }
        ]
      },
      offerRemaining: 100
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
  findMax = (a, b, c) => {
    return a >= b ? (a >= c ? a : c) : (b >= c ? b : c);
  }
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  showChart(e) {
    e.preventDefault();

    var cards = document.getElementsByClassName("card-stats");

    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.remove('active');
    }

    let currentTarget = e.currentTarget;
    currentTarget.classList.add('active');
    let metric = currentTarget.getAttribute("data-metric");

    let chart;

    if (metric == 1) {
      chart = Object.assign({}, this.state.chart);
      chart.labels = this.state.chartMonthly.labels;
      chart.datasets = [{}];
      chart.datasets[0] = this.state.chartMonthly.datasets[metric];
    } else {
      chart = Object.assign({}, this.state.mainChart);;
      chart.labels = this.state.mainChart.labels;
      chart.datasets = [{}];
      chart.datasets[0] = this.state.mainChart.datasets[metric];
    }

    this.setState({
      'chart': chart
    });
  }

  componentDidMount() {

    //  var env = getEnvironmentId();
    let userSession = CommonUtils.getUserSession();
    var application = userSession.application;
    var that = this;
    var endTime = new Date().getTime();
    var startDate = new Date();
    startDate.setDate(1);
    var startTime = startDate.getTime();
    const apzToken = userSession.apzToken;
    const statsUrl = getConfig().applozicPlugin.statsUrl.replace(":appKey", application.key);

    var userDataMonthly = [];
    var mauDataMonthly = [];
    var messageDataMonthly = [];
    var channelDataMonthly = [];

    var labelMonthly = [];
    var labels = [];
    //rest/ws/stats/filter?appKey=agpzfmFwcGxvemljchgLEgtBcHBsaWNhdGlvbhiAgICAuqiOCgw&startTime=1498847400000&endTime=1501352999000
    axios.get(statsUrl, { headers: { "Apz-AppId": application.applicationId, "Apz-Token": "Basic " + apzToken, "Access-Token": userSession.password, "Authorization": "Basic " + userSession.authorization, "Content-Type": "application/json", "Apz-Product-App": true } })
      .then(function (response) {
        if (response.status == 200) {
          var data = response.data;

          if (data.length >= 2) {
            var lastMonthStats = data[data.length - 2];
            that.setState({ 'lastMonthStats': lastMonthStats });
          } else {
            let lastMonthSubTitle = document.getElementsByClassName("card-sub-title");
            for (var i = 0; i < lastMonthSubTitle.length; i++) {
              lastMonthSubTitle[i].classList.add('n-vis');
            }
          }

          if (data.length > 0) {

            let lastDate = null;

            for (var i = 0; i < data.length; i++) {
              var obj = data[i];
              var datetime = new Date(obj.month);

              if (lastDate == null) {
                lastDate = datetime;
              }
              for (var gap = lastDate.getMonth() + 1; gap < datetime.getMonth(); gap++) {
                labelMonthly.push(MONTH_NAMES[lastDate.getMonth()]);
                userDataMonthly.push(0);
                mauDataMonthly.push(0);
                channelDataMonthly.push(0);
                messageDataMonthly.push(0);
              }

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

            that.setState({
              chartMonthly: chartMonthly
            });

            var stat = data[data.length - 1];

            that.setState({
              'currentMonth': MONTH_NAMES_LONG[new Date(stat.month).getMonth()],
              'newUsers': stat.newUserCount,
              'conversations': stat.channelCount,
              'messages': stat.newMessageCount,
              'active': stat.activeUserCount || 0,
              'leads': '0',
              'online': '0',
              'assigned': '0',
            });
          }
        } else {
        }
      });

    axios.get(getConfig().applozicPlugin.statsFilterUrl.replace(":appKey", application.key) + "&startTime=" + startTime + "&endTime=" + endTime, { headers: { "Apz-AppId": application.applicationId, "Apz-Token": "Basic " + apzToken, "Content-Type": "application/json", "Authorization": "Basic " + userSession.authorization, "Apz-Product-App": true } })
      .then(function (response) {
        if (response.status == 200) {
          var data = response.data;
          var messageData = [];
          var userData = [];
          var channelData = [];
          if (data.length > 0) {
            let lastDate = null;
            for (var i = 0; i < data.length; i++) {
              var obj = data[i];
              var datetime = new Date(obj.onDateTime);

              if (lastDate == null) {
                lastDate = datetime;
              }
              for (var gap = lastDate.getDate() + 1; gap < datetime.getDate(); gap++) {
                labels.push(MONTH_NAMES[lastDate.getMonth()] + " " + gap);
                messageData.push(0);
                userData.push(0);
                channelData.push(0);
              }

              lastDate = datetime;
              labels.push(MONTH_NAMES[datetime.getMonth()] + " " + datetime.getDate());
              messageData.push(obj.messageCount);
              userData.push(obj.userCount);
              channelData.push(obj.channelCount);
              that.state.chartUperLimit = that.findMax(that.state.chartUperLimit, obj.messageCount, obj.userCount);
            }
          }

          var mainChart = Object.assign({}, that.state.mainChart);
          mainChart.labels = labels;
          mainChart.datasets[0].data = userData;
          mainChart.datasets[2].data = channelData;
          mainChart.datasets[3].data = messageData;

          that.setState({
            'mainChart': mainChart
          });

          let chart = that.state.chart;
          chart.labels = labels;
          chart.datasets = [{}];
          chart.datasets[0] = that.state.mainChart.datasets[0];
          //chart.datasets[0].label = 'Users';
          //chart.datasets[0].data = userData;

          that.setState({
            'chart': chart
          });
        } else {
        }
      });

    axios.get(getConfig().kommunicateApi.subscriptionCount)
      .then(function (response) {
        that.setState({ offerRemaining: (100 - parseInt(response.data)) });
      });
  }

  render() {
    return (
      <div className="animated fadeIn early-bird-card">

        <EarlyBirdOffer OfferPercent={'75'} remainingOffers={this.state.offerRemaining} />
      
      <div className="animated fadeIn dashboard-card">
      
        <div className="row">
          <div className="col-sm-6 col-lg-3 text-center">
            <div className="card card-inverse card-stats card-stats--users active" data-metric="0" onClick={this.showChart}>

              <div className="card-block pb-0 text-left">
                <p className="card-stats-month">{this.state.currentMonth}</p>
                <p className="card-main-title text-center">Users</p>
                <h4 className="card-stats-value text-center" data-metric="0">{this.state.newUsers}</h4>
                <p className="card-sub-title text-center">Last month: {this.state.lastMonthStats.newUserCount}</p>
              </div>
              <div className="vertical-line"></div>
            </div>

          </div>

          <div className="col-sm-6 col-lg-3 text-center">
            <div className="card card-inverse card-stats card-stats--mau" data-metric="1" onClick={this.showChart}>
              <div className="card-block pb-0 text-left">
                <p className="card-stats-month">{this.state.currentMonth}</p>
                <p className="card-main-title text-center">Chat Users</p>
                <h4 className="card-stats-value text-center">{this.state.active}</h4>
                <p className="card-sub-title text-center">Last month: {this.state.lastMonthStats.activeUserCount}</p>
              </div>
              <div className="vertical-line"></div>
            </div>

          </div>

          <div className="col-sm-6 col-lg-3 text-center">
            <div className="card card-inverse card-stats card-stats--conversations" data-metric="2" onClick={this.showChart}>
              <div className="card-block pb-0 text-left">
                <p className="card-stats-month">{this.state.currentMonth}</p>
                <p className="card-main-title text-center">Conversations</p>
                <h4 className="card-stats-value text-center">{this.state.conversations}</h4>
                <p className="card-sub-title text-center">Last month: {this.state.lastMonthStats.channelCount}</p>
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
              <div className="card-block pb-0 text-left">
                <p className="card-stats-month">{this.state.currentMonth}</p>
                <p className="card-main-title text-center">Messages</p>
                <h4 className="card-stats-value text-center">{this.state.messages}</h4>
                <p className="card-sub-title text-center">Last month: {this.state.lastMonthStats.newMessageCount}</p>
              </div>
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
            <div className="chart-wrapper" style={{ height: 200 + 'px', marginTop: 40 + 'px' }}>
              <Line data={this.state.chart} options={this.mainChartOpts} height={200} />
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
      </div>
    )
  }
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
const MONTH_NAMES_LONG = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default Dashboard;
