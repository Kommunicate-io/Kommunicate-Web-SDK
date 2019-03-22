import React, { Fragment } from 'react';
import moment from 'moment';
import Linkify from 'react-linkify';
import * as MessageLogsStyles from './MessageLogsStyles';
import { SearchIcon, EncryptedLockIcon } from '../../../assets/svg/svgs';

const MessageLogsDetailsPage = (props) =>  {

    var oneToOneChat = props.type === 0,
        groupFeed = !oneToOneChat ? props.groupFeeds[0] : props.userDetails[0],
        message = props.message,
        displayName = groupFeed.name || groupFeed.displayName || groupFeed.userId,
        image = props.getContactImageByAlphabet(displayName),
        imageTag = <MessageLogsStyles.Image src={groupFeed.imageUrl}/>,
        searchFieldPlaceholder = !oneToOneChat ? "Search in " + groupFeed.name : "Search";


    return (
        <Fragment>

            <MessageLogsStyles.GroupDetailContainer >

                <MessageLogsStyles.GroupDetailMetadataContainer id="group-metadata-container">
                    <MessageLogsStyles.GroupDetailMetadataHeader>
                        <MessageLogsStyles.GroupDetailMetadataBackdropContainer>
                            {(groupFeed.imageUrl) ? imageTag : <MessageLogsStyles.ContactIcon className={image[1]}>{image[0]}</MessageLogsStyles.ContactIcon>}
                            <MessageLogsStyles.GroupDetailMetadataBackdrop />
                        </MessageLogsStyles.GroupDetailMetadataBackdropContainer>
                        <MessageLogsStyles.GroupImage>
                            {(groupFeed.imageUrl) ? imageTag : <MessageLogsStyles.ContactIcon className={image[1]}>{image[0]}</MessageLogsStyles.ContactIcon>}
                        </MessageLogsStyles.GroupImage>
                        <MessageLogsStyles.GroupTitle title={displayName}>{displayName}</MessageLogsStyles.GroupTitle>
                    </MessageLogsStyles.GroupDetailMetadataHeader>
                    <MessageLogsStyles.GroupDetailMetadataBody>

                        { props.type !==0 && 
                            <Fragment>
                                <MessageLogsStyles.GroupDetailMetadata>
                                    <MessageLogsStyles.GroupDetailMetadataKey>
                                        Client Group ID: 
                                    </MessageLogsStyles.GroupDetailMetadataKey>
                                    <MessageLogsStyles.GroupDetailMetadataValue>
                                        {groupFeed.clientGroupId}
                                    </MessageLogsStyles.GroupDetailMetadataValue>
                                </MessageLogsStyles.GroupDetailMetadata>
                                <MessageLogsStyles.GroupDetailMetadata>
                                    <MessageLogsStyles.GroupDetailMetadataKey>
                                        Group ID: 
                                    </MessageLogsStyles.GroupDetailMetadataKey>
                                    <MessageLogsStyles.GroupDetailMetadataValue>
                                        {groupFeed.id}
                                    </MessageLogsStyles.GroupDetailMetadataValue>
                                </MessageLogsStyles.GroupDetailMetadata>
                            </Fragment>
                        }
                        <MessageLogsStyles.GroupDetailMetadata>
                            <MessageLogsStyles.GroupDetailMetadataKey>
                                Message Count: 
                            </MessageLogsStyles.GroupDetailMetadataKey>
                            <MessageLogsStyles.GroupDetailMetadataValue>
                                {message.length}
                            </MessageLogsStyles.GroupDetailMetadataValue>
                        </MessageLogsStyles.GroupDetailMetadata>
                        <MessageLogsStyles.GroupDetailMetadata>
                            <MessageLogsStyles.GroupDetailMetadataKey>
                                No. of members: 
                            </MessageLogsStyles.GroupDetailMetadataKey>
                            <MessageLogsStyles.GroupDetailMetadataValue>
                                {!oneToOneChat ? groupFeed.userCount : <Fragment><span>{props.userCount}</span><span> (1 to 1 chat)</span></Fragment>}
                            </MessageLogsStyles.GroupDetailMetadataValue>
                        </MessageLogsStyles.GroupDetailMetadata>
                        { message.length > 0 &&
                            <MessageLogsStyles.GroupDetailMetadata>
                                <MessageLogsStyles.GroupDetailMetadataKey>
                                    Last message: 
                                </MessageLogsStyles.GroupDetailMetadataKey>
                                <MessageLogsStyles.GroupDetailMetadataValue>
                                {moment(message[0].createdAtTime).format("DD MMM YYYY, hh:mm A")}
                                </MessageLogsStyles.GroupDetailMetadataValue>
                            </MessageLogsStyles.GroupDetailMetadata>
                        }
                        <MessageLogsStyles.GroupDetailMetadata>
                            <MessageLogsStyles.GroupDetailMetadataKey>
                                Group created: 
                            </MessageLogsStyles.GroupDetailMetadataKey>
                            <MessageLogsStyles.GroupDetailMetadataValue>
                            {moment(groupFeed.createdAtTime).format("DD MMM YYYY, hh:mm A")}
                            </MessageLogsStyles.GroupDetailMetadataValue>
                        </MessageLogsStyles.GroupDetailMetadata>

                        {/* <Hr />

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
                        </GroupDetailMetadata> */}

                    </MessageLogsStyles.GroupDetailMetadataBody>
                </MessageLogsStyles.GroupDetailMetadataContainer>

                <MessageLogsStyles.GroupDetailMessagesContainer id="group-messages-container">
                    { !props.encryptedApp ?
                    <Fragment>
                        <MessageLogsStyles.GroupDetailMessageSearchContainer>
                            <MessageLogsStyles.GroupDetailMessagesSearchIcon><SearchIcon /></MessageLogsStyles.GroupDetailMessagesSearchIcon>
                            <MessageLogsStyles.GroupDetailMessagesSearchField type="text" placeholder={searchFieldPlaceholder} value={props.searchValue} onChange={props.onChange} autoComplete="off" />
                        </MessageLogsStyles.GroupDetailMessageSearchContainer>

                        <MessageLogsStyles.GroupMessagesContainer className="al-messages-list-section-container">
                            { message.length > 0 && message.filter(item => item.metadata && item.metadata.hide !== "true" && item.metadata.show !== "false").slice(0).reverse().map((data, index) => {
                            
                                return (
                                    <MessageList key={index} data={data} image={props.getContactImageByAlphabet} />
                                )
                            })
                            }    
                        </MessageLogsStyles.GroupMessagesContainer>
                    </Fragment> :
                    <MessageLogsStyles.EncryptedMessageLogoContainer>
                        <EncryptedLockIcon />
                        <MessageLogsStyles.EncryptedMessageLogoText>This conversation is encrypted</MessageLogsStyles.EncryptedMessageLogoText>
                    </MessageLogsStyles.EncryptedMessageLogoContainer>
                }

                </MessageLogsStyles.GroupDetailMessagesContainer>
            </MessageLogsStyles.GroupDetailContainer>
        </Fragment>
    )
};


