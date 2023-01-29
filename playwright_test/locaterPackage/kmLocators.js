
/*
 * kmLocators.js
 * playwright_test/utils
 * Created by Archit on 21/12/2022. 
 */

export const LOCATORS = {
    envBtn : '#test',
    appIdField : '//span[text()="App ID"]/following::input',
    scriptFiled : '//textarea[@data-gramm="false"]',
    launchWidgetBtn : '(//button[@type="button"])[3]',
    logoutWidgetBtn : '//button[text()="Logout & Reload"]'
};

export const WIDGET_LOCATORS = {
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

export const RICHMESSAGES_LOCATORS = {
    kmSuggestedRepliesYesBtn : '//button[@aria-label="Yes"]',
    kmSuggestedRepliesYesBtnResponse : '//div[text()="Cool! send me more."]',
    kmLinkButton : '//button[@aria-label="Go To Google"]',
    kmLinkOnNewTab : '//img[@alt="Google"]',
    kmImageResponse: '//div[@class="km-image-template"]',
    kmCombiSuggestedRepliesBtn : '//button[@aria-label="Suggested reply Button"]',
    kmCombiSubmitBtn : '//button[@data-buttontype="submit"]',
    kmCombiSuggestedRepliesBtnResponse : '//div[text()="text will be sent as message"]',
    kmSubmitButton: '//button[@data-buttontype="submit"]',
    kmSubmitButtonResponse: '//div[text()="Button Response"]',
    kmImageResponse: '//div[@class="km-image-template"]',
    kmNameInFormTemplate : '//input[@placeholder="Enter your name"]',
    kmPhoneInFormTemplate : '//input[@placeholder="Enter your Phone No"]',
    kmRadioButtonInFormTemplate : '//input[@value="male"]',
    kmCheckBox1InFormTemplate : '//input[@value="metal"]',
    kmCheckBox2InFormTemplate : '//input[@value="blues"]',
    kmSubmitBtnInFormTemplate : '//button[text()="Submit"]',
    kmDropDownInFormTemplate : '//select[@data-error-text="Please select your profession"]',
    kmTextAreaInFormTemplate : '//textarea[@cols="10"]',
    kmDateInFormTemplate : '//input[@type="date"]'

};

export const COMMON_VALUES = {
    thresholdValue : 0.98
};
