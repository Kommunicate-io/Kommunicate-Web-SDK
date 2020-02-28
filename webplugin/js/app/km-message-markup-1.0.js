Kommunicate.messageTemplate = {
    getAttachmentTemplate: function () {
         return `<div class="mck-file-text mck-attachment {{attachmentClass}} notranslate mck-attachment-{{key}}" data-groupId="{{groupId}}" data-filemetakey="{{fileMetaKey}}" data-stopupload="{{fileMeta.stopUpload}}" data-filename="{{fileMeta.name}}" data-thumbnailUrl="{{fileMeta.thumbnailUrl}}"  data-filetype="{{fileMeta.contentType}}" data-fileurl="{{fileUrl}" data-filesize="{{fileMeta.size}}+" data-msgkey ="{{key}}"><div>{{{fileExpr}}}</div><div class="{{attachmentDownloadClass}}">{{{downloadMediaUrlExpr}}}</div></div>`;
           
    },
    getAttachmentApplicationTemplate: function(attachment) {
        return `<div class="km-attachment-wrapper mck-attachment {{attachmentClass}} notranslate mck-attachment-{{key}}" data-groupId="{{groupId}}" data-filemetakey="{{fileMetaKey}}" data-filename="{{fileMeta.name}}" data-thumbnailUrl="{{fileMeta.thumbnailUrl}}"  data-filetype="{{fileMeta.contentType}}" data-fileurl="{{fileUrl}" data-filesize="{{fileMeta.size}}+" data-msgkey ="{{key}}"><div class="mck-msg-box vis km-custom-widget-background-color" data-groupId="{{groupId}}" data-filemetakey="{{fileMetaKey}}">
        <svg width="9" height="9" class="km-attachment-icon km-attachment-cancel-icon km-attachment-cancel-icon-{{key}} {{cancelIconClass}}" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7338 0.275312C11.3788 -0.0796375 10.8055 -0.0796375 10.4505 0.275312L6 4.71672L1.54949 0.266213C1.19454 -0.0887375 0.621163 -0.0887375 0.266213 0.266213C-0.0887375 0.621163 -0.0887375 1.19454 0.266213 1.54949L4.71672 6L0.266213 10.4505C-0.0887375 10.8055 -0.0887375 11.3788 0.266213 11.7338C0.621163 12.0887 1.19454 12.0887 1.54949 11.7338L6 7.28328L10.4505 11.7338C10.8055 12.0887 11.3788 12.0887 11.7338 11.7338C12.0887 11.3788 12.0887 10.8055 11.7338 10.4505L7.28328 6L11.7338 1.54949C12.0796 1.20364 12.0796 0.621162 11.7338 0.275312Z" fill="white"/></svg>
        <svg width="16" height="16" class="km-attachment-icon km-attachment-upload-icon km-attachment-upload-icon-{{key}} {{uploadIconClass}}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0C3.55556 0 0 3.55556 0 8C0 12.4444 3.55556 16 8 16C12.4444 16 16 12.4444 16 8C16 3.55556 12.4444 0 8 0ZM5.88889 5.44444L7.88889 3.22222C7.88889 3.11111 8 3.11111 8.11111 3.11111C8.22222 3.11111 8.22222 3.11111 8.33333 3.22222L10.3333 5.44444C10.4444 5.55556 10.4444 5.66667 10.3333 5.77778C10.3333 5.88889 10.2222 5.88889 10.1111 5.88889H8.88889V9.44444C8.88889 9.55556 8.77778 9.66667 8.66667 9.66667H7.55556C7.44445 9.66667 7.33333 9.55556 7.33333 9.44444V5.88889H6.22222C6.11111 5.88889 6 5.77778 6 5.77778C5.77778 5.66667 5.77778 5.55556 5.88889 5.44444ZM12.2222 11.4444C12.2222 11.7778 12 12 11.6667 12H4.44444C4.11111 12 3.88889 11.7778 3.88889 11.4444V9.22222H5V10.8889H11.1111V9.22222H12.2222V11.4444Z" fill="white"/></svg><a class="km-attachment-preview-href-{{key}}" href="{{fileMeta.previewUrl}}" target="_self" download><svg width="16" height="16" class="km-attachment-download-icon-{{key}} km-attachment-download-icon {{downloadIconClass}}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM11.6 12H5V11.1H11.6V12ZM8.3 10.1L5 6.8H6.9V4H9.7V6.8H11.6L8.3 10.1Z" fill="white"></path></svg>
        <span class="km-attachment-file-name">{{fileMeta.name}}<span/>{{fileMeta.previewSize}}</a></div><div class="km-attachment-progress-bar-wrapper km-attachment-progress-bar-wrapper-{{key}} {{progressBarClass}}"><div class="km-attachment-progress-bar-success km-attachment-progress-bar-success-{{key}} vis"></div></div></div>`;
    },
    getProgressMeter:function(key) {
        return '<div class="km-progress-meter-container km-progress-meter-back-drop progress-meter-{{key}}"><svg class="km-progress-svg" xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 107 105"><g class="km-progress-icons"><circle class="km-progress-meter" cx="54" cy="54" r="45" stroke-width="10" /><circle class="km-progress-value" cx="54" cy="54" r="45" stroke-width="5" /><path class="km-progress-stop-upload-icon km-progress-stop-upload-icon-{{key}} vis" d="M51.5,47.9L32.3,28.7c-1.3-1.3-2.3-1.3-3.6,0c-1.3,1.3-0.3,3.3,1,4.6c0,0,0,0,0,0l19.1,19.1   c0.8,0.8,0.8,2.2,0,3.1L29.7,74.7c-1.3,1.3-2.4,3.4-1,4.6c1.8,1.5,2.7,0.6,3.6,0c0,0,1-1,1-1l19.1-19.1c0.8-0.8,2.6-1,3.4-0.1   l19.8,20.3c1.3,1.3,2.3,1.3,3.6,0c1.3-1.3,0.3-3.3-1-4.6L59.1,55.5c-0.8-0.8-0.8-2.2,0-3.1l19.1-19.1c1.3-1.3,2.3-3.3,1-4.6   c-1.3-1.3-3.3-0.3-4.6,1L56.4,48C55.5,48.9,52.3,48.7,51.5,47.9L51.5,47.9z" fill="#FFF" data-name="Path 1"/><path class="km-progress-upload-icon km-progress-upload-icon-{{key}} n-vis" d="M52.246 21.547L30.00689 43.78339a3.2 3.2 0 0 0-.03927 4.4858l.03047.03155a3.2 3.2 0 0 0 4.56449.03994L51.286 31.619v53.712a3.2 3.2 0 0 0 3.2 3.2 3.2 3.2 0 0 0 3.2-3.2V31.619l16.72045 16.72131a3.2 3.2 0 0 0 4.56467-.03976l.03029-.03136a3.2 3.2 0 0 0-.03927-4.4858L56.723 21.547l-.06168-.05724a3.2 3.2 0 0 0-4.3542.00048z" fill="#FFF"/></g></svg></div>';
    },
    getAttachmentContanier: function (data, fileExpr, mediaUrlExpr, fileUrl) {
        data.downloadMediaUrlExpr = mediaUrlExpr
        data.fileExpr = fileExpr;
        data.fileUrl = fileUrl;
        if (typeof data.fileMeta === 'object' && data.fileMeta.contentType) {
            data.attachmentDownloadClass = "n-vis"
            data.attachmentClass = (data.fileMeta.contentType.indexOf("image/") != 1 || data.fileMeta.contentType.indexOf("audio/") != -1 || data.fileMeta.contentType.indexOf("video/") != 1) ? "" : "mck-msg-box";

            switch (true) {
                case (data.fileMeta.contentType.indexOf("image") != -1):
                    data.attachmentDownloadClass = "vis";
                    return Mustache.to_html(Kommunicate.messageTemplate.getAttachmentTemplate(), data);
                    break;
                case (data.fileMeta.contentType.indexOf("application") != -1):
                case (data.fileMeta.contentType.indexOf("text") != -1):
                        data.attachmentClass = "km-application-attachment-wrapper"
                    if (!Kommunicate.internetStatus) {
                        data.uploadIconClass = "vis";
                        data.downloadIconClass = "n-vis";
                        data.cancelIconClass = "n-vis";
                    } else if(data.type == 4) {
                        data.uploadIconClass = "n-vis";
                        data.downloadIconClass = "vis";
                        data.cancelIconClass = "n-vis";
                        data.progressBarClass ="n-vis";
                        data.attachmentClass = "";
                    } else {
                        data.uploadIconClass = "n-vis";
                        data.downloadIconClass = data.sent || data.delivered ? "vis" : "n-vis";
                        data.cancelIconClass = data.sent || data.delivered ? "n-vis" : "vis";
                        data.progressBarClass = data.sent || data.delivered ? "n-vis" : "vis";
                    }
                    data.fileMeta.url = (data.fileMeta && data.fileMeta.url) || "javascript:void(0)";
                    return Mustache.to_html(Kommunicate.messageTemplate.getAttachmentApplicationTemplate(data), data);
                    break;
                default:
                    return Mustache.to_html(Kommunicate.messageTemplate.getAttachmentTemplate(), data);
            }
        }
    },
    getProgressMeterContanier:function(key) {
        var data = {key: key};
        return Mustache.to_html(Kommunicate.messageTemplate.getProgressMeter(), data);
    }
};

