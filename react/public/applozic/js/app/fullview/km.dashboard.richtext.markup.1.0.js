
//Kommunicate = $applozic.extends(true,Kommunicate||{})
kommunicateDashboard.markup = {
    getSingleRoomPaxInfo: function(roomCount){
         roomCount= roomCount||"1";
     return '<div class = "km-single-pax-info">'+
    '<div class="km-room-title-text">ROOM '+roomCount+'</div>'+
    '<div class="km-dashboard-room-selector">'+
        '<div style="margin-right:15px;">Guest:</div>'+
        '<div id= "">'+
            '<input class ="km-dashboard-decrement-guest-count" type="button" value="-">'+
            '<input type="number" min="1" max="5" value="1" class="km-dashboard-room-number-field" maxlength="1" disabled>'+
            '<input class ="km-dashboard-increment-guest-count" type="button" value="+">'+
        '</div>'+
    '</div>'+
    '<div class="km-dashboard-person-selector n-vis">'+
        '<div>Children: <span style="font-size:12px; color: rgba(0,0,0,0.5); display: block;">(1-12 yrs)</span> </div>'+
        '<div style="margin-bottom:30px">'+
            '<input type="button" value="-" class ="km-dashboard-decrement-children-count" >'+
            '<input type="number" min="0" max="6" value="0" id="km-dashboard-person-number-field" class="km-dashboard-person-number-field" maxlength="1" disabled>'+
            '<input type="button" value="+" class ="km-dashboard-increment-children-count" >'+
        '</div>'+ 
    '</div>'+
'</div>';
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
    var price = (options.Price.CurrencyCode=="INR"?'&#x20B9;': options.Price.CurrencyCode )+ " " + Math.ceil(options.Price.OfferedPrice * 1);
    return 
    '<div class="km-dashboard-single-card-message">'+
        '<div class="km-dashboard-card-message-header">'+
            '<div class="km-dashboard-card-message-image-continer"><img class ="km-dashboard-card-message-img" src ='+ options.HotelPicture+' />'+
                    '<div class="km-dashboard-card-message-image-price-container">'+ price +'</div>'+
            '</div>'+
        '</div>'+
        '<div class="km-dashboard-card-message-body">'+
            '<h1 class="km-dashboard-card-message-body-title">'+ options.HotelName+'</h1>'+
            '<div class="km-dashboard-card-message-body-ratings">'+
               '<span>'+
                    '<svg xmlns="http://www.w3.org/2000/svg"  height="24" viewBox="0 0 24 24" width="24" class="'+star.star1+'">'+
                        '<path d="M0 0h24v24H0z" fill="none"/>'+
                        '<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>'+
                    '</svg>'+
                '</span>'+
                '<span>'+
                    '<svg xmlns="http://www.w3.org/2000/svg"  height="24" viewBox="0 0 24 24" width="24" class="'+ star.star2+'">'+
                        '<path d="M0 0h24v24H0z" fill="none"/>'+
                        '<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>'+
                    '</svg>'+
                '</span>'+
                '<span>'+
                    '<svg xmlns="http://www.w3.org/2000/svg"  height="24" viewBox="0 0 24 24" width="24" class="'+ star.star3+'">'+
                        '<path d="M0 0h24v24H0z" fill="none"/>'+
                        '<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>'+
                    '</svg>'+
                '</span>'+
                '<span>'+
                    '<svg xmlns="http://www.w3.org/2000/svg"  height="24" viewBox="0 0 24 24" width="24" class="'+ star.star4+'">'+
                        '<path d="M0 0h24v24H0z" fill="none"/>'+
                        '<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>'+
                    '</svg>'+
                '</span>'+
                '<span>'+
                    '<svg xmlns="http://www.w3.org/2000/svg"  height="24" viewBox="0 0 24 24" width="24" class="'+ star.star5+'">'+
                        '<path d="M0 0h24v24H0z" fill="none"/>'+
                        '<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>'+
                    '</svg>'+
                '</span>'+
            '</div>'+
            '<div class="km-dashboard-card-message-body-address">'+
                '<span class="km-dashboard-card-message-body-address-icon">'+
                    '<svg xmlns="http://www.w3.org/2000/svg"  height="24" viewBox="0 0 24 24" width="24">'+
                        '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>'+
                        '<path d="M0 0h24v24H0z" fill="none"/>'+
                    '</svg>'+
                '</span>'+ options.HotelAddress +
            '</div>'+
        '</div>'+
        '<div class="km-dashboard-card-message-footer">'+
            '<button class="km-dashboard-card-message-footer-button" data-resultindex= '+options.ResultIndex +' data-sessionid= '+ sessionId+' data-name='+ options.HotelName+'>ROOM DETAIL</button>'+
       '</div>'+
    '</div>';

},

getRoomDetailTemplate: function (options, sessionId) {
    let guest=options.NoOfGuest=="undefined"?1:options.NoOfGuest
    let dayRates = (options.DayRates.Amount)?options.DayRates.Amount:options.Price.RoomPrice

    return '<div class="km-dashboard-single-card-message">'+
                '<div class="message received km-dashboard-blocked-room">'+
                    '<div class="km-dashboard-blocked-room-details">'+
                    '<div class="km-dashboard-card-message-image-continer"><img class ="km-dashboard-card-message-img" src='+ options.HotelPicture +' alt='+options.HotelName+'></div>'+
                        '<div class="km-dashboard-blocked-room-text-container">'+
                            '<div class="km-dashboard-blocked-room-room-type">'+
                                '<span>ROOM TYPE: </span> <span> '+ options.RoomTypeName + '</span>'+
                            '</div>'+
                            '<div class="km-dashboard-blocked-room-guests">'+
                                '<span>GUESTS:</span><span>'+ guest + '</span>'+
                            '</div>'+
                            '<div class="km-dashboard-blocked-room-price">'+
                                '<p>Price:<br><span>(Per Room Per Night)</span></p>'+
                                '<span>'+ options.Price.CurrencyCode + " " + Math.ceil(dayRates) + '</span>'+
                            '</div>'+
                            '<div class="km-dashboard-blocked-room-sub-total">'+
                                '<p>Sub Total:<br><span>(1 Room for '+ options.NoOfNights +' Nights)</span></p>'+
                                '<span> '+ options.Price.CurrencyCode + " " + Math.ceil(options.Price.RoomPrice) +  '</span>'+
                            '</div>'+
                        '</div>'+
                        '<div class="km-dashboard-blocked-room-button-container">'+
                            '<button class="km-dashboard-block-room-button" data-sessionId= '+ sessionId  +' data-roomIndex='+options.RoomIndex+' data-NoOfRooms='+options.NoOfRooms+' data-NoOfNights='+options.NoOfNights+' data-HotelName='+options.HotelName+' data-HotelResultIndex='+options.HotelResultIndex+'>Book</button>'+
                        '</div>'+
                   '</div>'+
                '</div>'+
            '</div>';
},
getButtonTemplate:function(options,requestType, buttonClass){
    if(options.type=="link"){
        options.openLinkInNewTab = (typeof options.openLinkInNewTab  !='undefined' && !options.openLinkInNewTab ) ? options.openLinkInNewTab:true;
        var target = options.openLinkInNewTab ? "_blank" : "_parent";
        return'<button data-eventhandlerid="'+options.handlerId+'"  title= "'+ options.replyText +'" class= "km-dashboard-cta-button km-dashboard-add-more-rooms km-link-button km-dashboard-undecorated-link '+buttonClass+'  " data-url="'+options.url+'" data-target="'+target+'" ">'+options.name+'</button>';  
    }else{
        return'<button title= "'+ options.replyText +'" data-buttontype="submit" data-requesttype= "'+requestType+'" class="km-dashboard-cta-button '+buttonClass+' ">'+options.name+'</button>';
    }
},

getQuickRepliesTemplate:function(){
    return'<div class="km-dashboard-cta-multi-button-container">'+
            '{{#payload}}'+
                 '<button title="{{message}}" class="km-dashboard-quick-replies km-dashboard-add-more-rooms km-dashboard-cta-button {{buttonClass}} {{elemWidthClass}}" data-metadata = "{{replyMetadata}}">{{title}}</button>'+
            '{{/payload}}'+
            '</div>';
},

getPassangerDetail : function(options){
    if(!options.SessionId){
       console.log("sessionId not present in message..") 
    }
    return '  <div class="km-guest-details-container km-rich-text-default-container">'+
    '<div class="km-guest-detail-form">'+
        '<div class= "km-select-title">'+  
            '<select name="title" class="km-title-select">'+
                '<option value="0" disabled selected>Title *</option>'+
                '<option value="Mr.">Mr.</option>'+
                '<option value="Ms.">Ms.</option>'+
                '<option value="Mrs.">Mrs.</option>'+
            '</select>'+
        '</div>'+
        '<input type="number" name="age"  class="km-input km-age-input n-vis" placeholder="Age *" min="0" max="150">'+
        '<input type="text" name="first-name"  class="km-input first-name-input km-pxinfo-btn-right" placeholder="First Name *">'+
        '<input type="text" name="middle-name"  class="km-input middle-name-input n-vis" placeholder="Middle Name (optional) ">'+
        '<input type="text" name="last-name"  class="km-input last-name-input km-pxinfo-btn-left" placeholder="Last Name *">'+
        '<input type="email" name="email"  class="km-input e-mail-input km-pxinfo-btn-right" placeholder="Email Id *">'+
        '<input type="text" name="contact-no"  class="km-input number-input km-pxinfo-btn-left" placeholder="Contact Number ">'+
    '</div>'+
    '<div class="km-guest-button-container">'+
        '<button class="km-add-more-rooms km-submit-person-detail" data-sessionid= '+ options.sessionId +'>Submit</button>'+
    '</div>'+
'</div>';
},
getListMarkup:function(){
    return '<div class="km-dash-message km-dash-received km-dash-faq-list" style="">'+
    '<div class="km-dash-faq-list--container"  >'+
             '<div class="km-dash-faq-list--header">'+
                     '{{{headerImgSrc}}}'+
                     '<div class="km-dash-faq-list--header_text-container">'+
                                     '{{{headerText}}}'+
                        '</div>'+
         '</div>'+
         '<div class="km-dash-faq-list--body">'+
             '<div class="km-dash-faq-list--body_list-container">'+
                 '<ul class="km-dash-faq-list--body_list">'+
                     '{{#elements}}'+
                     '<li class ={{hadlerClass}} data-type="{{dataType}}" data-reply = "{{dataReply}}" data-articleid= "{{dataArticleId}}" data-source="{{source}}"> <a href={{href}} target="_blank" class="km-undecorated-link" >'+
                             '<div class="km-dash-faq-list--body_img">'+
                                     '{{{imgSrc}}}'+
                             '</div>'+
                         '<div class="km-dash-faq-list--body_que-ans">'+
                                 '<p class="km-dash-faq-list--body_que">'+
                                     '{{title}}'+
                                 '</p>'+
                                 '<p class="km-dash-faq-list--body_ans">'+
                                     '{{{description}}}'+
                                 '</p>'+
                             '</div>'+
                         '</a>'+
                     '</li>'+
                    '{{/elements}}'+
                 
                 '</ul>'+
             '</div>'+
         '</div>'+
         '<div class="km-dash-faq-list--footer">'+
                 '<div class="km-dash-faq-list--footer_button-container">'+
                         '{{#buttons}}'+
                        '<button class="km-cta-button km-add-more-rooms {{hadlerClass}}" data-type ="{{dataType}}" data-reply="{{dataReply}}"><a class ="km-undecorated-link" href ="{{href}}" target="_blank">{{name}}</a></button>'+
                         '{{/buttons}}'+
                     
             '</div>'+
         '</div>'+
     '</div>'+
'</div>';
 },
 getDialogboxTemplate : function(){
     return '<div  class="km-dash-message km-dash-received km-dash-faq-answer">'+
     '<div class="km-dash-faq-answer--container">'+
         '<div class="km-dash-faq-answer--body">'+
             '<div class="km-dash-faq-answer--body_container">'+
                 '<p class="km-dash-faq-answer--body_que">{{title}}</p>'+
                 '<p class="km-dash-faq-answer--body_ans"> {{{description}}}</p>'+
             '</div>'+
         '</div>'+
         '<div class="km-dash-faq-answer--footer">'+
             '<div class="km-dash-faq-answer--footer_button-text-container">'+
                 '<p>{{buttonLabel}}</p>'+
                 '{{#buttons}}'+
                 '<button class="km-cta-button km-add-more-rooms">{{name}}</button>'+
                '{{/buttons}}'+
             '</div>'+
         '</div>'+
     '</div>'+
 '</div>';
 },
 getImageTemplate : function(){
     return '<div>'+
     '{{#payload}}'+
     '<div class="km-dashboard-image-template">'+
        '<img class="km-dashboard-template-img" src="{{url}}"></img>'+
        '<div class="km-dashboard-template-image-caption-wrapper">'+
            '<p class="km-dashboard-template-img-caption">{{caption}}</p>'+
        '</div>'+
    '</div>'+
    '{{/payload}}'+
    '</div>';
 },
 getCardHeaderTemplate: function() {
    return '<img class="{{headerImageClass}}" src="{{imgSrc}}"></img>'+
           '<div class="{{headerOverlayTextClass}}">{{overlayText}}</div>';
 },
 getCardInfoTemplate: function() {
    return '<div class="km-dashboard-carousel-card-title-wrapper">'+
                '<div class="km-dashboard-carousel-card-title">{{title}}</div>'+
                '<div class="km-dashboard-carousel-card-title-extension">{{titleExt}}</div>'+
            '</div>'+
            '<div class="km-dashboard-carousel-card-sub-title">{{subtitle}}</div>'+
            '<div class="{{cardDescriptionClass}}">' +
                '<div class="km-dashboard-carousel-card-description">{{description}}'+
            '</div></div>';
 },
 getCarouselTemplate: function() {
    return '<div class="km-dashboard-card-message-container  km-div-slider">'+
            '{{#payload}}'+
                '<div class="km-dashboard-carousel-card-template">'+
                    '<div class="km-dashboard-carousel-card-header {{carouselHeaderClass}}">{{{header}}}</div>'+
                    '<div class="km-dashboard-carousel-card-content-wrapper {{carouselInfoWrapperClass}}">{{{info}}}</div>'+
                    '<div class="km-dashboard-carousel-card-footer">{{{footer}}}</div>'+
                '</div>'+
            '{{/payload}}'+
            '</div>';
},

};

