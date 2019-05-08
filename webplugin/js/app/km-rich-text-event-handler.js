
/**
 * Attach all event listeners.
 */
const mck_actionable_message_plugin_svgs = {
    arrow:{
        left:'<svg xmlns="http://www.w3.org/2000/svg" width="10" height="11" viewBox="0 0 10 19"><path fill="#5B5959" fill-rule="evenodd" d="M9.076 18.266c.21.2.544.2.753 0a.53.53 0 0 0 0-.753L1.524 9.208 9.829.903a.53.53 0 0 0 0-.752.546.546 0 0 0-.753 0L.026 9.208l9.05 9.058z"/></svg>'
    }
}
Kommunicate.attachEvents = function($applozic){
    $applozic("#mck-message-cell").on('click','.km-increment-guest-count',Kommunicate.richMsgEventHandler.incrementGuestCount);
    $applozic("#mck-message-cell").on('click','.km-decrement-guest-count',Kommunicate.richMsgEventHandler.decrementGuestCount);//
    $applozic("#mck-message-cell").on('click','.km-btn-add-more-rooms',Kommunicate.richMsgEventHandler.addMoreRoom);//
    $applozic("#mck-message-cell").on('click','.km-done-button',Kommunicate.richMsgEventHandler.processSelectedRoom);
    $applozic("#mck-message-cell").on('click','.km-card-message-footer-button',Kommunicate.richMsgEventHandler.processHotelBookClick);
    $applozic("#mck-message-cell").on('click','.km-cta-button',Kommunicate.richMsgEventHandler.handlleRichButtonClick);
    $applozic("#mck-message-cell").on('click','.km-submit-person-detail',Kommunicate.richMsgEventHandler.handlleSubmitPersonDetail);
    $applozic("#mck-message-cell").on('click', '.km-block-room-button', Kommunicate.richMsgEventHandler.processBookRoomClick);
    $applozic("#mck-message-cell").on('click', '.km-quick-replies', Kommunicate.richMsgEventHandler.processQuickReplies);
    $applozic("#mck-message-cell").on('click', '.km-list-item-handler', Kommunicate.richMsgEventHandler.processClickOnListItem); 
    $applozic("#mck-message-cell").on('click', '.km-list-button-item-handler', Kommunicate.richMsgEventHandler.processClickOnButtonItem); 
    $applozic("#mck-message-cell").on('click', '.km-faq-dialog-button', Kommunicate.richMsgEventHandler.processClickOnDialogButton); 
    $applozic("#mck-message-cell").on('click', ".km-progress-meter-container",Kommunicate.attachmentEventHandler.manageUploadAttachment);
    $applozic("#mck-message-cell").on('click', ".km-link-button",Kommunicate.richMsgEventHandler.handleLinkButtonClick); 
    
    
}




/**
 * define your event listeners.
 */
