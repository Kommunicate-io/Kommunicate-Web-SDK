import React, { Component, Fragment } from 'react';
import styled, { css, withTheme } from 'styled-components';
import moment from 'moment';
import _ from 'lodash';
import ApplozicClient   from '../../../utils/applozicClient';
import DummyImage from '../../../../public/img/avatars/5.jpg';
import { BackArrow, DownloadIcon, SearchIcon } from '../../../assets/svg/svgs';


const commomStyles = css`
    font-size: 14px;
    font-style: normal;
    font-weight: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: 0.4px;
    color: #464748;
`;

const textOverflowEllipsis = css`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
`;

const Container = styled.div`
    width: 98%;
    margin: 25px auto 50px;
`;

const Table = styled.table`
    border-collapse: separate;
    border-spacing: 0px 6px;
    width: 100%;
`;

const THead = styled.thead`
    & tr {
        border-radius: 0;
        box-shadow: none;
    }
`;
const TBody = styled.tbody`

`;
const TableRow = styled.tr`
    border-radius: 3px;
    box-shadow: 0 3px 9px 2px rgba(212, 208, 208, 0.45);
    cursor: pointer;

    & td:first-child, & th:first-child {
        padding-left: 15px;
        border-radius: 3px 0 0 3px;
    }
    & td:last-child, & th:last-child {
        padding-right: 15px;
        border-radius: 0 3px 3px 0;
        width: 350px;
        ${textOverflowEllipsis}
    }

`;
const TableHeader = styled.th`
    ${commomStyles}
    font-weight: 500;
    color: #adafb2;
`;
const TableData = styled.td`
    background-color: #fff;
    padding: 15px 0px;
    ${commomStyles}
    line-height: 1.5;
`;

const FlexContainer = styled.div`
    display: flex;
    align-items: center;
`;

const ImageContainer = styled.div`
    width: 35px;
    height: 35px;
    margin-right: 10px;
`;
const Image = styled.img`
    width: 35px;
    height: 35px;
    border-radius: 50%;
    object-fit: contain;
`;

const GroupNameContainer = styled.div``;
const GroupName = styled.div`
    ${commomStyles}
`;
const GroupId = styled.div`
    font-size: 12px;
    color: #8e8f91;
    margin-top: 3px;
`;

const LastMessage = styled.div`
    ${commomStyles}
    max-width: 350px;
    ${textOverflowEllipsis}
`;
const LastMessageFrom = styled.span``;
const LastMessageData = styled.span`
    color: #7a7c7e;
    ${textOverflowEllipsis}
`;

const LastMessageTime = styled(GroupId)``;






// Message Groups Details Section Design

const GoBackToList = styled.div`
    margin-bottom: 5px;
    cursor: pointer;
    max-width: 180px;
`;
const GoBackText = styled.span`
    ${commomStyles}
    font-size: 22px;
    letter-spacing: 0.7px;
    color: #2f2f31;
`;
const GoBackIcon = styled.span`
    vertical-align: middle;
    margin-right: 10px;
`;

const ExportDataContainer = styled.div`
    text-align: right;
    cursor: pointer;
    max-width: 180px;
    margin-left: auto;
`;
const ExportDataIcon = styled(GoBackIcon)``;
const ExportDataText = styled.span`
    ${commomStyles}
    color: #9b9c9e;
`;


const GroupDetailContainer = styled(FlexContainer)`
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
`;
const GroupDetailMetadataContainer = styled.div`
    max-width: 350px;
    border-radius: 4px;
    background-color: #ffffff;
    border: 1px solid #dad7d7;
    overflow: hidden;
`;
const GroupDetailMessagesContainer = styled.div`
    border-radius: 4px;
    box-shadow: 0 2px 5px 0 rgba(172, 170, 170, 0.5);
    background-color: #eeeeee;
    width: 100%;
    max-width: calc(100% - 390px);
`;
const GroupDetailMetadataBackdropContainer = styled.div`
    position: relative;
    height: 100px;
    overflow: hidden;

    & img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 0;
        filter: blur(6px);
    }
`;
const GroupDetailMetadataBackdrop = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
`;
const GroupImage = styled(ImageContainer)`
    width: 70px;
    height: 70px;
    position: relative;
    margin: -35px auto 20px;

    & img {
        width: 70px;
        height: 70px;
        height: 70px;
        border: 2px solid #fff;
    }
`;

const GroupTitle = styled.h4`
    text-align: center;
    ${commomStyles}
    font-size: 18px;
    font-weight: 300;
    letter-spacing: 0.5px;
    color: #414243;
    margin-bottom: 25px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
