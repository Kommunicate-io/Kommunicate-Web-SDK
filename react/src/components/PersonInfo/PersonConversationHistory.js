import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import CommonUtils from '../../utils/CommonUtils';
import ApplozicClient from '../../utils/applozicClient';
import { CONVERSATION_STATUS } from '../../utils/Constant';

class PersonConversationHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            conversations: []
        };
    };

    componentDidMount = () => {
        this.fetchUserConversations();
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.user.userId !== prevProps.user.userId) {
            this.fetchUserConversations();
        }
    }

    fetchUserConversations = () => {
        let userSession = CommonUtils.getUserSession();
        var params = {
            "startIndex" : 0,
            "pageSize" : 60,
            "orderBy" : 1
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
                let groupFeeds = response.data.groupFeeds,
                    messages = response.data.message;

                for(var i = 0, _len = groupFeeds.length; i < _len; i++) {
                    groupFeeds[i].lastMessageTime = messages[i].createdAtTime;
                }
                this.setState({
                    conversations: groupFeeds
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <Container>
                <SectionHeading>Conversation History</SectionHeading>
                <Section>
                    {
                        this.state.conversations.length !== 0 && this.state.conversations.map( (data, index) => {
                            let status = Object.keys(CONVERSATION_STATUS).find(key => CONVERSATION_STATUS[key] === parseInt(data.metadata.CONVERSATION_STATUS));
                            return (
                                <ConversationDataContainer key={index}>
                                    <ConversationTitle onClick={() => window.Aside.initConversation(data.id)}>Conversation #{data.id}</ConversationTitle>
                                    <ConversationStatus>Status: <strong>{status} - </strong><span>{data.name}</span></ConversationStatus>
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
`;
const ConversationTitle = styled.div`
    font-size: 16px;
    letter-spacing: 0.5px;
    color: #5553b7;
    margin-bottom: 5px;
    cursor: pointer;
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