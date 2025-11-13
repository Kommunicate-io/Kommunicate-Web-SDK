//Kommunicate = $applozic.extends(true,Kommunicate||{})
Kommunicate.markup = {
    getSingleRoomPaxInfo: function (roomCount) {
        roomCount = roomCount || '1';
        return (
            `<div class = "km-single-pax-info">
    <div class="km-room-title-text">ROOM ` +
            roomCount +
            `</div>
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
        );
    },
    getHotelCardTemplate: function (options, sessionId) {
        var starClasses = Array(5).fill('km-star-empty');
        var rating = Math.floor(Number(options.StarRating) || 0);
        rating = Math.max(0, Math.min(rating, starClasses.length));
        for (var i = 0; i < rating; i++) {
            starClasses[i] = 'km-star-filled';
        }
        var starMarkup = '';
        starClasses.forEach(function (cls) {
            starMarkup +=
                '<span><svg xmlns="http://www.w3.org/2000/svg"  height="24" viewBox="0 0 24 24" width="24" class="' +
                cls +
                '"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></span>';
        });
        //Note: Setting price as 8%, modify it to change price calculation logic.
        var price =
            (options.Price.CurrencyCode == 'INR' ? '&#x20B9;' : options.Price.CurrencyCode) +
            ' ' +
            Math.ceil(options.Price.OfferedPrice * 1);
        return (
            `
    <div class="km-single-card-message">
        <div class="km-card-message-header">
            <div class="km-card-message-image-continer"><img class ="km-card-message-img" src =` +
            options.HotelPicture +
            ` />
                    <div class="km-card-message-image-price-container">` +
            price +
            `</div>
            </div>
        </div>
        <div class="km-card-message-body">
            <h1 class="km-card-message-body-title">` +
            options.HotelName +
            `</h1>
            <div class="km-card-message-body-ratings">` +
            starMarkup +
            `</div>
            <div class="km-card-message-body-address">
                <span class="km-card-message-body-address-icon">
                    <svg xmlns="http://www.w3.org/2000/svg"  height="24" viewBox="0 0 24 24" width="24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        <path d="M0 0h24v24H0z" fill="none"/>
                    </svg>
                </span>` +
            options.HotelAddress +
            `
            </div>
        </div>
        <div class="km-card-message-footer">
            <button class="km-card-message-footer-button" data-resultindex= ` +
            options.ResultIndex +
            ` data-sessionid= ` +
            sessionId +
            ` data-name= ` +
            options.HotelName.replace(' ', '_') +
            ` > Get Room Details</button>
        </div>
    </div>`
        );
    },

    getRoomDetailTemplate: function (options, sessionId) {
        var guest = options.NoOfGuest == 'undefined' ? 1 : options.NoOfGuest;
        var dayRates = options.DayRates.Amount ? options.DayRates.Amount : options.Price.RoomPrice;

        return (
            `<div class="km-single-card-message">
                <div class="message received km-blocked-room">
                    <div class="km-blocked-room-details">
                    <div class="km-card-message-image-continer"><img class ="km-card-message-img" src=` +
            options.HotelPicture +
            ` alt=` +
            options.HotelName +
            `></div>
                        <div class="km-blocked-room-text-container">
                            <div class="km-blocked-room-room-type">
                                <span>Room Type: </span> <span> ` +
            options.RoomTypeName +
            `</span>
                            </div>
                            <div class="km-blocked-room-guests">
                                <span>Guests:</span><span>` +
            guest +
            ` </span>
                            </div>
                            <div class="km-blocked-room-price">
                                <p>Price:<br><span>(Per Room Per Night)</span></p>

                                <span>` +
            (options.Price.CurrencyCode == 'INR' ? '&#x20B9;' : options.Price.CurrencyCode) +
            ' ' +
            Math.ceil(dayRates) +
            `</span>

                            </div>
                            <div class="km-blocked-room-sub-total">
                                <p>Total:<br><span>(1 Room for ` +
            options.NoOfNights +
            ` Nights)</span></p>
                                <span> ` +
            (options.Price.CurrencyCode == 'INR' ? '&#x20B9;' : options.Price.CurrencyCode) +
            ' ' +
            Math.ceil(options.Price.RoomPrice) +
            ` </span>
                            </div>
                        </div>
                        <div class="km-blocked-room-button-container">
                            <button class="km-block-room-button" data-sessionId= ` +
            sessionId +
            ` data-roomIndex=` +
            options.RoomIndex +
            ` data-NoOfRooms=` +
            options.NoOfRooms +
            ` data-NoOfNights=` +
            options.NoOfNights +
            ` data-HotelName= ` +
            options.HotelName.replace(' ', '_') +
            ` data-HotelResultIndex= ` +
            options.HotelResultIndex +
            ` >Book</button>
                        </div>
                    </div>
                </div>
            </div>`
        );
    },
    getLinkPreviewTemplate: function (extractedData, isMckRightMsg) {
        var data = extractedData.data;
        if (data && data.title) {
            var mckRightLinkClass = isMckRightMsg ? 'km-custom-widget-background-color' : '';
            var title = data.siteName || data.title;
            var description = data.description || data.title;

            return (
                '<div class="link-preview-wrapper"><div class="link-preview-image-div"><img class="link-preview-image" src="' +
                (data.images[0] || data.favicons[0]) +
                '" onerror="this.classList.add(\'link-preview-image-broken\')"  alt="' +
                title +
                '"></div><div class="link-preview-content ' +
                mckRightLinkClass +
                '"><h5 class="link-preview-title link-preview-title-width" title="' +
                title +
                '"> ' +
                title +
                '</h5><p class="link-preview-div-description" title="' +
                description +
                '">' +
                description +
                '</p></div></div>'
            );
        }
    },
    getButtonTemplate: function (options, requestType, buttonClass) {
        var linkSvg =
            '<span><svg width="12" height="12" viewBox="0 0 12 12"><path class="km-custom-widget-stroke" fill="none" stroke="#5553B7" d="M8.111 5.45v2.839A.711.711 0 0 1 7.4 9H1.711A.711.711 0 0 1 1 8.289V2.6a.71.71 0 0 1 .711-.711H4.58M5.889 1h2.667C8.8 1 9 1.199 9 1.444v2.667m-.222-2.889L4.503 5.497" /></svg></span>';

        if (options.type == 'link') {
            return (
                '<button aria-label="' +
                (options.replyText || options.name) +
                '" title= "' +
                (options.replyText || options.name) +
                '" class= "km-cta-button km-link-button km-custom-widget-text-color km-undecorated-link ' +
                buttonClass +
                '  " data-url="' +
                encodeURI(options.url) +
                '  " data-metadata="' +
                options.replyMetadata +
                '" data-buttontype="button" data-target="' +
                Kommunicate.markup.getLinkTarget(options) +
                '" ">' +
                options.name +
                '' +
                linkSvg +
                '</button>'
            );
        } else {
            return (
                '<button aria-label="' +
                (options.replyText || (options.action && options.action.message) || options.name) +
                '" title= "' +
                (options.replyText || (options.action && options.action.message) || options.name) +
                '" data-metadata="' +
                options.replyMetadata +
                '" data-buttontype="submit" data-requesttype= "' +
                requestType +
                '" class="km-cta-button km-custom-widget-text-color  ' +
                buttonClass +
                ' ">' +
                options.name +
                '</button>'
            );
        }
    },
    getQuickRepliesTemplate: function () {
        return `
            {{#payload}}
                 <button aria-label="{{title}}" title='{{message}}' class="km-quick-replies km-custom-widget-text-color {{buttonClass}} " data-metadata = "{{replyMetadata}}" data-languageCode = "{{updateLanguage}}" data-hidePostCTA="{{hidePostCTA}}">{{title}}</button>
            {{/payload}}
            `;
    },
    getGenericSuggestedReplyButton: function () {
        return `<button aria-label="{{name}}" title='{{message}}' class="km-quick-replies km-custom-widget-text-color {{buttonClass}} " data-metadata = "{{replyMetadata}}" data-languageCode = "{{action.updateLanguage}}" data-hidePostCTA="{{hidePostCTA}}">{{name}}</button>`;
    },
    getPassangerDetail: function (options) {
        if (!options.sessionId) {
            console.log('sessionId not present in message..');
        }
        return (
            `  <div class="km-guest-details-container km-rich-text-default-container">
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
                    <button class="km-add-more-rooms km-submit-person-detail" data-sessionid= ` +
            options.sessionId +
            `>Submit</button>
                </div>
            </div>
            `
        );
    },
    getListMarkup: function () {
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
                     <li class ={{handlerClass}} data-type="{{dataType}}" data-hidePostCTA="{{hidePostCTA}}" data-metadata = "{{replyMetadata}}" data-reply = "{{dataReply}}" data-languageCode = "{{updateLanguage}}" data-articleid= "{{dataArticleId}}" data-source="{{source}}"> <a href={{href}} {{{target}}} class="km-undecorated-link km-custom-widget-text-color" >
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
         {{#buttons.length}}
         <div class="km-faq-list--footer">
            <div class="km-faq-list--footer_button-container">
                    {{#buttons}}
                        <button aria-label="{{name}}" class="{{buttonClass}} km-cta-button km-custom-widget-border-color km-custom-widget-text-color km-add-more-rooms {{handlerClass}} km-faq-list-link-button" data-type ="{{dataType}}" data-hidePostCTA="{{hidePostCTA}}" data-metadata="{{replyMetadata}}" data-languageCode="{{updateLanguage}}" data-url={{href}} type="button" data-target={{target}} data-reply="{{dataReply}}">{{name}}</button>
                    {{/buttons}}  
             </div>
         </div>
         {{/buttons.length}}
         
     </div>
     </div>`;
    },
    getDialogboxTemplate: function () {
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
                 <button aria-label="{{name}}" class="km-faq-dialog-button km-quick-replies km-add-more-rooms" data-reply="{{name}}" data-metadata ="{{replyMetadata}}">{{name}}</button>
                {{/buttons}}
             </div>
         </div>
     </div>
 </div>`;
    },
    getImageTemplate: function () {
        return `<div>
    {{#payload}}
    <div class="km-image-template">
        <a href="#" target="_self" role="link" class="file-preview-link fancybox-media fancybox-kommunicate" data-type="image/{{type}}" data-url="{{url}}" data-name="{{caption}}">
            <img class="km-template-img" src="{{url}}"></img>
       </a>
       <div class="km-template-image-caption-wrapper {{^caption}}n-vis{{/caption}}">
           <p class="km-template-img-caption">{{caption}}</p>
       </div>
   </div>
   {{/payload}}
   </div>`;
    },
    getCarouselTemplate: function () {
        return `<div class="mck-msg-box-rich-text-container km-card-message-container  km-div-slider">
            {{#payload}}
            <div class="km-carousel-card-template {{containerClass}}">
            <div class="km-carousel-card-header-container">
            {{#url}}<a href = {{url}} target="_blank"><span class="km-carousel-url-container"></span></a>{{/url}}
            <div class="km-carousel-card-header {{carouselHeaderClass}}">{{{header}}}</div>
            <div class="km-carousel-card-content-wrapper {{carouselInfoWrapperClass}}">{{{info}}}</div>
            </div>
            <div class="km-carousel-card-footer"><div class="km-cta-multi-button-container">{{{footer}}}</div></div>
            </div>
            {{/payload}}
        </div>`;
    },
    getButtonListTemplate: function () {
        return `{{#buttons}}<button aria-label="{{action.payload.title}}" class="km-carousel-card-button {{{class}}}">{{action.payload.title}}</button>{{/buttons}}`;
    },
    getCardHeaderTemplate: function () {
        return `<img class="{{headerImageClass}}" src="{{imgSrc}}"></img>
            <div class="{{headerOverlayTextClass}}">{{overlayText}}</div>`;
    },
    getCardInfoTemplate: function () {
        return `<div class="km-carousel-card-title-wrapper">
                <div class="km-carousel-card-title" title="{{title}}">{{title}}</div>
                <div class="km-carousel-card-title-extension">{{titleExt}}</div>
            </div>
            <div class="km-carousel-card-sub-title" title="{{subtitle}}">{{subtitle}}</div>
            <div class="{{cardDescriptionClass}}"><div class="km-carousel-card-description" title="{{description}}">{{description}}</div></div>`;
    },
    getFormTemplate: function () {
        return `<div class="mck-msg-box-rich-text-container mck-form-template-container" data-hidePostFormSubmit="{{hidePostFormSubmit}}">
                <form class="km-btn-hidden-form mck-actionable-form" action="{{actionUrl}}" method="post" data-msg-key={{msgKey}} >
                    <div class="mck-form-template-wrapper {{#isHideFormContainer}}n-vis{{/isHideFormContainer}}">
                        {{#payload}}
                            {{#.}}
                                {{#supported}}
                                    {{#radio}}
                                        <p class="mck-radio-group-title">{{title}}</p>
                                        <div>
                                        <div class="mck-form-radio-wrapper" style="margin-bottom:0px">
                                        {{#options}}
                                        <div class="mck-radio-input-container">
                                            <input id="{{label}} {{msgKey}}" type="{{type}}" name="{{name}}" value="{{value}}" data-regex="{{validation.regex}}" data-error-text="{{validation.errorText}}" {{#selected}}checked{{/selected}}>
                                            <label for="{{label}} {{msgKey}}" class="mck-form-label mck-radio-label"><b>{{label}}</b></label>   
                                        </div>                                 
                                    {{/options}} 
                                        </div>
                                        {{#validation}}
                                            <div class="mck-form-error-container mck-form-{{className}}-error-container n-vis">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12" fill="none">
                                                 <path d="M6 1C3.24 1 1 3.24 1 6C1 8.76 3.24 11 6 11C8.76 11 11 8.76 11 6C11 3.24 8.76 1 6 1ZM6 8.5C5.725 8.5 5.5 8.275 5.5 8V6C5.5 5.725 5.725 5.5 6 5.5C6.275 5.5 6.5 5.725 6.5 6V8C6.5 8.275 6.275 8.5 6 8.5ZM6.5 4.5H5.5V3.5H6.5V4.5Z" fill="#D64242"/>
                                                </svg>
                                                <span class="mck-form-error-text mck-form-error-{{className}}" style="margin-top:0px"></span>
                                           </div
                                    {{/validation}}     
                                        </div>
                                       
                                      
                                    {{/radio}}
                                    {{#checkbox}}
                                        <p class="mck-checkbox-group-title">{{title}}</p>
                                        <div class="{{checkboxContainerClass}}">
    
                                            {{#options}}
                                                <div class="{{checkboxClass}}">
                                                   <div class="mck-form-label-container">
                                                    {{#validation}}
                                                     <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                      <path d="M2.74006 5.18182L2.83807 3.45597L1.3892 4.40625L0.869318 3.50284L2.41619 2.72727L0.869318 1.9517L1.3892 1.0483L2.83807 1.99858L2.74006 0.272727H3.77557L3.68182 1.99858L5.13068 1.0483L5.65057 1.9517L4.09943 2.72727L5.65057 3.50284L5.13068 4.40625L3.68182 3.45597L3.77557 5.18182H2.74006Z" fill="#D64242"></path>
                                                     </svg>
                                                    {{/validation}}
                                                     <label class="mck-form-label mck-checkbox-label {{msgKey}}">
                                                        <input id="{{label}} {{msgKey}}" type="{{type}}" name="{{name}}" value="{{value}}" {{#selected}}checked{{/selected}}>
                                                        <span>
                                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <rect width="18" height="18" rx="9" fill="#00A4BF"/>
                                                                <path d="M7.4001 10.9499L5.3001 8.8499L4.6001 9.5499L7.4001 12.3499L13.4001 6.3499L12.7001 5.6499L7.4001 10.9499Z" fill="white"/>
                                                            </svg> {{label}}
                                                        </span>
                                                     </label>   
                                                    </div>
                                                    {{#validation}}
                                                    <div class="mck-form-error-container mck-form-{{className}}-error-container n-vis">
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12" fill="none">
                                                       <path d="M6 1C3.24 1 1 3.24 1 6C1 8.76 3.24 11 6 11C8.76 11 11 8.76 11 6C11 3.24 8.76 1 6 1ZM6 8.5C5.725 8.5 5.5 8.275 5.5 8V6C5.5 5.725 5.725 5.5 6 5.5C6.275 5.5 6.5 5.725 6.5 6V8C6.5 8.275 6.275 8.5 6 8.5ZM6.5 4.5H5.5V3.5H6.5V4.5Z" fill="#D64242"/>
                                                      </svg>
                                                      <span class="mck-form-error-text mck-form-error-{{className}}"></span>
                                                    </div>
                                                {{/validation}}
                                                </div>                                     
                                            {{/options}}
                                        </div>
                                    {{/checkbox}}
                                    {{#text}}
                                        <div class="mck-form-text-wrapper">
                                            <div class="mck-form-label-container">
                                            {{#validation}}
                                              <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                               <path d="M2.74006 5.18182L2.83807 3.45597L1.3892 4.40625L0.869318 3.50284L2.41619 2.72727L0.869318 1.9517L1.3892 1.0483L2.83807 1.99858L2.74006 0.272727H3.77557L3.68182 1.99858L5.13068 1.0483L5.65057 1.9517L4.09943 2.72727L5.65057 3.50284L5.13068 4.40625L3.68182 3.45597L3.77557 5.18182H2.74006Z" fill="#D64242"></path>
                                              </svg>
                                            {{/validation}}
                                              <label for="{{label}}" class="mck-form-label"><b>{{label}}</b></label>
                                            </div>
                                            <input type="{{type}}" placeholder="{{placeholder}}" name="{{label}}" data-regex="{{validation.regex}}" {{#readonly}}readonly{{/readonly}} data-error-text="{{validation.errorText}}">
                                            {{#validation}}
                                              <div class="mck-form-error-container mck-form-{{className}}-error-container n-vis">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12" fill="none">
                                                 <path d="M6 1C3.24 1 1 3.24 1 6C1 8.76 3.24 11 6 11C8.76 11 11 8.76 11 6C11 3.24 8.76 1 6 1ZM6 8.5C5.725 8.5 5.5 8.275 5.5 8V6C5.5 5.725 5.725 5.5 6 5.5C6.275 5.5 6.5 5.725 6.5 6V8C6.5 8.275 6.275 8.5 6 8.5ZM6.5 4.5H5.5V3.5H6.5V4.5Z" fill="#D64242"/>
                                                </svg>
                                                <span class="mck-form-error-text mck-form-error-{{className}}"></span>
                                              </div>
                                            {{/validation}}
                                        </div>
                                    {{/text}}
                                    {{#textarea}}
                                         <div class="mck-form-textarea-wrapper">
                                           <div class="mck-form-label-container">
                                            {{#validation}}
                                            <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                             <path d="M2.74006 5.18182L2.83807 3.45597L1.3892 4.40625L0.869318 3.50284L2.41619 2.72727L0.869318 1.9517L1.3892 1.0483L2.83807 1.99858L2.74006 0.272727H3.77557L3.68182 1.99858L5.13068 1.0483L5.65057 1.9517L4.09943 2.72727L5.65057 3.50284L5.13068 4.40625L3.68182 3.45597L3.77557 5.18182H2.74006Z" fill="#D64242"></path>
                                            </svg>
                                            {{/validation}}
                                            <label class="mck-form-label" for="{{name}}">{{title}}</label>
                                            </div>
                                            <textarea name="{{name}}" rows="{{rows}}" cols="{{cols}}" placeholder="{{placeholder}}" data-regex= "{{validation.regex}}" data-error-text="{{validation.errorText}}"></textarea>
                                            {{#validation}}
                                              <div class="mck-form-error-container mck-form-{{className}}-error-container n-vis">
                                               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12" fill="none">
                                                <path d="M6 1C3.24 1 1 3.24 1 6C1 8.76 3.24 11 6 11C8.76 11 11 8.76 11 6C11 3.24 8.76 1 6 1ZM6 8.5C5.725 8.5 5.5 8.275 5.5 8V6C5.5 5.725 5.725 5.5 6 5.5C6.275 5.5 6.5 5.725 6.5 6V8C6.5 8.275 6.275 8.5 6 8.5ZM6.5 4.5H5.5V3.5H6.5V4.5Z" fill="#D64242"/>
                                               </svg>
                                               <span class="mck-form-error-text mck-form-error-{{className}}"></span>
                                              </div>
                                            {{/validation}}
                                        </div>
                                    {{/textarea}}
                                    {{#dropdown}}
                                        <div class="mck-form-dropdown-wrapper">
                                          <div class="mck-form-label-container">
                                           {{#validation}}
                                            <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                             <path d="M2.74006 5.18182L2.83807 3.45597L1.3892 4.40625L0.869318 3.50284L2.41619 2.72727L0.869318 1.9517L1.3892 1.0483L2.83807 1.99858L2.74006 0.272727H3.77557L3.68182 1.99858L5.13068 1.0483L5.65057 1.9517L4.09943 2.72727L5.65057 3.50284L5.13068 4.40625L3.68182 3.45597L3.77557 5.18182H2.74006Z" fill="#D64242"></path>
                                            </svg>
                                            {{/validation}}
                                             <label for="{{name}}" class="mck-form-label">{{title}}</label><br>
                                            </div>
                                            <select name="{{name}}" data-error-text = "{{validation.errorText}}">
                                                {{#options}}
                                                    {{#selected}}{{#disabled}}
                                                        <option value="{{value}}" selected disabled hidden>{{label}}</option>
                                                    {{/disabled}}{{/selected}}
                                                    {{#selected}}{{^disabled}}
                                                        <option value="{{value}}" selected>{{label}}</option>
                                                    {{/disabled}}{{/selected}}
                                                    {{^selected}}
                                                        <option value="{{value}}">{{label}}</option>
                                                    {{/selected}}
                                                {{/options}}    
                                            </select>
                                            {{#validation}}
                                               <div class="mck-form-error-container mck-form-{{className}}-error-container n-vis">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12" fill="none">
                                                 <path d="M6 1C3.24 1 1 3.24 1 6C1 8.76 3.24 11 6 11C8.76 11 11 8.76 11 6C11 3.24 8.76 1 6 1ZM6 8.5C5.725 8.5 5.5 8.275 5.5 8V6C5.5 5.725 5.725 5.5 6 5.5C6.275 5.5 6.5 5.725 6.5 6V8C6.5 8.275 6.275 8.5 6 8.5ZM6.5 4.5H5.5V3.5H6.5V4.5Z" fill="#D64242"/>
                                                 </svg>
                                                <span class="mck-form-error-text mck-form-error-{{className}}"></span>
                                               </div>
                                            {{/validation}}
                                        </div>
                                    {{/dropdown}}
                                    {{#hidden}}
                                            <input type="{{type}}" name="{{name}}" value="{{value}}" >
                                    {{/hidden}}
                                {{/supported}}
                                {{^supported}}
                                    <div class="mck-form-text-wrapper">
                                        <div class="mck-form-label-container">
                                         {{#validation}}
                                        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                         <path d="M2.74006 5.18182L2.83807 3.45597L1.3892 4.40625L0.869318 3.50284L2.41619 2.72727L0.869318 1.9517L1.3892 1.0483L2.83807 1.99858L2.74006 0.272727H3.77557L3.68182 1.99858L5.13068 1.0483L5.65057 1.9517L4.09943 2.72727L5.65057 3.50284L5.13068 4.40625L3.68182 3.45597L3.77557 5.18182H2.74006Z" fill="#D64242"></path>
                                        </svg>
                                        {{/validation}}
                                        <label for="{{label}}" class="mck-form-label"><b>{{label}}</b></label>
                                        </div>
                                        <input type="{{type}}" placeholder="{{placeholder}}" name="{{label}}" data-regex="{{validation.regex}}" data-error-text="{{validation.errorText}}" >
                                        {{#validation}}
                                             <div class="mck-form-error-container mck-form-{{className}}-error-container n-vis">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12" fill="none">
                                                 <path d="M6 1C3.24 1 1 3.24 1 6C1 8.76 3.24 11 6 11C8.76 11 11 8.76 11 6C11 3.24 8.76 1 6 1ZM6 8.5C5.725 8.5 5.5 8.275 5.5 8V6C5.5 5.725 5.725 5.5 6 5.5C6.275 5.5 6.5 5.725 6.5 6V8C6.5 8.275 6.275 8.5 6 8.5ZM6.5 4.5H5.5V3.5H6.5V4.5Z" fill="#D64242"/>
                                                </svg>
                                                <span class="mck-form-error-text mck-form-error-{{className}}"></span>
                                              </div>
                                            {{/validation}}
                                    </div>
                                {{/supported}}
                            {{/.}}
                        {{/payload}}
                    </div>
                        {{#buttons}}
                            <button type="{{type}}" class="km-cta-button km-custom-widget-text-color km-custom-widget-border-color mck-form-submit-button" data-requesttype="{{requestType}}" title="{{message}}" data-post-back-to-kommunicate="{{postBackToKommunicate}}" data-post-back-as-message="{{postFormDataAsMessage}}" data-hidePostFormSubmit="{{hidePostFormSubmit}}">{{label}}</button>      
                        {{/buttons}}   
                </form>   
            </div>`;
    },
    getVideoTemplate: function () {
        return `
        {{#payload}}  
        <div class= "mck-rich-video-container">
            <a href="{{displayUrl}}" target="_blank" rel="noopener noreferrer">{{displayUrl}}</a>
        {{#source}}
            <iframe 
                class="mck-rich-video-iframe"
                width="{{width}}" 
                height="{{height}}" 
                src="{{iframeSrc}}"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                referrerpolicy="strict-origin-when-cross-origin"
                title="Video player"
            ></iframe>
        {{/source}}
        {{^source}}
        <video width="{{width}}" height="{{height}}" controls class= "mck-rich-video">
             <source src="{{url}}" type="{{type||''}}">
         </video>
        {{/source}}
        {{#caption}}
        <div class="km-template-video-caption-wrapper" style="width:{{width}};">
           <p class="km-template-video-caption">{{caption}}</p>
        </div>
        {{/caption}}
        </div>
       {{/payload}}`;
    },
    getFormDataMessageTemplate: function (data) {
        var element = '';
        Object.keys(data).forEach(function (key) {
            var value = data[key];
            value && (element += '<span>' + key + ' : ' + value + '</span><br>');
        });
        return element;
    },
};

Kommunicate.markup.buttonContainerTemplate = function (options) {
    var containerMarkup = '<div class="km-cta-multi-button-container">';
    var payload = JSON.parse(options.payload);
    var formData = options.formData || '';
    var buttonClass = 'km-add-more-rooms ';
    buttonClass +=
        payload.length == 1
            ? 'km-cta-button-1 km-custom-widget-border-color'
            : payload.length == 2
            ? 'km-cta-button-2 km-custom-widget-border-color'
            : 'km-cta-button-many km-custom-widget-border-color';
    var requestType = options.requestType;
    for (var i = 0; i < payload.length; i++) {
        payload[i].replyMetadata =
            typeof payload[i].replyMetadata == 'object'
                ? JSON.stringify(payload[i].replyMetadata)
                : payload[i].replyMetadata;
        containerMarkup += Kommunicate.markup.getButtonTemplate(
            payload[i],
            requestType,
            buttonClass
        );
        if (payload[i].type != 'link' && formData) {
            formData = JSON.parse(formData);
            Object.keys(formData).length > 0 &&
                (containerMarkup += Kommunicate.markup.getFormMarkup(options));
        }
    }
    containerMarkup += '</div>';
    return containerMarkup;
};
Kommunicate.markup.getFormMarkup = function (options) {
    var payload =
        typeof options.payload == 'string' ? JSON.parse(options.payload) : options.payload;
    var formData =
        payload && options.formData ? JSON.parse(options.formData || '{}') : payload.formData || '';
    var formMarkup = '';
    if (formData) {
        formMarkup +=
            "<form method ='post'  target='_blank' class= 'km-btn-hidden-form' action =" +
            (options.formAction || payload.formAction) +
            '>';
        for (var key in formData) {
            if (formData.hasOwnProperty(key)) {
                formMarkup +=
                    '<input type="hidden" name ="' + key + '" value="' + formData[key] + '" />';
            }
        }
        formMarkup += '</form>';
        return formMarkup;
    }
};
Kommunicate.markup.quickRepliesContainerTemplate = function (options, template) {
    var payload = JSON.parse(options.payload);
    var buttonClass;
    var hidePostCTA = kommunicate._globals.hidePostCTA;
    switch (template) {
        case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.QUICK_REPLY:
            buttonClass = 'km-quick-rpy-btn km-custom-widget-border-color ';
            break;
        case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.CARD_CAROUSEL:
            buttonClass = 'km-carousel-card-button km-carousel-card-quick-rpy-button ';
            break;
    }
    template == KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.QUICK_REPLY &&
        (buttonClass +=
            payload.length == 1
                ? 'km-cta-button-1'
                : payload.length == 2
                ? 'km-cta-button-2'
                : 'km-cta-button-many');

    for (var i = 0; i < payload.length; i++) {
        payload[i].replyMetadata =
            typeof payload[i].replyMetadata == 'object'
                ? JSON.stringify(payload[i].replyMetadata)
                : payload[i].replyMetadata;
        payload[i].buttonClass = buttonClass;
        payload[i].hidePostCTA = hidePostCTA;
    }
    return Mustache.to_html(Kommunicate.markup.getQuickRepliesTemplate(), {
        payload: payload,
    });
};

Kommunicate.markup.getHotelRoomPaxInfoTemplate = function (roomCount) {
    return (
        `<div class = "km-rich-text-default-container">
            <div class="km-room-person-selector-container">` +
        Kommunicate.markup.getSingleRoomPaxInfo(roomCount) +
        `</div>
            <hr>
            <div class="km-add-room-button-container">
                <button  class="km-add-more-rooms km-btn-add-more-rooms" data-roomcount=1>ADD ROOM</button>
                <button class=" km-add-more-rooms km-done-button">DONE</button>
            </div>
        </div>`
    );
};

Kommunicate.markup.getHotelCardContainerTemplate = function (hotelList, sessionId) {
    var hotelListMarkup = '';
    for (var i = 0; i < hotelList.length; i++) {
        hotelListMarkup =
            hotelListMarkup + Kommunicate.markup.getHotelCardTemplate(hotelList[i], sessionId);
    }
    return `<div class="km-card-message-container  km-div-slider">` + hotelListMarkup + `</div>`;
};

Kommunicate.markup.getRoomDetailsContainerTemplate = function (roomList, sessionId) {
    var roomDetails = roomList.HotelRoomsDetails;
    var roomListMarkup = '';
    for (var i = 0; i < roomDetails.length; i++) {
        roomListMarkup =
            roomListMarkup + Kommunicate.markup.getRoomDetailTemplate(roomDetails[i], sessionId);
    }
    return `<div class="km-card-room-detail-container  km-div-slider">` + roomListMarkup + `</div>`;
};
Kommunicate.markup.getListContainerMarkup = function (metadata) {
    const buttonClass = { link: 'km-link-button', submit: '' };
    if (metadata && metadata.payload) {
        var json = JSON.parse(metadata.payload);
        if (json.headerImgSrc) {
            json.headerImgSrc =
                '<div class="km-faq-list--header_text-img"><img src= "' +
                json.headerImgSrc +
                '"  alt = "image" /></div>';
        }
        if (json.headerText) {
            json.headerText = '<p class="km-faq-list--header_text">' + json.headerText + '</p>';
        }
        if (json.elements && json.elements.length) {
            json.elementClass = 'vis';
            json.elements = json.elements.map(function (item) {
                // checking for image
                if (item.imgSrc) {
                    item.imgSrc = '<img src ="' + item.imgSrc + '" />';
                }
                item.description &&
                    (item.description = kommunicateCommons.removeHtmlTag(item.description));
                if (item.action && item.action.replyMetadata) {
                    item.replyMetadata =
                        typeof item.action.replyMetadata == 'object'
                            ? JSON.stringify(item.action.replyMetadata)
                            : item.action.replyMetadata;
                }
                //checking for type
                if (item.action && item.action.type == 'link') {
                    item.href = item.action.url;
                    item.action.openLinkInNewTab == false
                        ? (item.target = 'target="_parent"')
                        : (item.target = 'target="_blank"');
                    item.hidePostCTA = false;
                } else {
                    item.href = 'javascript:void(0)';
                    item.target = '';
                    item.action && (item.updateLanguage = item.action.updateLanguage);
                    item.hidePostCTA = kommunicate._globals.hidePostCTA;
                }
                item.handlerClass = 'km-list-item-handler';
                if (item.action) {
                    item.dataType = item.action.type || '';
                    item.dataReply = item.action.text || item.title || '';
                }
                item.dataArticleId = item.articleId || '';
                item.dataSource = item.source || '';
                // TODO : add post url in data.
                return item;
            });
        } else {
            json.elementClass = 'n-vis';
        }
        if (json.buttons && json.buttons.length) {
            json.buttons = json.buttons.map(function (button) {
                button.target = Kommunicate.markup.getLinkTarget(button.action);
                button.buttonClass = buttonClass[button.action.type];
                if (button.action && button.action.replyMetadata) {
                    button.replyMetadata =
                        typeof button.action.replyMetadata == 'object'
                            ? JSON.stringify(button.action.replyMetadata)
                            : button.action.replyMetadata;
                }
                button.action && (button.updateLanguage = button.action.updateLanguage);
                if (
                    !button.action ||
                    button.action.type == 'quick_reply' ||
                    button.action.type == 'submit'
                ) {
                    button.href = 'javascript:void(0)';
                    button.handlerClass = 'km-list-item-handler';
                } else {
                    button.href = encodeURI(button.action.url);
                }

                if (button.action.type == 'quick_reply') {
                    button.hidePostCTA = kommunicate._globals.hidePostCTA;
                } else {
                    button.hidePostCTA = false;
                }

                button.dataType = button.action ? button.action.type : '';

                button.dataReply =
                    button.action && button.action.text ? button.action.text : button.name || '';
                // TODO : add post url in data.
                return button;
            });
        }

        return Mustache.to_html(Kommunicate.markup.getListMarkup(), json);
    } else {
        return '';
    }
};
Kommunicate.markup.getDialogboxContainer = function (metadata) {
    if (metadata && metadata.payload) {
        var json = JSON.parse(metadata.payload);

        json.buttons.length > 0 &&
            json.buttons.forEach(function (element) {
                element.replyMetadata =
                    typeof element.replyMetadata == 'object'
                        ? JSON.stringify(element.replyMetadata)
                        : element.replyMetadata;
            });
        return Mustache.to_html(Kommunicate.markup.getDialogboxTemplate(), json);
    }
    return '';
};
Kommunicate.markup.getImageContainer = function (options) {
    if (options && options.payload) {
        var payload = typeof options.payload == 'string' ? JSON.parse(options.payload) : {};
        options.payload = JSON.parse(JSON.stringify(payload));
        options.payload?.forEach((payload) => {
            payload.type = payload.url?.split('.').pop()?.toLowerCase();
        });
        return Mustache.to_html(Kommunicate.markup.getImageTemplate(), options);
    }
    return '';
};
Kommunicate.markup.getHtmlMessageMarkups = function (message) {
    if (message && message.source == KommunicateConstants.MESSAGE_SOURCE.MAIL_INTERCEPTOR) {
        var uniqueId = 'km-email-' + message.groupId + '-' + message.key;
        return `<mck-email-rich-message class='km-mail-fixed-view ${uniqueId} mck-eml-container' id='${uniqueId}' ></mck-email-rich-message>`;
    }
    return '';
};
Kommunicate.markup.getActionableFormMarkup = function (options) {
    var action = {};
    var data = {};
    var isActionObject = false;
    if (options && options.payload) {
        var payload = typeof options.payload == 'string' ? JSON.parse(options.payload) : {};
        options.payload = payload;
        options.buttons = [];
        if (kommunicateCommons.isObject(options.payload[0].data)) {
            options.payload = options.payload.map(function (item) {
                data = {};
                data.type = item.type;
                for (var key in item.data) {
                    if (item.data.hasOwnProperty(key)) {
                        data[key] = item.data[key];
                    }
                }
                return data;
            });
        }
        options.checkboxClass = Kommunicate._globals.checkboxAsMultipleButton
            ? 'checkbox-as-button'
            : 'checkbox-container';
        options.checkboxContainerClass = Kommunicate._globals.checkboxAsMultipleButton
            ? 'mck-form-checkbox-as-button-wrapper'
            : 'mck-form-checkbox-wrapper';
        options.payload.forEach(function (item, index) {
            if (item.type == 'submit') {
                isActionObject = kommunicateCommons.isObject(item.action);
                options.actionUrl =
                    item.formAction ||
                    (isActionObject && item.action.formAction) ||
                    'javascript:void(0);';
                options.requestType =
                    item.requestType || (isActionObject && item.action.requestType);
                options.postBackToKommunicate =
                    (isActionObject && item.action.postBackToKommunicate) || false;
                options.postFormDataAsMessage =
                    (isActionObject && item.action.postFormDataAsMessage) || false;
                options.label = item.name || item.label;
                options.message = item.message || (isActionObject && item.action.message);
                options.payload[index].className = 'km-cta-button';
                options.buttons.push(item);
                options.payload.splice(index, 1);
                options.hidePostFormSubmit = Kommunicate._globals.hidePostFormSubmit;
            } else {
                options.payload[index].supported =
                    KommunicateConstants.FORM_SUPPORTED_FIELDS.indexOf(item.type) != -1;
                options.payload[index][item.type] = true;

                if (item.readonly) {
                    options.payload[index].readonly = true; // Add readonly to the payload
                }

                try {
                    options.payload[index].className = (item.label || item.name)
                        .toLowerCase()
                        .replace(/ +/g, '');
                } catch (e) {
                    console.log(e);
                }
            }
        });
        // if all form field have type hidden
        options.isHideFormContainer = options.payload.every(function (opt) {
            return opt.type === 'hidden';
        });

        return Mustache.to_html(Kommunicate.markup.getFormTemplate(), options);
    }
};
Kommunicate.markup.getCarouselMarkup = function (options) {
    var cardList = [];
    var cardHtml = {};
    var image = true;
    var footer, header, info;
    var buttonClass;
    var headerOverlayTextClass, headerImageClass, carouselHeaderClass, carouselInfoWrapperClass;
    var createCardFooter = function (buttons) {
        var cardFooter = '';
        var requestType;
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].action.type == 'quickReply') {
                buttons[i].action.payload.title =
                    buttons[i].action.payload.title || buttons[i].name;
                buttons[i].action.payload = JSON.stringify([buttons[i].action.payload]);
                cardFooter = cardFooter.concat(
                    Kommunicate.markup.quickRepliesContainerTemplate(
                        buttons[i].action,
                        KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.CARD_CAROUSEL
                    )
                );
            } else if (buttons[i].action.type == 'link' || buttons[i].action.type == 'submit') {
                buttons[i].action.type == 'link' &&
                    (buttons[i].action.payload['openLinkInNewTab'] =
                        typeof buttons[i].action.openLinkInNewTab == 'undefined'
                            ? true
                            : buttons[i].action.openLinkInNewTab);
                requestType = buttons[i].action.payload.requestType
                    ? buttons[i].action.payload.requestType
                    : '';
                buttons[i].action.payload['type'] = buttons[i].action.type;
                buttons[i].action.payload['buttonClass'] = 'km-carousel-card-button';
                buttons[i].action.payload['name'] = buttons[i].name;
                cardFooter = cardFooter.concat(
                    Kommunicate.markup.getButtonTemplate(
                        buttons[i].action.payload,
                        requestType,
                        'km-carousel-card-button'
                    )
                );
                var formData = buttons[i].action.payload.formData;
                buttons[i].action.payload.formAction &&
                    (buttons[i].action['formAction'] = buttons[i].action.payload.formAction);
                buttons[i].action.payload = JSON.stringify([buttons[i].action.payload]);
                formData && (buttons[i].action['formData'] = JSON.stringify(formData));
                formData &&
                    (cardFooter = cardFooter.concat(
                        Kommunicate.markup.getFormMarkup(buttons[i].action)
                    ));
            }
        }
        return cardFooter;
    };
    if (options && options.payload) {
        var cards = typeof options.payload == 'string' ? JSON.parse(options.payload) : [];
        options.payload = cards;
        for (var i = 0; i < cards.length; i++) {
            var item = cards[i];
            item.header &&
                (headerOverlayTextClass = item.header.overlayText
                    ? item.header.imgSrc
                        ? 'km-carousel-card-overlay-text '
                        : 'km-carousel-card-overlay-text  km-carousel-card-overlay-text-without-img'
                    : 'n-vis');
            carouselHeaderClass = item.header
                ? item.header.imgSrc
                    ? 'km-carousel-card-header-with-img'
                    : 'km-carousel-card-header-without-img'
                : 'n-vis';
            carouselInfoWrapperClass = item.header
                ? ''
                : 'km-carousel-card-info-wrapper-without-header';
            carouselInfoWrapperClass = item.buttons
                ? carouselInfoWrapperClass.concat(' km-carousel-card-info-wrapper-with-buttons')
                : '';
            item.header &&
                (headerImageClass = item.header.imgSrc ? 'km-carousel-card-img' : 'n-vis');
            item.header && (item.header['headerOverlayTextClass'] = headerOverlayTextClass);
            item.header && (item.header['headerImageClass'] = headerImageClass);
            item['cardDescriptionClass'] = item.description
                ? 'km-carousel-card-description-wrapper'
                : 'n-vis';
            cardHtml['carouselHeaderClass'] = carouselHeaderClass;
            cardHtml['carouselInfoWrapperClass'] = carouselInfoWrapperClass;
            cardHtml['containerClass'] = cards.length > 1 ? '' : 'km-single-card';
            item.header && (cardHtml.header = Kommunicate.markup.cardHeader(item.header));
            cardHtml.info = Kommunicate.markup.cardInfo(item);
            item.buttons && (cardHtml.footer = createCardFooter(item.buttons));
            cardList[i] = $applozic.extend([], cardHtml);
            cardList[i].url = item.url;
        }
    }
    var cardCarousel = { payload: cardList };

    return Mustache.to_html(Kommunicate.markup.getCarouselTemplate(), cardCarousel);
};
Kommunicate.markup.cardHeader = function (item) {
    return Mustache.to_html(Kommunicate.markup.getCardHeaderTemplate(), item);
};
Kommunicate.markup.cardInfo = function (item) {
    return Mustache.to_html(Kommunicate.markup.getCardInfoTemplate(), item);
};
Kommunicate.markup.getLinkTarget = function (buttonInfo) {
    buttonInfo.openLinkInNewTab =
        typeof buttonInfo.openLinkInNewTab != 'undefined' && !buttonInfo.openLinkInNewTab
            ? buttonInfo.openLinkInNewTab
            : true;
    return buttonInfo.openLinkInNewTab ? '_blank' : '_parent';
};

Kommunicate.markup.getGenericButtonMarkup = function (metadata) {
    var buttonPayloadList = metadata.payload ? JSON.parse(metadata.payload) : [];
    var buttonContainerHtml = '<div class="km-cta-multi-button-container">';
    var buttonClass =
        ' km-custom-widget-border-color ' +
        (buttonPayloadList.length == 1
            ? 'km-cta-button-1'
            : buttonPayloadList.length == 2
            ? 'km-cta-button-2'
            : 'km-cta-button-many');
    for (var i = 0; i < buttonPayloadList.length; i++) {
        var singlePayload = buttonPayloadList[i];
        typeof (singlePayload.replyMetadata == 'object') &&
            (singlePayload.replyMetadata = JSON.stringify(singlePayload.replyMetadata));
        !singlePayload.type &&
            singlePayload.action &&
            (singlePayload.type = singlePayload.action.type);
        !singlePayload.replyMetadata &&
            singlePayload.action &&
            singlePayload.action.replyMetadata &&
            kommunicateCommons.isObject(singlePayload.action.replyMetadata) &&
            (singlePayload.replyMetadata = JSON.stringify(singlePayload.action.replyMetadata));
        singlePayload.hidePostCTA = false;
        if (singlePayload.type == 'link' || singlePayload.type == 'submit') {
            singlePayload.url =
                buttonPayloadList[i].action.url || buttonPayloadList[i].action.formAction;
            singlePayload.openLinkInNewTab = buttonPayloadList[i].action.openLinkInNewTab;
            buttonClass += buttonClass + ' km-add-more-rooms';
            buttonContainerHtml += Kommunicate.markup.getButtonTemplate(
                singlePayload,
                singlePayload.action.requestType,
                buttonClass
            );
            singlePayload.type == 'submit' &&
                (buttonContainerHtml += Kommunicate.markup.getFormMarkup({
                    payload: singlePayload.action,
                }));
        } else if (singlePayload.type == 'quickReply' || singlePayload.type == 'suggestedReply') {
            singlePayload.buttonClass = 'km-quick-rpy-btn ' + buttonClass;
            singlePayload.message = singlePayload.action.message || singlePayload.name;
            singlePayload.type == 'quickReply' &&
                (singlePayload.hidePostCTA = kommunicate._globals.hidePostCTA);
            buttonContainerHtml += Mustache.to_html(
                Kommunicate.markup.getGenericSuggestedReplyButton(),
                singlePayload
            );
        } else if (singlePayload.action && singlePayload.action.type == 'submit') {
        }
    }
    return buttonContainerHtml + '</div>';
};
Kommunicate.markup.getVideoMarkup = function (options) {
    function toSeconds(t) {
        // supports 1h2m3s, 2m3s, 75s, or plain seconds
        if (!t) return null;
        if (/^\d+$/.test(t)) return parseInt(t, 10);
        var h = 0,
            m = 0,
            s = 0;
        var mh = t.match(/(\d+)h/);
        var mm = t.match(/(\d+)m/);
        var ms = t.match(/(\d+)s/);
        if (mh) h = parseInt(mh[1], 10);
        if (mm) m = parseInt(mm[1], 10);
        if (ms) s = parseInt(ms[1], 10);
        var total = h * 3600 + m * 60 + s;
        return total || null;
    }

    function normalizeYouTubeUrl(url) {
        try {
            var original = url;
            var u = new URL(url);
            var host = u.hostname.replace(/^www\./, '');
            var id = '';
            var params = new URLSearchParams(u.search);
            // Extract start time if present
            var start = params.get('start') || params.get('t');
            var startSec = toSeconds(start);

            if (host === 'youtu.be') {
                id = u.pathname.split('/')[1] || '';
            } else if (host === 'youtube.com' || host === 'm.youtube.com') {
                if (u.pathname.indexOf('/watch') === 0) {
                    id = params.get('v') || '';
                } else if (u.pathname.indexOf('/embed/') === 0) {
                    id = u.pathname.split('/embed/')[1] || '';
                } else if (u.pathname.indexOf('/shorts/') === 0) {
                    id = u.pathname.split('/shorts/')[1] || '';
                }
            }

            // handle playlist
            var list = params.get('list');
            var embedBase = 'https://www.youtube-nocookie.com';
            var embedUrl = '';
            if (list && !id) {
                embedUrl = embedBase + '/embed/videoseries?list=' + encodeURIComponent(list);
            } else if (id) {
                // remove any extra path/query fragments from id
                id = id.split('?')[0].split('&')[0];
                embedUrl = embedBase + '/embed/' + id;
                var qp = [];
                if (list) qp.push('list=' + encodeURIComponent(list));
                if (startSec != null) qp.push('start=' + startSec);
                // modest branding for cleaner UI
                qp.push('rel=0');
                qp.push('modestbranding=1');
                qp.push('playsinline=1');
                // If parent site strips referrer, pass explicit origin for YT config
                try {
                    var ref = document.referrer ? new URL(document.referrer).origin : '';
                    if (ref) {
                        qp.push('origin=' + encodeURIComponent(ref));
                        qp.push('enablejsapi=1');
                    }
                } catch (e) {}
                if (qp.length) embedUrl += '?' + qp.join('&');
            }

            return embedUrl || original;
        } catch (e) {
            return url; // fallback to original on parse issues
        }
    }

    if (options && options.payload) {
        var payload = typeof options.payload == 'string' ? JSON.parse(options.payload) : {};
        for (var i = 0; i < payload.length; i++) {
            var video = payload[i];
            // ensure dimensions always present for template
            video.width = video.width || '100%';
            video.height = video.height || '250px';

            // Preserve original URL for display while normalizing iframe source when needed
            video.displayUrl = video.url;
            video.iframeSrc = video.url;

            if (video.source && typeof video.url === 'string') {
                var lower = video.url.toLowerCase();
                if (
                    lower.indexOf('youtube.com') !== -1 ||
                    lower.indexOf('youtu.be') !== -1
                ) {
                    video.iframeSrc = normalizeYouTubeUrl(video.url);
                }
            }
        }
        options.payload = payload;
        return Mustache.to_html(Kommunicate.markup.getVideoTemplate(), options);
    }
};
