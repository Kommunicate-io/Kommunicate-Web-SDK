---
id: web-conversation-assignment
title: Conversation Assignment
sidebar_label: Conversation Assignment
---

# Dashboard: conversation routing rules

![List Template](/img/dashboard-conversation-assignment.png)


* In case: **Assign new conversations to bot** is enabled then irrespective of routing rules for agents, the conversation will be assigned to **selected bot**.
* In case: **Assign new conversations to bot** is disabled then conversation assignment depends on Routing rules for agents.
  -  If **Routing rules for agents** is set to **Automatic assignment** then conversation will be assigned to agents in round robin manner.
  - If **Routing rules for agents** is set to **Notify everybody** then conversation will be assigned to a default admin/agent and notification will be sent to everybody. Anybody can assign that conversation to themself after that.
* If conversation assignee is bot :
  - If bot is not able to answer:
    - Conversation will be assigned to default agent if  **Notify everybody** is selected in agent routing rules.
    - Conversation will be assigned to the agent present in conversation for **Automatic assignment**.
  - Welcome message and away message will not come.
  - The **take over from bot** button will be displayed in the conversation, if agent takes over from bot, conversation will assign to that particular agent..


# Bot to agent handoff
There are multiple ways your can assign the conversation to agents. 

  1. Set action `input.unknown` in Dialogflow. If Default fallback intents are enabled, Dialogflow automatically adds this action in response. It means whenever fallback intent is triggered the conversation will be assigned to an agent according to your conversation routing settings. 

  2. Assign conversation to an agent when an intent detected. Set below json as the custom payload in dialogflow. Specify the agent's emailId in `KM_ASSIGN_TO` parameter. If `KM_ASSIGN_TO` parameter left empty conversation routing rules will be applied. 

```js
{
  "platform": "kommunicate",
  "message": "our agents will get back to you", //optional 
  "metadata": {
    "KM_ASSIGN_TO": "agent's userId" // pass empty string to use conversation routing rules. 
  }
}
```
