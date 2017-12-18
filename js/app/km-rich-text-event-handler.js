
/**
 * Attach all event listeners.
 */
Kommunicate.attachEvents = function($applozic){
    $applozic("#mck-message-cell").on('click','.km-increment-guest-count',Kommunicate.richMsgEventHandler.incrementGuestCount);
    $applozic("#mck-message-cell").on('click','.km-decrement-guest-count',Kommunicate.richMsgEventHandler.decrementGuestCount);//
    $applozic("#mck-message-cell").on('click','.km-btn-add-more-rooms',Kommunicate.richMsgEventHandler.addMoreRoom);//
    $applozic("#mck-message-cell").on('click','.km-done-button',Kommunicate.richMsgEventHandler.processSelectedRoom);
    $applozic("#mck-message-cell").on('click','.km-card-message-footer-button',Kommunicate.richMsgEventHandler.processHotelBookClick);
    //slick.js
   // Kommunicate.richMsgEventHandler.initializeSlick($applozic);
}




/**
 * define your event listeners.
 */
Kommunicate.richMsgEventHandler ={
    initializeSlick:function($applozic){
        console.log("initializing slick");
        var cardMessageContainer = $applozic('.km-card-message-container');
        console.log("selected by class",cardMessageContainer);
        
               /* cardMessageContainer.slick({
                    dots: false,
                    infinite: false,
                    speed: 300,
                    slidesToShow: 1,
                    centerMode: false,
                    variableWidth: true,
                    prevArrow: false,
                    nextArrow: false
                });*/
    },
    decrementGuestCount: function(e) {
        var  target = e.target || e.srcElement;
        target.parentElement.getElementsByClassName('km-room-number-field')[0].stepDown();
    },
    incrementGuestCount: function (e) {
        var  target = e.target || e.srcElement;
        target.parentElement.getElementsByClassName('km-room-number-field')[0].stepUp();
    },
    decrementPersonCount: function () {
        document.getElementById('km-person-number-field').stepDown();
    },
    incrementPersonCount:  function () {
        document.getElementById('km-person-number-field').stepUp();
    },
    addMoreRoom : function(e){
        return;
        /*
        //uncomment this code toadd more rooms and update send  message call accordingly 

       var container = e.target.parentElement.parentElement.parentElement;
       var roomCount = Number(e.target.dataset.roomcount)+1;
       e.target.setAttribute("roomcount",roomCount);
       var roomInfoElem = document.createElement('div');
       roomInfoElem.innerHTML=Kommunicate.markup.getSingleRoomPaxInfo(roomCount);
       container.getElementsByClassName('km-room-person-selector-container')[0].appendChild(roomInfoElem);*/
          
    },
    processSelectedRoom:function(e){
        //TODO : handle multiple room select  
        var roomInfoContainer = e.target.parentElement.parentElement;
       var numOfguest=roomInfoContainer.getElementsByClassName('km-room-number-field')[0].value;
        //send message to group
        //[{"NoOfAdults":1,"NoOfChild":2,"ChildAge":[8,9]}]
        var messagePxy={
            'message' : "Room 1, Guest "+numOfguest , //message to send 
            'metadata':{
                isRoomGuestJSON:true,
                roomGuestJson:'[{"NoOfAdults":'+numOfguest+'}]',
                guestTypeId:"ADULTS"

            }
        };
       var $mck_msg_inner= $applozic("#mck-message-cell .mck-message-inner");
       var $mck_msg_to=  $applozic("#mck-msg-to");

        if ($mck_msg_inner.data("isgroup") === true) {
            messagePxy.groupId = $mck_msg_to.val();
            } else {
            messagePxy.to = $mck_msg_to.val();
            }
       $applozic.fn.applozic('sendGroupMessage',messagePxy);
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
       var $mck_msg_inner= $applozic("#mck-message-cell .mck-message-inner");
       var $mck_msg_to=  $applozic("#mck-msg-to");

        if ($mck_msg_inner.data("isgroup") === true) {
            messagePxy.groupId = $mck_msg_to.val();
            } else {
            messagePxy.to = $mck_msg_to.val();
            }
       $applozic.fn.applozic('sendGroupMessage',messagePxy);


    }

}
