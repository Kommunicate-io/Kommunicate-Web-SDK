
/**
 * Attach all event listeners.
 */
Kommunicate.attachEvents = function($kmApplozic){
    $kmApplozic("#km-message-cell").on('click','.km-increment-guest-count',Kommunicate.richMsgEventHandler.incrementGuestCount);
    $kmApplozic("#km-message-cell").on('click','.km-decrement-guest-count',Kommunicate.richMsgEventHandler.decrementGuestCount);//
    $kmApplozic("#km-message-cell").on('click','.km-btn-add-more-rooms',Kommunicate.richMsgEventHandler.addMoreRoom);//
    $kmApplozic("#km-message-cell").on('click','.km-done-button',Kommunicate.richMsgEventHandler.processSelectedRoom);
    $kmApplozic("#km-message-cell").on('click','.km-card-message-footer-button',Kommunicate.richMsgEventHandler.processHotelBookClick);
    $kmApplozic("#km-message-cell").on('click','.km-cta-button',Kommunicate.richMsgEventHandler.handlleRichButtonClick);
   // $kmApplozic("#km-message-cell").on('click','.km-cta-button',Kommunicate.richMsgEventHandler.initializeSlick);
   
}




/**
 * define your event listeners.
 */
Kommunicate.richMsgEventHandler ={
    initializeSlick:function($cardMessageContainer){
        if ($cardMessageContainer.length >= 0) {
            var slider = tns({
                container: '.km-div-slider',
                items: 10,
                slideBy: 'page',
                "mouseDrag": true,
                "arrowKeys": true
              });
        }

            /*$cardMessageContainer.slick({
                    dots: false,
                    infinite: false,
                    speed: 300,
                    slidesToShow: 1,
                    centerMode: false,
                    variableWidth: true,
                    prevArrow: false,
                    nextArrow: false
                }); */
    },
    changeSlider: function() {
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
