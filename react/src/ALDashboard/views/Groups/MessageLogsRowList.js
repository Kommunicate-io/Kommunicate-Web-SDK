import React, { Fragment } from 'react';
import moment from 'moment';
import * as MessageLogsStyles from './MessageLogsStyles';

const MessageLogsRowList = (props) => {

    let oneToOneChat = props.type === 0,
        data = props.data,
        image = props.getContactImageByAlphabet(data.name);


    return (
        <MessageLogsStyles.TableRow onClick={ () => props.onClickHandler(data)}>
            <MessageLogsStyles.TableData>
                <MessageLogsStyles.FlexContainer>
                    <MessageLogsStyles.ImageContainer>
                        {
                            (data.imageUrl) ? <MessageLogsStyles.Image src={data.imageUrl}/> : <MessageLogsStyles.ContactIcon className={image[1]}>{image[0]}</MessageLogsStyles.ContactIcon>
                        }
                    </MessageLogsStyles.ImageContainer>
                    <MessageLogsStyles.GroupNameContainer>
                        <MessageLogsStyles.GroupName>{data.type === 0 ? data.name.replace(":", " and ") : data.name}</MessageLogsStyles.GroupName>
                        <MessageLogsStyles.GroupId>{data.type === 0 ? <span>This is a 1-to-1 chat</span> : "Client group ID: " + data.clientGroupId}</MessageLogsStyles.GroupId>
                    </MessageLogsStyles.GroupNameContainer>
                </MessageLogsStyles.FlexContainer>
            </MessageLogsStyles.TableData>
            {/* <MessageLogsStyles.TableData>
                1024
            </MessageLogsStyles.TableData> */}
            <MessageLogsStyles.TableData>
                {data.userCount}
            </MessageLogsStyles.TableData>
            <MessageLogsStyles.TableData>
                {   props.encryptedApp ? 
                    <MessageLogsStyles.LastMessage>
                        <MessageLogsStyles.EncryptedMessageText>
                            This conversation is encrypted
                        </MessageLogsStyles.EncryptedMessageText>
                    </MessageLogsStyles.LastMessage> :
                    <Fragment>
                    {   data.senderName ? 
                        <Fragment>
                            <MessageLogsStyles.LastMessage>    
                                <MessageLogsStyles.LastMessageFrom>{data.type === 0 ? data.groupMemberUserKeys[data.senderUserKey] : data.senderName}: </MessageLogsStyles.LastMessageFrom>
                                <MessageLogsStyles.LastMessageData>{data.message}</MessageLogsStyles.LastMessageData>
                            </MessageLogsStyles.LastMessage>
                    
                            <MessageLogsStyles.LastMessageTime>
                            {moment(data.createdAtTime).format("DD MMM YYYY, hh:mm A")}
                            </MessageLogsStyles.LastMessageTime>
                        </Fragment> : <i>No Conversation</i>
                    }
                    </Fragment>
                }
            </MessageLogsStyles.TableData>
        </MessageLogsStyles.TableRow>
    );
}

export default MessageLogsRowList;