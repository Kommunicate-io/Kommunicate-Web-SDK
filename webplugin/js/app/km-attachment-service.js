Kommunicate.attachmentService = {
    getFileMeta: function (file, tabId, callback) {
        let messagePxy = {
            groupId: tabId,
            contentType: 1,
            type: 5,
            message: ""
        }

        var reader = new FileReader();
        reader.onload = function (theFile) {
            return function (e) {
                var span = document.createElement('span');
                span.innerHTML = ['<img class="thumb" src="', e.target.result,
                    '" title="', escape(theFile.name), '"/>'].join('');
            }
        };
        reader.onloadend = function () {
            FILE_META = [];
            FILE_META.push({
                thumbnailUrl: reader.result,
                contentType: file.type,
                isUploaded: false,
                contentType: file.type,
                stopUpload:false,
                name: file.name
            });
            if (typeof callback == "function") {
                callback(FILE_META, messagePxy, file);
                return
            }
        }
        reader.readAsDataURL(file);
    },
    uploadAttachment: function (params, messagePxy, MCK_CUSTOM_UPLOAD_SETTINGS) {
        data = { params: params, messagePxy: messagePxy };
        $applozic.fn.applozic("uploadAttachemnt", data);

    }
}