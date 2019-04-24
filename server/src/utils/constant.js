exports.KM_SERVER_RELEASE_VERSION = "4.3";

exports.GROUP_ROLE = { ADMIN: "1", MODERATOR: "2", MEMBER: "3" }; // bot is moderator

exports. ADJECTIVE = ["Merry", "Amused", "Bubbly", "Cheerful", "Friendly", "Happy", "Jolly", "Sincere", "Excited", "Euphoric", "Zealous", "Lively", "Witty", "Inventive", "Reliable", "Charming", "Dynamic", "Diligent", "Kooky", "Brainy", "Ecstatic", "Fancy", "Posh", "Poised", "Suave", "Radiant", "Shrewd", "Sporty", "Stylish", "Phenomenal"];

exports.NAME = ["Octopus", "Squid", "Starfish", "Seadragon", "Jellyfish", "Shellfish", "Lobster", "Seal", "Turtle", "Eel", "Stingray", "Orca", "Dolphin", "Krill", "Oyster", "Pufferfish", "Seahorse", "Manatee", "Narwhal", "Otter", "Cod", "Tuna", "Mackerel", "Salmon", "Goldfish", "Shark", "Whale", "Herring", "Angelfish", "Clownfish"];


exports.appSettings={
    ROUTING_RULES_FOR_AGENTS : {
        NOTIFY_EVERYBODY: 0,
        AUTOMATIC_ASSIGNMENT: 1
    },
     REMOVE_BOT_ON_AGENT_HANDOFF: {
         ENABLED:1,
         DISABLED:0
        },
    LEAD_COLLECTION_TYPE: {
        COLLECT_EMAIL_ON_WELCOME: 0,
        COLLECT_EMAIL_ON_AWAY: 1,
        COLLECT_EMAIL_ON_BOTH_WELCOME_AND_AWAY: 2,
        COLLECT_EMAIL_ON_MANUAL_TRIGGER: 3,
        COLLECT_EMAIL_VIA_ASK_USER_DETAIL: 4
    }
}
exports.ROUTING_RULES_FOR_AGENTS =this.appSettings.ROUTING_RULES_FOR_AGENTS;

exports.ONBOARDING_STATUS = {
    ACCOUNT_CREATED: 1,
    PROFILE_UPDATED: 2,
    SCRIPT_INSTALLED:3,
    WIDGET_CUSTOMIZED: 4,
    MAILBOX_CONFIGURED: 5,
    WELCOME_MESSAGE_CREATED:6,
    TEAM_INVITATION_SENT: 7,
   
}