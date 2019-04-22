import React, { Component, Fragment } from 'react';
import styled, { css, withTheme } from 'styled-components';
import moment from 'moment';
import MessageLogsDetailsPage from './MessageLogsDetailsPage';
import MessageLogsRowList from './MessageLogsRowList';
import * as MessageLogsStyles from './MessageLogsStyles';
import ApplozicClient from '../../../utils/applozicClient';
import Button from '../../../components/Buttons/Button';
import { BackArrow, DownloadIcon, MessageLogsEmptyState } from '../../../assets/svg/svgs';
import { MyLoader, MessageLogsDetailsLoader } from '../../../components/EmptyStateLoader/emptyStateLoader';
import CommonUtils from '../../../utils/CommonUtils';


class MessageLogs extends Component {

    constructor(props) {
        super(props);

        this.state = {
            emptyState: true,
            secondEmptyState: false,
            groupData: [],
            totalCombinedGroupData: [],
            showGroupDetailData: false,
            lastFetchTime: 0,
            searchMessages: "",
            hideLoadMoreButton: true
        };
    };

    componentDidMount = () => {
        this.fetchMessages(this.state.lastFetchTime);
    }

    fetchMessages = (lastFetchTime) => {
        let params = {
            'pageSize': 60,
        };
        if(typeof lastFetchTime === 'undefined') {
            return;
        } else if(lastFetchTime !== 0) {
            params.lastFetchTime = lastFetchTime;
        }
        ApplozicClient.getAllGroupsAndMessages(params).then(response => {
            if(response && response.status === 200 && response.data.status === "success") {
                this.setState({
                    lastFetchTime: response.data.response.lastFetchTime,
                    emptyState: false,
                    hideLoadMoreButton: response.data.response.groupFeeds.length < params.pageSize
                }); 
    
                var message = response.data.response.message;
                var map = [];
                var group = response.data.response.groupFeeds;
    
                for(var i=0; i<message.length; i++){
                    map[message[i].key] = message[i];
                }
    
                for (var j=0; j<group.length; j++){
                    if(group[j].latestMessagekey){
                        group[j].message = map[group[j].latestMessagekey].message;
                        group[j].latestMessageTime = map[group[j].latestMessagekey].createdAtTime;
                        group[j].senderName = map[group[j].latestMessagekey].senderName;  
                        (group[j].type === 0) &&  (group[j].groupMemberUserKeys = {
                            [group[j].memberUserKeys[0]]: group[j].groupUsers[0].userId,
                            [group[j].memberUserKeys[1]]: group[j].groupUsers[1].userId
                        });
                        group[j].senderUserKey = map[group[j].latestMessagekey].userKey;
                    } else {
                        console.log("Group without Latest Message", group[j]);
                    }  
                }
                lastFetchTime === 0 ?  this.setState({ totalCombinedGroupData: group }) :  this.setState({ totalCombinedGroupData: this.state.totalCombinedGroupData.concat(group) });
            } else {
                this.setState({
                    emptyState: true
                })
            }
        }).catch( err => {
            console.log(err);
            this.setState({
                emptyState: true
            })
        })
    }

    openGroupDetails = (data) => {
        let userSession = CommonUtils.getUserSession();
        var params = {
            "startIndex" : 0,
            "pageSize" : 100,
            "orderBy" : 1,
            "groupId" : data.id,
            "skipRead": true
        };
        var headers = {
            'Content-Type': 'application/json',
            'Apz-AppId': userSession.application.applicationId,
            'Apz-Token': 'Basic ' + new Buffer(userSession.userName + ':' + userSession.accessToken).toString('base64'),
            'Apz-Product-App': true,
            "Of-User-Id": data.membersId[0]
        }

        if(data.type === 0) {
            params.combinedMessage = true;
        }

        ApplozicClient.getMessageGroups(params, headers).then(response => {
            if(response && response.status === 200) {

                let groupType = data.type;
                response.data.type = groupType;
                response.data.userCount = data.userCount;

                if(groupType === 0) {
                    response.data.oneToOneUsersDetail = {
                        [data.memberUserKeys[0]]: data.groupUsers[0].userId,
                        [data.memberUserKeys[1]]: data.groupUsers[1].userId
                    };
                }
                
                this.setState({
                    groupData: response.data,
                    showGroupDetailData: true,
                    secondEmptyState: false
                }, () => {
                    document.getElementById("group-messages-container").style.height = document.getElementById("group-metadata-container").offsetHeight + "px";
                });
            } else {
                this.setState({
                    secondEmptyState: false
                });
            }
            
        }).catch(err => {
            console.log(err);
            this.setState({
                secondEmptyState: true
            });
        });
    }