const GroupDetailMetadataHeader = styled.div``;
const GroupDetailMetadataBody = styled.div`
    padding: 0 10px 15px;
`;

const GroupDetailMetadata = styled(FlexContainer)`
    align-items: flex-start;
    justify-content: flex-start;
    margin-top: 10px;
`; 

const GroupDetailMetadataKey = styled.div`
    width: 130px;
    ${commomStyles}
    font-weight: 300;
    color: #949699;
`;
const GroupDetailMetadataValue = styled.div`
    ${commomStyles}
    min-width: 130px;
    max-width: 199px;
    word-wrap: break-word;
`;
const GroupDetailMetadataPercentage = styled.div`
    ${commomStyles}
    font-weight: 300; 
    color: ${props => props.theme.primary};
`;

const Hr = styled.hr`

`;

const GroupMetadataMessageSource = styled(GroupTitle)`
    font-size: 16px;
    letter-spacing: 0.4px;
`;


const GroupDetailMessageSearchContainer = styled(FlexContainer)`
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #dedee2;
    padding: 0 0 0 20px;
    border-radius: 4px 4px 0 0;
`;
const GroupDetailMessagesSearchIcon = styled.span`
    & svg {
        vertical-align: middle;
    }
`;
const GroupDetailMessagesSearchField = styled.input`
    margin:0;
	border:0;
    padding: 12px 15px;
	display:inline-block;
	vertical-align:middle;
	white-space:normal;
	background:none;
	line-height:1;
    width: 100%;
    ${commomStyles}
    font-size: 15px;
    
    &:focus {
        outline:0;
    }
    &::placeholder {
        color: #9b9c9e;
    } 
`;

const GroupMessagesContainer = styled.div`
    padding: 0 20px 20px;
    height: 100%;
    overflow-y: auto;
`;

const MessagesDataContainer = styled(FlexContainer)`
    align-items: flex-start;
`;

const MessagesProfileImageContainer = styled.div`
    margin: 42px 10px 0 0;
`;
const MessagesContainer = styled.div`
    
`;
const MessageFromContainer = styled(FlexContainer)`
    margin-top: 25px;
    justify-content: space-between;
    margin-bottom: 3px;
`;
const MessagesTextContainer = styled.div`
    border-radius: 6px;
    background-color: #ffffff;
    padding: 12px;
`;
const MessagesTimeStampContainer = styled.div`
    margin-top: 3px;
`;
const MessageFromText = styled.p`
    ${commomStyles}
    font-size: 12px;
    letter-spacing: 0.3px;
    color: #a8a8ac;
    margin: 0;
`;
const MessagesTimestampText = styled(MessageFromText)`
`;

const MessagesText = styled.div`
    ${commomStyles}
    font-size: 16px;
    font-weight: 300;
    line-height: 1.25;
    letter-spacing: 0.6px;
    color: #161616;
`;

const MessageFromMetadataText = styled(FlexContainer)`
    justify-content: flex-end;
`;

const MessageFromMetadataPlaceholder = styled.p`
    ${commomStyles}
    color: ${props => props.theme.primary};
    margin: 0 5px 0 0;
    font-size: 12px;
    font-weight: 300;
    font-style: italic;
`;

const InfoContainer = styled.div`
    width: 13px;
    height: 13px;
`;

const InfoIcon = styled.div`
    width: 13px;
    height: 13px;
    font-size: 11px;
    line-height: 13px;
    border: 1px solid ${props => props.theme.primary};
    color: ${props => props.theme.primary};
    border-radius: 50%;
    margin: 0 auto;
    text-align: center;
`;

const GroupDetailHeaderButtonContainer = styled.div``;




