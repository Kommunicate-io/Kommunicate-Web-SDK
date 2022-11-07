import { test, expect } from "@playwright/test";
import ChatWidgetPage from "../page/chatwidget.page";

test("test", async ({ page }) => {
    const chatWidgetPage = new ChatWidgetPage(page);
    await chatWidgetPage.launchChatWidget();
    await chatWidgetPage.sendMessage();
    
});
