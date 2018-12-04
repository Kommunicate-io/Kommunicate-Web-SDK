import React , { Component, Fragment } from 'react';
import styled, { withTheme } from 'styled-components';
import Select from 'react-select';
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-style';
import Colors from '../../../assets/theme/colors';
import ApplozicClient   from '../../../utils/applozicClient';
import Notification from '../../../views/model/Notification';
import { ALAnalyticsDashboardLoader } from '../../../components/EmptyStateLoader/emptyStateLoader';
import { TotalUsersIcon, ActiveUsersIcon, ConversationThreadsIcon, MessagesSentIcon } from '../../../assets/svg/svgs';


const Container = styled.div`
    width: 90%;
    margin: 25px auto 50px;
`;

const H3 = styled.h3`
    font-weight: 400;
    letter-spacing: 0.7px;
    color: #2f2f31;
    padding-left: 15px;
    margin-bottom: 20px;
`;

const AnalyticsCardsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
`;

const H2 = styled.h2`
    font-size: 25px;
    letter-spacing: 1.1px;
    color: #252526;
`;

const P = styled.p`
    font-weight: 300;
    letter-spacing: 0.4px;
    color: #4b4b4e;
`;

const AnalyticsCards = styled.div`
    position: relative;
    text-align: center;
    width: 210px;
    border-radius: 4px;
    box-shadow: 0 2px 5px 0 rgba(172, 170, 170, 0.5);
    background-color: #ffffff;
    padding: 10px;
    margin-bottom: 15px;

    & svg {
        width: 40px;
        height: 40px;
        margin: 25px auto 10px;
    }
    & h2 {
        margin: 0 auto 10px;
    }
    & p {
        margin: 0 auto 30px;
    }
    
`;

const InfoContainer = styled.div`
    position: absolute;
    top: 12px;
    left: 12px;
    width: 20px;
    height: 20px;
    cursor: pointer;
`;

const InfoIcon = styled.div`
    width: 15px;
    height: 15px;
    font-size: 12px;
    line-height: 15px;
    border: 1px solid #515050;
    border-radius: 50%;
    margin: 0 auto;
`;

const AnalyticsGraphContainer = styled.div`
    margin: 35px auto;
`;

const AnalyticsGraphHeader = styled(AnalyticsCardsContainer)``;

const SelectDropdownContainer = styled(AnalyticsCardsContainer)`
    flex-wrap: wrap;

    .al-dashboard-statistics-graph-type-dropdown, 
    .al-dashboard-statistics-graph-duration-dropdown {
        min-width: 200px;
    }
    .al-dashboard-statistics-graph-duration-dropdown {
        margin-left: 15px;
    }

    .al-dashboard-statistics-graph-type-dropdown .Select-control, 
    .al-dashboard-statistics-graph-duration-dropdown .Select-control {
        border-radius: 5px;
        box-shadow: 0 2px 5px 0 rgba(172, 170, 170, 0.5), 0px -1px 5px 0 rgba(172, 170, 170, 0.4);
        background-color: #ffffff;
        border: none;
        height: 44px;
    }
    .al-dashboard-statistics-graph-type-dropdown .Select-placeholder, .Select--single > .Select-control .Select-value, 
    .al-dashboard-statistics-graph-duration-dropdown .Select-placeholder, .Select--single > .Select-control .Select-value {
        line-height: 44px;
    }

    .al-dashboard-statistics-graph-type-dropdown .Select-menu-outer, 
    .al-dashboard-statistics-graph-duration-dropdown .Select-menu-outer {
        border-radius: 5px;
        box-shadow: 0 2px 5px 0 rgba(172, 170, 170, 0.5);
        background-color: #ffffff;
        border: none;
        margin-top: 5px;
    }

    .Select.is-focused:not(.is-open) > .Select-control {
        border-color: transparent;
    }
