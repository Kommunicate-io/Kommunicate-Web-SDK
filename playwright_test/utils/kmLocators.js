
/*
 * kmLocators.js
 * playwright_test/utils
 * Created by Archit on 21/12/2011. 
 */

export const locators = {
    envBtn : '//label[@for="test"]',
    appIdField : '//*[@id="root"]/div/div/div[2]/div/div/input',
    scriptFiled : '//*[@id="root"]/div/div/div[3]/div/div/textarea',
    launchWidgetBtn : '(//button[@type="button"])[3]',
    logoutWidgetBtn : '//button[text()="Logout & Reload"]'
}

export const widgetLocators = {
    kmIframe : 'iframe[name="Kommunicate widget iframe"]',
    kmLaunchWidget : '//*[@id="launcher-svg-container"]',
    kmTextBox : '#mck-text-box',
    kmSendButton : '//button[@title="Send Message"]//span[1]',
    kmMsgStatus : '//*[@id="mck-message-cell"]/div[2]/div[1]/div/div[1]/div[2]/div[2]/div[4]/span[2]'
};