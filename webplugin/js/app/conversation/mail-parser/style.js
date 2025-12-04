kmMailProcessor.getEmailRichMsgStyle = function () {
    return `
            *::-webkit-scrollbar { 
               -webkit-appearance: none; 
            }  *::-webkit-scrollbar:vertical { 
               width: 4px; 
            } *::-webkit-scrollbar:horizontal {
               height: 4px; 
            } *::-webkit-scrollbar-thumb {
               background-color: rgba(0, 0, 0, 0.2);
               border-radius: 5px; 
            } *::-webkit-scrollbar-track {
               background: rgba(255, 255, 255, 0.08);
            } *::-webkit-scrollbar-corner {
               background: rgba(0,0,0,0); 
            }
            .km-email-rich-msg-container{
              color: #000000;
              font-size: 14px;
              min-height: 100px;
              margin: 0;
              padding: 10px 14px 12px;
              font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
              background: white;
              border: 1px solid #E7EAF2;
              border-radius: 5px; 
            //   border-top: none;
              overflow: scroll;
            }
            .km-email-rich-msg-container.km-email-source-mail-interceptor{
               border: none;
               background: transparent;
               padding: 0 3px 12px;
            } 
            .eml-container {
               display: flex;
               flex-direction: column;
               gap: 6px;
               background: #bfeafc;
               padding: 13px;
               border-radius: 5px;
               max-width: 300px
            }  
            .eml-image-container img,
            .eml-image-container video {
               width: 100%;
            }
            .km-email-heading{
               margin: 8px 0;
            }   
            .eml-container .mck-file-name{
              display: flex;
              gap: 6px;
            }
            .km-email-to-cc-container{
               font-size: 14px;
               margin-bottom: 0;
               display: flex;
               flex-direction: column;
               gap: 6px;
            } 
            .km-email-show-more-container{
               display: flex;
            }    
            .km-email-show-less-container .km-email-to-heading{
               width: 100%;
               white-space: normal;
               margin-bottom: 10px;
            }   
            .km-email-to-cc-container .km-email-to-heading {
               overflow: hidden;
            }    
            .km-email-to-cc-container .km-email-to-heading span,
            .km-email-to-cc-container .km-email-cc-heading span {
               color: #565656 !important;
            }
            .km-email-to-cc-container .km-email-cc-heading {
               margin: 8px 0;
            }    
            .km-email-show-more-container  .km-email-to-heading{
               width: 70%;
               text-overflow: ellipsis;
               white-space: nowrap;
            }
            .km-email-show-more-btn{
               background: none;
               border: none;
               padding: 0px;
               font-style: inherit;
               font-variant: inherit;
               font-stretch: inherit;
               font-size: inherit;
               line-height: inherit;
               font-family: inherit;
               font-optical-sizing: inherit;
               font-size-adjust: inherit;
               font-kerning: inherit;
               font-feature-settings: inherit;
               font-variation-settings: inherit;
               cursor: pointer;
               outline: inherit;
               color: rgb(85, 83, 183);
               font-weight: 500;
               display: inline;
               margin-left: 3px;
               text-decoration: underline;
               font-size: 13px;
            }
            .km-email-show-more-btn {
               margin-bottom: 6px;
            }    
            .n-vis{
               display: none;
            }
            .km-eml-loading {
                height: 100%;
                align-items: center;
                display: flex;
                justify-content: center;
            }  
            .eml-attachment-link{
	            width: 90%;
               white-space: break-spaces;
               overflow: hidden;
               text-overflow: ellipsis;
            } 
            .km-email-from-heading {
               margin-bottom: 10px;
               display: flex;
               gap: 10px
            }
            .km-email-from-heading p {
               color: #565656 !important;
               margin: 0
            }   
            .km-email-attachment-heading {
               border-top: 1px solid #DCDCDC;
               padding-top: 10px;
            }
            .km-email-attachment-container {
               display: flex;
               flex-wrap: wrap;
               flex-direction: row;
               gap: 6px;
               align-items: flex-start;
            }         
    `;
};