`;

const GraphContainer = styled.div`
    padding: 25px;
    box-shadow: 0 2px 5px 0 rgba(172, 170, 170, 0.5);
    border-radius: 6px;
    background-color: #ffffff;
    margin: 15px auto;
`;

const GraphColor = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background-color: ${props => props.value ? Colors.ApplozicColors.primary : Colors.ApplozicColors.secondary};
`;
const GraphTitle = styled.div`
    font-size: 13px;
    font-weight: 300;
    letter-spacing: 0.5px;
    color: #363637;
    margin-left: 15px;
`;

const GraphLegend =  styled(AnalyticsCardsContainer)`
    justify-content: flex-start;
    padding-left: 30px;
    margin-bottom: 25px;
`;

const ChartContainer = styled.div`
    width: 100%;
    height: 350px;
`;

const GraphTypeOptions = [
    { value: true, label: 'Messages sent' },
    { value: false, label: 'Active chat users' }
];

const GraphDurationOptions = [
    { value: 3, label: 'Last 3 months'},
    { value: 6, label: 'Last 6 months'},
    { value: 12, label: 'Last 12 months'},
    { value: 24, label: 'Last 24 months'},
];

const months = [{
        "MonthNameFull": ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        "MonthNameHalf": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    }
];

class AlDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            emptyState: true,
            totalUsers: 0,
            activeUsers: 0,
            conversationThreads: 0,
            messagesSent: 0,
            currentMonth: "",
            graphType: { value: true, label: 'Messages sent'},  
            graphDuration: { value: 3, label: 'Last 3 months'},
            dataForMsgSentGraph: [],
            dataForActiveUsersGraph: [],
            monthsLabelForGraph: []
        }   
    };

    componentDidMount = () => {
        this.getAnalyticsData();   
    }

    getAnalyticsData = () => {
        ApplozicClient.getApplicationStats().then( resp => {
            if(resp.status === 200) {
                var length = resp.data.length;
                this.setState({
                    analyticsData: resp.data,
                    emptyState: false
                });
               console.log(resp.data);
                let totalUsers = resp.data.reduce((a, b) => a + b.newUserCount, 0);
                let activeUsers = resp.data[length - 1].activeUserCount;
                let conversationThreads = resp.data[length - 1].channelCount;
                let messagesSent = resp.data[length - 1].newMessageCount;
    
                let currentMonth = new Date(resp.data[length - 1].month).getMonth();
                currentMonth = months[0].MonthNameFull[currentMonth];
                let currentYear = new Date(resp.data[length - 1].month).getFullYear();
    
                let selectedMonthsRange = this.selectMonthsRange(this.state.analyticsData, this.state.graphDuration.value);
                console.log(selectedMonthsRange);
    
                this.setState({
                    totalUsers: this.formatNumbers(totalUsers, 2),
                    activeUsers: this.formatNumbers(activeUsers, 2),
                    conversationThreads: this.formatNumbers(conversationThreads, 2),
                    messagesSent: this.formatNumbers(messagesSent, 2),
                    currentMonth: currentMonth + ", " + currentYear.toString()
                });    
            }
        }).catch( err => {
            console.log(err);
            Notification.error("Something went wrong.");
        });
    }

    selectMonthsRange = (data, months) => {
        let fewMonthsData = data.slice(Math.max(data.length - months, 0));

        var msgSentObj = [], activeUsersObj = [], i = 0;
        for( ; i < fewMonthsData.length; i++) {
            msgSentObj.push(fewMonthsData[i].newMessageCount);
            activeUsersObj.push(fewMonthsData[i].activeUserCount);
        }

        console.log(msgSentObj, activeUsersObj);

        this.setState({
            dataForMsgSentGraph: msgSentObj,
            dataForActiveUsersGraph: activeUsersObj
        });

        console.log(this.state.dataForMsgSentGraph, this.state.dataForActiveUsersGraph);

        console.log(data.slice(Math.max(data.length - months, 0)));

        this.generateMonths(fewMonthsData);

        return data.slice(Math.max(data.length - months, 0));
    }

    generateMonths = (fewMonthsData) => {
        var monthLabelsArray = [], _length = fewMonthsData.length;

        for (var i = 0; i < _length; i++) {
            let currentMonth = new Date(fewMonthsData[i].month).getMonth();
            currentMonth = _length <= 6 ? months[0].MonthNameFull[currentMonth] : months[0].MonthNameHalf[currentMonth];
            let currentYear = new Date(fewMonthsData[i].month).getFullYear();
            monthLabelsArray.push(currentMonth.toString() + " " + currentYear.toString());
        }

        this.setState({
            monthsLabelForGraph: monthLabelsArray
        })
        console.log(monthLabelsArray);
    }

    formatNumbers = (num, decimalPlaces) => {
        var base = Math.floor(Math.log(Math.abs(num)) / Math.log(1000));
        var suffix = 'KMBTQ' [base - 1];
        var label = suffix ? Math.abs(num / Math.pow(1000, base), 2).toFixed(decimalPlaces) + suffix : '' + num
        return label;
    }

    render() {

        var _this = this;

        const data = (canvas) => {
            const ctx = canvas.getContext("2d")
            const gradientForMsgSentGraph = ctx.createLinearGradient(0, 350, 0, 0);
            gradientForMsgSentGraph.addColorStop(0, "rgba(92, 90, 167, 0)");
            gradientForMsgSentGraph.addColorStop(1, "rgba(3, 180, 155, 0.35)");

            const gradientForActiveUsersGraph = ctx.createLinearGradient(0, 350, 0, 0);
            gradientForActiveUsersGraph.addColorStop(0, "rgba(92, 90, 167, 0)");
            gradientForActiveUsersGraph.addColorStop(1, "rgba(242, 199, 94, 0.35)");
            return {
                labels: this.state.monthsLabelForGraph,
                datasets: [
                  {
                    lineTension: 0.9,
                    cubicInterpolationMode: 'monotone',
                    backgroundColor: this.state.graphType.value ? gradientForMsgSentGraph : gradientForActiveUsersGraph,
                    borderColor: this.state.graphType.value ? this.props.theme.primary : this.props.theme.secondary,
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: this.state.graphType.value ? this.props.theme.primary : this.props.theme.secondary,
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: this.state.graphType.value ? this.props.theme.primary : this.props.theme.secondary,
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: this.state.graphType.value ? this.state.dataForMsgSentGraph : this.state.dataForActiveUsersGraph
                  }
                ]
            }
        }

        // const data2 = (canvas) => {
        //     const ctx = canvas.getContext("2d")
        //     const gradient = ctx.createLinearGradient(0, 800, 0, 0);
        //     gradient.addColorStop(0, "rgba(142, 140, 224, 0)");
        //     gradient.addColorStop(1, "rgba(242, 199, 94, 0.35)");
        //     return {
        //         labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        //         datasets: [
        //           {
        //             lineTension: 0.4,
        //             backgroundColor: gradient,
        //             borderColor: '#f2c75e',
        //             borderCapStyle: 'butt',
        //             borderDash: [],
        //             borderDashOffset: 0.0,
        //             borderJoinStyle: 'miter',
        //             pointBorderColor: 'rgba(75,192,192,1)',
        //             pointBackgroundColor: '#fff',
        //             pointBorderWidth: 1,
        //             pointHoverRadius: 5,
        //             pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        //             pointHoverBorderColor: 'rgba(220,220,220,1)',
        //             pointHoverBorderWidth: 2,
        //             pointRadius: 1,
        //             pointHitRadius: 10,
        //             data: this.state.dataForGraph
        //           }
        //         ]
        //     }
        // }

        const options = {
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        callback: function(value, index, values) {
                            return _this.formatNumbers(value, 0);
                        },
                        maxTicksLimit: 6
                    }
                }],
                xAxes: [{
                    gridLines: {
                        drawOnChartArea: true,
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 24,
                        autoSkip: false
                    }
                }]
            },
            tooltips: {
                backgroundColor: "#ffffff",
                titleFontColor: "#363637",
                titleSpacing: 5,
                titleMarginBottom: 10,
                bodyFontColor: "#363637",
                bodyFontSize: 14,
                displayColors: false,
                caretPadding: 10,
                xPadding: 12,
                yPadding: 10,

                callbacks: {
                    label: function(tooltipItem, data) {
                        return _this.formatNumbers(tooltipItem.yLabel, 2);
                    }
                },

                shadowOffsetX: 0,
                shadowOffsetY: 2,
                shadowBlur: 4,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }

        return (
            <Fragment>
                { this.state.emptyState && <ALAnalyticsDashboardLoader /> }
                <Container className="animated fadeIn" hidden={this.state.emptyState}>

                    <H3>Analytics overview for {this.state.currentMonth}</H3>

                    <AnalyticsCardsContainer>

                        <AnalyticsCards>
                            <TotalUsersIcon />
                            <H2>{this.state.totalUsers}</H2>
                            <P>Total registered users</P>
                            <InfoContainer data-rh="Total number of users registered on your platform" data-rh-at="right" data-tip="Total number of users registered on your platform" data-effect="solid" data-place="right">
                                <InfoIcon>?</InfoIcon>
                            </InfoContainer>
                        </AnalyticsCards>

                        <AnalyticsCards>
                            <ActiveUsersIcon />
                            <H2>{this.state.activeUsers}</H2>
                            <P>Active chat users</P>
                        </AnalyticsCards>

                        <AnalyticsCards>
                            <ConversationThreadsIcon />
                            <H2>{this.state.conversationThreads}</H2>
                            <P>Conversation threads</P>
                            <InfoContainer data-rh-at="right" data-effect="solid" data-place="right" data-tip="Total number of one-to-one conversations, group <br> conversations and announcement threads" data-html={true}>
                                <InfoIcon>?</InfoIcon>
                            </InfoContainer>
                        </AnalyticsCards>

                        <AnalyticsCards>
                            <MessagesSentIcon />
                            <H2>{this.state.messagesSent}</H2>
                            <P>Messages sent</P>
                        </AnalyticsCards>

                    </AnalyticsCardsContainer>

                    <AnalyticsGraphContainer>
                        <AnalyticsGraphHeader>
                            <H3>Statistics</H3>
                            <SelectDropdownContainer>
                                <Select 
                                    className="al-dashboard-statistics-graph-type-dropdown"
                                    clearable={false}
                                    searchable={false}
                                    value={this.state.graphType}
                                    onChange={graphType => {
                                        this.setState({
                                            graphType
                                        })
                                    }}
                                    options={GraphTypeOptions} />

                                <Select 
                                    className="al-dashboard-statistics-graph-duration-dropdown"
                                    clearable={false}
                                    searchable={false}
                                    value={this.state.graphDuration}
                                    onChange={graphDuration => {
                                        this.setState({
                                            graphDuration
                                        }, () => {
                                            this.selectMonthsRange(this.state.analyticsData, this.state.graphDuration.value);
                                        })
                                    }}
                                    options={GraphDurationOptions} />
                            </SelectDropdownContainer>
                        </AnalyticsGraphHeader>
                        

                        <GraphContainer>
                            <GraphLegend>
                                <GraphColor value={this.state.graphType.value} />
                                <GraphTitle>{this.state.graphType.label}</GraphTitle>
                            </GraphLegend>
                            <ChartContainer >
                                <Line data={data} options={options} ref="chart"/>
                            </ChartContainer>
                            
                        </GraphContainer>                                           

                    </AnalyticsGraphContainer>

                </Container>

            </Fragment>
        );
    }
}

export default withTheme(AlDashboard);