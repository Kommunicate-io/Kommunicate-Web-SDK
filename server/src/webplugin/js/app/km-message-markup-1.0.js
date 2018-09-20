Kommunicate.messageTemplate = {
    getAttachmentTemplate: function () {
         return `<div class="mck-file-text mck-attachment {{attachmentClass}} notranslate mck-attachment-{{key}}" data-groupId="{{groupId}}" data-filemetakey="{{fileMetaKey}}" data-stopupload="{{fileMeta.stopUpload}}" data-filename="{{fileMeta.name}}" data-thumbnailUrl="{{fileMeta.thumbnailUrl}}"  data-filetype="{{fileMeta.contentType}}" data-fileurl="{{fileUrl}" data-filesize="{{fileMeta.size}}+" data-msgkey ="{{key}}"><div>{{{fileExpr}}}</div><div class="{{attachmentDownloadClass}}">{{{downloadMediaUrlExpr}}}</div></div>`;
        
    },
    getProgressMeter:function(key) {
        return '<div class="km-progress-meter-container km-progress-meter-back-drop progress-meter-{{key}}"><svg class="km-progress-svg" xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 107 105"><g class="km-progress-icons"><circle class="km-progress-meter" cx="54" cy="54" r="45" stroke-width="10" /><circle class="km-progress-value" cx="54" cy="54" r="45" stroke-width="5" /><path class="km-progress-stop-upload-icon vis" d="M52.469 47.875L33.328 28.737a3.24845 3.24845 0 1 0-4.594 4.594l19.141 19.138a2.165 2.165 0 0 1 0 3.061L28.737 74.671a3.24845 3.24845 0 1 0 4.594 4.594l19.138-19.141a2.165 2.165 0 0 1 3.061 0l19.141 19.139a3.24845 3.24845 0 0 0 4.594-4.594L60.124 55.53a2.165 2.165 0 0 1 0-3.061l19.139-19.141a3.2488 3.2488 0 0 0-4.595-4.594L55.533 47.878a2.165 2.165 0 0 1-3.061 0z"  fill="#FFF" data-name="Path 1"/><path class="km-progress-upload-icon n-vis" d="M52.246 21.547L30.00689 43.78339a3.2 3.2 0 0 0-.03927 4.4858l.03047.03155a3.2 3.2 0 0 0 4.56449.03994L51.286 31.619v53.712a3.2 3.2 0 0 0 3.2 3.2 3.2 3.2 0 0 0 3.2-3.2V31.619l16.72045 16.72131a3.2 3.2 0 0 0 4.56467-.03976l.03029-.03136a3.2 3.2 0 0 0-.03927-4.4858L56.723 21.547l-.06168-.05724a3.2 3.2 0 0 0-4.3542.00048z" fill="#FFF"/></g></svg><input id="km-progress-meter-input" class="n-vis" type="range" value="60" /></div>';
    },
    getAttachmentContanier:function(data, fileExpr) {
        var alFileService = new AlFileService();
        let fileUrl = alFileService.getFileurl(data);
        data.downloadMediaUrlExpr = alFileService.getFileAttachment(data)
        data.fileExpr = fileExpr;
        data.fileUrl = fileUrl;
        data.attachmentClass = (data.fileMeta.contentType.includes("image/") || data.fileMeta.contentType.includes("audio/") || data.fileMeta.contentType.includes("video/")) ? "" : "mck-msg-box" ;
        data.attachmentDownloadClass = data.fileMeta.contentType.includes("image/") ? "n-vis" : "vis"
        return Mustache.to_html(Kommunicate.messageTemplate.getAttachmentTemplate(), data);
    },
    getProgressMeterContanier:function(key) {
        let data = {key: key};
        return Mustache.to_html(Kommunicate.messageTemplate.getProgressMeter(), data);
    }
}