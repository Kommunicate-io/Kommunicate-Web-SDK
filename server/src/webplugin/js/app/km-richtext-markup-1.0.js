//Kommunicate = $applozic.extends(true,Kommunicate||{})
Kommunicate.markup = {
    getSingleRoomPaxInfo: function(roomCount){
         roomCount= roomCount||"1";
     return `<div class = "km-single-pax-info">
    <div class="km-room-title-text">ROOM `+roomCount+`</div>
    <div class="km-room-selector">
        <div>Guest :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
        <div id= "">
            <input class ="km-decrement-guest-count" type="button" value="-" data-type="guest">
            <input type="number" min="1" max="5" value="1" class="km-room-number-field" maxlength="1" disabled>
            <input class ="km-increment-guest-count" type="button" value="+" data-type="guest">
        </div>
    </div>
    <div class="km-person-selector n-vis">
        <div class="km-children-text-lable">Children :<span>(1-12 yrs)</span></div>
        <div>
            <input class ="km-decrement-guest-count" type="button" value="-" data-type="children">
            <input type="number" min="0" max="2" value="0" class="km-person-number-field" maxlength="1" disabled >
            <input class ="km-increment-guest-count" type="button" value="+" data-type="children">
        </div> 
    </div>
</div>`
},
getHotelCardTemplate : function(options,sessionId){
   var star={
    star1:"km-star-empty",
    star2:"km-star-empty",
    star3:"km-star-empty",
    star4:"km-star-empty",
    star5:"km-star-empty"

    };
    if(options.StarRating){
        //populate the star rating
        for(var i = 0;i<options.StarRating;i++){
            star["star"+(i+1)]="km-star-filled";
        }
   
    }    
    //Note: Setting price as 8%, modify it to change price calculation logic.
    var price = (options.Price.CurrencyCode=="INR"?'&#x20B9;': options.Price.CurrencyCode )+ " " + Math.ceil(options.Price.OfferedPrice * 1);
    return `
    <div class="km-single-card-message">
        <div class="km-card-message-header">
            <div class="km-card-message-image-continer"><img class ="km-card-message-img" src =`+ options.HotelPicture+` />
                    <div class="km-card-message-image-price-container">`+ price +`</div>
            </div>
        </div>
        <div class="km-card-message-body">
            <h1 class="km-card-message-body-title">`+ options.HotelName+`</h1>
            <div class="km-card-message-body-ratings">
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
            <div class="km-card-message-body-address">
                <span class="km-card-message-body-address-icon">
                    <svg xmlns="http://www.w3.org/2000/svg"  height="24" viewBox="0 0 24 24" width="24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        <path d="M0 0h24v24H0z" fill="none"/>
                    </svg>
                </span>`+ options.HotelAddress +`
            </div>
        </div>
        <div class="km-card-message-footer">
            <button class="km-card-message-footer-button" data-resultindex= `+ options.ResultIndex +` data-sessionid= `+ sessionId+` data-name= `+(options.HotelName).replace(' ', '_')+` > Get Room Details</button>
        </div>
    </div>`;

},

getRoomDetailTemplate: function (options, sessionId) {
    let guest=options.NoOfGuest=="undefined"?1:options.NoOfGuest
    let dayRates = (options.DayRates.Amount)?options.DayRates.Amount:options.Price.RoomPrice;

    return `<div class="km-single-card-message">
                <div class="message received km-blocked-room">
                    <div class="km-blocked-room-details">
                    <div class="km-card-message-image-continer"><img class ="km-card-message-img" src=`+ options.HotelPicture +` alt=`+options.HotelName+`></div>
                        <div class="km-blocked-room-text-container">
                            <div class="km-blocked-room-room-type">
                                <span>Room Type: </span> <span> `+ options.RoomTypeName + `</span>
                            </div>
                            <div class="km-blocked-room-guests">
                                <span>Guests:</span><span>`+ guest + ` </span>
                            </div>
                            <div class="km-blocked-room-price">
                                <p>Price:<br><span>(Per Room Per Night)</span></p>

                                <span>`+(options.Price.CurrencyCode == "INR" ? '&#x20B9;' : options.Price.CurrencyCode ) + " " + Math.ceil(dayRates) + `</span>

                            </div>
                            <div class="km-blocked-room-sub-total">
                                <p>Total:<br><span>(1 Room for `+ options.NoOfNights +` Nights)</span></p>
                                <span> `+ (options.Price.CurrencyCode=="INR"?'&#x20B9;': options.Price.CurrencyCode ) + " " +Math.ceil(options.Price.RoomPrice) + ` </span>
                            </div>
                        </div>
                        <div class="km-blocked-room-button-container">
                            <button class="km-block-room-button" data-sessionId= `+ sessionId  +` data-roomIndex=`+options.RoomIndex+` data-NoOfRooms=`+options.NoOfRooms+` data-NoOfNights=`+options.NoOfNights+` data-HotelName= `+(options.HotelName).replace(' ', '_')+ ` data-HotelResultIndex= `+options.HotelResultIndex+` >Book</button>
                        </div>
                    </div>
                </div>
            </div>`;
},

getButtonTemplate:function(options,elemWidthClass){
    if(options.type=="link"){
    return'<button data-eventhandlerid="'+options.handlerId+'" class="km-cta-button km-add-more-rooms km-undecorated-link '+elemWidthClass+'"><a href ="'+options.url+'" target="_blank">'+options.name+'</a></button>';
    }else{
    return'<button data-eventhandlerid="'+options.handlerId+'" class="km-cta-button km-add-more-rooms '+elemWidthClass+'">'+options.name+'</button>';
    }
},
getQuickRepliesTemplate:function(options,elemWidthClass){
    return'<button title="'+options.message+'" class="km-cta-button km-add-more-rooms km-quick-replies '+elemWidthClass+'">'+options.title+'</button>';
},
getPassangerDetail : function(options){
    if(!options.sessionId){
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
                    <input type="text" name="first-name"  class="km-input first-name-input km-pxinfo-btn-left" placeholder="First Name *" >
                    <input type="text" name="middle-name"  class="km-input middle-name-input n-vis" placeholder="Middle Name (optional) ">
                    <input type="text" name="last-name"  class="km-input last-name-input km-pxinfo-btn-left" placeholder="Last Name *" >
                    <input type="email" name="email"  class="km-input e-mail-input km-pxinfo-btn-left" placeholder="Email Id *" >
                    <input type="text" name="contact-no"  class="km-input number-input km-pxinfo-btn-left" placeholder="Contact Number *" >
                </div>
                <div class="km-guest-button-container">
                    <button class="km-add-more-rooms km-submit-person-detail" data-sessionid= `+ options.sessionId +`>Submit</button>
                </div>
            </div>
            `
},
getListMarkup:function(){
    return `<div class="km-message km-received km-chat-faq-list" style="">
     <div class="km-faq-list--container"  >
             <div class="km-faq-list--header">
                     {{{headerImgSrc}}}
                     <div class="km-faq-list--header_text-container">
                                     {{{headerText}}}
                         </div>
         </div>
         <div class="km-faq-list--body">
             <div class="km-faq-list--body_list-container">
                 <ul class="km-faq-list--body_list {{elementClass}}">
                     {{#elements}}
                     <li class ={{hadlerClass}} data-type="{{dataType}}" data-reply = "{{dataReply}}" data-articleid= "{{dataArticleId}}" data-source="{{source}}"> <a href={{href}} target="_blank" class="km-undecorated-link" >
                             <div class="km-faq-list--body_img">
                                     {{{imgSrc}}}
                             </div>
                         <div class="km-faq-list--body_que-ans">
                                 <p class="km-faq-list--body_que">
                                     {{title}}
                                 </p>
                                 <p class="km-faq-list--body_ans">
                                     {{description}}
                                 </p>
                             </div>
                         </a>
                     </li>
                     {{/elements}}
                 
                 </ul>
             </div>
         </div>
         <div class="km-faq-list--footer">
                 <div class="km-faq-list--footer_button-container">
                         {{#buttons}}
                         <button class="km-cta-button km-add-more-rooms {{hadlerClass}}" data-type ="{{dataType}}" data-reply="{{dataReply}}"><a class ="km-undecorated-link" href ="{{href}}" target="_blank">{{name}}</a></button>
                         {{/buttons}}
                     
             </div>
         </div>
     </div>`
 },
 getDialogboxTemplate : function(){
     return `<div class="km-message km-received km-faq-answer">
     <div class="km-faq-answer--container">
         <div class="km-faq-answer--body">
             <div class="km-faq-answer--body_container">
                 <p class="km-faq-answer--body_que">{{title}}</p>
                 <p class="km-faq-answer--body_ans"> {{{description}}} </p>
             </div>
         </div>
         <div class="km-faq-answer--footer">
             <div class="km-faq-answer--footer_button-text-container">
                 <p>{{buttonLabel}}</p>
                 {{#buttons}}
                 <button class="km-faq-dialog-button km-quick-replies km-cta-button km-add-more-rooms" data-reply="{{name}}">{{name}}</button>
                {{/buttons}}
             </div>
         </div>
     </div>
 </div>`;
 }

};

Kommunicate.markup.buttonContainerTemplate= function(options){
    var containerMarkup = '<div class="km-cta-multi-button-container">';
    var payload = JSON.parse(options.payload);
    var formData= payload? JSON.parse(options.formData||"{}"):"";
    var elemWidthClass = payload.length==1?"km-cta-button-1":(payload.length==2?"km-cta-button-2":"km-cta-button-many");

    for(var i = 0;i<payload.length;i++){
        containerMarkup+=  Kommunicate.markup.getButtonTemplate(payload[i],elemWidthClass)
    }
    if(formData){
        containerMarkup+="<form method ='post'  target='_blank' class= km-btn-hidden-form action ="+options.formAction+">";
        for (var key in formData) {
            if (formData.hasOwnProperty(key)) {
                containerMarkup+= '<input type="hidden" name ="'+key+'" value="'+formData[key]+'" />';
            }
        } 
        containerMarkup+='</form>';
    }
    containerMarkup+='</div>';
    return containerMarkup;
}
Kommunicate.markup.quickRepliesContainerTemplate= function(options){
    var containerMarkup = '<div class="km-cta-multi-button-container">';
    var payload = JSON.parse(options.payload);
    //var formData= payload? JSON.parse(options.formData||"{}"):"";
    var elemWidthClass = payload.length==1?"km-cta-button-1":(payload.length==2?"km-cta-button-2":"km-cta-button-many");

    for(var i = 0;i<payload.length;i++){
        containerMarkup+=  Kommunicate.markup.getQuickRepliesTemplate(payload[i],elemWidthClass)
    }
    containerMarkup+='</div>';
    return containerMarkup;
}

Kommunicate.markup.getHotelRoomPaxInfoTemplate= function(roomCount){

return `<div class = "km-rich-text-default-container">
            <div class="km-room-person-selector-container">`+Kommunicate.markup.getSingleRoomPaxInfo(roomCount)+`</div>
            <hr>
            <div class="km-add-room-button-container">
                <button  class="km-add-more-rooms km-btn-add-more-rooms" data-roomcount=1>ADD ROOM</button>
                <button class=" km-add-more-rooms km-done-button">DONE</button>
            </div>
        </div>`;
}

Kommunicate.markup.getHotelCardContainerTemplate= function(hotelList,sessionId){
var hotelListMarkup ="";
for(var i= 0;i<hotelList.length;i++){
    hotelListMarkup= hotelListMarkup+Kommunicate.markup.getHotelCardTemplate(hotelList[i],sessionId);
}
    return `<div class="km-card-message-container  km-div-slider">`+hotelListMarkup+`</div>`
}

Kommunicate.markup.getRoomDetailsContainerTemplate = function (roomList, sessionId) {
    let roomDetails=roomList.HotelRoomsDetails;
    var roomListMarkup = "";
    for (var i = 0; i < roomDetails.length; i++) {
        roomListMarkup = roomListMarkup + Kommunicate.markup.getRoomDetailTemplate(roomDetails[i], sessionId);
    }
    return `<div class="km-card-room-detail-container  km-div-slider">` + roomListMarkup + `</div>`
}
Kommunicate.markup.getListContainerMarkup = function(metadata){
    if(metadata && metadata.payload){
       var json = JSON.parse(metadata.payload);
        if(json.headerImgSrc){
            json.headerImgSrc = '<div class="km-faq-list--header_text-img"><img src= '+json.headerImgSrc+'/></div>' 
        }if(json.headerText){
            json.headerText ='<p class="km-faq-list--header_text">'+json.headerText+"</p>"
        }
        if(json.elements&&json.elements.length){
            json.elementClass ="vis";
            json.elements =   json.elements.map(function(item){
               // checking for image
                if(item.imgSrc){
                item.imgSrc =  '<img src ='+item.imgSrc +'/>';
               }
               //checking for type
               if(item.action && item.action.type=="link"){
                item.href = item.action.url;
               }else{
                item.href = "javascript:void(0)";
                item.hadlerClass= "km-list-item-handler";
                
               }
               if(item.action){
                item.dataType=item.action.type||"";
                item.dataReply = item.action.text||item.title||"";
               }
               item.dataArticleId = item.articleId||"";
               item.dataSource = item.source||"";
               // TODO : add post url in data.
                return item;
            })
        }else{
            json.elementClass ="n-vis"
        }
        if(json.buttons&&json.buttons.length){
        json.buttons=  json.buttons.map(button=>{
            if(!button.action || button.action.type =="quick_reply" || button.action.type =="submit"){
                button.href = "javascript:void(0)";
                button.hadlerClass= "km-list-button-item-handler";
               }else{
                button.href = button.action.url;
               }
               
               button.dataType=button.action.type||"";
               button.dataReply = button.action.text||button.name||"";
               // TODO : add post url in data.
                return button;
        })
    }
        
       return Mustache.to_html(Kommunicate.markup.getListMarkup(), json);
    }else{
        return "";
    }

}
Kommunicate.markup.getDialogboxContainer = function(metadata){
    if(metadata && metadata.payload){
        var json = JSON.parse(metadata.payload);
        
        return Mustache.to_html(Kommunicate.markup.getDialogboxTemplate(), json);
     }else{
         return "";
     }
}