Kommunicate.popupChatTemplate = {

    getPopupChatTemplate: function(popupWidgetContent, chatWidget, isAnonymousChat) {
        var isPopupEnabled = kommunicateCommons.isObject(chatWidget) && chatWidget.popup;
        var chatPopupTemplateMarkup = "";
        var popupMessageContent = popupWidgetContent && popupWidgetContent.length && popupWidgetContent[0].message;
        
        if(isPopupEnabled) {
            var launcherClass = isAnonymousChat ? "km-anonymous-chat-launcher" : "applozic-launcher";
            var index = (popupWidgetContent && popupWidgetContent.length && popupWidgetContent[0].templateKey) || KommunicateConstants.CHAT_POPUP_TEMPLATE.HORIZONTAL;
            var templateCss = index === KommunicateConstants.CHAT_POPUP_TEMPLATE.HORIZONTAL ? 'chat-popup-widget-container--horizontal' : 'chat-popup-widget-container--vertical';
            chatPopupTemplateMarkup = '<div id="chat-popup-widget-container" class="chat-popup-widget-container ' + templateCss + ' n-vis"><div class="chat-popup-widget-text-wrapper '  + launcherClass + '"><p class="chat-popup-widget-text">' + (popupMessageContent && kommunicateCommons.formatHtmlTag(popupMessageContent)) + '</p></div>' + '<div class="chat-popup-widget-close-btn-container"><div class="chat-popup-widget-close-btn"><span class="chat-popup-widget-close-icon-svg"><svg viewBox="0 0 64 64" width="8" xmlns="http://www.w3.org/2000/svg" height="8"><path fill="#fff" d="M28.941 31.786L.613 60.114a2.014 2.014 0 1 0 2.848 2.849l28.541-28.541 28.541 28.541c.394.394.909.59 1.424.59a2.014 2.014 0 0 0 1.424-3.439L35.064 31.786 63.41 3.438A2.014 2.014 0 1 0 60.562.589L32.003 29.15 3.441.59A2.015 2.015 0 0 0 .593 3.439l28.348 28.347z"></path></svg></span></div></div>' + '</div>';
        };
        
        if(isAnonymousChat) {
            var anonymousLauncherContainer = document.getElementById('km-anonymous-chat-launcher');
            anonymousLauncherContainer.insertAdjacentHTML('afterEnd', chatPopupTemplateMarkup);
        } else {
            return chatPopupTemplateMarkup;
        }
        
    }
}