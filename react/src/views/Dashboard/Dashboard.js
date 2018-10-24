import React, { Component } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Dropdown, DropdownMenu, DropdownItem, Progress } from 'reactstrap';
import { getConfig } from '../../config/config.js';
import CommonUtils from '../../utils/CommonUtils';
import './Dashboard.css';
import ProductHuntOffer from '../.../../../components/EarlyBirdOffer/ProductHuntOffer';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { getUsersByType, getConversationStatsByDayAndMonth} from '../../utils/kommunicateClient';
import { USER_TYPE, CONVERSATION_STATS_FILTER_KEY } from '../../utils/Constant'
import Checkbox from '../../components/Checkbox/Checkbox'
import {Link} from 'react-router-dom';
import Onboarding from '../../components/UserOnboarding/Onboarding';

const brandPrimary = '#5c5aa7';
const brandSuccess = '#18A9B7';
const brandInfo = '#D13351';
const brandDanger = '#f86c6b';

// Main Chart

var elements = 27;
const tab = {newConversation:0, closedConversation:1, firstResponseTime:2, resolutionTime:3};
const numOfSteps = 5;
const  dayWiseFilterOptions = {today: 0, yesterday:1, last7Days:7, last30Days: 30};
const timeConverterKey = {toDisplayInsideChart: 0, toDisplayTotalAvg: 1}
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
      disableCheckbox: false ,
      isChecked : false,
      unansweredConversation:0,
      tabSelected: tab.newConversation,
      agentFilterOption: [{ label: "All Agents", value: "allagents" }],
      timeFilterSelectedOption: { label: "Last 7 days", value: 7 },
      agentFilterSelectedOption: { label: "All agents", value: "allagents" },
      displayTotalCounts:{newConversationCount:0, closedConversationCount:0},
      dataKey: {  //data-key HTML attribute
        newConversation: 0,
        closedConversation: 1,
        responseTime: 2,
        resolutionTime: 3
      },
      dataDay: 7,
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
      hourWiseTotalNoOfCountAndAvgs : {
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
      hourWiseStats: {
        newConversationCount: 0,
        closedConversationCount: 0,
        avgResponseTime: 0,
        avgResolutionTime: 0
      },
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
      chart: {
        labels: [],
        datasets: [
          {
            label: '',
            fill: true,
            backgroundColor: 'rgba(92,90,167,0.25)',
            borderColor: '#5c5aa7',
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: [],
          }
        ]
      },
      chartFor24Hrs: {
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
            display: false
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            maxTicksLimit: 5,
            // minTicksLimit: 3,
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

    if ((currentTarget.dataset.day == 0 || currentTarget.dataset.day == 1) || (currentTarget.dataset.day == 7 && this.state.isChecked == true) || (currentTarget.dataset.day == 30 && this.state.isChecked == true)){
      chartState = "chartFor24Hrs"
    } else {
      chartState = "chartForLast"+currentTarget.dataset.day+"Days";
    }

    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.remove('active');
    }

    currentTarget.classList.add('active');
    let chart = this.state.chart
    let getChartInfo = this.state[chartState];
    chart.labels = getChartInfo.labels;
    let key = parseInt(currentTarget.dataset.key);
    chart.datasets[0].data = getChartInfo.datasets[key].data;
    this.setState({
      chart: chart,
      tabSelected:key
    });

  }
  displayInitialChart = (day, isChecked) => {
    let chartState = "";
    if ((day == 0 || day == 1) || (day == 7 && isChecked == true) || (day == 30 && isChecked == true) ) {
      chartState = "chartFor24Hrs"
    } else {
      chartState = "chartForLast"+day+"Days";
    }

    var cards = document.getElementsByClassName("card-stats");

    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.remove('active');
    }
    cards[this.state.tabSelected].classList.add('active');
    let chart = this.state.chart
    let getChartInfo = this.state[chartState];
    chart.labels = getChartInfo.labels;
    chart.datasets[0].data = getChartInfo.datasets[this.state.tabSelected].data;
    this.setState({chart: chart});

  }
  displayAllTotalCounts = (day, isChecked) => {
    let countState = "";
    let totalNoOfCountState = "";
    if ((day == 0 || day == 1) || (day == 7 && isChecked == true) || (day == 30 && isChecked == true) ) {
      countState = "hourWiseStats";
      totalNoOfCountState = "hourWiseTotalNoOfCountAndAvgs";
    } else {
      countState = "last"+day+"daysStats";
      totalNoOfCountState = "last"+day+"DaysTotalNoOfCountAndAvgs";
    }
    let getTotalCount = this.state[countState];
    let getTotalNoOfCountAndAvgs = this.state[totalNoOfCountState]
    let displayTotalCounts = this.state.displayTotalCounts;
    displayTotalCounts.newConversationCount = getTotalCount.newConversationCount;
    displayTotalCounts.closedConversationCount = getTotalCount.closedConversationCount;
    this.setState({displayAllTotalCounts:displayTotalCounts});

    if ((day == 0 || day == 1) || (day == 7 && isChecked == true) || (day == 30 && isChecked == true)) {
      let s = getTotalCount.avgResponseTime == null ? getTotalCount.avgResponseTime : (getTotalCount.avgResponseTime / getTotalNoOfCountAndAvgs.avgResponseTime);
      let hmsResponseTime = this.secondsToHms(s, timeConverterKey.toDisplayTotalAvg);
      this.setState({ avgResponseTime: hmsResponseTime });

      let t = getTotalCount.avgResolutionTime == null ? getTotalCount.avgResolutionTime : (getTotalCount.avgResolutionTime) / getTotalNoOfCountAndAvgs.avgResolutionTime;
      let hms = this.secondsToHms(t, timeConverterKey.toDisplayTotalAvg);
      this.setState({ avgResolutionTime: hms });

      this.displayInitialChart(day, isChecked);


    }

    else {
      let avgRt = getTotalCount.avgResponseTime == null ? getTotalCount.avgResponseTime : (getTotalCount.avgResponseTime/getTotalNoOfCountAndAvgs.avgResponseTime);
      let hmsResponseTime = this.secondsToHms(avgRt, timeConverterKey.toDisplayTotalAvg)
      this.setState({ avgResponseTime: hmsResponseTime });
      let avgRst = getTotalCount.avgResolutionTime == null ? getTotalCount.avgResolutionTime : getTotalCount.avgResolutionTime / getTotalNoOfCountAndAvgs.avgResolutionTime;
      let hms = this.secondsToHms(avgRst, timeConverterKey.toDisplayTotalAvg)
      this.setState({ avgResolutionTime: hms });
      this.displayInitialChart(day);

    }
  }


  getAllUsers = (applicationId) => {
    // this method also populating BOT_AGENT_MAP in localStorage
    let agentFilterOption = this.state.agentFilterOption;
    let agentBotMap ={};
    return Promise.resolve(getUsersByType(applicationId, [USER_TYPE.AGENT, USER_TYPE.ADMIN,USER_TYPE.BOT])).then(data => {
      data.map((user, index) => {
       user && (agentBotMap[user.userName] = user);
        // remove below "if" to show bot  in agent filter option
        if(user && user.type !=USER_TYPE.BOT ){
        let name = user.name ? user.name :  user.email
        agentFilterOption.push({ label: name, value: user.userName })
      }
      })
      this.setState({ agentFilterOption: agentFilterOption })
      CommonUtils.setItemInLocalStorage('KM_BOT_AGENT_MAP',agentBotMap);
    }).catch(err => {
      // console.log("err while fetching users list ", err);
    });
  }

  updateDetailsToKommunicate (){
    let userSession = CommonUtils.getUserSession();
    var userdetail = {
      "email": userSession.email !== null ? userSession.email: "",
      "displayName": userSession.displayName !== null ? userSession.displayName: "",
      "userId": userSession.userName !== null ? userSession.userName: "",
      "metadata": {      // add userinfo you want to show in userinfo section of kommunicate dashboard
          "Billing": userSession.billingCustomerId !== null ? userSession.billingCustomerId : ""  ,
          "Signup": userSession.created_at !== null ? userSession.created_at: "",
          "Subscription": userSession.subscription !== null ? userSession.subscription : "" ,
          "Application": userSession.applicationId !== null ? userSession.applicationId : "",
          "Website": userSession.application.websiteUrl !== null ? userSession.application.websiteUrl : "",
          "Industry": userSession.industry !== null ? userSession.industry : ""
      }
    };
    window.Kommunicate.updateUser(userdetail);
  }

  componentDidMount() {
    //  var env = getEnvironmentId();
    let userSession = CommonUtils.getUserSession();
    var application = userSession.application;
    this.getAllUsers(application.applicationId);
    this.filterConversationDetails(dayWiseFilterOptions.last30Days, "allagents", this.state.isChecked);
    window.addEventListener("kmInitilized",this.updateDetailsToKommunicate,true);
    // For Tooltip
    // var tooltipSpan = document.getElementById('tooltip-span');
    // var selectDropdown = document.querySelector(".tooltip-for-lock .Select");
    // selectDropdown.appendChild(tooltipSpan);
    // window.onmousemove = function (e) {
    //     var x = e.clientX,
    //         y = e.clientY;
    //     tooltipSpan.style.top = (y + 20) + 'px';
    //     tooltipSpan.style.left = (x + 20) + 'px';
    // };
  }

  componentWillUnmount(){
    window.removeEventListener("kmInitilized",function(){});
  }

  filterConversationDetails = (timeFilterSelectedOption, agentFilterSelectedOption, hoursWiseDistribution) => {
    let last30DaysYYYYMMDD = [];
    let last7DaysYYYYMMDD = [];
    let hourWiseData = { newConversation: [], closedConversation: [], avgResolutionTime: [], avgResponseTime: [] };
    let last30DaysData = { newConversation: [], closedConversation: [], avgResolutionTime: [], avgResponseTime: [] };
    let last7DaysData = { newConversation: [], closedConversation: [], avgResolutionTime: [], avgResponseTime: [] };
    let hourWiseStats = this.state.hourWiseStats;
    let last7daysStats = this.state.last7daysStats;
    let last30daysStats = this.state.last30daysStats;
    let chartForLast30Days = this.state.chartForLast30Days;
    let chartForLast7Days = this.state.chartForLast7Days;
    let chartFor24Hrs = this.state.chartFor24Hrs;
    let last7DaysTotalNoOfCountAndAvgs = this.state.last7DaysTotalNoOfCountAndAvgs;
    let last30DaysTotalNoOfCountAndAvgs = this.state.last30DaysTotalNoOfCountAndAvgs;
    let hourWiseTotalNoOfCountAndAvgs = this.state.hourWiseTotalNoOfCountAndAvgs;

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

    let last7days = this.getLastdays(date7DaysAgo, today)
    chartForLast7Days.labels = last7days.mmdd;
    last7DaysYYYYMMDD = last7days.yyyymmdd
    this.setState({ chartForLast7Days: chartForLast7Days })

    let last30days = this.getLastdays(date30DaysAgo, today)
    chartForLast30Days.labels = last30days.mmdd;
    last30DaysYYYYMMDD = last30days.yyyymmdd
    this.setState({ chartForLast30Days: chartForLast30Days })
    
    for (let i = 0; i <= 23; i++) {
      hourWiseData.newConversation.push(0);
      hourWiseData.closedConversation.push(0);
      hourWiseData.avgResponseTime.push(null);
      hourWiseData.avgResolutionTime.push(null);
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
    let hoursDistribution = [];
    for (var i = 0; i < 24; i++) {
      let hour = i > 9 ? "" + i : "0" + i;
      hoursDistribution.push(hour + ":00");
    }
    chartFor24Hrs.labels = hoursDistribution;
    this.setState({chartFor24Hrs: chartFor24Hrs});
    return Promise.resolve(getConversationStatsByDayAndMonth(timeFilterSelectedOption, agentFilterSelectedOption,hoursWiseDistribution)).then(result => {
      let res=result.response;
      if (typeof res.response.unansweredConversation != "undefined") {
        this.setState({ unansweredConversation: res.response.unansweredConversation })
      }
      // console.log(res);
      let countForADay ={newConversationCount:0, closedConversationCount:0, avgResponseTime:null, avgResolutionTime:null};
      let closedConversationCount = { today: 0, yesterday: 0, last7Days: 0, last30Days: 0 };
      let newConversationCount = { today: 0, yesterday: 0, last7Days: 0, last30Days: 0 };
      let avgResolutionTime = { today: null, yesterday: null, last7Days: null, last30Days: null };
      let avgResponseTime = { today: null, yesterday: null, last7Days: null, last30Days: null };

      let totalNoOfNewCoversations = {dayWise : 0, last7Days:0, last30Days:0 };
      let totalNoOfClosedCoversations = {dayWise : 0, last7Days:0, last30Days:0 };
      let totalNoOfResponse = {dayWise : 0, last7Days:0, last30Days:0 };
      let totalNoOfResolutions = {dayWise : 0, last7Days:0, last30Days:0 };


    if(res.key == CONVERSATION_STATS_FILTER_KEY.HOUR_WISE_DISTRIBUTION ) {
        // today's or yesterday's data
        // or last 30 days and last 7 Days hour wise data
        res.response.newConversation.length && res.response.newConversation.map((item, index) => {
          totalNoOfNewCoversations.dayWise++;
          countForADay.newConversationCount += item.count;
          let getIndex = hoursDistribution.indexOf(item.HOUR);
          hourWiseData.newConversation.splice(getIndex, 1, item.count);

        })
        res.response.closedConversation.length && res.response.closedConversation.map((item, index) => {
          totalNoOfClosedCoversations.dayWise++;
          countForADay.closedConversationCount += item.count;
          let getIndex = hoursDistribution.indexOf(item.HOUR);
          hourWiseData.closedConversation.splice(getIndex, 1, item.count);

        })
        res.response.avgResponseTime.length && res.response.avgResponseTime.map((item, index) => {
          if (typeof item.average != 'undefined' ) {
            totalNoOfResponse.dayWise++;
            let avgResponseTime = parseFloat(item.average);
            countForADay.avgResponseTime += avgResponseTime;
            let getIndex = hoursDistribution.indexOf(item.HOUR);
            let time = this.secondsToHms(parseFloat(item.average), timeConverterKey.toDisplayInsideChart);
            time = time === "NaN" ? null : parseFloat(time);
            hourWiseData.avgResponseTime.splice(getIndex, 1, time);
          }

        })
        res.response.avgResolutionTime.length && res.response.avgResolutionTime.map((item, index) => {
          if (typeof item.average != 'undefined' ) {
            totalNoOfResolutions.dayWise++;
            let avgResolutionTime = parseFloat(item.average);
            countForADay.avgResolutionTime += avgResolutionTime;
            let getIndex = hoursDistribution.indexOf(item.HOUR);
            let time = this.secondsToHms(parseFloat(item.average), timeConverterKey.toDisplayInsideChart);
            time = time === "NaN" ? null : parseFloat(time);
            hourWiseData.avgResolutionTime.splice(getIndex, 1, time);
          }

        })


        hourWiseTotalNoOfCountAndAvgs.newConversation = totalNoOfNewCoversations.dayWise;
        hourWiseTotalNoOfCountAndAvgs.closedConversation = totalNoOfClosedCoversations.dayWise;
        hourWiseTotalNoOfCountAndAvgs.avgResponseTime = totalNoOfResponse.dayWise;
        hourWiseTotalNoOfCountAndAvgs.avgResolutionTime = totalNoOfResolutions.dayWise;

        hourWiseStats.newConversationCount = countForADay.newConversationCount;
        hourWiseStats.closedConversationCount = countForADay.closedConversationCount;
        hourWiseStats.avgResponseTime = countForADay.avgResponseTime;
        hourWiseStats.avgResolutionTime = countForADay.avgResolutionTime;
        // chartFor24Hrs.labels = hoursDistribution;
        chartFor24Hrs.datasets[0].data = hourWiseData.newConversation;
        chartFor24Hrs.datasets[1].data = hourWiseData.closedConversation;
        chartFor24Hrs.datasets[2].data = hourWiseData.avgResponseTime;
        chartFor24Hrs.datasets[3].data = hourWiseData.avgResolutionTime;

        this.setState({
          chartFor24Hrs: chartFor24Hrs,
          hourWiseStats: hourWiseStats,
          hourWiseTotalNoOfCountAndAvgs:hourWiseTotalNoOfCountAndAvgs

        },this.displayTotalCountCallBack())

    }
    else {
        // Filter new conversation
        res.response.newConversation.length && res.response.newConversation.map((item, index) => {
          let dateInmSec = new Date(item.DATE).getTime();

          if (dateInmSec > date8DaysAgoInmSec) { //last 7 days
            totalNoOfNewCoversations.last7Days++;
            newConversationCount.last7Days += item.count;
            let i = last7DaysYYYYMMDD.indexOf(item.DATE);
            last7DaysData.newConversation.splice(i, 1, item.count);
          }
          if (dateInmSec > date31DaysAgoInmSec) { //last 30 days
            totalNoOfNewCoversations.last30Days++;
            newConversationCount.last30Days += item.count;
            let j = last30DaysYYYYMMDD.indexOf(item.DATE);
            last30DaysData.newConversation.splice(j, 1, item.count);
          }

        })
        res.response.closedConversation.length && res.response.closedConversation.map((item, index) => {
          // filter closed conversation
          let dateInmSec = new Date(item.DATE).getTime();

          if (dateInmSec > date8DaysAgoInmSec) { //last 7 days
            totalNoOfClosedCoversations.last7Days++;
            closedConversationCount.last7Days += item.count;
            let k = last7DaysYYYYMMDD.indexOf(item.DATE);
            last7DaysData.closedConversation.splice(k, 1, item.count);
          }
          if (dateInmSec > date31DaysAgoInmSec) { // last 30 days
            totalNoOfClosedCoversations.last30Days++;
            closedConversationCount.last30Days += item.count;
            let l = last30DaysYYYYMMDD.indexOf(item.DATE);
            last30DaysData.closedConversation.splice(l, 1, item.count);

          }
        })

        res.response.avgResponseTime.length && res.response.avgResponseTime.map((item, index) => {
          // filter average response time
          let dateInmSec = new Date(item.DATE).getTime();
          if (dateInmSec > date8DaysAgoInmSec && typeof item.average != 'undefined') { //last 7 days days
            totalNoOfResponse.last7Days++;
            avgResponseTime.last7Days += parseFloat(item.average);
            let m = last7DaysYYYYMMDD.indexOf(item.DATE);
            let time = this.secondsToHms(parseFloat(item.average), timeConverterKey.toDisplayInsideChart);
            time = time === "NaN" ? null : parseFloat(time);
            last7DaysData.avgResponseTime.splice(m, 1, time);
          }
          if (dateInmSec > date31DaysAgoInmSec && typeof item.average != 'undefined') { //last 30 days data
            totalNoOfResponse.last30Days++;
            avgResponseTime.last30Days += parseFloat(item.average);
            let n = last30DaysYYYYMMDD.indexOf(item.DATE);
            let time = this.secondsToHms(parseFloat(item.average), timeConverterKey.toDisplayInsideChart);
            time = time === "NaN" ? null : parseFloat(time);
            last30DaysData.avgResponseTime.splice(n, 1, time);
          }
        })

        res.response.avgResolutionTime.length && res.response.avgResolutionTime.map((item, index) => {
          //Filter average resolutin time
          let dateInmSec = new Date(item.DATE).getTime();
          if (dateInmSec > date8DaysAgoInmSec && typeof item.average != 'undefined') { // last 7 days
            totalNoOfResolutions.last7Days++;
            let avgResolutionTime_7 = parseFloat(item.average);
            avgResolutionTime.last7Days += avgResolutionTime_7
            let index = last7DaysYYYYMMDD.indexOf(item.DATE);
            let time = this.secondsToHms(parseFloat(item.average), timeConverterKey.toDisplayInsideChart);
            time = time === "NaN" ? null : parseFloat(time);
            last7DaysData.avgResolutionTime.splice(index, 1, time);
          }
          if (dateInmSec > date31DaysAgoInmSec && typeof item.average != 'undefined') { //last 30 days
            totalNoOfResolutions.last30Days++;
            let avgResolutionTime_30 = parseFloat(item.average)
            avgResolutionTime.last30Days += avgResolutionTime_30;
            let index = last30DaysYYYYMMDD.indexOf(item.DATE);
            let time = this.secondsToHms(parseFloat(item.average), timeConverterKey.toDisplayInsideChart)
            time = time === "NaN" ? null : parseFloat(time);
            last30DaysData.avgResolutionTime.splice(index, 1, time);
          }

        })
        // console.log(closedConversationCount, newConversationCount, avgResponseTime, avgResolutionTime);

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

        chartForLast30Days.datasets[0].data = last30DaysData.newConversation;
        chartForLast30Days.datasets[1].data = last30DaysData.closedConversation;
        chartForLast30Days.datasets[2].data = last30DaysData.avgResponseTime;
        chartForLast30Days.datasets[3].data = last30DaysData.avgResolutionTime;


        chartForLast7Days.datasets[0].data = last7DaysData.newConversation;
        chartForLast7Days.datasets[1].data = last7DaysData.closedConversation;
        chartForLast7Days.datasets[2].data = last7DaysData.avgResponseTime;
        chartForLast7Days.datasets[3].data = last7DaysData.avgResolutionTime;


        this.setState({
          chartForLast30Days: chartForLast30Days,
          chartForLast7Days: chartForLast7Days,
          last30daysStats:last30daysStats,
          last7daysStats: last7daysStats,
          last7DaysTotalNoOfCountAndAvgs: last7DaysTotalNoOfCountAndAvgs,
          last30DaysTotalNoOfCountAndAvgs: last30DaysTotalNoOfCountAndAvgs

        },this.displayTotalCountCallBack());

    }

  }).catch(err => {
    console.log(err);
    });

  }

displayTotalCountCallBack = () => {
  this.displayAllTotalCounts(this.state.timeFilterSelectedOption.value, this.state.isChecked);
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
    yyyymmdd.push(getDateFormattedYYYYMMDD);
    dt.setDate(dt.getDate() + 1);
  }
  return {mmdd, yyyymmdd};
}
secondsToHms = (seconds,key) => { 
  var h = Math.floor(seconds / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 3600 % 60);
  if (key) {
    if (seconds !== null) {
      h = h > 0 ? h : "";
      h === "" && (m = m > 0 ? m : "") ;
      h === "" && m == "" && (s = s >= 0 ? s : "");

    var hDisplay = h > 0 ? (h == 1 ? "hr " : "hrs ") : "";
    var mDisplay = m > 0 ? (m == 1 ? "min " : "mins ") : "";
    var sDisplay = s >= 0 ? (s <= 1 ? "sec" : "secs") : "";
    }
    else {
      h = "_ ";
      m = "_ ";
      s = "_";
    }

    return { hrDigit: h, hrText: hDisplay, minDigit: m, minText: mDisplay, secDigit: s, secText: sDisplay };
  }
  else {
    return h +"."+ m;
  }

}

