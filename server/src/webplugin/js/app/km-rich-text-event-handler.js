
/**
 * Attach all event listeners.
 */

Kommunicate.attachEvents = function($applozic){
    $applozic("#mck-message-cell").on('click','.km-increment-guest-count',Kommunicate.richMsgEventHandler.incrementGuestCount);
    $applozic("#mck-message-cell").on('click','.km-decrement-guest-count',Kommunicate.richMsgEventHandler.decrementGuestCount);//
    $applozic("#mck-message-cell").on('click','.km-btn-add-more-rooms',Kommunicate.richMsgEventHandler.addMoreRoom);//
    $applozic("#mck-message-cell").on('click','.km-done-button',Kommunicate.richMsgEventHandler.processSelectedRoom);
    $applozic("#mck-message-cell").on('click','.km-card-message-footer-button',Kommunicate.richMsgEventHandler.processHotelBookClick);
    $applozic("#mck-message-cell").on('click','.km-cta-button',Kommunicate.richMsgEventHandler.handlleRichButtonClick);
    $applozic("#mck-message-cell").on('click','.km-submit-person-detail',Kommunicate.richMsgEventHandler.handlleSubmitPersonDetail);
    $applozic("#mck-message-cell").on('click', '.km-block-room-button', Kommunicate.richMsgEventHandler.processBookRoomClick);
  
}




/**
 * define your event listeners.
 */
Kommunicate.richMsgEventHandler = {
    initializeSlick: function ($cardMessageContainer) {
        if ($cardMessageContainer.length > 0) {
            var slider = tns({
                container: $cardMessageContainer[0],
                items: 2,
                slideBy: 'page',
                "mouseDrag": true,
                "arrowKeys": true,
                onInit : function(){
                    console.log("tiny-slider initilized");
                   document.querySelector(".km-slick-container .tns-controls button:first-child").innerHTML='<';
                   document.querySelector(".km-slick-container .tns-controls button:last-child").innerHTML='>';

                }
              });
        }

    },
    decrementGuestCount: function (e) {
        var target = e.target || e.srcElement;
        target.parentElement.getElementsByClassName('km-room-number-field')[0].stepDown();
    },
    incrementGuestCount: function (e) {
        var target = e.target || e.srcElement;
        target.parentElement.getElementsByClassName('km-room-number-field')[0].stepUp();
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
        // TODO: number of rooms should not greater than entered erlier.
        // var roomInfoContainer = e.target.parentElement.parentElement;
        // $(e.target).closest('mck-msg-box-rich-text-container').find('.km-room-person-selector-container input.km-room-number-field')
        var roomGuestJson = [];
        //var roomGuest= document.querySelectorAll(".km-room-person-selector-container input.km-room-number-field");
        var roomGuest = $(e.target).closest('.mck-msg-box-rich-text-container').find('.km-room-person-selector-container input.km-room-number-field');

        // TODO: process number of child if required
        var message = ""
        for (var i = 0; i < roomGuest.length; i++) {
            roomGuestJson.push({ "NoOfAdults": roomGuest[i].value, "NoOfChild": 0, "ChildAge": [] });
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
            'message': "Get room detail of " +hotelName , //message to send 
            'metadata': {
                hotelSelected: true,
                sessionId: sessionId,
                resultIndex: resultIndex,
                skipBot: true
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
            'message': "Book " + HotelName,
            'metadata': {
                sessionId: sessionId,
                RoomIndex: RoomIndex,
                NoOfRooms: NoOfRooms,
                blockHotelRoom: true,
                skipBot: true,
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
        console.log("event generated: ", e);
        var target = e.target || e.srcElement;
        var eventHandlerId = target.dataset.eventhandlerid;
        if (eventHandlerId == "km-eh-001") {
            //var buttonContainer = target.parentElement;
            var form = target.parentElement.getElementsByClassName('km-btn-hidden-form')[0];
            // handling paymet gateway button callback
            form.submit();

        }

    },
   
    handlleSubmitPersonDetail: function (e) {
        var title = $(e.target).closest('.km-guest-details-container').find(".km-title-select option:selected").text();
        var age = $(e.target).closest('.km-guest-details-container').find(".km-guest-detail-form input.km-age-input");
        var fname = $(e.target).closest('.km-guest-details-container').find(".km-guest-detail-form input.first-name-input");
        var mname = $(e.target).closest('.km-guest-details-container').find(".km-guest-detail-form input.middle-name-input");
        var lname = $(e.target).closest('.km-guest-details-container').find(".km-guest-detail-form input.last-name-input");
        var email = $(e.target).closest('.km-guest-details-container').find(".km-guest-detail-form input.e-mail-input");
        var phone = $(e.target).closest('.km-guest-details-container').find(".km-guest-detail-form input.number-input").val();
        if(fname[0].value==""){
            $(e.target).closest('.km-guest-details-container').find('input[type=text]').focus();
            return;
        }
        var personDetail = {
            Title: title === 'title' ? "" : title,
            Age: age[0].value,
            FirstName: fname[0].value,
            MiddleName: mname[0].value,
            LastName: lname[0].value,
            EmailId: email[0].value,
            PhoneNo: phone
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
        Kommunicate.sendMessage(messagePxy);
        console.log("passenger detail submitted");
    }

}
