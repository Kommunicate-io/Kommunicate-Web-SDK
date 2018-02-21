---
id: ios-conversation
title: Conversation
sidebar_label: Conversation
---



### Launch chat screen


You can launch the chat screen(Where all the conversations are listed in descending order of communication time) as below:

```
  ALChatManager * chatManager = [[ALChatManager alloc] init];
  [chatManager launchChat:self];
````



### Create a new Conversation

You can create a new conversation as below.


```
    ALChatManager * chatManager = [[ALChatManager alloc] init];
    [chatManager startNewConversation:@"Group name" withAgentId:<agentId here> withBotId:@"bot" withCompletion:^(ALChannel *alChannel, NSError *error) {
        if(alChannel){
            NSLog(@"Conversation created %@ ",alChannel.description);
        }else{
            NSLog(@"Error in start conversation");
        }
        
    }];
 ```
 
 
### Open a particular conversation
 
 You can open a particular conversation if you have the group id of the conversation.


 ```
 
     ALChatManager * chatManager = [[ALChatManager alloc] init];
    [chatManager launchChatForUserWithDisplayName:nil
                                      withGroupId:groupId // Pass the channel.key
                               andwithDisplayName:nil
                            andFromViewController:self ];
                            
 ```
