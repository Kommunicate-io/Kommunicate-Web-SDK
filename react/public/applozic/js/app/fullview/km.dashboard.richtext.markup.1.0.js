
//Kommunicate = $applozic.extends(true,Kommunicate||{})
kommunicateDashboard.markup = {
    getSingleRoomPaxInfo: function(roomCount){
         roomCount= roomCount||"1";
     return `<div class = "km-single-pax-info">
    <div class="km-room-title-text">ROOM `+roomCount+`</div>
    <div class="km-dashboard-room-selector">
        <div style="margin-right:15px;">Guest:</div>
        <div id= "">
            <input class ="km-dashboard-decrement-guest-count" type="button" value="-">
            <input type="number" min="1" max="5" value="1" class="km-dashboard-room-number-field" maxlength="1" disabled>
            <input class ="km-dashboard-increment-guest-count" type="button" value="+">
        </div>
    </div>
    <div class="km-dashboard-person-selector n-vis">
        <div>Children: <span style="font-size:12px; color: rgba(0,0,0,0.5); display: block;">(1-12 yrs)</span> </div>
        <div style="margin-bottom:30px">
            <input type="button" value="-" class ="km-dashboard-decrement-children-count" >
            <input type="number" min="0" max="6" value="0" id="km-dashboard-person-number-field" class="km-dashboard-person-number-field" maxlength="1" disabled>
            <input type="button" value="+" class ="km-dashboard-increment-children-count" >
        </div> 
    </div>
</div>`
},
getHotelCardTemplate : function(options,sessionId){
   var star={
    star1:"km-dashboard-star-empty",
    star2:"km-dashboard-star-empty",
    star3:"km-dashboard-star-empty",
    star4:"km-dashboard-star-empty",
    star5:"km-dashboard-star-empty"

    };
    if(options.StarRating){
        //populate the star rating
        for(var i = 0;i<options.StarRating;i++){
            star["star"+(i+1)]="km-dashboard-star-filled";
        }
   
    }    
    //Note: Setting price as 8%, modify it to change price calculation logic.
    var price = options.Price.CurrencyCode + " " + (options.Price.OfferedPrice/100)*108;
    return `
    <div class="km-dashboard-single-card-message">
        <div class="km-dashboard-card-message-header">
            <div class="km-dashboard-card-message-image-continer"><img class ="km-dashboard-card-message-img" src =`+ options.HotelPicture+` />
                    <div class="km-dashboard-card-message-image-price-container">`+ price +`</div>
            </div>
        </div>
        <div class="km-dashboard-card-message-body">
            <h1 class="km-dashboard-card-message-body-title">`+ options.HotelName+`</h1>
            <div class="km-dashboard-card-message-body-ratings">
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg"  height="24" viewBox="0 0 24 24" width="24" class="`+star.star1+`">
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                </span>
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg"  height="24" viewBox="0 0 24 24" width="24" class="`+ star.star2+`">
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                </span>
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg"  height="24" viewBox="0 0 24 24" width="24" class="`+ star.star3+`">
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                </span>
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg"  height="24" viewBox="0 0 24 24" width="24" class="`+ star.star4+`">
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                </span>
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg"  height="24" viewBox="0 0 24 24" width="24" class="`+ star.star5+`">
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                </span>
            </div>
            <div class="km-dashboard-card-message-body-address">
                <span class="km-dashboard-card-message-body-address-icon">
                    <svg xmlns="http://www.w3.org/2000/svg"  height="24" viewBox="0 0 24 24" width="24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        <path d="M0 0h24v24H0z" fill="none"/>
                    </svg>
                </span>`+ options.HotelAddress +`
            </div>
        </div>
        <div class="km-dashboard-card-message-footer">
            <button class="km-dashboard-card-message-footer-button" data-resultindex= `+options.ResultIndex +` data-sessionid= `+ sessionId+` data-name=`+ options.HotelName+`>ROOM DETAIL</button>
        </div>
    </div>`;

},

getRoomDetailTemplate: function (options, sessionId) {
    let guest=options.NoOfGuest=="undefined"?1:options.NoOfGuest
    let dayRates = (options.DayRates.Amount)?options.DayRates.Amount:options.Price.RoomPrice

    return `<div class="km-dashboard-single-card-message">
                <div class="message received km-dashboard-blocked-room">
                    <div class="km-dashboard-blocked-room-details">
                    <div class="km-dashboard-card-message-image-continer"><img class ="km-dashboard-card-message-img" src=`+ options.HotelPicture +` alt=`+options.HotelName+`></div>
                        <div class="km-dashboard-blocked-room-text-container">
                            <div class="km-dashboard-blocked-room-room-type">
                                <span>ROOM TYPE: </span> <span> `+ options.RoomTypeName + `</span>
                            </div>
                            <div class="km-dashboard-blocked-room-guests">
                                <span>GUESTS:</span><span>`+ guest + ` </span>
                            </div>
                            <div class="km-dashboard-blocked-room-price">
                                <p>Price:<br><span>(Per Room Per Night)</span></p>
                                <span>`+ options.Price.CurrencyCode + " " + Math.ceil(dayRates) + `</span>
                            </div>
                            <div class="km-dashboard-blocked-room-sub-total">
                                <p>Sub Total:<br><span>(1 Room for `+ options.NoOfNights +` Nights)</span></p>
                                <span> `+ options.Price.CurrencyCode + " " + Math.ceil(options.Price.RoomPrice) + ` </span>
                            </div>
                        </div>
                        <div class="km-dashboard-blocked-room-button-container">
                            <button class="km-dashboard-block-room-button" data-sessionId= `+ sessionId  +` data-roomIndex=`+options.RoomIndex+` data-NoOfRooms=`+options.NoOfRooms+` data-NoOfNights=`+options.NoOfNights+` data-HotelName=`+options.HotelName+` data-HotelResultIndex=`+options.HotelResultIndex+`>Book</button>
                        </div>
                    </div>
                </div>
            </div>`;
},

getButtonTemplate:function(options,elemWidthClass){
    if(options.type=="link"){
    return'<button data-eventhandlerid="'+options.handlerId+'" class="km-dashboard-cta-button km-dashboard-add-more-rooms km-dashboard-undecorated-link '+elemWidthClass+'"><a href ="'+options.url+'" target="_blank">'+options.name+'</a></button>';
    }else{
    return'<button data-eventhandlerid="'+options.handlerId+'" class="km-dashboard-cta-button km-dashboard-add-more-rooms '+elemWidthClass+'">'+options.name+'</button>';
    }
},

getQuickRepliesTemplate:function(options,elemWidthClass){
    return'<button title="'+options.message+'" class="km-dashboard-cta-button km-dashboard-add-more-rooms km-dashboard-quick-replies '+elemWidthClass+'">'+options.title+'</button>';
},

getPassangerDetail : function(options){
    if(!options.SessionId){
       console.log("sessionId not present in message..") 
    }
    return `  <div class="km-guest-details-container km-rich-text-default-container">
    <div class="km-guest-detail-form">
        <div class= "km-select-title">    
            <select name="title" class="km-title-select">
                <option value="0" disabled selected>Title *</option>
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
                <option value="Mrs.">Mrs.</option>
            </select>
        </div>
        <input type="number" name="age"  class="km-input km-age-input n-vis" placeholder="Age *" min="0" max="150">
        <input type="text" name="first-name"  class="km-input first-name-input km-pxinfo-btn-right" placeholder="First Name *">
        <input type="text" name="middle-name"  class="km-input middle-name-input n-vis" placeholder="Middle Name (optional) ">
        <input type="text" name="last-name"  class="km-input last-name-input km-pxinfo-btn-left" placeholder="Last Name *">
        <input type="email" name="email"  class="km-input e-mail-input km-pxinfo-btn-right" placeholder="Email Id *">
        <input type="text" name="contact-no"  class="km-input number-input km-pxinfo-btn-left" placeholder="Contact Number ">
    </div>
    <div class="km-guest-button-container">
        <button class="km-add-more-rooms km-submit-person-detail" data-sessionid= `+ options.sessionId +`>Submit</button>
    </div>
</div>
`
}
};

