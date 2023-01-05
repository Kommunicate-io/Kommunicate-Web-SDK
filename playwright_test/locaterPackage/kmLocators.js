
/*
 * kmLocators.js
 * playwright_test/utils
 * Created by Archit on 21/12/2022. 
 */

export const locators = {
    envBtn : '//label[@for="test"]',
    appIdField : '//span[text()="App ID"]/following::input',
    scriptFiled : '//textarea[@data-gramm="false"]',
    launchWidgetBtn : '(//button[@type="button"])[3]',
    logoutWidgetBtn : '//button[text()="Logout & Reload"]'
}

export const widgetLocators = {
    kmIframe : 'iframe[name="Kommunicate widget iframe"]',
    kmLaunchWidget : '#launcher-svg-container',
    kmTextBox : '#mck-text-box',
    kmSendButton : '//button[@title="Send Message"]//span[1]',
    kmMsgStatus : '//div[@id="mck-message-cell"]//span[@aria-hidden="false"]',
    kmEmojiBtn : '#mck-btn-smiley',
    kmMicBtn : '#mck-mic-btn',
    kmLocBtn : '#mck-btn-loc',
    kmAttachmentBtn : '#mck-file-up',
    kmSmirkEmoji : '//*[@id="group_0"]/a[6]',
    kmLocSendBtn : '#mck-loc-submit'
};

export const richMessagesLocators = {
    kmSuggestedRepliesYesBtn : '//button[@aria-label="Yes"]',
    kmSuggestedRepliesYesBtnResponse : '//div[text()="Cool! send me more."]'
}