Kommunicate.attachmentEventHandler= {
    manageUploadAttachment: function (e) {
        var stopUploadIconHidden = $applozic(e.target).closest('.km-msg-box-attachment').find('.km-progress-stop-upload-icon').hasClass('n-vis');
        var uploadIconHidden= $applozic(e.target).closest('.km-msg-box-attachment').find('.km-progress-upload-icon').hasClass('n-vis');
        var attachmentDiv= $applozic(e.target).closest('.km-msg-box-attachment').children();
        let msgkey = attachmentDiv[0].dataset.msgkey;
        var deliveryStatusDiv= $applozic(e.target).closest('.mck-clear').find('.mck-msg-right-muted');      
        if(Kommunicate.internetStatus) {
            if(!stopUploadIconHidden && uploadIconHidden) {
                KommunicateUI.updateAttachmentStopUploadStatus(msgkey, true);
                Kommunicate.attachmentEventHandler.progressMeter(100, msgkey);
                $applozic(".km-progress-stop-upload-icon-"+msgkey).removeClass("vis").addClass("n-vis");
                $applozic(".km-progress-upload-icon-"+msgkey).removeClass("n-vis").addClass("vis");
                Kommunicate.attachmentEventHandler.progressMeter(100, msgkey);
                $applozic(".mck-timestamp-"+msgkey).removeClass("n-vis").addClass("vis"); 
                deliveryStatusDiv[0].querySelector(".mck-sending-failed").style.display = "block";
          
            } else {
                KommunicateUI.updateAttachmentStopUploadStatus(msgkey, false);
                let fileMetaKey = attachmentDiv[0].dataset.filemetakey;
                let fileName = attachmentDiv[0].dataset.filename;
                let fileSize = attachmentDiv[0].dataset.filesize;
                let fileUrl = attachmentDiv[0].dataset.fileurl;
                let fileType = attachmentDiv[0].dataset.filetype
                let groupId = attachmentDiv[0].dataset.groupid;
                let thumbnailUrl = attachmentDiv[0].dataset.thumbnailurl;
                if(fileSize && fileUrl && fileMetaKey  && fileName&& fileType ) { 
                    messagePxy = {
                        contentType: 1,
                        groupId:groupId,
                        fileMeta:{
                            blobKey:fileMetaKey, 
                            url:fileUrl,
                            contentType:fileType,
                            size:fileSize,
                            key:fileMetaKey,
                            thumbnailUrl:fileUrl,
                            name:fileName
                        },
                        message:"",
                        type:5,
                        metadata:{},
                        key:msgkey
                    }
                    var optns = {
                        tabId: groupId,
                    };
                    let params = {
                        messagePxy: messagePxy,
                        optns: optns
                    };
                    $applozic.fn.applozic("submitMessage",params);
                    $applozic(e.target).closest('.km-msg-box-progressMeter').children().removeClass('km-progress-meter-back-drop');
                    $applozic(e.target).closest('.km-msg-box-progressMeter').addClass("n-vis");
                    $applozic(".mck-timestamp-"+msgkey).removeClass("n-vis").addClass("vis");
                    deliveryStatusDiv[0].querySelector(".mck-sending-failed").style.display = "none";              
                } 
                else if (thumbnailUrl  && groupId  && msgkey ) {
                    messagePxy = {
                        contentType: 1,
                        groupId:groupId,
                        key:msgkey,
                        fileMeta:{
                            thumbnailUrl:thumbnailUrl,
                            contentType:1,
                            isUploaded:false
                        },
                        message:"",
                        type:5,
                        metadata:{}
                    }
                    let file = KM_PENDING_ATTACHMENT_FILE[msgkey];
                    params = {
                        params: {
                            file: file,
                            name: file.name
                        },
                        messagePxy: messagePxy
                    };
                    $applozic.fn.applozic("uploadAttachemnt", params);
                    $applozic(".mck-timestamp-"+msgkey).removeClass("n-vis").addClass("vis");
                    deliveryStatusDiv[0].querySelector(".mck-sending-failed").style.display = "none"; 
                    delete KM_PENDING_ATTACHMENT_FILE[msgkey];
                    $applozic(e.target).closest('.km-msg-box-progressMeter').children().removeClass('km-progress-meter-back-drop')
                }
            }

        } else {
            KommunicateUI.displayUploadIconForAttachment(msgkey, false);
            KommunicateUI.updateAttachmentStopUploadStatus(msgkey, true);
        }
            
    },
    progressMeter : function (value, key) {
        var control = document.getElementById('km-progress-meter-input');
        let selector = ".progress-meter-"+key+ " .km-progress-value";
        let stopUpload = KommunicateUI.getAttachmentStopUploadStatus(key);
        if(stopUpload) {
            value = 100;
        }
        var progressValue = document.querySelector(selector);
        if(progressValue) {
        progressValue.style.strokeDasharray = KM_PROGRESS_METER_CIRCUMFERENCE;
        var progress = value / 100;
        var dashoffset = KM_PROGRESS_METER_CIRCUMFERENCE * (1 - progress);
        progressValue.style.strokeDashoffset = dashoffset;
        // value == 100 && !stopUpload && KommunicateUI.deleteProgressMeter(key);
        }      
     }
}