kommunicateDashboard.markup.buttonContainerTemplate= function(options){
    var containerMarkup = '<div class="km-dashboard-cta-multi-button-container">';
    var payload = JSON.parse(options.payload);
    var formData= JSON.parse(options.formData||"{}");
    var elemWidthClass = payload.length==1?"km-dashboard-cta-button-1":(payload.length==2?"km-dashboard-cta-button-2":"km-dashboard-cta-button-many");

    for(var i = 0;i<payload.length;i++){
        containerMarkup+=  kommunicateDashboard.markup.getButtonTemplate(payload[i],elemWidthClass)
    }
    if(formData){
        containerMarkup+="<form method ='post'  target='_blank' class= km-btn-hidden-form action ="+options.formAction+">";
        for (var key in formData) {
            if (formData.hasOwnProperty(key)) {
                containerMarkup+= '<input type="hidden" name ="'+key+'" value="'+formData[key]+'" />';
            }
        } 
    }
    containerMarkup+='</form></div>';
    return containerMarkup;
}
kommunicateDashboard.markup.quickRepliesContainerTemplate= function(options){
    var containerMarkup = '<div class="km-dashboard-cta-multi-button-container">';
    var payload = JSON.parse(options.payload);
    //var formData= payload? JSON.parse(options.formData||"{}"):"";
    var elemWidthClass = payload.length==1?"km-dashboard-cta-button-1":(payload.length==2?"km-dashboard-cta-button-2":"km-dashboard-cta-button-many");

    for(var i = 0;i<payload.length;i++){
        containerMarkup+=  kommunicateDashboard.markup.getQuickRepliesTemplate(payload[i],elemWidthClass)
    }
    containerMarkup+='</div>';
    return containerMarkup;
}

