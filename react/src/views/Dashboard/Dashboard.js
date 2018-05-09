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
      last30Days: [],
      last7days: [],
      agentFilterOption: [{ label: "All Agents", value: "allagents" }],
      timeFilterSelectedOption: { label: "Last 7 days", value: 7 },
      agentFilterSelectedOption: { label: "All agents", value: "allagents" },
      displayTotalCounts:{newConversationCount:0, closedConversationCount:0},
      dataKey: { 
        newConversation: 0, 
        closedConversation: 1, 
        responseTime: 2, 
        resolutionTime: 3 
      },
      dataDay: 7,
      // newConversationCount: 0,
      // closedConversationCount: 0,
      month: 30,
      hoursDistribution: [],
      avgResponseTime: [],
      avgResolutionTime: [],
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
      dayWiseTotalNoOfCountAndAvgs : {
        newConversation: 0,
        closedConversation:0,
        avgResponseTime: 0,
        avgResolutionTime: 0
      },
      last7DaysTotalNoOfCountAndAvgs : {
        newConversation: 0,
        closedConversation:0,
        avgResponseTime: 0,
        avgResolutionTime: 0
      },
      last30DaysTotalNoOfCountAndAvgs : {
        newConversation: 0,
        closedConversation:0,
        avgResponseTime: 0,
        avgResolutionTime: 0
      },
      dayWiseStats: {
        newConversationCount: 0,
        closedConversationCount: 0,
        avgResponseTime: 0,
        avgResolutionTime: 0
      },
      // yesterdaysStats: {
      //   newConversationCount: 0,
      //   closedConversationCount: 0,
      //   avgResponseTime: 0,
      //   avgResolutionTime: 0
      // },
      last7daysStats: {
        newConversationCount: 0,
        closedConversationCount: 0,
        avgResponseTime: 0,
        avgResolutionTime: 0
      },
      last30daysStats: {
        newConversationCount: 0,
        closedConversationCount: 0,
        avgResponseTime: 0,
        avgResolutionTime: 0
      },
      // lastMonthStats: {
      //   newUserCount: 0,
      //   activeUserCount: 0,
      //   channelCount: 0,
      //   newMessageCount: 0
      // },
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
      chartForADay: {
        labels: [],
        datasets: [
          {
            id:"7days",
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
      chartForYesterday: {
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
      chartForLast7Days: {
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
      chartForLast30Days: {
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
        display: false
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
      options: {
        scaleShowVerticalLines: false
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
  displayChart = (e) => {
    let chartState = "";
    let currentTarget = e.currentTarget;
    var cards = document.getElementsByClassName("card-stats");

    if (currentTarget.dataset.day == 0 || currentTarget.dataset.day == 1){
      chartState = "chartForADay"
    } else {
      chartState = "chartForLast"+currentTarget.dataset.day+"Days";
    }

    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.remove('active');
    }

    currentTarget.classList.add('active');
    let chart = this.state.chart
    let getChartInfo = this.state[chartState];
    // let getChartInfoNewConversations = getChartInfo.datasets[0];
    chart.labels = getChartInfo.labels;
    let key = parseInt(currentTarget.dataset.key);
    chart.datasets[0].data = getChartInfo.datasets[key].data;
    this.setState({chart: chart},this.abc());

  }
  displayInitialChart = (day) => {
    let chartState = "";
    if (day == 0 || day ==1 ) {
      chartState = "chartForADay"
    } else {
      chartState = "chartForLast"+day+"Days";
    }
   
    var cards = document.getElementsByClassName("card-stats");

    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.remove('active');
    }
    cards[0].classList.add('active');
    let chart = this.state.chart
    let getChartInfo = this.state[chartState];
    // let getChartInfoNewConversations = getChartInfo.datasets[0];
    chart.labels = getChartInfo.labels;
    chart.datasets[0].data = getChartInfo.datasets[0].data;
    this.setState({chart: chart},this.abc());

  }
  displayAllTotalCounts = (day) => {
    // this.millisToMinutesAndSeconds(14624)
    let countState = "";
    let totalNoOfCountState = "";
    if (day == 0 || day == 1) {
      countState = "dayWiseStats";
      totalNoOfCountState = "dayWiseTotalNoOfCountAndAvgs";
    } else {
      countState = "last"+day+"daysStats";
      totalNoOfCountState = "last"+day+"DaysTotalNoOfCountAndAvgs";
    }
    let getTotalCount = this.state[countState];
    let getTotalNoOfCountAndAvgs = this.state[totalNoOfCountState]
    let displayTotalCounts = this.state.displayTotalCounts;
    console.log(getTotalCount);
    displayTotalCounts.newConversationCount = getTotalCount.newConversationCount;
    displayTotalCounts.closedConversationCount = getTotalCount.closedConversationCount;
    this.setState({displayAllTotalCounts:displayTotalCounts});

    if(day == 0 || day ==1) {
      let s = getTotalCount.avgResponseTime == 0 ? getTotalCount.avgResponseTime : (getTotalCount.avgResponseTime / getTotalNoOfCountAndAvgs.avgResponseTime) ;
      return Promise.resolve(this.millisToMinutesAndSeconds(s)).then(res => {
        // avgResponseTime.last7Days = res
        this.setState({ avgResponseTime: res })
        let t = getTotalCount.avgResolutionTime == 0 ? getTotalCount.avgResolutionTime : (getTotalCount.avgResolutionTime) / getTotalNoOfCountAndAvgs.avgResolutionTime ;
        Promise.resolve(this.secondsToHms(t)).then(resp => {
        // avgResolutionTime.last7Days = resp
        this.setState({ avgResolutionTime: resp })
      })
      this.displayInitialChart(day)
     
      }).catch(err => {
      console.log(err);
      });
    } 
    // else if (day == 7) {
    //   return Promise.resolve(this.millisToMinutesAndSeconds((getTotalCount.avgResponseTime) / getTotalNoOfCountAndAvgs.avgResponseTime)).then(res => {
    //     // avgResponseTime.last7Days = res
    //     this.setState({ avgResponseTime: res })
    //     Promise.resolve(this.secondsToHms((getTotalCount.avgResolutionTime) / getTotalNoOfCountAndAvgs.avgResolutionTime)).then(resp => {
    //       // avgResolutionTime.last7Days = resp
    //       this.setState({ avgResolutionTime: resp });
    //       this.displayInitialChart(day)
    //     })

    //   }).catch(err => {
    //     console.log(err);
    //   });
    // }
    else {
      let s = getTotalCount.avgResponseTime == 0 ? getTotalCount.avgResponseTime : (getTotalCount.avgResponseTime / getTotalNoOfCountAndAvgs.avgResponseTime) ;
      return Promise.resolve(this.millisToMinutesAndSeconds(s)).then(res => {
        // avgResponseTime.last7Days = res
        this.setState({ avgResponseTime: res });
        let t = getTotalCount.avgResolutionTime == 0 ? getTotalCount.avgResolutionTime : (getTotalCount.avgResolutionTime) / getTotalNoOfCountAndAvgs.avgResolutionTime ;
         return Promise.resolve(this.secondsToHms(t)).then(resp => {
          // avgResolutionTime.last7Days = resp
          this.setState({ avgResolutionTime: resp });
          this.displayInitialChart(day)
        })

      }).catch(err => {
        console.log(err);
      });
    }   
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
    this.filterConversationDetails(30, "allagents")
    var that = this;
    var endTime = new Date().getTime();
    var today = new Date();
    today.setDate(1);
    var startTime = today.getTime();
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
        that.setState({ offerRemaining: Math.max((70 - parseInt(response.data)), 3) });
      });
  }
  filterConversationDetails = (timeFilterSelectedOption, agentFilterSelectedOption) => {
    let last30DaysYYYYMMDD = [];
    let last7DaysYYYYMMDD = [];
    let dayWiseData = { newConversation: [], closedConversation: [], avgResolutionTime: [], avgResponseTime: [] };
    let last30DaysData = { newConversation: [], closedConversation: [], avgResolutionTime: [], avgResponseTime: [] };
    let last7DaysData = { newConversation: [], closedConversation: [], avgResolutionTime: [], avgResponseTime: [] };
    let dayWiseStats = this.state.dayWiseStats;
    let last7daysStats = this.state.last7daysStats;
    let last30daysStats = this.state.last30daysStats;
    let chartForLast30Days = this.state.chartForLast30Days;
    let chartForLast7Days = this.state.chartForLast7Days;
    let chartForYesterday = this.state.chartForYesterday;
    let chartForADay = this.state.chartForADay;
    let last7DaysTotalNoOfCountAndAvgs = this.state.last7DaysTotalNoOfCountAndAvgs;
    let last30DaysTotalNoOfCountAndAvgs = this.state.last30DaysTotalNoOfCountAndAvgs;
    let dayWiseTotalNoOfCountAndAvgs = this.state.dayWiseTotalNoOfCountAndAvgs;

    let today = new Date();

    let date1DayAgo = new Date();
    date1DayAgo.setDate(today.getDate() - 1);
    let date1DayAgoInmSec = date1DayAgo.getTime();

    let date2DaysAgo = new Date();
    date2DaysAgo.setDate(today.getDate() - 2);
    let date2DaysAgoInmSec = date2DaysAgo.getTime();

    let date7DaysAgo = new Date();
    date7DaysAgo.setDate(today.getDate() - 6);
    let date7DaysAgoInmSec = date7DaysAgo.getTime();

    let date8DaysAgo = new Date();
    date8DaysAgo.setDate(today.getDate() - 7);
    let date8DaysAgoInmSec = date8DaysAgo.getTime();

    let date30DaysAgo = new Date();
    date30DaysAgo.setDate(today.getDate() - 29);
    let date30DaysAgoInmSec = date30DaysAgo.getTime();

    let date31DaysAgo = new Date();
    date31DaysAgo.setDate(today.getDate() - 30);
    let date31DaysAgoInmSec = date31DaysAgo.getTime();

    return Promise.resolve(this.getLastdays(date7DaysAgo, today)).then(last7days => {
      chartForLast7Days.labels = last7days.mmdd;
      last7DaysYYYYMMDD = last7days.yyyymmdd
      this.setState({ chartForLast7Days: chartForLast7Days })

      Promise.resolve(this.getLastdays(date30DaysAgo, today)).then(last30days => {
        console.log(last30days);
        chartForLast30Days.labels = last30days.mmdd;
        last30DaysYYYYMMDD = last30days.yyyymmdd
        this.setState({ chartForLast30Days: chartForLast30Days })
        console.log(last7DaysYYYYMMDD, last30DaysYYYYMMDD)
      });
      
      for (let i = 0; i <= 23; i++) {
        dayWiseData.newConversation.push(0);
        dayWiseData.closedConversation.push(0);
        dayWiseData.avgResponseTime.push(null);
        dayWiseData.avgResolutionTime.push(null);
      }
    
      for (let i = 0; i <= 29; i++) {
      last30DaysData.newConversation.push(0);
      last30DaysData.closedConversation.push(0);
      last30DaysData.avgResponseTime.push(null);
      last30DaysData.avgResolutionTime.push(null);
    }
    for (let i = 0; i <= 6; i++) {
      last7DaysData.newConversation.push(0);
      last7DaysData.closedConversation.push(0);
      last7DaysData.avgResponseTime.push(null);
      last7DaysData.avgResolutionTime.push(null);
    }
    console.log(last30DaysData, last7DaysData)
    let hoursDistribution = [];
    for (var i = 0; i < 24; i++) {
      let hour = i > 9 ? "" + i : "0" + i;
      hoursDistribution.push(hour + ":00");
    }
    // let chartForADay =  this.state.chartForADay
    // let chartForYesterday = this.state.chartForYesterday
    chartForADay.labels = hoursDistribution;
    chartForYesterday.labels = hoursDistribution;
    this.setState({
      chartForADay: chartForADay,
      chartForYesterday: chartForADay
    })
    console.log(hoursDistribution)
    // this.setState({ hoursDistribution: hoursDistribution })
    
    return Promise.resolve(getConversationStatsByDayAndMonth(timeFilterSelectedOption, agentFilterSelectedOption)).then(res => {
      console.log(res);
      let countForADay ={newConversationCount:0, closedConversationCount:0, avgResponseTime:0, avgResolutionTime:0}
      let closedConversationCount = { today: 0, yesterday: 0, last7Days: 0, last30Days: 0 };
      let newConversationCount = { today: 0, yesterday: 0, last7Days: 0, last30Days: 0 };
      let avgResolutionTime = { today: 0, yesterday: 0, last7Days: 0, last30Days: 0 };
      let avgResponseTime = { today: 0, yesterday: 0, last7Days: 0, last30Days: 0 };
      
      let totalNoOfNewCoversations = {dayWise : 0, last7Days:0, last30Days:0 };
      let totalNoOfClosedCoversations = {dayWise : 0, last7Days:0, last30Days:0 };
      let totalNoOfResponse = {dayWise : 0, last7Days:0, last30Days:0 };
      let totalNoOfResolutions = {dayWise : 0, last7Days:0, last30Days:0 };
      // let newConversationCount = 0;
      // let closedConversationCount = 0;
      
    if(res.data.key == 2 ) {
      if (res.data.response.newConversation.length) {      
        //Filter Closed Conversation Count 
        res.data.response.newConversation.map((item, index) => {
          totalNoOfNewCoversations.dayWise++;
          countForADay.newConversationCount += item.count;
          let getIndex = hoursDistribution.indexOf(item.HOUR);
          dayWiseData.newConversation.splice(getIndex, 1, item.count); 
        })    
      }  
      res.data.response.closedConversation.map((item, index) => {
          totalNoOfClosedCoversations.dayWise++;
          countForADay.closedConversationCount += item.count;
          let getIndex = hoursDistribution.indexOf(item.HOUR);
          
          dayWiseData.closedConversation.splice(getIndex, 1, item.count);
        })
        res.data.response.avgResponseTime.map((item, index) => {
          totalNoOfResponse.dayWise++;
          let avgResponseTime = item.average === null ? item.average : parseFloat(item.average)
          countForADay.avgResponseTime += avgResponseTime;
          let getIndex = hoursDistribution.indexOf(item.HOUR);
          // let minutes = Math.floor(avgResponseTime / 60000);
          // let seconds = ((avgResponseTime % 60000) / 1000).toFixed(0);
          // let time= minutes + "." + (seconds < 10 ? '0' : '') + seconds;
          return Promise.resolve(this.milliToMSToDispalyInsideChart(parseFloat(item.average))).then(res => { 
            dayWiseData.avgResponseTime.splice(getIndex, 1, res);
          }).catch(err => {
          console.log(err);
          });
          // dayWiseData.avgResponseTime.splice(getIndex, 1, time);
        })
        res.data.response.avgResolutionTime.map((item, index) => {
          totalNoOfResolutions.dayWise++;
          let avgResolutionTime = item.average === null ? item.average : parseFloat(item.average)
          countForADay.avgResolutionTime += avgResolutionTime;
          let getIndex = hoursDistribution.indexOf(item.HOUR);
          return Promise.resolve(this.secondsToHmsToDispalyInsideChart(avgResolutionTime)).then(res => { 
            dayWiseData.avgResolutionTime.splice(getIndex, 1, res);
          }).catch(err => {
          console.log(err);
          });
          
        })

        
        dayWiseTotalNoOfCountAndAvgs.newConversation = totalNoOfNewCoversations.dayWise;
        dayWiseTotalNoOfCountAndAvgs.closedConversation = totalNoOfClosedCoversations.dayWise;
        dayWiseTotalNoOfCountAndAvgs.avgResponseTime = totalNoOfResponse.dayWise;
        dayWiseTotalNoOfCountAndAvgs.avgResolutionTime = totalNoOfResolutions.dayWise;
        
        dayWiseStats.newConversationCount = countForADay.newConversationCount;
        dayWiseStats.closedConversationCount = countForADay.closedConversationCount;
        dayWiseStats.avgResponseTime = countForADay.avgResponseTime;
        dayWiseStats.avgResolutionTime = countForADay.avgResolutionTime;
        // chartForADay.labels = hoursDistribution;
        chartForADay.datasets[0].data = dayWiseData.newConversation; // New
        chartForADay.datasets[1].data = dayWiseData.closedConversation;  // Closed
        chartForADay.datasets[2].data = dayWiseData.avgResponseTime; // avg Resp
        chartForADay.datasets[3].data = dayWiseData.avgResolutionTime;  // Resl
  
        this.setState({
          chartForADay: chartForADay,
          dayWiseStats: dayWiseStats,
          dayWiseTotalNoOfCountAndAvgs:dayWiseTotalNoOfCountAndAvgs
        },this.abc())
        this.displayAllTotalCounts(this.state.timeFilterSelectedOption.value);
  
     
    
    }
    else {    
        //Filter Closed Conversation Count 
        res.data.response.newConversation.map((item, index) => {
          let dateInmSec = new Date(item.DATE).getTime();
          // if (dateInmSec > date1DayAgoInmSec) {
          //   newConversationCount.today += item.count;
    
          // }
          // if (dateInmSec > date2DaysAgoInmSec && dateInmSec < date1DayAgoInmSec) {
          //   newConversationCount.yesterday += item.count;
          // }
          if (dateInmSec > date8DaysAgoInmSec) {
            totalNoOfNewCoversations.last7Days++;
            newConversationCount.last7Days += item.count;
            let i = last7DaysYYYYMMDD.indexOf(item.DATE);
            last7DaysData.newConversation.splice(i, 1, item.count);
          }
          if (dateInmSec > date31DaysAgoInmSec) {
            totalNoOfNewCoversations.last30Days++;
            newConversationCount.last30Days += item.count;
            let j = last30DaysYYYYMMDD.indexOf(item.DATE);
            last30DaysData.newConversation.splice(j, 1, item.count);
          }
  
        })
        console.log(totalNoOfNewCoversations)
        console.log(last30DaysData);
        res.data.response.closedConversation.map((item, index) => {
          let dateInmSec = new Date(item.DATE).getTime();
          // if (dateInmSec > date1DayAgoInmSec) {
          //   closedConversationCount.today += item.count;
          // }
          // if (dateInmSec > date2DaysAgoInmSec && dateInmSec < date1DayAgoInmSec) {
          //   closedConversationCount.yesterday += item.count;
          // }
          if (dateInmSec > date8DaysAgoInmSec) {
            totalNoOfClosedCoversations.last7Days++;
            closedConversationCount.last7Days += item.count;
            let k = last7DaysYYYYMMDD.indexOf(item.DATE);
            last7DaysData.closedConversation.splice(k, 1, item.count);
          }
          if (dateInmSec > date31DaysAgoInmSec) {
            totalNoOfClosedCoversations.last30Days++;
            closedConversationCount.last30Days += item.count;
            let l = last30DaysYYYYMMDD.indexOf(item.DATE);
            last30DaysData.closedConversation.splice(l, 1, item.count);
            
          }
        })
  
        res.data.response.avgResponseTime.map((item, index) => {
          let dateInmSec = new Date(item.DATE).getTime();
          // if (dateInmSec > date1DayAgoInmSec) {
          //   avgResponseTime.today += item.average;
          // }
          // if (dateInmSec > date2DaysAgoInmSec && dateInmSec < date1DayAgoInmSec) {
          //   avgResponseTime.yesterday += item.average;
          // }
          if (dateInmSec > date8DaysAgoInmSec) {
            totalNoOfResponse.last7Days++;
            avgResponseTime.last7Days += parseFloat(item.average);
            let m = last7DaysYYYYMMDD.indexOf(item.DATE);
            // let minutes = Math.floor(item.average / 60000);
            // let seconds = ((item.average % 60000) / 1000).toFixed(0);
            // let time= minutes + "." + (seconds < 10 ? '0' : '') + seconds; 
            // time = parseInt (time);
            return Promise.resolve(this.milliToMSToDispalyInsideChart(parseFloat(item.average))).then(res => { 
              last7DaysData.avgResponseTime.splice(m, 1, res);
            }).catch(err => {
            console.log(err);
            });
            
          }
          if (dateInmSec > date31DaysAgoInmSec) {
            totalNoOfResponse.last30Days++;
            avgResponseTime.last30Days += parseFloat(item.average);  
            let n = last30DaysYYYYMMDD.indexOf(item.DATE);
            return Promise.resolve(this.milliToMSToDispalyInsideChart(parseFloat(item.average))).then(res => { 
              last30DaysData.avgResponseTime.splice(n, 1, res);
            }).catch(err => {
            console.log(err);
            });
            
          }
        })
  
        res.data.response.avgResolutionTime.map((item, index) => {
          let dateInmSec = new Date(item.DATE).getTime();
          // if (dateInmSec > date1DayAgoInmSec) {
          //   avgResolutionTime.today += item.average;
          // }
          // if (dateInmSec > date2DaysAgoInmSec && dateInmSec < date1DayAgoInmSec) {
          //   avgResolutionTime.yesterday += item.average;
          // }
          if (dateInmSec > date8DaysAgoInmSec) {
            totalNoOfResolutions.last7Days++;
            let avgResolutionTime_7 = item.average == null ? item.average : parseFloat(item.average)
            avgResolutionTime.last7Days += avgResolutionTime_7;
            let getIndex = last7DaysYYYYMMDD.indexOf(item.DATE);
            return Promise.resolve(this.secondsToHmsToDispalyInsideChart(item.average)).then(res => { 
              last7DaysData.avgResolutionTime.splice(getIndex, 1, res);
            }).catch(err => {
            console.log(err);
            });
            
          }
          if (dateInmSec > date31DaysAgoInmSec) {
            totalNoOfResolutions.last30Days++;
            let avgResolutionTime_30 = item.average == null ? item.average : parseFloat(item.average)
            avgResolutionTime.last30Days += avgResolutionTime_30;
            let getIndex = last30DaysYYYYMMDD.indexOf(item.DATE);
            return Promise.resolve(this.secondsToHmsToDispalyInsideChart(item.average)).then(res => { 
              last30DaysData.avgResolutionTime.splice(getIndex, 1, res);
            }).catch(err => {
            console.log(err);
            });
          }
        })
  
        console.log(closedConversationCount, newConversationCount, avgResponseTime, avgResolutionTime);
       
        
        last7DaysTotalNoOfCountAndAvgs.newConversation = totalNoOfNewCoversations.last7Days;
        last7DaysTotalNoOfCountAndAvgs.closedConversation = totalNoOfClosedCoversations.last7Days;
        last7DaysTotalNoOfCountAndAvgs.avgResponseTime = totalNoOfResponse.last7Days;
        last7DaysTotalNoOfCountAndAvgs.avgResolutionTime = totalNoOfResolutions.last7Days
        
        last7daysStats.newConversationCount =  newConversationCount.last7Days;
        last7daysStats.closedConversationCount = closedConversationCount.last7Days;
        last7daysStats.avgResponseTime = avgResponseTime.last7Days;
        last7daysStats.avgResolutionTime = avgResolutionTime.last7Days;

        last30DaysTotalNoOfCountAndAvgs.newConversation = totalNoOfNewCoversations.last30Days;
        last30DaysTotalNoOfCountAndAvgs.closedConversation = totalNoOfClosedCoversations.last30Days;
        last30DaysTotalNoOfCountAndAvgs.avgResponseTime = totalNoOfResponse.last30Days;
        last30DaysTotalNoOfCountAndAvgs.avgResolutionTime = totalNoOfResolutions.last30Days;

        last30daysStats.newConversationCount = newConversationCount.last30Days;
        last30daysStats.closedConversationCount = closedConversationCount.last30Days;
        last30daysStats.avgResponseTime = avgResponseTime.last30Days;
        last30daysStats.avgResolutionTime = avgResolutionTime.last30Days
        
        chartForLast30Days.datasets[0].data = last30DaysData.newConversation; // New
        chartForLast30Days.datasets[1].data = last30DaysData.closedConversation;  // Closed
        chartForLast30Days.datasets[2].data = last30DaysData.avgResponseTime; // avg Resp
        chartForLast30Days.datasets[3].data = last30DaysData.avgResolutionTime;  // Resl
  
        
        chartForLast7Days.datasets[0].data = last7DaysData.newConversation; // New
        chartForLast7Days.datasets[1].data = last7DaysData.closedConversation;  // Closed
        chartForLast7Days.datasets[2].data = last7DaysData.avgResponseTime; // avg Resp
        chartForLast7Days.datasets[3].data = last7DaysData.avgResolutionTime;  // Resl
  
        
        // // chartForYesterday.labels = hoursDistribution;
        // chartForYesterday.datasets[0].data = newConversationCount.yesterday; // New
        // chartForYesterday.datasets[1].data = closedConversationCount.yesterday;  // Closed
        // chartForYesterday.datasets[2].data = avgResponseTime.yesterday; // avg Resp
        // chartForYesterday.datasets[3].data = avgResolutionTime.yesterday;  // Resl
  
        
        // // chartForADay.labels = hoursDistribution;
        // chartForADay.datasets[0].data = newConversationCount.today; // New
        // chartForADay.datasets[1].data = closedConversationCount.today;  // Closed
        // chartForADay.datasets[2].data = avgResponseTime.today; // avg Resp
        // chartForADay.datasets[3].data = avgResolutionTime.today;  // Resl

        this.setState({
          chartForLast30Days: chartForLast30Days,
          chartForLast7Days: chartForLast7Days,
          last30daysStats:last30daysStats,
          last7daysStats: last7daysStats,
          last7DaysTotalNoOfCountAndAvgs: last7DaysTotalNoOfCountAndAvgs,
          last30DaysTotalNoOfCountAndAvgs: last30DaysTotalNoOfCountAndAvgs
          // chartForYesterday: chartForYesterday,
          // chartForADay: chartForADay
        },this.abc());
        this.displayAllTotalCounts(this.state.timeFilterSelectedOption.value);  
  
      
      
    }
    
    // let avgResponseTime = 6.5;
    // let avgResolutionTime = 8.5;
    
  }).catch(err => {
    console.log(err);
    });



  }).catch(err => {
    console.log(err);
  });    
  }
  
abc = () => {
  console.log(this.state.chartForLast30Days, this.state.chartForLast7Days, this.state.chartForADay, this.state.chartForYesterda,this.state.last7daysStats, this.state.last30daysStats)
  // console.log(this.state.chartForADay, this.state.dayWiseStats);
  // console.log(this.state.displayTotalCounts);
  // console.log(this.state.chart)
  // console.log(this.state.hoursDistribution)
  // console.log(this.state.last7DaysTotalNoOfCountAndAvgs, this.state.last30DaysTotalNoOfCountAndAvgs)
}
getLastdays = (start, end) => {
  let mmdd = new Array();
  let yyyymmdd = new Array();
  let dt = new Date(start);
  while (dt <= end) {
    let getDateFormattedMMDD = MONTH_NAMES[dt.getMonth()] + " " + dt.getDate();
    let mm = ((dt.getMonth() + 1) < 10 ? '0' : '') + (dt.getMonth() + 1);
    let dd = (dt.getDate() < 10 ? '0' : '') + dt.getDate();
    let getDateFormattedYYYYMMDD = dt.getFullYear() +"-"+ mm + "-" + dd;
    mmdd.push(getDateFormattedMMDD);
    yyyymmdd.push(getDateFormattedYYYYMMDD)
    dt.setDate(dt.getDate() + 1);
  }
  return {mmdd, yyyymmdd};
}
secondsToHms = (d) => {
  // if ( d === null || d == 0  ) {
  //   return 0 ;
  // }
  d = Number(d);
  var h = Math.floor(d / 3600);
  h = h > 0 ? h : "";  
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  var hDisplay = h > 0 ? (h == 1 ? " hr, " : " hrs, ") : "";
  var mDisplay = m > 0 ? (m == 1 ? " min, " : " mins, ") : "";
  var sDisplay = s > 0 ? (s == 1 ? " sec" : " secs") : "";
  // return hDisplay + mDisplay + sDisplay;
  // return {h:hDisplay,m:mDisplay,s:sDisplay }
  return { hrDigit: h, hrText: hDisplay, minDigit: m, minText: mDisplay, secDigit: s, secText: sDisplay }
}
secondsToHmsToDispalyInsideChart = (d) => {
  // if (d === null || d == 0) {
  //   return 0 ;
  // }
  d = Number(d);
  var h = Math.floor(d / 3600);
  // h = h > 0 ? h : "";  
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);
  if (h  == 0) {
    return m + "." + s ;
  }
  else {
    return h+"."+m
  }
  
}
milliToMSToDispalyInsideChart = (d) => {
  let minutes = Math.floor(d / 60000);
  let seconds = (d / 1000).toFixed(0);
  return minutes + "." + (seconds < 10 ? '0' : '') + seconds;
}
 millisToMinutesAndSeconds = (millis) => {
  let m = Math.floor(millis / 60000); 
  m = m > 0 ? m : ""
  let s = ((millis % 60000) / 1000).toFixed(0);
  let mDisplay = m > 0 ? (m == 1 ? " min, " : " mins, ") : "";
  let sDisplay = s > 0 ? (s == 1 ? " sec" : " secs") : "";
  return { minDigit: m, minText: mDisplay, secDigit: s, secText: sDisplay }
}
timeFilterHandleChange = (timeFilterSelectedOption) => {
  this.setState({ timeFilterSelectedOption });
  console.log(`Time Filter Selected: ${timeFilterSelectedOption.value}`);
  console.log("Agent Filter Selected:", this.state.agentFilterSelectedOption.value);
  let dataDay = `${timeFilterSelectedOption.value}`;
  if(`${timeFilterSelectedOption.value}` != 7 && `${timeFilterSelectedOption.value}` != 30) {
    this.filterConversationDetails(`${timeFilterSelectedOption.value}`, this.state.agentFilterSelectedOption.value);
  }
  // 
  this.displayAllTotalCounts(`${timeFilterSelectedOption.value}`);
  this.setState({dataDay: dataDay});
;
}
agentFilterHandleChange = (agentFilterSelectedOption) => {
  this.setState({ agentFilterSelectedOption });
  console.log("Time Filter Selected:", this.state.timeFilterSelectedOption.value);
  console.log(`Agent Filter Selected: ${agentFilterSelectedOption.value}`);
  this.filterConversationDetails(this.state.agentFilterSelectedOption.value, `${agentFilterSelectedOption.value}`);
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
        <div className="row filter-dropdown-wrapper">
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
          {/* <div className="col-lg-2 col-sm-4">
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
          </div> */}
        </div>
        <div className="row">
          <div className="col-sm-6 col-lg-3 ">
            <div className="card-block pb-0 text-left">
              <div id="card-new-conversation" className="card-inner-block card-stats active" 
                data-key = {this.state.dataKey.newConversation}
                data-day = {this.state.dataDay} 
                onClick={this.displayChart}>
                <h4 className="card-count">{this.state.displayTotalCounts.newConversationCount}</h4>
                <p className="card-count-title">New Conversations</p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="card-block pb-0 text-left">
              <div className="card-inner-block card-stats" data-key = {this.state.dataKey.closedConversation}
                data-day = {this.state.dataDay} 
                onClick={this.displayChart}>
                <h4 className="card-count">{this.state.displayTotalCounts.closedConversationCount}</h4>
                <p className="card-count-title">Closed Conversations</p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="card-block pb-0 text-left">
              <div className="card-inner-block card-stats" data-key = {this.state.dataKey.responseTime}
                data-day = {this.state.dataDay} 
                onClick = {this.displayChart}>
                <h4 className="card-count">
                  {/* <span className="card-time-digit">{this.state.avgResponseTime.hrDigit}</span>
                  <span className="card-time-text">{this.state.avgResponseTime.hrText}</span> */}
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
              <div className="card-inner-block card-stats" data-key = {this.state.dataKey.resolutionTime}
               data-day = { this.state.dataDay} 
               onClick = { this.displayChart}>
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
        {/* <div className="row">
          <div className="col-sm-6 col-lg-3 text-center">
            <div className="card card-inverse card-stats card-stats--users active" data-metric="0" onClick={this.showChart}>

              <div className="card-block pb-0 text-left">
                <p className="card-stats-month">{this.state.currentMonth}</p>
                <p className="card-main-title text-center">Users</p>
                <h4 className="card-stats-value text-center" data-metric="0">{this.state.newUsers}</h4>
                <p className="card-sub-title text-center">Last month: </p>
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
                <p className="card-sub-title text-center">Last month: </p>
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
                <p className="card-sub-title text-center">Last month: </p>
              </div>
              <div className="vertical-line"></div>
            </div>

          </div>

          <div className="col-sm-6 col-lg-3 text-center">
            <div className="card card-inverse card-stats card-stats--messages" data-metric="3" onClick={this.showChart}>
              <div className="card-block pb-0 text-left">
                <p className="card-stats-month">{this.state.currentMonth}</p>
                <p className="card-main-title text-center">Messages</p>
                <h4 className="card-stats-value text-center">{this.state.messages}</h4>
                <p className="card-sub-title text-center">Last month: </p>
              </div>
            </div>
          </div>
        </div> */}

        {/* <div className="card">
          <div className="card-block">
            <div className="row">
              
            </div>
            <div className="chart-wrapper" style={{ height: 200 + 'px', marginTop: 40 + 'px' }}>
              <Line data={this.state.chart} options={this.mainChartOpts} height={200} />
            </div>
          </div>
        </div> */}

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
