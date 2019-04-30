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

getButtonTemplate:function(options,requestType, buttonClass){
    let linkSvg = '<span><svg width="12" height="12" viewBox="0 0 12 12"><path class="km-custom-widget-stroke" fill="none" stroke="#5553B7" d="M8.111 5.45v2.839A.711.711 0 0 1 7.4 9H1.711A.711.711 0 0 1 1 8.289V2.6a.71.71 0 0 1 .711-.711H4.58M5.889 1h2.667C8.8 1 9 1.199 9 1.444v2.667m-.222-2.889L4.503 5.497" /></svg></span>';

    if(options.type=="link"){
        return'<button title= "'+ (options.replyText || options.name) +'" class= "km-cta-button km-link-button km-custom-widget-text-color km-undecorated-link '+buttonClass+'  " data-url="'+encodeURI(options.url)+'  " data-metadata="'+options.replyMetadata+'" data-target="'+Kommunicate.markup.getLinkTarget(options)+'" ">'+options.name+'' + linkSvg + '</button>';  
    }else{
        return'<button title= "'+ (options.replyText || options.name) +'" data-metadata="'+options.replyMetadata+'" data-buttontype="submit" data-requesttype= "'+requestType+'" class="km-cta-button km-custom-widget-text-color  '+buttonClass+' ">'+options.name+'</button>';
    }
},
getQuickRepliesTemplate:function(){
    return`<div class="km-cta-multi-button-container">
            {{#payload}}
                 <button title='{{message}}' class="km-quick-replies km-custom-widget-text-color {{buttonClass}} " data-metadata = "{{replyMetadata}}">{{title}}</button>
            {{/payload}}
            </div>`;
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
                    <input type="text" name="first-name"  class="km-input first-name-input km-pxinfo-btn-left" placeholder="First Name *"  required>
                    <input type="text" name="middle-name"  class="km-input middle-name-input n-vis" placeholder="Middle Name (optional) ">
                    <input type="text" name="last-name"  class="km-input last-name-input km-pxinfo-btn-left" placeholder="Last Name *"  required>
                    <input type="email" name="email"  class="km-input e-mail-input km-pxinfo-btn-left" placeholder="Email Id *" required>
                    <input type="text" name="contact-no"  class="km-input number-input km-pxinfo-btn-left" placeholder="Contact Number *" required >
                    <div class= "km-mandatory-field-error n-vis"><span> All fields are mandatory.</span></div>
                </div>
                <div class="km-guest-button-container">
                    <button class="km-add-more-rooms km-submit-person-detail" data-sessionid= `+ options.sessionId +`>Submit</button>
                </div>
            </div>
            `
},
getListMarkup:function(){
    return `<div class="km-message km-received km-chat-faq-list km-list-container" style="">
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
                     <li class ={{handlerClass}} data-type="{{dataType}}" data-metadata = "{{replyMetadata}}" data-reply = "{{dataReply}}" data-articleid= "{{dataArticleId}}" data-source="{{source}}"> <a href={{href}} {{{target}}} class="km-undecorated-link km-custom-widget-text-color" >
                             <div class="km-faq-list--body_img">
                                     {{{imgSrc}}}
                             </div>
                         <div class="km-faq-list--body_que-ans">
                                 <p class="km-faq-list--body_que">
                                     {{title}}
                                 </p>
                                 <p class="km-faq-list--body_ans">
                                     
                                 
                                 {{{description}}}
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
                        <button class="{{buttonClass}} km-cta-button km-custom-widget-border-color km-custom-widget-text-color km-add-more-rooms {{handlerClass}} km-faq-list-link-button" data-type ="{{dataType}}" data-metadata = "{{replyMetadata}}" data-url={{href}} data-target={{target}} data-reply="{{dataReply}}">{{name}}</button>
                    {{/buttons}}  
             </div>
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
                 <button class="km-faq-dialog-button km-quick-replies km-cta-button km-add-more-rooms" data-reply="{{name}}" data-metadata ="{{replyMetadata}}">{{name}}</button>
                {{/buttons}}
             </div>
         </div>
     </div>
 </div>`;
 },
 getImageTemplate : function(){
    return `<div>
    {{#payload}}
    <div class="km-image-template">
       <img class="km-template-img" src="{{url}}"></img>
       <div class="km-template-image-caption-wrapper">
           <p class="km-template-img-caption">{{caption}}</p>
       </div>
   </div>
   {{/payload}}
   </div>`
},
getCarouselTemplate: function() {
return `<div class="mck-msg-box-rich-text-container km-card-message-container  km-div-slider">
            {{#payload}}
            <div class="km-carousel-card-template">
            <div class="km-carousel-card-header {{carouselHeaderClass}}">{{{header}}}</div>
            <div class="km-carousel-card-content-wrapper {{carouselInfoWrapperClass}}">{{{info}}}</div>
            <div class="km-carousel-card-footer">{{{footer}}}</div>
            </div>
            {{/payload}}
        </div>`
},
getButtonListTemplate: function() {
    return `{{#buttons}}<button class="km-carousel-card-button {{{class}}}">{{action.payload.title}}</button>{{/buttons}}`
},
getCardHeaderTemplate: function() {
    return `<img class="{{headerImageClass}}" src="{{imgSrc}}"></img>
            <div class="{{headerOverlayTextClass}}">{{overlayText}}</div>`
},
getCardInfoTemplate: function() {
    return `<div class="km-carousel-card-title-wrapper">
                <div class="km-carousel-card-title">{{title}}</div>
                <div class="km-carousel-card-title-extension">{{titleExt}}</div>
            </div>
            <div class="km-carousel-card-sub-title">{{subtitle}}</div>
            <div class="{{cardDescriptionClass}}"><div class="km-carousel-card-description">{{description}}</div></div>`
}

};

Kommunicate.markup.buttonContainerTemplate= function(options){
    var containerMarkup = '<div class="km-cta-multi-button-container">';
    var payload = JSON.parse(options.payload);
    var formData= options.formData || "";
    var buttonClass = "km-add-more-rooms ";
    buttonClass += payload.length==1?"km-cta-button-1 km-custom-widget-border-color":(payload.length==2?"km-cta-button-2 km-custom-widget-border-color":"km-cta-button-many km-custom-widget-border-color");
    var requestType = options.requestType;
    for(var i = 0;i<payload.length;i++){
        payload[i].replyMetadata = typeof  payload[i].replyMetadata =="object"? JSON.stringify(payload[i].replyMetadata):payload[i].replyMetadata;
        containerMarkup+=  Kommunicate.markup.getButtonTemplate(payload[i],requestType,buttonClass)
        if(payload[i].type != "link" && formData) {
            formData = JSON.parse(formData);
            Object.keys(formData).length > 0 && (containerMarkup += Kommunicate.markup.getFormMarkup(options));   
        }  
    }
    containerMarkup+='</div>';
    return containerMarkup;
}
Kommunicate.markup.getFormMarkup = function(options) {
    var payload = JSON.parse(options.payload);
    var formData= payload? JSON.parse(options.formData||"{}"):"";
    var formMarkup="";
    if(formData){
        formMarkup+="<form method ='post'  target='_blank' class= 'km-btn-hidden-form' action ="+options.formAction+ ">";
        for (var key in formData) {
            if (formData.hasOwnProperty(key)) {
                formMarkup+= '<input type="hidden" name ="'+key+'" value="'+formData[key]+'" />';
            }
        } 
        formMarkup+='</form>';
        return formMarkup
    }
}
Kommunicate.markup.quickRepliesContainerTemplate= function(options, template){
    var payload = JSON.parse(options.payload);
    var buttonClass;
    switch (template) {
        case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.QUICK_REPLY:
            buttonClass = "km-quick-rpy-btn km-custom-widget-border-color "
            break;
        case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.CARD_CAROUSEL:
            buttonClass = "km-carousel-card-button km-carousel-card-quick-rpy-button "
            break;
    }
    template == KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.QUICK_REPLY && (buttonClass +=  payload.length==1?"km-cta-button-1":(payload.length==2?"km-cta-button-2":"km-cta-button-many"));
    
    for(var i = 0;i<payload.length;i++){
        payload[i].replyMetadata = typeof  payload[i].replyMetadata =="object"? JSON.stringify(payload[i].replyMetadata):payload[i].replyMetadata;
        payload[i].buttonClass = buttonClass;
    }
     return Mustache.to_html(Kommunicate.markup.getQuickRepliesTemplate(), {"payload":payload});
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
    const buttonClass = {link:"km-link-button", submit:""}
    if(metadata && metadata.payload){
       var json = JSON.parse(metadata.payload);
        if(json.headerImgSrc){
            json.headerImgSrc = '<div class="km-faq-list--header_text-img"><img src= "'+json.headerImgSrc+'"  alt = "image" /></div>';
        }if(json.headerText){
            json.headerText ='<p class="km-faq-list--header_text">'+json.headerText+"</p>"
        }
        if(json.elements&&json.elements.length){
            json.elementClass ="vis";
            json.elements =   json.elements.map(function(item){
               // checking for image
                if(item.imgSrc){
                item.imgSrc =  '<img src ="'+item.imgSrc +'" />';
               }
               item.description && (item.description = kommunicateCommons.removeHtmlTag(item.description));
               if(item.action && item.action.replyMetadata){
                 item.replyMetadata = typeof  item.action.replyMetadata =="object"? JSON.stringify(item.action.replyMetadata):item.action.replyMetadata;
               }
               //checking for type
               if(item.action && item.action.type=="link"){
                item.href = item.action.url;
                item.action.openLinkInNewTab == false ? item.target = 'target="_parent"' : item.target = 'target="_blank"';
               }else{
                item.href = "javascript:void(0)";
                item.target = '';
                item.handlerClass= "km-list-item-handler";
                
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
        json.buttons=  json.buttons.map(function (button){
            button.target = Kommunicate.markup.getLinkTarget(button.action);
            button.buttonClass = buttonClass[button.action.type];
            if(button.action && button.action.replyMetadata){
                button.replyMetadata = typeof  button.action.replyMetadata =="object"? JSON.stringify(button.action.replyMetadata):button.action.replyMetadata;
              }
            if(!button.action || button.action.type =="quick_reply" || button.action.type =="submit"){
                button.href = "javascript:void(0)";
                button.handlerClass= "km-list-button-item-handler";
               }else{
                button.href = encodeURI(button.action.url);
               }
               
               button.dataType=button.action? button.action.type:"";
               button.dataReply = (button.action && button.action.text)? button.action.text: (button.name||"");
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
        
        json.buttons.length>0 && json.buttons.forEach(function(element) {
            element.replyMetadata  = typeof element.replyMetadata == 'object'? JSON.stringify(element.replyMetadata): element.replyMetadata;
        });
        return Mustache.to_html(Kommunicate.markup.getDialogboxTemplate(), json);
     }
     return "";
}
Kommunicate.markup.getImageContainer = function(options) {
    if (options && options.payload) {
        let payload = typeof options.payload == 'string' ? JSON.parse(options.payload) : {};
        options.payload = payload;
        return Mustache.to_html(Kommunicate.markup.getImageTemplate(), options);
    }
    return ""; 
}
Kommunicate.markup.getHtmlMessageMarkups = function (message) {
    if (message && message.source == KommunicateConstants.MESSAGE_SOURCE.MAIL_INTERCEPTOR) {
        var uniqueId = "km-iframe-" + message.groupId;
        return "<iframe class='km-mail-fixed-view' id=" + uniqueId + " ></iframe>";
    }
    return ""; 
}
Kommunicate.markup.getCarouselMarkup = function(options) {
    var cardList =[]; 
    var cardHtml= {}
    var image = true
    var footer,header,info;
    var buttonClass;
    var headerOverlayTextClass, headerImageClass, carouselHeaderClass, carouselInfoWrapperClass;
    var createCardFooter = function (buttons) {
        var cardFooter = "";
        var requestType;
        for (var i = 0; i < buttons.length; i++) { 
            if(buttons[i].action.type == "quickReply") {
                buttons[i].action.payload = JSON.stringify([buttons[i].action.payload]);
                cardFooter = cardFooter.concat(Kommunicate.markup.quickRepliesContainerTemplate(buttons[i].action, KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.CARD_CAROUSEL))
            } else if (buttons[i].action.type == "link" || buttons[i].action.type == "submit") {
                requestType = buttons[i].action.payload.requestType ? buttons[i].action.payload.requestType :"";
                buttons[i].action.payload["type"] = buttons[i].action.type;
                buttons[i].action.payload["buttonClass"] = "km-carousel-card-button";
                buttons[i].action.payload["name"] = buttons[i].name;
                cardFooter = cardFooter.concat(Kommunicate.markup.getButtonTemplate(buttons[i].action.payload,requestType,"km-carousel-card-button"))
                let formData = buttons[i].action.payload.formData;
                buttons[i].action.payload.formAction && (buttons[i].action["formAction"] = buttons[i].action.payload.formAction);
                buttons[i].action.payload = JSON.stringify([buttons[i].action.payload])
                formData && (buttons[i].action["formData"] = JSON.stringify(formData))
                formData && (cardFooter = cardFooter.concat(Kommunicate.markup.getFormMarkup( buttons[i].action)));
            }

        } 
        return cardFooter;
    }
    if (options && options.payload) {
        let cards = typeof options.payload == 'string' ? JSON.parse(options.payload) : [];
        options.payload = cards;
        for (var i = 0; i < cards.length; i++) {
            var item = cards[i];
            item.header && (headerOverlayTextClass = item.header.overlayText ? (item.header.imgSrc ? "km-carousel-card-overlay-text ":"km-carousel-card-overlay-text  km-carousel-card-overlay-text-without-img") : "n-vis");     
            carouselHeaderClass = item.header ? (item.header.imgSrc ? "km-carousel-card-header-with-img":"km-carousel-card-header-without-img" ): "n-vis";  
            carouselInfoWrapperClass = item.header ? "": "km-carousel-card-info-wrapper-without-header";
            carouselInfoWrapperClass = item.buttons ? carouselInfoWrapperClass.concat(" km-carousel-card-info-wrapper-with-buttons"): "";
            item.header && (headerImageClass = item.header.imgSrc ? "km-carousel-card-img": "n-vis");
            item.header && (item.header["headerOverlayTextClass"] = headerOverlayTextClass);
            item.header && (item.header["headerImageClass"] =headerImageClass);
            item["cardDescriptionClass"] = item.description ? "km-carousel-card-description-wrapper" : "n-vis"
            cardHtml["carouselHeaderClass"] = carouselHeaderClass;
            cardHtml["carouselInfoWrapperClass"] = carouselInfoWrapperClass;
            item.header && (cardHtml.header = Kommunicate.markup.cardHeader(item.header));
            cardHtml.info = Kommunicate.markup.cardInfo(item);
            item.buttons && (cardHtml.footer = createCardFooter(item.buttons));
            cardList[i] = $applozic.extend([], cardHtml);
        }
    }
    let cardCarousel = {payload:cardList};

    return Mustache.to_html(Kommunicate.markup.getCarouselTemplate(),cardCarousel)

}
Kommunicate.markup.cardHeader = function(item) {
    return Mustache.to_html(Kommunicate.markup.getCardHeaderTemplate(),item)
}
Kommunicate.markup.cardInfo= function(item) {
    return Mustache.to_html(Kommunicate.markup.getCardInfoTemplate(),item)
}
Kommunicate.markup.getLinkTarget= function(buttonInfo) {
    buttonInfo.openLinkInNewTab = (typeof buttonInfo.openLinkInNewTab  !='undefined' && !buttonInfo.openLinkInNewTab ) ? buttonInfo.openLinkInNewTab:true;
    return buttonInfo.openLinkInNewTab ? "_blank" : "_parent";
}