kommunicateDashboard.markup.getHotelRoomPaxInfoTemplate= function(roomCount){

return `<div class = "km-dashboard-rich-text-default-container">
            <div class="km-dashboard-room-person-selector-container">`+kommunicateDashboard.markup.getSingleRoomPaxInfo(roomCount)+`</div>
            <hr>
            <div class="km-dashboard-add-room-button-container">
                <button  class="km-dashboard-add-more-rooms km-dashboard-btn-add-more-rooms" data-roomcount=1>ADD ROOM</button>
                <button class=" km-dashboard-add-more-rooms km-dashboard-done-button">DONE</button>
            </div>
        </div>`;
}

kommunicateDashboard.markup.getHotelCardContainerTemplate= function(hotelList,sessionId){
var hotelListMarkup ="";
for(var i= 0;i<hotelList.length;i++){
    hotelListMarkup= hotelListMarkup+kommunicateDashboard.markup.getHotelCardTemplate(hotelList[i],sessionId);
    }
    return `<div class="km-dashboard-card-message-container  km-div-slider">`+hotelListMarkup+`</div>`
}

kommunicateDashboard.markup.getRoomDetailsContainerTemplate = function (roomList, sessionId) {
    let roomDetails=roomList.HotelRoomsDetails;
    var roomListMarkup = "";
    for (var i = 0; i < roomDetails.length; i++) {
        roomListMarkup = roomListMarkup + kommunicateDashboard.markup.getRoomDetailTemplate(roomDetails[i], sessionId);
    }
    return `<div class="km-dashboard-card-room-detail-container  km-div-slider">` + roomListMarkup + `</div>`
}
/*{"HotelRoomsDetails":[{
    "ChildCount":0,
    "RequireAllPaxDetails":true,
    "RoomIndex":1,
    "RoomTypeCode":"001:DEL:3834:S3807:4259:16538|1",
    "RoomTypeName":"Standard Twin",
    "RatePlanCode":"001:DEL:3834:S3807:4259:16538|1",
    "CancellationPolicy":"Standard Twin#^#INR 476.00 will be charged, If cancelled between 01-Feb-2018 00:00:00 and 04-Feb-2018 23:59:59.|INR 1904.00 will be charged, If cancelled between 05-Feb-2018 00:00:00 and 08-Feb-2018 00:00:00.|100.00% of total amount will be charged, If cancelled between 08-Feb-2018 00:00:01 and 09-Feb-2018 23:59:59.|#!#",
    "Price":{"CurrencyCode":"INR",
        "RoomPrice":1903.5,
        "Tax":0,
        "ExtraGuestCharge":0,
        "ChildCharge":0,
        "OtherCharges":0,
        "Discount":0,
        "PublishedPrice":1903.5,
        "PublishedPriceRoundedOff":1904,
        "OfferedPrice":1903.5,
        "OfferedPriceRoundedOff":1904,
        "AgentCommission":0,
        "AgentMarkUp":0,
        "ServiceTax":114.21,
        "TDS":0
        }
    },
    {"ChildCount":0,"RequireAllPaxDetails":true,"RoomIndex":2,"RoomTypeCode":"001:DEL1:3834:S3807:4259:16528|1","RoomTypeName":"Deluxe Twin","RatePlanCode":"001:DEL1:3834:S3807:4259:16528|1","CancellationPolicy":"Deluxe Twin#^#INR 588.00 will be charged, If cancelled between 01-Feb-2018 00:00:00 and 04-Feb-2018 23:59:59.|INR 2350.00 will be charged, If cancelled between 05-Feb-2018 00:00:00 and 08-Feb-2018 00:00:00.|100.00% of total amount will be charged, If cancelled between 08-Feb-2018 00:00:01 and 09-Feb-2018 23:59:59.|#!#","Price":{"CurrencyCode":"INR","RoomPrice":2350,"Tax":0,"ExtraGuestCharge":0,"ChildCharge":0,"OtherCharges":0,"Discount":0,"PublishedPrice":2350,"PublishedPriceRoundedOff":2350,"OfferedPrice":2350,"OfferedPriceRoundedOff":2350,"AgentCommission":0,"AgentMarkUp":0,"ServiceTax":141,"TDS":0}},{"ChildCount":0,"RequireAllPaxDetails":true,"RoomIndex":3,"RoomTypeCode":"001:DEL:3834:S3807:4259:16533|1","RoomTypeName":"Standard Triple","RatePlanCode":"001:DEL:3834:S3807:4259:16533|1","CancellationPolicy":"Standard Triple#^#INR 711.00 will be charged, If cancelled between 01-Feb-2018 00:00:00 and 04-Feb-2018 23:59:59.|INR 2844.00 will be charged, If cancelled between 05-Feb-2018 00:00:00 and 08-Feb-2018 00:00:00.|100.00% of total amount will be charged, If cancelled between 08-Feb-2018 00:00:01 and 09-Feb-2018 23:59:59.|#!#","Price":{"CurrencyCode":"INR","RoomPrice":2843.5,"Tax":0,"ExtraGuestCharge":0,"ChildCharge":0,"OtherCharges":0,"Discount":0,"PublishedPrice":2843.5,"PublishedPriceRoundedOff":2844,"OfferedPrice":2843.5,"OfferedPriceRoundedOff":2844,"AgentCommission":0,"AgentMarkUp":0,"ServiceTax":170.61,"TDS":0}},{"ChildCount":0,"RequireAllPaxDetails":true,"RoomIndex":4,"RoomTypeCode":"001:DEL1:3834:S3807:4259:16527|1","RoomTypeName":"Deluxe Triple","RatePlanCode":"001:DEL1:3834:S3807:4259:16527|1","CancellationPolicy":"Deluxe Triple#^#INR 817.00 will be charged, If cancelled between 01-Feb-2018 00:00:00 and 04-Feb-2018 23:59:59.|INR 3267.00 will be charged, If cancelled between 05-Feb-2018 00:00:00 and 08-Feb-2018 00:00:00.|100.00% of total amount will be charged, If cancelled between 08-Feb-2018 00:00:01 and 09-Feb-2018 23:59:59.|#!#","Price":{"CurrencyCode":"INR","RoomPrice":3266.5,"Tax":0,"ExtraGuestCharge":0,"ChildCharge":0,"OtherCharges":0,"Discount":0,"PublishedPrice":3266.5,"PublishedPriceRoundedOff":3267,"OfferedPrice":3266.5,"OfferedPriceRoundedOff":3267,"AgentCommission":0,"AgentMarkUp":0,"ServiceTax":195.99,"TDS":0}}]}
*/
