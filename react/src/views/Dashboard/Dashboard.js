import React, { Component } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Dropdown, DropdownMenu, DropdownItem, Progress } from 'reactstrap';
import { getConfig } from '../../config/config.js';
import CommonUtils from '../../utils/CommonUtils';
import './Dashboard.css';
import EarlyBirdOffer from '../.../../../components/EarlyBirdOffer/EarlyBirdOffer';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { getUsersByType, getConversationStatsByDayAndMonth } from '../../utils/kommunicateClient';
import { USER_TYPE } from '../../utils/Constant'
import Checkbox from '../../components/Checkbox/Checkbox'
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

    let subscription = CommonUtils.getUserSession().subscription;
    if (typeof CommonUtils.getUserSession().subscription === 'undefined' || CommonUtils.getUserSession().subscription == '' || CommonUtils.getUserSession().subscription == '0') {
      subscription = 'startup';
    }

    this.toggle = this.toggle.bind(this);
    this.state = {
      last30Days : [],
      agentFilterOption: [{ label: "All Agents", value: "allagents" }],
      timeFilterSelectedOption: { label: "Last 7 days", value: 7 },
      agentFilterSelectedOption: { label: "All agents", value: "allagents" },
      newConversationCount: 0,
      closedConversationCount: 0,
      avgResponseTime: [],
      avgResolutionTime:[],
      subscription: subscription,
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
      chartHourly: {
        labels: [],
        datasets: [
          {
            label: 'New Conversations',
            backgroundColor: 'rgba(92,90,167,0.25)',
            borderColor: '#5c5aa7',
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: [],
          },
          {
            label: 'Closed Conversations',
            backgroundColor: 'rgba(92,90,167,0.25)',
            borderColor: '#5c5aa7',
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: [],
          },
          {
            label: 'First Responsetime',
            backgroundColor: 'rgba(92,90,167,0.25)',
            borderColor: '#5c5aa7',
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: [],
          },
          {
            label: 'Resolution Time',
            backgroundColor: 'rgba(92,90,167,0.25)',
            borderColor: '#5c5aa7',
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: [],
          }
        ]
      },
      chartDaily: {
        labels: [],
        datasets: [
          {
            label: 'New Conversations',
            backgroundColor: 'rgba(92,90,167,0.25)',
            borderColor: '#5c5aa7',
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: [],
          },
          {
            label: 'Closed Conversations',
            backgroundColor: 'rgba(92,90,167,0.25)',
            borderColor: '#5c5aa7',
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: [],
          },
          {
            label: 'First Responsetime',
            backgroundColor: 'rgba(92,90,167,0.25)',
            borderColor: '#5c5aa7',
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: [],
          },
          {
            label: 'Resolution Time',
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
            label: 'New Conversations',
            backgroundColor: 'rgba(92,90,167,0.25)',
            borderColor: '#5c5aa7',
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: [],
          },
          {
            label: 'Closed Conversations',
            backgroundColor: 'rgba(92,90,167,0.25)',
            borderColor: '#5c5aa7',
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: [],
          },
          {
            label: 'First Responsetime',
            backgroundColor: 'rgba(92,90,167,0.25)',
            borderColor: '#5c5aa7',
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: [],
          },
          {
            label: 'Resolution Time',
            backgroundColor: 'rgba(92,90,167,0.25)',
            borderColor: '#5c5aa7',
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: [],
          }
        ]
      },
      // chartMonthly: {
      //   labels: [],
      //   datasets: [
      //     {
      //       label: 'Users',
      //       backgroundColor: 'rgba(92,90,167,0.25)',
      //       borderColor: '#5c5aa7',
      //       pointHoverBackgroundColor: '#fff',
      //       borderWidth: 2,
      //       data: [],
      //     },
      //     {
      //       label: 'Chat Users',
      //       backgroundColor: 'rgba(92,90,167,0.25)',
      //       borderColor: '#5c5aa7',
      //       pointHoverBackgroundColor: '#fff',
      //       borderWidth: 2,
      //       data: [],
      //     },
      //     {
      //       label: 'Conversations',
      //       backgroundColor: 'rgba(92,90,167,0.25)',
      //       borderColor: '#5c5aa7',
      //       pointHoverBackgroundColor: '#fff',
      //       borderWidth: 2,
      //       data: [],
      //     },
      //     {
      //       label: 'Messages',
      //       backgroundColor: 'rgba(92,90,167,0.25)',
      //       borderColor: '#5c5aa7',
      //       pointHoverBackgroundColor: '#fff',
      //       borderWidth: 2,
      //       data: [],
      //     }
      //   ]
      // },
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

  getAllUsers = (applicationId) => {
    let agentFilterOption = this.state.agentFilterOption
    return Promise.resolve(getUsersByType(applicationId, [USER_TYPE.AGENT, USER_TYPE.ADMIN])).then(data => {
      data.map((user, index) => {
        agentFilterOption.push({ label: user.name, value: user.email })
      })
      this.setState({ agentFilterOption: agentFilterOption })
    }).catch(err => {
      console.log("err while fetching users list ", err);
    });
  }


  componentDidMount() {
    //  var env = getEnvironmentId();
    let userSession = CommonUtils.getUserSession();
    var application = userSession.application;
    this.getAllUsers(application.applicationId);
    this.filterConversationDetails(this.state.timeFilterSelectedOption.value, this.state.agentFilterSelectedOption.value)
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

    //new
    //Hourly
    var newConversationHourly = [];
    var closedConversationHourly = [];
    var firstResponseTimeHourly = [];
    var resolutionTimeHourly = [];

    //Daily
    var newConversationDaily = [];
    var closedConversationDaily = [];
    var firstResponseTimeDaily = [];
    var resolutionTimeDaily = [];
    
    //Monthly
    var newConversationMonthly = [];
    var closedConversationMonthly = [];
    var firstResponseTimeMonthly = [];
    var resolutionTimeMonthly = [];
    

    var labelMonthly = [];
    var labels = [];
    //rest/ws/stats/filter?appKey=agpzfmFwcGxvemljchgLEgtBcHBsaWNhdGlvbhiAgICAuqiOCgw&startTime=1498847400000&endTime=1501352999000
    // axios.get(statsUrl, { headers: { "Apz-AppId": application.applicationId, "Apz-Token": "Basic " + apzToken, "Access-Token": userSession.password, "Authorization": "Basic " + userSession.authorization, "Content-Type": "application/json", "Apz-Product-App": true } })
    //   .then(function (response) {
    //     if (response.status == 200) {
    //       var data = response.data;

    //       if (data.length >= 2) {
    //         var lastMonthStats = data[data.length - 2];
    //         that.setState({ 'lastMonthStats': lastMonthStats });
    //       } else {
    //         let lastMonthSubTitle = document.getElementsByClassName("card-sub-title");
    //         for (var i = 0; i < lastMonthSubTitle.length; i++) {
    //           lastMonthSubTitle[i].classList.add('n-vis');
    //         }
    //       }

    //       if (data.length > 0) {

    //         let lastDate = null;

    //         for (var i = 0; i < data.length; i++) {
    //           var obj = data[i];
    //           var datetime = new Date(obj.month);

    //           if (lastDate == null) {
    //             lastDate = datetime;
    //           }
    //           for (var gap = lastDate.getMonth() + 1; gap < datetime.getMonth(); gap++) {
    //             labelMonthly.push(MONTH_NAMES[lastDate.getMonth()]);
    //             userDataMonthly.push(0);
    //             mauDataMonthly.push(0);
    //             channelDataMonthly.push(0);
    //             messageDataMonthly.push(0);
    //           }

    //           labelMonthly.push(MONTH_NAMES[datetime.getMonth()]);
    //           userDataMonthly.push(obj.newUserCount);
    //           mauDataMonthly.push(obj.activeUserCount);
    //           channelDataMonthly.push(obj.channelCount);
    //           messageDataMonthly.push(obj.newMessageCount);
    //           //that.state.chartUperLimit=that.findMax(that.state.chartUperLimit,obj.messageCount,obj.userCount);
    //         }

    //         var chartMonthly = that.state.chartMonthly;
    //         chartMonthly.labels = labelMonthly;
    //         chartMonthly.datasets[0].data = userDataMonthly;
    //         chartMonthly.datasets[1].data = mauDataMonthly;
    //         chartMonthly.datasets[2].data = channelDataMonthly;
    //         chartMonthly.datasets[3].data = messageDataMonthly;

    //         that.setState({
    //           chartMonthly: chartMonthly
    //         });

    //         var stat = data[data.length - 1];

    //         that.setState({
    //           'currentMonth': MONTH_NAMES_LONG[new Date(stat.month).getMonth()],
    //           'newUsers': stat.newUserCount,
    //           'conversations': stat.channelCount,
    //           'messages': stat.newMessageCount,
    //           'active': stat.activeUserCount || 0,
    //           'leads': '0',
    //           'online': '0',
    //           'assigned': '0',
    //         });
    //       }
    //     } else {
    //     }
    //   });

    // axios.get(getConfig().applozicPlugin.statsFilterUrl.replace(":appKey", application.key) + "&startTime=" + startTime + "&endTime=" + endTime, { headers: { "Apz-AppId": application.applicationId, "Apz-Token": "Basic " + apzToken, "Content-Type": "application/json", "Authorization": "Basic " + userSession.authorization, "Apz-Product-App": true } })
    //   .then(function (response) {
    //     if (response.status == 200) {
    //       var data = response.data;
    //       var messageData = [];
    //       var userData = [];
    //       var channelData = [];
    //       if (data.length > 0) {
    //         let lastDate = null;
    //         for (var i = 0; i < data.length; i++) {
    //           var obj = data[i];
    //           var datetime = new Date(obj.onDateTime);

    //           if (lastDate == null) {
    //             lastDate = datetime;
    //           }
    //           for (var gap = lastDate.getDate() + 1; gap < datetime.getDate(); gap++) {
    //             labels.push(MONTH_NAMES[lastDate.getMonth()] + " " + gap);
    //             messageData.push(0);
    //             userData.push(0);
    //             channelData.push(0);
    //           }

    //           lastDate = datetime;
    //           labels.push(MONTH_NAMES[datetime.getMonth()] + " " + datetime.getDate());
    //           messageData.push(obj.messageCount);
    //           userData.push(obj.userCount);
    //           channelData.push(obj.channelCount);
    //           that.state.chartUperLimit = that.findMax(that.state.chartUperLimit, obj.messageCount, obj.userCount);
    //         }
    //       }

    //       var mainChart = Object.assign({}, that.state.mainChart);
    //       mainChart.labels = labels;
    //       mainChart.datasets[0].data = userData;
    //       mainChart.datasets[2].data = channelData;
    //       mainChart.datasets[3].data = messageData;

    //       that.setState({
    //         'mainChart': mainChart
    //       });

    //       let chart = that.state.chart;
    //       chart.labels = labels;
    //       chart.datasets = [{}];
    //       chart.datasets[0] = that.state.mainChart.datasets[0];
    //       //chart.datasets[0].label = 'Users';
    //       //chart.datasets[0].data = userData;

    //       that.setState({
    //         'chart': chart
    //       });
    //     } else {
    //     }
    //   });

    axios.get(getConfig().kommunicateApi.subscriptionCount)
      .then(function (response) {
        that.setState({ offerRemaining: Math.max((70 - parseInt(response.data)), 3)});
      });
  }
  
  filterConversationDetails = (timeFilterSelectedOption, agentFilterSelectedOption) => {
    return Promise.resolve(getConversationStatsByDayAndMonth(timeFilterSelectedOption, agentFilterSelectedOption)).then(res => {
      console.log(res);
      let newConversationCount = 0 ;
      let closedConversationCount = 0 ;
      // let newConversationCount = res.data.response.newConversation[0].count;
      // let closedConversationCount = res.data.response.closedConversation[0].count;
    
      var startDate = new Date();
      startDate.setDate(startDate.getDate()-30);

      var endDate = new Date();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
      ];
      
      var getLast30days = function(start, end,) {
        var arr = new Array();
        var dt = new Date(start);
        while (dt <= end) {
            var dateFormat =  monthNames[dt.getMonth()]+ " " + dt.getDate();
            arr.push(dateFormat);
            dt.setDate(dt.getDate() + 1);
        }
        return arr;    
      }
      var last30Days = getLast30days(startDate, endDate);
      this.setState({last30Days:last30Days})
      
      
      
      
      let avgResponseTime = res.data.response.avgResponseTime[0].average;
      let avgResolutionTime = res.data.response.avgResolutionTime[0].average;
      if(res.data.response.newConversation.length > 0){
        let n_conversationCount = res.data.response.newConversation.map ((item,index) => {
          return item.count
        })  
        for (var i  = 0; i < n_conversationCount.length; i++){
          newConversationCount  += n_conversationCount[i];
        }
        this.setState({newConversationCount:newConversationCount})
      }
      else{
        this.setState({newConversationCount: 0 }) 
      }
      if(res.data.response.closedConversation.length > 0){
        let c_conversationCount = res.data.response.closedConversation.map ((item,index) => {
          return item.count
        })
        
        for (var i  = 0; i < c_conversationCount.length; i++){
          closedConversationCount  += c_conversationCount[i];
        }
        this.setState({closedConversationCount:closedConversationCount})
         
      }
      else {
        this.setState({closedConversationCount: 0 })
      }
      
      
      
      var date = new Date(null);
      date.setSeconds(avgResponseTime); // specify value for SECONDS here
      var result = date.toISOString().substr(11, 8);
      console.log(result)
      
      return Promise.resolve(this.secondsToHms(avgResponseTime)).then(res =>{
        this.setState({avgResponseTime:res})
        
        Promise.resolve(this.secondsToHms(avgResolutionTime)).then(resp =>{
          this.setState({avgResolutionTime:resp})
        })
      })
      // this.secondsToHms(avgResponseTime)
      // this.secondsToHms(avgResolutionTime)
    }).catch(err => {
      console.log(err);
    });
  }
  
  secondsToHms = (d) => {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    
    var hDisplay = h > 0 ? (h == 1 ? " hr, " : " hrs, ") : "";
    var mDisplay = m > 0 ? (m == 1 ? " min, " : " mins, ") : "";
    var sDisplay = s > 0 ? (s == 1 ? " sec" : " secs") : "";
    // return hDisplay + mDisplay + sDisplay;
    // return {h:hDisplay,m:mDisplay,s:sDisplay }
    return {hrDigit:h, hrText:hDisplay, minDigit:m, minText:mDisplay, secDigit:s, secText:sDisplay}
   
     
}
  timeFilterHandleChange = (timeFilterSelectedOption) => {
    this.setState({ timeFilterSelectedOption });
    console.log(`Time Filter Selected: ${timeFilterSelectedOption.value}`);
    console.log("Agent Filter Selected:", this.state.agentFilterSelectedOption.value);
    this.filterConversationDetails(`${timeFilterSelectedOption.value}`, this.state.agentFilterSelectedOption.value);
  }
  agentFilterHandleChange = (agentFilterSelectedOption) => {
    this.setState({ agentFilterSelectedOption });
    console.log("Time Filter Selected:", this.state.timeFilterSelectedOption.value);
    console.log(`Agent Filter Selected: ${agentFilterSelectedOption.value}`);
    this.filterConversationDetails(this.state.agentFilterSelectedOption.value, `${agentFilterSelectedOption.value}` );
  }


  render() {
    let names = [];
    const { timeFilterSelectedOption } = this.state;
    const { agentFilterSelectedOption } = this.state;
    return (
      <div className="animated fadeIn early-bird-card">
        {this.state.subscription == 'startup' ?
          <EarlyBirdOffer OfferPercent={'75'} remainingOffers={this.state.offerRemaining} />
          :
          null
        }
        <div className="animated fadeIn dashboard-card">
          {/* new design */}
          <div className="row">
            <div className="col-lg-2 col-sm-4">
              <Select
                name="km-dashboard-time-filter"
                clearable={false}
                searchable={false}
                value={timeFilterSelectedOption}
                onChange={this.timeFilterHandleChange}
                options={[
                  { label: 'Today', value: 0 },
                  { label: 'Yesterday', value: 1 },
                  { label: 'Last 7 days', value: 7 },
                  { label: 'Last 30 days', value: 30 }
                ]}
              />
            </div>
            <div className="col-lg-2 col-sm-4">
              <Select
                name="km-dashboard-agent-filter"
                value={agentFilterSelectedOption}
                clearable={false}
                searchable={false}
                onChange={this.agentFilterHandleChange}
                options={this.state.agentFilterOption}
              />
            </div>
            <div className="col-lg-4 col-sm-4">
              <Checkbox idCheckbox={'some-checkbox'} label={'Show 24 hour distribution'} />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 col-lg-3 ">
                <div className="card-block pb-0 text-left">
                  <div className="card-inner-block active">
                    <h4 className="card-count">{this.state.newConversationCount}</h4>
                    <p className="card-count-title">New Conversations</p>
                  </div>  
                </div>
            </div>

            <div className="col-sm-6 col-lg-3">
                <div className="card-block pb-0 text-left">
                  <div className="card-inner-block">
                    <h4 className="card-count">{this.state.closedConversationCount}</h4>
                    <p className="card-count-title">Closed Conversations</p>
                  </div>  
                </div>
            </div>

            <div className="col-sm-6 col-lg-3">
                <div className="card-block pb-0 text-left">
                  <div className="card-inner-block"> 
                  <h4 className="card-count">
                    <span className="card-time-digit">{this.state.avgResponseTime.hrDigit}</span>
                    <span className="card-time-text">{this.state.avgResponseTime.hrText}</span>
                    <span className="card-time-digit">{this.state.avgResponseTime.minDigit}</span>
                    <span className="card-time-text">{this.state.avgResponseTime.minText}</span>
                    <span className="card-time-digit">{this.state.avgResponseTime.secDigit}</span>
                    <span className="card-time-text">{this.state.avgResponseTime.secText}</span>    
                  </h4>
                  <p className="card-count-title">First Response Time</p>
                  </div>  
                </div>
            </div>

            <div className="col-sm-6 col-lg-3">
                <div className="card-block pb-0 text-left">
                  <div className="card-inner-block">
                    <h4 className="card-count">
                    <span className="card-time-digit">{this.state.avgResolutionTime.hrDigit}</span>
                    <span className="card-time-text">{this.state.avgResolutionTime.hrText}</span>
                    <span className="card-time-digit">{this.state.avgResolutionTime.minDigit}</span>
                    <span className="card-time-text">{this.state.avgResolutionTime.minText}</span>
                    <span className="card-time-digit">{this.state.avgResolutionTime.secDigit}</span>
                    <span className="card-time-text">{this.state.avgResolutionTime.secText}</span>    
                    </h4>
                    <p className="card-count-title">Resolution Time</p>
                  </div>
                </div>
            </div>

          </div>

          <div className="card">
            <div className="card-block">
              <div className="row">
              </div>
              <div className="chart-wrapper" style={{ height: 200 + 'px', marginTop: 40 + 'px' }}>
                <Line data={this.state.chart} options={this.mainChartOpts} height={200} />
              </div>
            </div>


          </div>

          {/* old design */}
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