const MessageList = (props) => {
    let data = props.data,
        displayName = data.to,
        image = props.image(displayName);

    return (
        <MessageLogsStyles.MessagesDataContainer className="al-messages-list-sections--blocks">
            <MessageLogsStyles.MessagesProfileImageContainer>
                {
                    (data.imageUrl) ? <MessageLogsStyles.Image src={data.imageUrl}/> : <MessageLogsStyles.ContactIcon className={image[1]}>{image[0]}</MessageLogsStyles.ContactIcon>
                }
            </MessageLogsStyles.MessagesProfileImageContainer>
            <MessageLogsStyles.MessagesContainer>
                <MessageLogsStyles.MessageFromContainer>
                    <MessageLogsStyles.MessageFromText>{data.to}</MessageLogsStyles.MessageFromText>
                    { Object.keys(data.metadata).length > 0 && <MessageLogsStyles.MessageFromMetadataText>
                        <MessageLogsStyles.MessageFromMetadataPlaceholder>Message contains metadata</MessageLogsStyles.MessageFromMetadataPlaceholder>
                        <MessageLogsStyles.InfoContainer>
                            <MessageLogsStyles.InfoIcon className="info-icon">?</MessageLogsStyles.InfoIcon>
                        </MessageLogsStyles.InfoContainer>
                    </MessageLogsStyles.MessageFromMetadataText> }
                </MessageLogsStyles.MessageFromContainer>
                <MessageLogsStyles.MessagesTextContainer>
                    {data.source == 7 ? 
                    <MessageLogsStyles.MessagesText className="al-messages-list-section--messages" id={"al-iframe-container" + data.groupId || data.key} dangerouslySetInnerHTML={mailMarkup(data)} /> : 
                    <Linkify properties={{target: '_blank'}}>
                        <MessageLogsStyles.MessagesText className="al-messages-list-section--messages">{data.message}</MessageLogsStyles.MessagesText>
                    </Linkify>
                    }
                    { Object.keys(data.metadata).length > 0 ?
                        <MessageLogsStyles.MessagesMetadata> {JSON.stringify(data.metadata)}</MessageLogsStyles.MessagesMetadata> : 
                        ""
                    }
                </MessageLogsStyles.MessagesTextContainer>
                <MessageLogsStyles.MessagesTimeStampContainer>
                    <MessageLogsStyles.MessagesTimestampText>{moment(data.createdAtTime).format("DD MMM YYYY, hh:mm A")}</MessageLogsStyles.MessagesTimestampText>
                </MessageLogsStyles.MessagesTimeStampContainer>
            </MessageLogsStyles.MessagesContainer>
        </MessageLogsStyles.MessagesDataContainer>
    )
}

const mailMarkup = (message) => {
    return {__html: message.message};
}

export default MessageLogsDetailsPage;