    goToGroupList = () => {
        this.setState({
            showGroupDetailData: false
        });
    }


    searchMessagesOnChange = (e) => {
        this.setState({
            searchMessages: e.target.value
        })
        var filter, mainContainer, div, messages, i;
            
        filter = e.target.value.toUpperCase();
        mainContainer = document.querySelector(".al-messages-list-section-container");
        div = mainContainer.querySelectorAll('.al-messages-list-sections--blocks');
        for (i = 0; i < div.length; i++) {
        messages = div[i].querySelectorAll(".al-messages-list-section--messages")[0];
            if (messages.innerHTML.toUpperCase().indexOf(filter) > -1) {
                div[i].style.display = "";
            } else {
                div[i].style.display = "none";
            }
        }
    }

    getContactImageByAlphabet = (name) => {
        return CommonUtils.getContactImageByAlphabet(name);
    }
    
    render() {
        const isEncryptedApp = CommonUtils.getUserSession().application.encryptionEnabled || false;

        return (
            <MessageLogsStyles.Container className="animated fadeIn">
                <MessageLogsStyles.GroupDetailHeaderButtonContainer hidden={!this.state.showGroupDetailData}>
                    <MessageLogsStyles.GoBackToList onClick={this.goToGroupList}>
                        <MessageLogsStyles.GoBackIcon><BackArrow /></MessageLogsStyles.GoBackIcon>
                        <MessageLogsStyles.GoBackText>Back</MessageLogsStyles.GoBackText>
                    </MessageLogsStyles.GoBackToList>

                    {/* <MessageLogsStyles.ExportDataContainer>
                        <MessageLogsStyles.ExportDataIcon><DownloadIcon /></MessageLogsStyles.ExportDataIcon>
                        <MessageLogsStyles.ExportDataText>Export all messages</MessageLogsStyles.ExportDataText>
                    </MessageLogsStyles.ExportDataContainer> */}
                </MessageLogsStyles.GroupDetailHeaderButtonContainer>

                { this.state.showGroupDetailData && <MessageLogsDetailsPage getContactImageByAlphabet={this.getContactImageByAlphabet} searchValue={this.state.searchMessages} onChange={this.searchMessagesOnChange} encryptedApp={isEncryptedApp} {...this.state.groupData} />  }

                { !this.state.emptyState ?
                ( this.state.totalCombinedGroupData.length > 0 ? <MessageLogsStyles.Table hidden={this.state.showGroupDetailData}>
                    <MessageLogsStyles.THead>
                        <MessageLogsStyles.TableRow>
                            <MessageLogsStyles.TableHeader>NAME</MessageLogsStyles.TableHeader>
                            {/* <TableHeader>MESSAGE COUNT</TableHeader> */}
                            <MessageLogsStyles.TableHeader>MEMBERS</MessageLogsStyles.TableHeader>
                            <MessageLogsStyles.TableHeader>LAST MESSAGE</MessageLogsStyles.TableHeader>
                        </MessageLogsStyles.TableRow>
                    </MessageLogsStyles.THead>
                    <MessageLogsStyles.TBody>
                        {  
                            this.state.totalCombinedGroupData && this.state.totalCombinedGroupData.filter(item => item.id).map( (data, index) => (
                                <MessageLogsRowList key={index} data={data} onClickHandler={this.openGroupDetails} getContactImageByAlphabet={this.getContactImageByAlphabet} encryptedApp={isEncryptedApp} />
                                )
                            )
                        }
                    </MessageLogsStyles.TBody>
                </MessageLogsStyles.Table> : 
                <MessageLogsStyles.EmptyStateContainer>
                    <MessageLogsEmptyState />
                </MessageLogsStyles.EmptyStateContainer> ) : <MyLoader />
            }
                {!this.state.showGroupDetailData && <MessageLogsStyles.LoadMoreButtonContainer>
                    <Button secondary onClick={() => this.fetchMessages(this.state.lastFetchTime)} hidden={this.state.hideLoadMoreButton}>Load More</Button>
                </MessageLogsStyles.LoadMoreButtonContainer>}
            </MessageLogsStyles.Container>
        );
    }
}


const DEVICE_TYPE = {
    DEVICE: 0,
    WEB: 1,
    ANDROID: 2,
    IOS: 3,
    PLATFORM: 4,
    DESKTOP_BROWSER: 5,
    MOBILE_BROWSER: 6,
    MAIL_INTERCEPTOR: 7
};

export default withTheme(MessageLogs);