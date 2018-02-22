
/**
 * Attach all event listeners.
 */

kommunicateDashboard.attachEvents = function($kmApplozic){
    $kmApplozic("#km-message-cell").on('click','.km-dashboard-increment-guest-count',kommunicateDashboard.richMsgEventHandler.incrementGuestCount);
    $kmApplozic("#km-message-cell").on('click','.km-dashboard-decrement-guest-count',kommunicateDashboard.richMsgEventHandler.decrementGuestCount);
    $kmApplozic("#km-message-cell").on('click','.km-dashboard-increment-children-count',kommunicateDashboard.richMsgEventHandler.incrementChildrenCount);
    $kmApplozic("#km-message-cell").on('click','.km-dashboard-decrement-children-count',kommunicateDashboard.richMsgEventHandler.decrementChildrenCount);
    $kmApplozic("#km-message-cell").on('click','.km-dashboard-btn-add-more-rooms',kommunicateDashboard.richMsgEventHandler.addMoreRoom);//
    $kmApplozic("#km-message-cell").on('click','.km-dashboard-done-button',kommunicateDashboard.richMsgEventHandler.processSelectedRoom);
    $kmApplozic("#km-message-cell").on('click','.km-dashboard-card-message-footer-button',kommunicateDashboard.richMsgEventHandler.processHotelBookClick);
    $kmApplozic("#km-message-cell").on('click','.km-dashboard-cta-button',kommunicateDashboard.richMsgEventHandler.handlleRichButtonClick);
    $kmApplozic("#km-message-cell").on('click','.km-dashboard-submit-person-detail',kommunicateDashboard.richMsgEventHandler.handlleSubmitPersonDetail);
    $kmApplozic("#km-message-cell").on('click', '.km-dashboard-block-room-button', kommunicateDashboard.richMsgEventHandler.processBookRoomClick);
    $kmApplozic("#km-message-cell").on('click', '.km-dashboard-quick-replies', kommunicateDashboard.richMsgEventHandler.processQuickReplies);
     

}




/**
 * define your event listeners.
 */
