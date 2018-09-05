Kommunicate.messageTemplate = {
    getAttachmentTemplate: function (msg, fileExpr) {
        var alFileService = new AlFileService();
        if(msg && typeof msg.fileMeta === "object") {
         return '<div class="mck-file-text notranslate mck-attachment" data-filemetakey="'+msg.fileMetaKey+'" data-filename="'+msg.fileMeta.name+'" data-fileurl="'+alFileService.getFileurl(msg)+'" data-filesize="'+ msg.fileMeta.size+'">'+
            '<div>'+fileExpr+'</div>'+
         '</div>'
        }
        
    }
}