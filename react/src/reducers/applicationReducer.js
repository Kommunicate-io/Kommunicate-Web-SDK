import { ROUTING_RULES_FOR_AGENTS } from '../utils/Constant';

const initialState = {
    agentRouting:null,
    applicationId:null,
    botRouting:null,
    collectEmailOnAwayMessage:null,
    collectEmailOnWelcomeMessage:null,
    defaultConversationAssignee:{},
    removeBotOnAgentHandOff:null,
    widgetTheme:{
      iconIndex:null,
      primaryColor:null,
      secondaryColor:null,
      widgetImageLink:null
    }

};
initialState.defaultConversationAssignee[ROUTING_RULES_FOR_AGENTS.NOTIFY_EVERYBODY] = null;
initialState.defaultConversationAssignee[ROUTING_RULES_FOR_AGENTS.AUTOMATIC_ASSIGNMENT] = null;

const applicationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_APP_SETTINGS':
      return {
        ...state,
        applicationId : action.payload.applicationId,
        agentRouting :action.payload.agentRouting,
        botRouting : action.payload.botRouting,
        collectEmailOnAwayMessage : action.payload.collectEmailOnAwayMessage,
        collectEmailOnWelcomeMessage : action.payload.collectEmailOnWelcomeMessage,
        defaultConversationAssignee : action.payload.defaultConversationAssignee,
        removeBotOnAgentHandOff : action.payload.removeBotOnAgentHandOff,
        widgetTheme : action.payload.widgetTheme,
      }
    default:
      return state
  }
}

export default applicationReducer
