import { expect } from "@playwright/test";
import { URL_DETAILS } from "../utils/Url";
import { APP_ID } from "../utils/Constant";

class ChatWidgetPage {
    constructor(page) {
        this.page = page;

        //Locators
        this.testRadioBtn = page.locator("#test");
        this.appIDbox = page.getByPlaceholder(APP_ID.DEF_APP_ID);
        this.launchWidgetBtn = page.getByRole("button", {name: "Launch Widget"});
        this.kommunicateChatWidgetiframe = page.frameLocator('iframe[name="Kommunicate widget iframe"]');
        this.chatWidgetLaunchBtn = this.kommunicateChatWidgetiframe.locator("#launcher-svg-container");
        this.chatWidgetTextBox = this.kommunicateChatWidgetiframe.locator("#mck-text-box");
        this.chatWidgetMsgSendBtn = this.kommunicateChatWidgetiframe.locator("#mck-msg-sbmt");
        this.chatWidgetDeliveredIcon = this.kommunicateChatWidgetiframe.locator('xpath=//span[@title="delivered"]');
    }

    //Launch chat widget
    async launchChatWidget() {
        await this.page.goto(URL_DETAILS.CHATWIDGET_URL);
        await this.testRadioBtn.click();
        await this.appIDbox.click();
        await this.appIDbox.press("Meta+a");
        await this.appIDbox.fill(APP_ID.APP_ID);
        await this.launchWidgetBtn.click();
        await this.chatWidgetLaunchBtn.click();
    }

    //Sending message
    async sendMessage() {
        await this.chatWidgetTextBox.click();
        await this.chatWidgetTextBox.type("hello");
        await this.chatWidgetMsgSendBtn.click();
        await this.chatWidgetDeliveredIcon;
    }
}

export default ChatWidgetPage;
