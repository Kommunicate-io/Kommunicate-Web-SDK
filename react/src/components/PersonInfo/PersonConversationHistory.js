import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import CommonUtils from '../../utils/CommonUtils';
import ApplozicClient from '../../utils/applozicClient';
// import { CONVERSATION_STATUS } from '../../utils/Constant';
import { getConfig } from '../../config/config';

class PersonConversationHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            conversations: [],
            hideTitle: true
        };
    };

    componentDidMount = () => {
        this.fetchUserConversations();
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.group && (this.props.group.id !== prevProps.group.id)) {
            this.fetchUserConversations();
        }
    }

    fetchUserConversations = () => {
        let userSession = CommonUtils.getUserSession();
        var params = {
            "startIndex" : 0,
            "pageSize" : 60,
            "orderBy" : 1,
            "skipDelivered": true
        };
        var headers = {
            'Content-Type': 'application/json',
            'Apz-AppId': userSession.application.applicationId,
            'Apz-Token': 'Basic ' + new Buffer(userSession.userName + ':' + userSession.accessToken).toString('base64'),
            'Apz-Product-App': true,
            "Of-User-Id": this.props.user.userId
        }
        ApplozicClient.getMessageGroups(params, headers).then(response => {
            if(response && response.status === 200) {
                var message = response.data.message,
                    map = [],
                    group = response.data.groupFeeds;
                for(var i=0; i<message.length; i++){
                    message[i].groupId && (map[message[i].groupId] = message[i]);
                }
                for (var j=0; j<group.length; j++){
                    if(map[group[j].id]){
                        group[j].lastMessageTime = map[group[j].id].createdAtTime;  
                    } else {
                        group[j].lastMessageTime = group[j].createdAtTime;
                    }  
                }
                this.setState({
                    conversations: group,
                    hideTitle: false
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }

    openConversation = (groupId) => {
        let url = getConfig().kommunicateDashboardUrl + '/conversations/' + groupId;
        window.open(url, '_blank');
    }

    render() {

        let activeGroup = decodeURIComponent(window.location.pathname.split("/").pop());

        return (
            <Container>
                <SectionHeading hidden={this.state.hideTitle}>Conversation History</SectionHeading>
                <Section>
                    {
                        this.state.conversations.length !== 0 && this.state.conversations.filter((grp) => typeof grp !== 'undefined' && (!activeGroup.includes("conversations") && grp.id !== parseInt(activeGroup))).map( (data, index) => {
                            let status = data.metadata ? Object.keys(window.KOMMUNICATE_CONSTANTS.CONVERSATION_STATE).find(key => 
                                window.KOMMUNICATE_CONSTANTS.CONVERSATION_STATE[key] === parseInt(data.metadata.CONVERSATION_STATUS)) : "OPEN";
                            return (
                                <ConversationDataContainer key={index} onClick={() => this.openConversation(data.id)}>
                                    <ConversationTitle className="km-custom-text-color">Conversation #{data.id}</ConversationTitle>
                                    <ConversationStatus>Status: <strong>{status === "UNRESPONDED" || status === "INITIAL" ? "OPEN" : status} - </strong><span>{data.name}</span></ConversationStatus>
                                    <ConversationDate>Last Contacted: <span>{moment(data.lastMessageTime).format("DD MMM YYYY")}</span></ConversationDate>
                                </ConversationDataContainer>
                            )
                        })
                    }
                </Section>
            </Container>
        );
    }
}


const Container = styled.div``;
const Section = styled(Container)`
    padding: 4px 15px;
`;
const SectionHeading = styled(Container)`
    background-color: #efefef;
    font-size: 14px;
    letter-spacing: 0.4px;
    color: #5a5858;
    padding: 4px 15px;
    line-height: initial;
`;
const ConversationDataContainer = styled.div`
    border-bottom: 1px solid rgb(236, 236, 236);
    padding: 10px 0 8px;
    cursor: pointer;
    &:last-child {
        margin-bottom: 75px;
    }
`;
const ConversationTitle = styled.div`
    font-size: 16px;
    letter-spacing: 0.5px;
    color: #5553b7;
    margin-bottom: 5px;
    
    &:hover {
        text-decoration: underline;
    }
`;
const ConversationStatus = styled.div`
    font-size: 14px;
    font-weight: 300;
    letter-spacing: 0.2px;
    color: #636364;
    margin-bottom: 5px;
    
    & span, & strong {
        color: #000000
    }
`;
const ConversationDate = styled(ConversationStatus)``;

export default PersonConversationHistory;