const GroupDetailData = (props) => {

    var groupFeed = props.groupFeeds[0],
        message = props.message;

    return (
        <Fragment>

            <GroupDetailContainer >

                <GroupDetailMetadataContainer>
                    <GroupDetailMetadataHeader>
                        <GroupDetailMetadataBackdropContainer>
                            <Image src={DummyImage}/>
                            <GroupDetailMetadataBackdrop></GroupDetailMetadataBackdrop>
                        </GroupDetailMetadataBackdropContainer>
                        <GroupImage>
                            <Image src={DummyImage}/>
                        </GroupImage>
                        <GroupTitle title={groupFeed.name}>{groupFeed.name}</GroupTitle>
                    </GroupDetailMetadataHeader>
                    <GroupDetailMetadataBody>

                        <GroupDetailMetadata>
                            <GroupDetailMetadataKey>
                                Client Group ID: 
                            </GroupDetailMetadataKey>
                            <GroupDetailMetadataValue>
                                {groupFeed.clientGroupId}
                            </GroupDetailMetadataValue>
                        </GroupDetailMetadata>
                        <GroupDetailMetadata>
                            <GroupDetailMetadataKey>
                                Group ID: 
                            </GroupDetailMetadataKey>
                            <GroupDetailMetadataValue>
                                {groupFeed.id}
                            </GroupDetailMetadataValue>
                        </GroupDetailMetadata>
                        <GroupDetailMetadata>
                            <GroupDetailMetadataKey>
                                Message Count: 
                            </GroupDetailMetadataKey>
                            <GroupDetailMetadataValue>
                                {message.length}
                            </GroupDetailMetadataValue>
                        </GroupDetailMetadata>
                        <GroupDetailMetadata>
                            <GroupDetailMetadataKey>
                                No. of members: 
                            </GroupDetailMetadataKey>
                            <GroupDetailMetadataValue>
                                {groupFeed.userCount}
                            </GroupDetailMetadataValue>
                        </GroupDetailMetadata>
                        <GroupDetailMetadata>
                            <GroupDetailMetadataKey>
                                Last message: 
                            </GroupDetailMetadataKey>
                            <GroupDetailMetadataValue>
                            {moment(message[0].createdAtTime).format("DD MMM YYYY, hh:mm A")}
                            </GroupDetailMetadataValue>
                        </GroupDetailMetadata>
                        <GroupDetailMetadata>
                            <GroupDetailMetadataKey>
                                Group created: 
                            </GroupDetailMetadataKey>
                            <GroupDetailMetadataValue>
                            {moment(groupFeed.createdAtTime).format("DD MMM YYYY, hh:mm A")}
                            </GroupDetailMetadataValue>
                        </GroupDetailMetadata>

                        <Hr />

                        <GroupMetadataMessageSource>Message source</GroupMetadataMessageSource>

                        <GroupDetailMetadata>
                            <GroupDetailMetadataKey>
                                Sent from Web: 
                            </GroupDetailMetadataKey>
                            <GroupDetailMetadataValue>
                                789
                            </GroupDetailMetadataValue>
                            <GroupDetailMetadataPercentage>
                                70%
                            </GroupDetailMetadataPercentage>
                        </GroupDetailMetadata>
                        <GroupDetailMetadata>
                            <GroupDetailMetadataKey>
                                Sent from Android: 
                            </GroupDetailMetadataKey>
                            <GroupDetailMetadataValue>
                                102
                            </GroupDetailMetadataValue>
                            <GroupDetailMetadataPercentage>
                                10%
                            </GroupDetailMetadataPercentage>
                        </GroupDetailMetadata>
                        <GroupDetailMetadata>
                            <GroupDetailMetadataKey>
                                Sent from iOS: 
                            </GroupDetailMetadataKey>
                            <GroupDetailMetadataValue>
                                203
                            </GroupDetailMetadataValue>
                            <GroupDetailMetadataPercentage>
                                20%
                            </GroupDetailMetadataPercentage>
                        </GroupDetailMetadata>

                    </GroupDetailMetadataBody>
                </GroupDetailMetadataContainer>

                <GroupDetailMessagesContainer>
                    <GroupDetailMessageSearchContainer>
                        <GroupDetailMessagesSearchIcon><SearchIcon /></GroupDetailMessagesSearchIcon>
                        <GroupDetailMessagesSearchField type="text" placeholder="Search in Applozic support" />
                    </GroupDetailMessageSearchContainer>

                    <GroupMessagesContainer>
                        { message.filter(item => item.metadata && item.metadata.hide !== "true" && item.metadata.show !== "false").slice(0).reverse().map(data => (
                            <MessagesDataContainer key={data.key}>
                                <MessagesProfileImageContainer>
                                    <Image src={DummyImage} />
                                </MessagesProfileImageContainer>
                                <MessagesContainer>
                                    <MessageFromContainer>
                                        <MessageFromText>Vibhor Sharma</MessageFromText>
                                        <MessageFromMetadataText>
                                            <MessageFromMetadataPlaceholder>Message contains metadata</MessageFromMetadataPlaceholder>
                                            <InfoContainer>
                                                <InfoIcon className="info-icon">?</InfoIcon>
                                            </InfoContainer>
                                        </MessageFromMetadataText>
                                    </MessageFromContainer>
                                    <MessagesTextContainer>
                                        <MessagesText>{data.message}</MessagesText>
                                    </MessagesTextContainer>
                                    <MessagesTimeStampContainer>
                                        <MessagesTimestampText>{moment(data.createdAtTime).format("DD MMM YYYY, hh:mm A")}</MessagesTimestampText>
                                    </MessagesTimeStampContainer>
                                </MessagesContainer>
                            </MessagesDataContainer>
                            ))
                        }    
                    </GroupMessagesContainer>

                </GroupDetailMessagesContainer>
            </GroupDetailContainer>
        </Fragment>
    )
}



