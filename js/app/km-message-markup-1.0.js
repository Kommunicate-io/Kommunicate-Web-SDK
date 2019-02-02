Kommunicate.messageTemplate = {
    getAttachmentTemplate: function () {
         return `<div class="mck-file-text mck-attachment {{attachmentClass}} notranslate mck-attachment-{{key}}" data-groupId="{{groupId}}" data-filemetakey="{{fileMetaKey}}" data-stopupload="{{fileMeta.stopUpload}}" data-filename="{{fileMeta.name}}" data-thumbnailUrl="{{fileMeta.thumbnailUrl}}"  data-filetype="{{fileMeta.contentType}}" data-fileurl="{{fileUrl}" data-filesize="{{fileMeta.size}}+" data-msgkey ="{{key}}"><div>{{{fileExpr}}}</div><div class="{{attachmentDownloadClass}}">{{{downloadMediaUrlExpr}}}</div></div>`;
        
    },
    getProgressMeter:function(key) {
        return '<div class="km-progress-meter-container km-progress-meter-back-drop progress-meter-{{key}}"><svg class="km-progress-svg" xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 107 105"><g class="km-progress-icons"><circle class="km-progress-meter" cx="54" cy="54" r="45" stroke-width="10" /><circle class="km-progress-value" cx="54" cy="54" r="45" stroke-width="5" /><path class="km-progress-stop-upload-icon km-progress-stop-upload-icon-{{key}} vis" d="M51.5,47.9L32.3,28.7c-1.3-1.3-2.3-1.3-3.6,0c-1.3,1.3-0.3,3.3,1,4.6c0,0,0,0,0,0l19.1,19.1   c0.8,0.8,0.8,2.2,0,3.1L29.7,74.7c-1.3,1.3-2.4,3.4-1,4.6c1.8,1.5,2.7,0.6,3.6,0c0,0,1-1,1-1l19.1-19.1c0.8-0.8,2.6-1,3.4-0.1   l19.8,20.3c1.3,1.3,2.3,1.3,3.6,0c1.3-1.3,0.3-3.3-1-4.6L59.1,55.5c-0.8-0.8-0.8-2.2,0-3.1l19.1-19.1c1.3-1.3,2.3-3.3,1-4.6   c-1.3-1.3-3.3-0.3-4.6,1L56.4,48C55.5,48.9,52.3,48.7,51.5,47.9L51.5,47.9z" fill="#FFF" data-name="Path 1"/><path class="km-progress-upload-icon km-progress-upload-icon-{{key}} n-vis" d="M52.246 21.547L30.00689 43.78339a3.2 3.2 0 0 0-.03927 4.4858l.03047.03155a3.2 3.2 0 0 0 4.56449.03994L51.286 31.619v53.712a3.2 3.2 0 0 0 3.2 3.2 3.2 3.2 0 0 0 3.2-3.2V31.619l16.72045 16.72131a3.2 3.2 0 0 0 4.56467-.03976l.03029-.03136a3.2 3.2 0 0 0-.03927-4.4858L56.723 21.547l-.06168-.05724a3.2 3.2 0 0 0-4.3542.00048z" fill="#FFF"/></g></svg></div>';
    },
    getAttachmentContanier:function(data, fileExpr, mediaUrlExpr, fileUrl) {
        data.downloadMediaUrlExpr = mediaUrlExpr
        data.fileExpr = fileExpr;
        data.fileUrl = fileUrl;
        if (typeof data.fileMeta === 'object') {
            data.attachmentClass = (data.fileMeta.contentType.indexOf("image/") != 1 || data.fileMeta.contentType.indexOf("audio/") != -1 || data.fileMeta.contentType.indexOf("video/") != 1) ? "" : "mck-msg-box";
            data.attachmentDownloadClass = data.fileMeta.contentType.indexOf("image/") != -1 ? "n-vis" : "vis";
        }
        return Mustache.to_html(Kommunicate.messageTemplate.getAttachmentTemplate(), data);
    },
    getProgressMeterContanier:function(key) {
        let data = {key: key};
        return Mustache.to_html(Kommunicate.messageTemplate.getProgressMeter(), data);
    }
}