timeFilterHandleChange = (timeFilterSelectedOption) => {
  let dataDay = `${timeFilterSelectedOption.value}`; // data-day is an HTML Attribute
  this.setState({ dataDay: dataDay });
  if (`${timeFilterSelectedOption.value}` == this.state.timeFilterSelectedOption.value) {

    return this.displayAllTotalCounts(`${timeFilterSelectedOption.value}`);

  }
  if (`${timeFilterSelectedOption.value}` != dayWiseFilterOptions.last7Days && `${timeFilterSelectedOption.value}` != dayWiseFilterOptions.last30Days) {
    //Today or Yesterday
    let isChecked = true
    this.setState({ timeFilterSelectedOption });
    this.setState({
      disableCheckbox: true,
      isChecked: isChecked
    });
    return this.filterConversationDetails(`${timeFilterSelectedOption.value}`, this.state.agentFilterSelectedOption.value,isChecked);
  }
  else {
    let isChecked = false
    this.setState({ timeFilterSelectedOption });
    this.setState({
      disableCheckbox: false,
      isChecked: isChecked
    });
    return this.filterConversationDetails(dayWiseFilterOptions.last30Days, this.state.agentFilterSelectedOption.value, isChecked);

  }

}

agentFilterHandleChange = (agentFilterSelectedOption) => {
  if (this.state.timeFilterSelectedOption.value != dayWiseFilterOptions.last7Days && this.state.timeFilterSelectedOption.value != dayWiseFilterOptions.last30Days) {
    // Today or Yesterday
   this.setState({ agentFilterSelectedOption });
   return this.filterConversationDetails(this.state.timeFilterSelectedOption.value, `${agentFilterSelectedOption.value}`, this.state.isChecked );
  }
  else {
    // 7 Days or 30 Days
   this.setState({ agentFilterSelectedOption });
   return this.filterConversationDetails(dayWiseFilterOptions.last30Days, `${agentFilterSelectedOption.value}`, this.state.isChecked);

  }

}
toggleChangeCheckbox = () => {
  let isChecked = !this.state.isChecked
  this.setState({
    isChecked: !this.state.isChecked,
  });
  this.filterConversationDetails(this.state.timeFilterSelectedOption.value, this.state.agentFilterSelectedOption.value,isChecked)
}