kommunicateDashboard.markup.buttonContainerTemplate= function(options){
    var containerMarkup = '<div class="km-dashboard-cta-multi-button-container">';
    var payload = JSON.parse(options.payload);
    var formData= options.formData || "";
    var requestType = options.requestType;
    var buttonClass = "km-dashboard-add-more-rooms ";
    buttonClass += payload.length==1?"km-dashboard-cta-button-1 ":(payload.length==2?"km-dashboard-cta-button-2":"km-dashboard-cta-button-many");

    for(var i = 0;i<payload.length;i++){
        containerMarkup+=  kommunicateDashboard.markup.getButtonTemplate(payload[i],requestType, buttonClass)
        if(payload[i].type != "link" && formData) {
            formData = JSON.parse(formData);
            Object.keys(formData).length > 0 && (containerMarkup += kommunicateDashboard.markup.getFormMarkup(options))
           
        }  
    }
    containerMarkup+='</div>';
    return containerMarkup;
}
kommunicateDashboard.markup.getFormMarkup = function(options) {
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
kommunicateDashboard.markup.getImageContainer = function(options) {
    if (options && options.payload) {
        let payload = typeof options.payload == 'string' ? JSON.parse(options.payload) : {};
        options.payload = payload;
        return Mustache.to_html(kommunicateDashboard.markup.getImageTemplate(), options);
    } else {
        return "";
    }
}
kommunicateDashboard.markup.quickRepliesContainerTemplate= function(options){
    var payload = JSON.parse(options.payload);
    var elemWidthClass = payload.length==1?"km-dashboard-cta-button-1":(payload.length==2?"km-dashboard-cta-button-2":"km-dashboard-cta-button-many");
    for(var i = 0;i<payload.length;i++){
        payload[i].replyMetadata = typeof  payload[i].replyMetadata =="object"? JSON.stringify(payload[i].replyMetadata):payload[i].replyMetadata;
        payload[i].elemWidthClass = elemWidthClass;
    }
    return Mustache.to_html(kommunicateDashboard.markup.getQuickRepliesTemplate(), {"payload":payload});
}

kommunicateDashboard.markup.getHotelRoomPaxInfoTemplate= function(roomCount){

return '<div class = "km-dashboard-rich-text-default-container">'+
            '<div class="km-dashboard-room-person-selector-container">'+kommunicateDashboard.markup.getSingleRoomPaxInfo(roomCount)+'</div>'+
            '<hr>'+
            '<div class="km-dashboard-add-room-button-container">'+
                '<button  class="km-dashboard-add-more-rooms km-dashboard-btn-add-more-rooms" data-roomcount=1>ADD ROOM</button>'+
                '<button class=" km-dashboard-add-more-rooms km-dashboard-done-button">DONE</button>'+
            '</div>'+
       '</div>';
}

kommunicateDashboard.markup.getHotelCardContainerTemplate= function(hotelList,sessionId){
var hotelListMarkup ="";
for(var i= 0;i<hotelList.length;i++){
    hotelListMarkup= hotelListMarkup+kommunicateDashboard.markup.getHotelCardTemplate(hotelList[i],sessionId);
    }
    return '<div class="km-dashboard-card-message-container  km-div-slider">'+hotelListMarkup+'</div>';
}

kommunicateDashboard.markup.getRoomDetailsContainerTemplate = function (roomList, sessionId) {
    let roomDetails=roomList.HotelRoomsDetails;
    var roomListMarkup = "";
    for (var i = 0; i < roomDetails.length; i++) {
        roomListMarkup = roomListMarkup + kommunicateDashboard.markup.getRoomDetailTemplate(roomDetails[i], sessionId);
    }
    return '<div class="km-dashboard-card-room-detail-container  km-div-slider">' + roomListMarkup + '</div>';
}
kommunicateDashboard.markup.getListContainerMarkup = function(metadata){
    if(metadata && metadata.payload){
       var json = JSON.parse(metadata.payload);
        if(json.headerImgSrc){
            json.headerImgSrc = '<div class="km-dash-faq-list--header_text-img"><img class="km-list-image" src= "'+json.headerImgSrc+'" /></div>' 
        }if(json.headerText){
            json.headerText ='<p class="km-dash-faq-list--header_text">'+json.headerText+"</p>"
        }
        if(json.elements&&json.elements.length){
            json.elements =   json.elements.map(function(item){
               // checking for image
                if(item.imgSrc){
                item.imgSrc =  '<img src ="'+item.imgSrc +'" />';
               }
               item.description && (item.description = kmUtils.removeHtmlTag(item.description));
               //checking for type
               if(!item.action || item.action.type =="quick_reply" || item.action.type =="submit"){
                item.href = "javascript:void(0)";
                item.hadlerClass= "km-list-item-handler";
               }else{
                item.href = item.action.url;
               }
               
               item.dataType = item.action && item.action.type ? item.action.type : "";
               item.dataReply = (item.action && item.action.text) ? item.action.text : (item.title || "");
               
               item.dataArticleId = item.articleId||"";
               item.dataSource = item.source||"";
               // TODO : add post url in data.
                return item;
            })
        }
        if(json.buttons&&json.buttons.length){
        json.buttons=  json.buttons.map(function(button){
            if(!button.action || button.action.type =="quick_reply" || button.action.type =="submit"){
                button.href = "javascript:void(0)";
                button.hadlerClass= "km-list-button-item-handler";
               }else{
                button.href = button.action.url;
               }            
            
            button.dataType = button.action && button.action.type ? button.action.type : "";
            button.dataReply = (button.action && button.action.text) ? button.action.text : (button.name || "");         
            
            return button;
        })
    }
        
       return Mustache.to_html(kommunicateDashboard.markup.getListMarkup(), json);
    }else{
        return "";
    }

}
kommunicateDashboard.markup.getDialogboxContainer = function(metadata){
    if(metadata && metadata.payload){
        var json = JSON.parse(metadata.payload);
        return Mustache.to_html(kommunicateDashboard.markup.getDialogboxTemplate(), json);
     }else{
         return "";
     }
}
kommunicateDashboard.markup.getHtmlMessageMarkups = function (message) {
    if (message.message && message.source == 7) {
        var uniqueId = "km-iframe-" + message.groupId;
        return "<iframe class='km-mail-fixed-view-iframe' id=" + uniqueId + " ></iframe>";
    } else {
        return "";
    }
}
kommunicateDashboard.markup.getCarouselMarkup = function(options) {
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
                buttons[i].action.payload["buttonClass"] = "km-dashboard-carousel-card-button"
                buttons[i].action.payload = JSON.stringify([buttons[i].action.payload])
                cardFooter = cardFooter.concat(kommunicateDashboard.markup.quickRepliesContainerTemplate(buttons[i].action))
            } else if (buttons[i].action.type == "link" || buttons[i].action.type == "submit") {
                requestType = buttons[i].action.payload.requestType ? buttons[i].action.payload.requestType :"";
                buttons[i].action.payload["type"] = buttons[i].action.type;
                buttons[i].action.payload["buttonClass"] = "km-dashboard-carousel-card-button";
                buttons[i].action.payload["name"] = buttons[i].name;
                cardFooter = cardFooter.concat(kommunicateDashboard.markup.getButtonTemplate(buttons[i].action.payload,requestType,"km-dashboard-carousel-card-button"))
                let formData = buttons[i].action.payload.formData;
                buttons[i].action.payload.formAction && (buttons[i].action["formAction"] = buttons[i].action.payload.formAction);
                buttons[i].action.payload = JSON.stringify([buttons[i].action.payload])
                formData && (buttons[i].action["formData"] = JSON.stringify(formData))
                formData && (cardFooter = cardFooter.concat(kommunicateDashboard.markup.getFormMarkup( buttons[i].action)));
            }

        } 
        return cardFooter;
    }
    if (options && options.payload) {
        let cards = typeof options.payload == 'string' ? JSON.parse(options.payload) : [];
        options.payload = cards;
        for (var i = 0; i < cards.length; i++) {
            var item = cards[i];
            item.header && (headerOverlayTextClass = item.header.overlayText ? (item.header.imgSrc ? "km-dashboard-carousel-card-overlay-text ":"km-dashboard-carousel-card-overlay-text  km-dashboard-carousel-card-overlay-text-without-img") : "n-vis");     
            carouselHeaderClass = item.header ? (item.header.imgSrc ? "":"km-dashboard-carousel-card-header-without-img" ): "n-vis";  
            carouselInfoWrapperClass = item.header ? "": "km-dashboard-carousel-card-info-wrapper-without-header";
            carouselInfoWrapperClass = item.buttons ? carouselInfoWrapperClass.concat(" km-dashboard-carousel-card-info-wrapper-with-buttons"): "";
            item.header && (headerImageClass = item.header.imgSrc ? "km-dashboard-carousel-card-img": "n-vis");
            item.header && (item.header["headerOverlayTextClass"] = headerOverlayTextClass);
            item.header && (item.header["headerImageClass"] =headerImageClass);
            item["cardDescriptionClass"] = item.description ? "km-dashboard-carousel-card-description-wrapper" : "n-vis";
            cardHtml["carouselHeaderClass"] = carouselHeaderClass;
            cardHtml["carouselInfoWrapperClass"] = carouselInfoWrapperClass;
            item.header && (cardHtml.header = kommunicateDashboard.markup.cardHeader(item.header));
            cardHtml.info = kommunicateDashboard.markup.cardInfo(item);
            item.buttons && (cardHtml.footer = createCardFooter(item.buttons));
            cardList.push(Object.assign({},cardHtml))
        }    
    }
    let cardCarousel = {payload:cardList};

    return Mustache.to_html(kommunicateDashboard.markup.getCarouselTemplate(),cardCarousel)

}
kommunicateDashboard.markup.cardHeader = function(item) {
    return Mustache.to_html(kommunicateDashboard.markup.getCardHeaderTemplate(),item)
}
kommunicateDashboard.markup.cardInfo= function(item) {
    return Mustache.to_html(kommunicateDashboard.markup.getCardInfoTemplate(),item)
}