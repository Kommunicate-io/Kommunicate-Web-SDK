var KM_ZENDESK_ATTACHMENTS=[];
KmZendesk={
    updateZendeskTicket: function (ticketId) {
        if(KM_ZENDESK_ATTACHMENTS.length==0){
            return;
        }
        let userSession = JSON.parse(localStorage.getItem('KM_USER_SESSION'));
        let url = kommunicateDashboard.getBaseUrl() + "/zendesk/" + userSession.application.applicationId + "/ticket/" + ticketId + "/update"
        var ticket = {
            "ticket": {
                "comment": { "body": "attachments.", "uploads": KM_ZENDESK_ATTACHMENTS }
            }
        }
        kmUtils.ajax({
            type: "PUT",
            url: url,
            data: ticket,
            success: function (result) {
                console.log("response: ", result);
                KM_ZENDESK_ATTACHMENTS = []
            },
            error: function () {
                KM_ZENDESK_ATTACHMENTS = []
            }
        });
    },

    uplaodFileToZendesk:function (file) {
        let userSession = JSON.parse(localStorage.getItem('KM_USER_SESSION'));
        var data = new FormData();
        if (typeof file === 'undefined') {
            return;
        } else {
            var xhr = new XMLHttpRequest();
            xhr.addEventListener('load', function (e) {
                var response = JSON.parse(this.response);
                if (response) {
                    KM_ZENDESK_ATTACHMENTS.push(response.data);
                }
                return false;
            });
            let ZENDESK_URL= kommunicateDashboard.getBaseUrl()+"/zendesk/attachment/upload/"+userSession.application.applicationId 
            data.append("file", file);
            xhr.open('post', ZENDESK_URL, true);
            xhr.send(data);
        }
    }
}