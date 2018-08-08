import {getConfig} from '../../config/config';
import CommonUtils from '../../utils/CommonUtils';
import './quickReply.css';
import { getAllSuggestions, getSuggestionsByAppId} from '../../utils/kommunicateClient';
const quickReply = {

  edValueKeyPress: function(quickReplyIndex) {
    var autoCompleteFlag = false;
    var textBoxContent;
    var textInput;
    var dBox = document.getElementById('d-box');
    var textBox = document.getElementById("km-text-box");
    const text = quickReplyIndex;

    textBox.addEventListener('keyup', function(event) {
      var key = event.which || event.keyCode;
      var suggestion = "";
      if (key === 191 || key === 47 || autoCompleteFlag === true) { // 13 is enter
        autoCompleteFlag = true;
        textBoxContent = textBox.textContent;
        if ((textBoxContent).indexOf("/") !== -1 && textBoxContent.charAt(0) === "/") {
          dBox.style.display = 'block';
          textBoxContent = textBoxContent.replace(/\//g, "");
          if (text.length !== 0){
            for (var i = 0; i < text.length; i++) {
              if ((text[i].label).indexOf(textBoxContent) !== -1) {
              //  textInput = (text[i].label).split(' ').join('-');
                textInput = text[i].randomId.toString();
                suggestion = suggestion + "<div id= " + textInput + " class=\"d-pop auto-suggest-pro\"> <span class=\"auto_reply auto-suggest\"> " + "/" + text[i].label + "</span> <br/> <span class=\"auto_suggestion auto-suggest\">" + text[i].value + "</span> </div>\n";
              }
            }
          }
          else {
            var replyMessage = "Quickly reply to common user queries by setting up your";
            var link = "<div id=\"km-no-suggestion\" class=\" km-no-suggestion km-no-quick-reply \"> <span class=\"km-no-reply-heading km-no-suggestion\">You haven’t set up any quick replies yet</span> <br/><br/> <span class=\"km-no-reply-content auto_reply km-no-suggestion\">"+replyMessage+"</span> <span class=\" auto_suggestion km-no-reply-content km-no-reply-color km-quick-reply-link\">Quick replies</span></div>\n";
            suggestion = link;
            // dBox.style.display = 'none';
          }
          var hasClass = function(el, className) {
            return (' ' + el.className + ' ').indexOf(' ' + className + ' ') > -1;
          }
          document.addEventListener('click', function(e) {
            if (hasClass(e.target, 'auto-suggest-pro')) {
              e.preventDefault();
            //  var data = (e.target.id).split('-').join(' ');
              var data = e.target.id;

              for (var i = 0; i < text.length; i++) {
                if ((text[i].randomId.toString()).indexOf(data) !== -1) {
                  textBox.textContent = "";
                  textBox.textContent = (text[i].value);
                  dBox.style.display = 'none'; // hide dropup
                  quickReply.setCursorToEnd(textBox);
                  textBox.focus();
                }
              }
            }
            else if (hasClass(e.target, 'auto-suggest')){
              e.preventDefault();
              // var data = (e.target.parentElement.id).split('-').join(' ');
              var data = e.target.parentElement.id;
              for (var i = 0; i < text.length; i++) {
                if ((text[i].randomId.toString()).indexOf(data) !== -1) {
                  textBox.textContent = "";
                  textBox.textContent = (text[i].value);
                  dBox.style.display = 'none'; // hide dropup
                  quickReply.setCursorToEnd(textBox);
                  textBox.focus();
                }
              }
            }
            else if (hasClass(e.target, 'km-quick-reply-link')){
              //  history.pushState('', 'New Page Title', newHREF);
              dBox.style.display = 'none';
              window.appHistory.push("/settings/message-shortcuts");
            }
            else {
              dBox.style.display = 'none';
            }
          });
          
          if (suggestion !== undefined && suggestion !== "") {
            dBox.innerHTML = suggestion;
          }
          else if (suggestion === "") {
            dBox.style.display = 'none';
          }
        }
      }
      if (key === 32 || key === 8 || key === 46 || textBox.textContent === "") {
        if ((textBox.textContent).indexOf("/") !== -1) {
          dBox.style.display = 'none';
          return false;
        }
        autoCompleteFlag = false;
        dBox.style.display = 'none';
      }
    });
  },

  setCursorToEnd: function(el) {
    el.focus();
    if (typeof window.getSelection != "undefined" &&
      typeof document.createRange != "undefined") {
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
    }
  },

  getQuickReplies: function() {
    let quickReplyIndex = [];
    let userSession = CommonUtils.getUserSession();
    const autoSuggestUrl = getConfig().kommunicateApi.autoSuggest + '/' + userSession.application.applicationId;
    getSuggestionsByAppId(userSession.application.applicationId, 'shortcut')
      .then(function(autoSuggestions_data) {
        for (var i = 0; i < autoSuggestions_data.length; i++) {
          var object = {
            label: autoSuggestions_data[i].category,
            value: autoSuggestions_data[i].content,
            randomId: autoSuggestions_data[i].id
          }
          quickReplyIndex[i] = object;
        }
        quickReply.edValueKeyPress(quickReplyIndex);
      });
  }

}

export default quickReply;
