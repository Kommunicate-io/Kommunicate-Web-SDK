import { test, expect } from "@playwright/test";
import ChatWidgetPage from "../page/chatwidget.page";

test("Launching Chat Widget And Sending a Message", async ({ page }) => {
    const chatWidgetPage = new ChatWidgetPage(page);
    await chatWidgetPage.launchChatWidget();
    await chatWidgetPage.sendMessage();
    
});