render() {
  let names = [];
  const { timeFilterSelectedOption } = this.state;
  const { agentFilterSelectedOption } = this.state;
  return (
    <div className="animated fadeIn early-bird-card">
      {/* {this.state.subscription == 'startup' ?
        <EarlyBirdOffer OfferPercent={'75'} remainingOffers={this.state.offerRemaining} />
        :
        null
      } */}
      {/* <ProductHuntOffer /> */}
      
      <Onboarding />

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
          <div className="col-lg-2 col-sm-4 tooltip-for-lock">

            <Select
              className={(CommonUtils.isTrialPlan()) ? "" : (CommonUtils.isStartupPlan()) ? "agent-restriction" : ""}
              name="km-dashboard-agent-filter"
              value={agentFilterSelectedOption}
              clearable={false}
              searchable={false}
              onChange={this.agentFilterHandleChange}
              options={this.state.agentFilterOption}

            />
            {/* <span id="tooltip-span" className="tooltip-span">
              Available in Growth Plan
            </span> */}
          </div>
          <div className="col-lg-8 col-sm-4 dashboard-chart-checkbox-section">
            <div className="dashboard-chart-checkbox-wrapper">
              <label className="dashboard-chart-checkbox-label" checked={this.state.isChecked}>
                Show 24 hour distribution
                <input type="checkbox" checked={this.state.isChecked} onChange={this.toggleChangeCheckbox} disabled={this.state.disableCheckbox} className="dashboard-chart-checkbox"/>
                <span className="chart-checkmark"></span>
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 col-lg-3 ">
            <div className="card-block pb-0 text-left">
              <div id="card-new-conversation" className="card-inner-block card-stats active"
                data-key = {this.state.dataKey.newConversation}
                data-day = {this.state.dataDay}
                onClick={this.displayChart}>
                <h4 className="card-count">{this.state.displayTotalCounts.newConversationCount}</h4>
                <p className="card-count-title">Incoming Conversations</p>
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
                  <span className="card-time-digit">{this.state.avgResponseTime.hrDigit}</span>
                  <span className="card-time-text">{this.state.avgResponseTime.hrText}</span>
                  <span className="card-time-digit">{this.state.avgResponseTime.minDigit}</span>
                  <span className="card-time-text">{this.state.avgResponseTime.minText}</span>
                  <span className="card-time-digit">{this.state.avgResponseTime.secDigit}</span>
                  <span className="card-time-text">{this.state.avgResponseTime.secText}</span>
                </h4>
                <p className="card-count-title">First Response Time</p>
                <Link className={this.state.unansweredConversation > 0 ? "vis" : "n-vis"} to="/conversations" >{this.state.unansweredConversation} {this.state.unansweredConversation == 1 ? " user" : " users"} waiting for first response</Link>
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

      </div>
      { this.state.isChecked &&
        <div className="time-zone-wrapper"><p className="time-zone-text">Time zone : GMT</p></div>
      }

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