Kommunicate.richMsgEventHandler = {
    initializeSlick: function ($cardMessageContainer) {
        if ($cardMessageContainer.length > 0) {
            var slider = tns({
                container: $cardMessageContainer[0],
                "edgePadding": 60,
                items: 1,
                slideBy: 'page',
                loop: false,
                controlsText:[mck_actionable_message_plugin_svgs.arrow.left, mck_actionable_message_plugin_svgs.arrow.left],
                "mouseDrag": true,
                "arrowKeys": true,
                onInit : function(){
                    console.log("tiny-slider initilized");
                }
              });
        }

    },
    decrementGuestCount: function (e) {
        var target = e.target || e.srcElement;
        var type = target.dataset.type;
        if (type == 'guest') {
            target.parentElement.getElementsByClassName('km-room-number-field')[0].stepDown();
        } else if (type == 'children') {
            target.parentElement.getElementsByClassName('km-person-number-field')[0].stepDown();
        }
    },

    incrementGuestCount: function (e) {
        var target = e.target || e.srcElement;
        var type = target.dataset.type;
        if (type == 'guest') {
            target.parentElement.getElementsByClassName('km-room-number-field')[0].stepUp();
        } else if (type == 'children') {
            target.parentElement.getElementsByClassName('km-person-number-field')[0].stepUp();
        }
    },

    decrementPersonCount: function () {
        document.getElementById('km-person-number-field').stepDown();
    },
    incrementPersonCount: function () {
        document.getElementById('km-person-number-field').stepUp();
    },
    addMoreRoom: function (e) {
        var container = e.target.parentElement.parentElement.parentElement;
        var roomCount = Number(e.target.dataset.roomcount) + 1;
        e.target.setAttribute("data-roomcount", roomCount);
        var roomInfoElem = document.createElement('div');
        roomInfoElem.innerHTML = Kommunicate.markup.getSingleRoomPaxInfo(roomCount);
        container.getElementsByClassName('km-room-person-selector-container')[0].appendChild(roomInfoElem);
    },
    processSelectedRoom: function (e) {
        //TODO : handle multiple room select  
        var roomGuestJson = [];
        var roomGuest = $(e.target).closest('.mck-msg-box-rich-text-container').find('.km-room-person-selector-container input.km-room-number-field');
        var NoOfChild = $(e.target).closest('.mck-msg-box-rich-text-container').find('.km-room-person-selector-container input.km-person-number-field');
        // TODO: process number of child if required

        var message = ""
        for (var i = 0; i < roomGuest.length; i++) {
            let noOfChild = NoOfChild[i].value;
            let arr = Array(noOfChild * 1).fill(10)
            roomGuestJson.push({ "NoOfAdults": roomGuest[i].value, "NoOfChild": noOfChild, "ChildAge": arr });
            message += "Room " + (i + 1) + " Guest " + roomGuest[i].value + "\n";
        }
        //send message to group
        //[{"NoOfAdults":1,"NoOfChild":2,"ChildAge":[8,9]}]
        var messagePxy = {
            'message': message, //message to send 
            'metadata': {
                isRoomGuestJSON: true,
                roomGuestJson: JSON.stringify(roomGuestJson),
                guestTypeId: "ADULTS"

            }
        };

        Kommunicate.sendMessage(messagePxy);
    },
    processHotelBookClick: function (e) {
        var target = e.target || e.srcElement;
        var sessionId = target.dataset.sessionid;
        var resultIndex = target.dataset.resultindex;
        var hotelName = target.dataset.name;

        var messagePxy = {
            'message': "Get room detail of " +hotelName.replace('_', ' ') , //message to send 
            'metadata': {
                hotelSelected: true,
                sessionId: sessionId,
                resultIndex: resultIndex,
                skipDialogflow: true
            }
        };

        Kommunicate.sendMessage(messagePxy);
    },

    processBookRoomClick: function (e) {
        var target = e.target || e.srcElement;
        var sessionId = target.dataset.sessionid;
        var RoomIndex = target.dataset.roomindex;
        var NoOfRooms = target.dataset.noofrooms;
        var HotelName = target.dataset.hotelname=="undefined" ? "" : target.dataset.hotelname;
        var HotelResultIndex =target.dataset.hotelresultindex;
        var messagePxy = {
            'message': "Book " + HotelName.replace('_', ' '),
            'metadata': {
                sessionId: sessionId,
                RoomIndex: RoomIndex,
                NoOfRooms: NoOfRooms,
                blockHotelRoom: true,
                skipDialogflow: true,
                HotelResultIndex:HotelResultIndex
            }
        };
        var $mck_msg_inner = $applozic("#mck-message-cell .mck-message-inner");
        var $mck_msg_to = $applozic("#mck-msg-to");

        if ($mck_msg_inner.data("isgroup") === true) {
            messagePxy.groupId = $mck_msg_to.val();
        } else {
            messagePxy.to = $mck_msg_to.val();
        }
        //console.log('messagePxy........# ', messagePxy)
        $applozic.fn.applozic('sendGroupMessage',messagePxy);
    },


    handlleRichButtonClick: function (e) {
        //console.log("event generated: ", e);

        var target = e.target || e.srcElement;
        var requestType = target.dataset.requesttype;
        var replyText = target.title || target.innerHTML;
        var buttonType = target.dataset.buttontype;
        var data = {};
        var form =target.parentElement.getElementsByClassName('km-btn-hidden-form')[0];
       if(buttonType !="submit"){   
        return ;
       }
        if (requestType == "json") {
           var  inputs = form.getElementsByTagName('input');
           for(var i = 0; i<inputs.length;i++){
            data[inputs[i].name] = inputs[i].value; 
           }  
           window.Applozic.ALApiService.ajax({
            url: form.action,
            async: false,
            type: "post",
            data:JSON.stringify(data),
            contentType:"application/json",
            success: function (data) { 
            },
            error: function (xhr,desc, err) {
               console.log("error while sending data ",err); 
            }
        })    
        } else {
            form.submit();
        }
        if(replyText){
            var messagePxy = {
                'message': replyText, //message to send 
            };
    
            Kommunicate.sendMessage(messagePxy);
        }

    },
   
    handlleSubmitPersonDetail: function (e) {
        var title = $applozic(e.target).closest('.km-guest-details-container').find(".km-title-select option:selected").text();
        var age = $applozic(e.target).closest('.km-guest-details-container').find(".km-guest-detail-form input.km-age-input");
        var fname = $applozic(e.target).closest('.km-guest-details-container').find(".km-guest-detail-form input.first-name-input");
        var mname = $applozic(e.target).closest('.km-guest-details-container').find(".km-guest-detail-form input.middle-name-input");
        var lname = $applozic(e.target).closest('.km-guest-details-container').find(".km-guest-detail-form input.last-name-input");
        var email = $applozic(e.target).closest('.km-guest-details-container').find(".km-guest-detail-form input.e-mail-input");
        var phone = $applozic(e.target).closest('.km-guest-details-container').find(".km-guest-detail-form input.number-input");

        if (fname[0].value == "" || lname[0].value == "" || email[0].value == "" || phone[0].value == ""){
            $applozic(e.target).closest('.km-guest-details-container').find(".km-mandatory-field-error").removeClass('n-vis').addClass('vis');
            return;
        }
        var personDetail = {
            Title: title === 'title' ? "" : title,
            Age: age[0].value,
            FirstName: fname[0].value,
            MiddleName: mname[0].value,
            LastName: lname[0].value,
            EmailId: email[0].value,
            PhoneNo: phone[0].value
        }
        var target = e.target || e.srcElement;
        var sessionId = target.dataset.sessionid;
        var messagePxy = {
            message: personDetail.Title+' '+personDetail.FirstName+' '+personDetail.LastName+'\n'
            +personDetail.EmailId+'\n'
            +personDetail.PhoneNo,
            metadata: {
                sessionId: sessionId,
                guestDetail: true,
                skipDialogflow: true,
                personInfo: JSON.stringify(personDetail)
            }
        };
        Kommunicate.sendMessage(messagePxy);
        console.log("passenger detail submitted");
    },
    processQuickReplies : function(e){
       var message = e.target.title;
       var metadata = {};
        try{
            metadata=  JSON.parse(e.target.dataset.metadata);
        }catch(e){
        }
        var messagePxy = {
            'message': message, //message to send 
            'metadata': metadata
        };

        Kommunicate.sendMessage(messagePxy);

    },
    processClickOnListItem: function(e){
        var target = e.currentTarget;
        var reply = target.dataset.reply;
        var type = target.dataset.type;
        var articleId = target.dataset.articleid;
        var source = target.dataset.source;
        var metadata = {};
        try{
            metadata=  JSON.parse(target.dataset.metadata);
        }catch(e){
        }
        metadata.KM_FAQ_ID =articleId;
        metadata.source= source;
        if(type && type =="quick_reply"){
            var messagePxy = {
                'message': reply, //message to send 
                'metadata': metadata
            };
    
            Kommunicate.sendMessage(messagePxy);
        }else if(type && type =='submit'){
            //TODO : support for post request with data.
        }

    },
    processClickOnButtonItem: function(e){
        e.preventDefault();
        var target = e.currentTarget;
        var reply = target.dataset.reply;
        var type = target.dataset.type;
        var metadata = {};
        try{
            metadata=  JSON.parse(target.dataset.metadata);
        }catch(e){
            console.log(e);
        }
        metadata.KM_BUTTON_CLICKED =true;
        if(type && type =="quick_reply"){
            var messagePxy = {
                'message': reply, //message to send 
                'metadata': metadata
            };
    
            Kommunicate.sendMessage(messagePxy);
        }else if(type && type =='submit'){
            //TODO : support for post request with data.
        }

    },
    processClickOnDialogButton:function(e){
        var target = e.currentTarget;
        var reply = target.dataset.reply;
        var metadata = {};
        try{
            metadata=  JSON.parse(target.dataset.metadata);
        }catch(e){
        }
        
        // default value for  metadata.skipBot is true for backward compatibility
        metadata.skipBot = typeof metadata.skipBot != 'undefined'?metadata.skipBot:true;
        var messagePxy = {
            'message': reply, //message to send 
            'metadata': metadata
        };

        Kommunicate.sendMessage(messagePxy);
    },
    handleLinkButtonClick: function(e) {
        var url  = decodeURI(e.target.dataset.url);
        window.open(url, e.target.dataset.target);
    }


}