class MessageGroups extends Component {

    constructor(props) {
        super(props);

        this.state = {
            groupData: [],
            totalCombinedGroupData: [],
            showGroupDetailData: false
        };
    };

    componentWillMount = () => {
        var params = {
            startIndex : 0,
            pageSize : 60,
            orderBy : 1,
            roleNameList : "USER",
            // groupId: 263388
          };
        ApplozicClient.getMessageGroups(params).then(response => {
            let result = response.data;

            console.log("totalGroupData", response);
            
            var message = function (el) { return _.pick(el, ['createdAtTime', 'message', 'userKey']); };
            var combinedGroupData = _.merge(result.groupFeeds, _.map(result.message, message));

            this.setState({
                totalCombinedGroupData: combinedGroupData
            })
            console.log("merged GroupData with Messages", combinedGroupData);

        }).catch(err => {
            console.log(err);
        });
    }

    openGroupDetails = (groupId) => {
        var params = {
            startIndex : 0,
            pageSize : 60,
            orderBy : 1,
            roleNameList : "USER",
            groupId: groupId
          };
        ApplozicClient.getMessageGroups(params).then(response => {
            this.setState({
                groupData: response.data,
                showGroupDetailData: true
            })
            console.log("groupData", this.state.groupData);
        }).catch(err => {
            console.log(err);
        });
        console.log(params);
    }

    goToGroupList = () => {
        this.setState({
            showGroupDetailData: false
        });
    }
    
    render() {

        return (
            <Container className="animated fadeIn">

                <GroupDetailHeaderButtonContainer hidden={!this.state.showGroupDetailData}>
                    <GoBackToList onClick={this.goToGroupList}>
                        <GoBackIcon><BackArrow /></GoBackIcon>
                        <GoBackText>Conversations</GoBackText>
                    </GoBackToList>

                    <ExportDataContainer>
                        <ExportDataIcon><DownloadIcon /></ExportDataIcon>
                        <ExportDataText>Export all messages</ExportDataText>
                    </ExportDataContainer>
                </GroupDetailHeaderButtonContainer>

                { this.state.showGroupDetailData && <GroupDetailData {...this.state.groupData} />  }


                <Table hidden={this.state.showGroupDetailData}>
                    <THead>
                        <TableRow>
                            <TableHeader>GROUP NAME</TableHeader>
                            <TableHeader>MESSAGE COUNT</TableHeader>
                            <TableHeader>GROUP MEMBERS</TableHeader>
                            <TableHeader>LAST MESSAGE</TableHeader>
                        </TableRow>
                    </THead>
                    <TBody>
                        {  
                            this.state.totalCombinedGroupData && this.state.totalCombinedGroupData.filter(item => item.id).map( data => (
                                <TableRow key={data.id} onClick={ () => this.openGroupDetails(data.id)}>
                                    <TableData>
                                        <FlexContainer>
                                            <ImageContainer>
                                                <Image src={DummyImage}/>
                                            </ImageContainer>
                                            <GroupNameContainer>
                                                <GroupName>{data.name}</GroupName>
                                                <GroupId>Client group ID: {data.clientGroupId}</GroupId>
                                            </GroupNameContainer>
                                        </FlexContainer>
                                    </TableData>
                                    <TableData>
                                        1024
                                    </TableData>
                                    <TableData>
                                        {data.userCount}
                                    </TableData>
                                    <TableData>
                                        <LastMessage>
                                            <LastMessageFrom>Dhruv: </LastMessageFrom>
                                            <LastMessageData>{data.message}</LastMessageData>
                                        </LastMessage>
                                        <LastMessageTime>
                                        {moment(data.createdAtTime).format("DD MMM YYYY, hh:mm A")}
                                        </LastMessageTime>
                                    </TableData>
                                </TableRow>
                                )
                            )
                        }
                    </TBody>
                </Table>
                
            </Container>
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

export default withTheme(MessageGroups);