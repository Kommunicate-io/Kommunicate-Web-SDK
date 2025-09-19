/*
 * kmScript.js
 * playwright_test/utils
 * Created by Archit on 22/12/2022.
 */

export const SCRIPT = {
    kmSendMessageScript: '{"popupWidget": true, "automaticChatOpenOnNavigation": true}',
    kmAllBooleanIsTrue:
        '{"popupWidget": true, "automaticChatOpenOnNavigation": true, "attachment": true, "emojilibrary": true, "locShare": true}',
    kmQuickReplies:
        '{"popupWidget": true, "automaticChatOpenOnNavigation": true, "quickReplies":["Speak with an Agent","Book a Demo","Sample Bots"]}',
    kmAllBooleanIsFalse:
        '{"popupWidget": false, "automaticChatOpenOnNavigation": false,"attachment": false}',
};
