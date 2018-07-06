---
id: web-conversation-assignment
title: Conversation Assignment
sidebar_label: Conversation Assignment
---
# Assign to agent
You can assign conversation to perticular agent on peticular intent. Add the following custom payload into your dialogflow intent. Kommunicate will assign the conversation to the agent that you mentioned into "KM_ASSIGN_TO".

```
{
  "platform": "kommunicate",
  "message": text message, //ex. "our sales agent will help you on price negotiation"
  "metadata": {
    "KM_ASSIGN_TO": agent's userId,
    "payload": {}
  }
}
```