kommunicateDashboard.richMsgEventHandler ={
    initializeSlick:function($cardMessageContainer){
            if ($cardMessageContainer.length >= 0) {
                var slider = tns({
                    //container: $cardMessageContainer[0],
                    container: ".km-dashboard-card-message-container",
                    items: 1,
                    slideBy: 1,
                    "mouseDrag": true,
                    "arrowKeys": true,
                    onInit: function () {
                        console.log("tiny-slider initilized");
                        document.querySelector(".km-dashboard-msg-box-rich-text-container .tns-controls button:first-child").innerHTML = '<';
                        document.querySelector(".km-dashboard-msg-box-rich-text-container .tns-controls button:last-child").innerHTML = '>';

                    }
                });
                var slider = tns({
                    //container: $cardMessageContainer[0],
                    container: ".km-card-room-detail-container",
                    items: 1,
                    slideBy: 1,
                    "mouseDrag": true,
                    "arrowKeys": true,
                    onInit: function () {
                        console.log("tiny-slider initilized");
                        document.querySelector(".km-dashboard-msg-box-rich-text-container .tns-controls button:first-child").innerHTML = '<';
                        document.querySelector(".km-dashboard-msg-box-rich-text-container .tns-controls button:last-child").innerHTML = '>';

                    }
                });
        }
        
    },
    
    decrementGuestCount: function(e) {
        var  target = e.target || e.srcElement;
        target.parentElement.getElementsByClassName('km-room-number-field')[0].stepDown();
    },
    incrementGuestCount: function (e) {
        var  target = e.target || e.srcElement;
        target.parentElement.getElementsByClassName('km-room-number-field')[0].stepUp();
    },
    decrementChildrenCount: function(e) {
        var  target = e.target || e.srcElement;
        target.parentElement.getElementsByClassName('km-dashboard-person-number-field')[0].stepDown();
    },
    incrementChildrenCount: function (e) {
        var  target = e.target || e.srcElement;
        target.parentElement.getElementsByClassName('km-dashboard-person-number-field')[0].stepUp();
    },
    // decrementPersonCount: function () {
    //     document.getElementById('km-dashboard-person-number-field').stepDown();
    // },
    // incrementPersonCount:  function () {
    //     document.getElementById('km-dashboard-person-number-field').stepUp();
    // },
    addMoreRoom : function(e){
       var container = e.target.parentElement.parentElement.parentElement;
       var roomCount = Number(e.target.dataset.roomcount)+1;
       e.target.setAttribute("data-roomcount",roomCount);
       var roomInfoElem = document.createElement('div');
       roomInfoElem.innerHTML=Kommunicate.markup.getSingleRoomPaxInfo(roomCount);
       container.getElementsByClassName('km-room-person-selector-container')[0].appendChild(roomInfoElem);
    },
    processSelectedRoom:function(e){
        //TODO : handle multiple room select  
        // TODO: number of rooms should not greater than entered erlier.
       // var roomInfoContainer = e.target.parentElement.parentElement;
       // $(e.target).closest('mck-msg-box-rich-text-container').find('.km-room-person-selector-container input.km-room-number-field')
        var roomGuestJson =[];
       //var roomGuest= document.querySelectorAll(".km-room-person-selector-container input.km-room-number-field");
       var roomGuest = $(e.target).closest('.km-msg-box-rich-text-container').find('.km-room-person-selector-container input.km-room-number-field');
     
       // TODO: process number of child if required
        var message=""
       for(var i=0;i<roomGuest.length;i++){
        roomGuestJson.push({"NoOfAdults":roomGuest[i].value,"NoOfChild": 0,"ChildAge": []});
        message += "Room "+ (i+1) +" Guest "+roomGuest[i].value +"\n";
       }
        //send message to group
        //[{"NoOfAdults":1,"NoOfChild":2,"ChildAge":[8,9]}]
        var messagePxy={
            'message' : message , //message to send 
            'metadata':{
                isRoomGuestJSON:true,
                roomGuestJson:JSON.stringify(roomGuestJson),
                guestTypeId:"ADULTS"

            }
        };
       var $mck_msg_inner= $kmApplozic("#km-message-cell .km-message-inner");
       var $mck_msg_to=  $kmApplozic("#km-msg-to");

        if ($mck_msg_inner.data("isgroup") === true) {
            messagePxy.groupId = $mck_msg_to.val();
            } else {
            messagePxy.to = $mck_msg_to.val();
            }
       $kmApplozic.fn.applozic('sendGroupMessage',messagePxy);
    },
    processHotelBookClick: function(e){
        var  target = e.target || e.srcElement;
        var sessionId = target.dataset.sessionid;
        var resultIndex = target.dataset.resultindex;
        var hotelName = target.dataset.name;

        var messagePxy={
            'message' : "Book "+hotelName , //message to send 
            'metadata':{
                hotelSelected:true,
                sessionId:sessionId,
                resultIndex:resultIndex,
                skipBot:true
            }
        };

       var $mck_msg_inner= $kmApplozic("#km-message-cell .km-message-inner");

       var $mck_msg_to=  $kmApplozic("#km-msg-to");

        if ($mck_msg_inner.data("isgroup") === true) {
            messagePxy.groupId = $mck_msg_to.val();
            } else {
            messagePxy.to = $mck_msg_to.val();
            }

       $kmApplozic.fn.applozic ('sendGroupMessage',messagePxy);



    },
    handlleRichButtonClick:function(e){
        console.log("event generated: ",e);
        var  target = e.target || e.srcElement;
        var eventHandlerId = target.dataset.eventhandlerid;
        if(eventHandlerId=="km-eh-001"){
            //var buttonContainer = target.parentElement;
            var form  = target.parentElement.getElementsByClassName('km-btn-hidden-form')[0];
            // handling paymet gateway button callback
            form.submit();

        }


    },
    handlleSubmitPersonDetail: function (e) {
        var title = $(e.target).closest('.km-dashboard-guest-details-container').find(".km-dashboard-title-select option:selected").text();
        var age = $(e.target).closest('.km-dashboard-guest-details-container').find(".km-dashboard-guest-detail-form input.km-age-input");
        var fname = $(e.target).closest('.km-dashboard-guest-details-container').find(".km-dashboard-guest-detail-form input.first-name-input");
        var mname = $(e.target).closest('.km-dashboard-guest-details-container').find(".km-dashboard-guest-detail-form input.middle-name-input");
        var lname = $(e.target).closest('.km-dashboard-guest-details-container').find(".km-dashboard-guest-detail-form input.last-name-input");
        var email = $(e.target).closest('.km-dashboard-guest-details-container').find(".km-dashboard-guest-detail-form input.e-mail-input");
        var phone = $(e.target).closest('.km-dashboard-guest-details-container').find(".km-dashboard-guest-detail-form input.number-input");
        if(fname[0].value==""){
            $(e.target).closest('.km-dashboard-guest-details-container').find('input[type=text]').focus();
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
                        message: "Your detail submitted",
                        metadata: { 
                                sessionId: sessionId, 
                                guestDetail: true, 
                                skipBot: true, 
                                personInfo: JSON.stringify(personDetail) 
                                } 
                            };
        kommunicateDashboard.sendMessage(messagePxy);
        console.log("passenger detail submitted");
    },
    processQuickReplies : function(e){
       var message = e.target.title;
        var messagePxy = {
            'message': message, //message to send 
            'metadata': {}
        };

        kommunicateDashboard.sendMessage(messagePxy);

    },
    handlleHotelSlider:function(e){
        var slider = tns();
        slider.getInfo();
        
        document.querySelector('.next-button').onclick = function () {
          // get slider info
          var info = slider.getInfo(),
              indexPrev = info.indexCached;
              indexCurrent = info.index;
        
          // update style based on index
          info.slideItems[indexPrev].classList.remove('active');
          info.slideItems[indexCurrent].classList.add('active');
        };

    }

}
