import styled, { css } from 'styled-components';

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

const placeholderProfileBG = css`
    & .alpha_0 {
        background-color: #FCA6A2;
        color: rgba(255,255,255,.7);
    }
    & .alpha_1 {
        background-color: #FFA750;
        color: rgba(255,255,255,.7);
    }
    & .alpha_2 {
        background-color: #FCDB51;
        color: rgba(0,0,0,.5);
    }
    & .alpha_3 {
        background-color: #C4FF43;
        color: rgba(0,0,0,.5);
    }
    & .alpha_4 {
        background-color: #75FCA2;
        color: rgba(0,0,0,.5);
    }
    & .alpha_5 {
        background-color: #34F2F7;
        color: rgba(0,0,0,.5);
    }
    & .alpha_6 {
        background-color: #32B2F9;
        color: rgba(255,255,255,.7);
    }
    & .alpha_7 {
        background-color: #9F80FF;
        color: rgba(255,255,255,.7);
    }
    & .alpha_8 {
        background-color: #CE77FC;
        color: rgba(255,255,255,.7);
    }
    & .alpha_9 {
        background-color: #F998F0;
        color: rgba(255,255,255,.7);
    }
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
        cursor: default;
    }
    & tr:hover {
        box-shadow: none;   
    }
`;
const TBody = styled.tbody`

`;
const TableRow = styled.tr`
    border-radius: 3px;
    box-shadow: 0 2px 5px 0 rgba(172, 170, 170, 0.5);
    cursor: pointer;
    ${placeholderProfileBG}
    transition: all 0.3s ease-in-out;

    &:hover {
        box-shadow: 0 3px 9px 2px rgba(212, 208, 208, 0.45);   
    }

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
    object-fit: cover;
`;

const GroupNameContainer = styled.div``;
const GroupName = styled.div`
    ${commomStyles}
`;
const GroupId = styled.div`
    font-size: 12px;
    color: #8e8f91;
    margin-top: 3px;

    & span {
        font-style: italic;
    }
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

const LoadMoreButtonContainer = styled.div`
    text-align: right;
    & button {
        margin-top: 25px;
    }
`;





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
    height: calc(100vh - 180px);
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

    & img, & div {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 0;
        filter: blur(6px);
    } 
    & div {
        font-size: 100px;
        line-height: 100%;
    }
`;
const GroupDetailMetadataBackdrop = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
`;
const GroupImage = styled(ImageContainer)`
    width: 70px;
    height: 70px;
    position: relative;
    margin: -35px auto 20px;

    & img, & div {
        width: 70px;
        height: 70px;
        height: 70px;
        border: 2px solid #fff;
    }
    & div {
        line-height: 70px;
        font-size: 35px;
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
    padding: 0 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
const GroupDetailMetadataHeader = styled.div`
    ${placeholderProfileBG}
`;
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
    word-wrap: normal;

    & span:last-child {
        color: #949699;
    }
`;
const GroupDetailMetadataPercentage = styled.div`
    ${commomStyles}
    font-weight: 300; 
    color: ${props => props.theme.primary};
`;

const Hr = styled.hr``;

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
        border: none;
        box-shadow: none;
    }
    &::placeholder {
        color: #9b9c9e;
    } 
`;

const GroupMessagesContainer = styled.div`
    padding: 0 20px 20px;
    height: calc(100% - 43px);
    overflow-y: auto;
    overflow-x: hidden;
    ${placeholderProfileBG}
`;

const MessagesDataContainer = styled(FlexContainer)`
    align-items: flex-start;
`;

const MessagesProfileImageContainer = styled.div`
    margin: 42px 10px 0 0;
    width: 35px;
    height: 35px;
`;
const MessagesContainer = styled.div`
    width: 100%;
    max-width: 93%;
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
const MessagesTimestampText = styled(MessageFromText)``;

const MessagesText = styled.div`
    ${commomStyles}
    font-size: 16px;
    font-weight: 300;
    line-height: 1.25;
    letter-spacing: 0.6px;
    color: #161616;
    width: 100%;
    word-break: break-word;
`;
const MessagesMetadata = styled(MessagesText)`
    font-style: italic;
    letter-spacing: 0.6px;
    color: #999696;
    margin-top: 15px;
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

const EncryptedMessageText = styled(LastMessageFrom)`
    color: ${props => props.theme.primary};
`;

const ContactIcon = styled.div`
    font-weight: bold;
    vertical-align: middle;
    height: 35px;
    line-height: 35px;
    display: block;
    border-radius: 50%;
    text-align: center;
`;

const EncryptedMessageLogoContainer = styled(FlexContainer)`
    width: 100%;
    height: 100%;
    justify-content: center;
    flex-direction: column;
`;

const EncryptedMessageLogoText = styled(GoBackText)`
    font-size: 24px;
    margin-top: 20px;
    font-weight: 300;
`;

const EmptyStateContainer = styled.div`
    text-align: center;
`;

module.exports = {
    Container,
    Table, 
    THead,
    TBody,
    TableRow,
    TableHeader,
    TableData,
    ImageContainer,
    Image,
    GroupNameContainer,
    GroupName,
    GroupId,
    LastMessage,
    LastMessageFrom,
    FlexContainer,
    LastMessageData,
    LastMessageTime,
    LoadMoreButtonContainer,
    GoBackToList,
    GoBackText,
    GoBackIcon,
    ExportDataContainer,
    ExportDataIcon,
    ExportDataText,
    GroupDetailContainer,
    GroupDetailMetadataContainer,
    GroupDetailMessagesContainer,
    GroupDetailMetadataBackdropContainer,
    GroupDetailMetadataBackdrop,
    GroupImage,
    GroupTitle,
    GroupDetailMetadataHeader,
    GroupDetailMetadataBody,
    GroupDetailMetadata,
    GroupDetailMetadataKey,
    GroupDetailMetadataValue,
    GroupDetailMetadataPercentage,
    GroupMetadataMessageSource,
    GroupDetailMessageSearchContainer,
    GroupDetailMessagesSearchIcon,
    GroupDetailMessagesSearchField,
    GroupMessagesContainer,
    MessagesDataContainer,
    MessagesProfileImageContainer,
    MessagesContainer,
    MessageFromContainer,
    MessagesTextContainer,
    MessagesTimeStampContainer,
    MessageFromText,
    MessagesTimestampText,
    MessagesText,
    MessagesMetadata,
    MessageFromMetadataText,
    MessageFromMetadataPlaceholder,
    InfoContainer,
    InfoIcon,
    GroupDetailHeaderButtonContainer,
    EncryptedMessageText,
    ContactIcon,
    EncryptedMessageLogoContainer,
    EncryptedMessageLogoText,
    EmptyStateContainer
}