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
        console.log(textBoxContent);
        if ((textBoxContent).indexOf("/") !== -1 && textBoxContent.charAt(0) === "/") {
          dBox.style.display = 'block';
          textBoxContent = textBoxContent.replace(/\//g, "");
          if (text.length !== 0){
            for (var i = 0; i < text.length; i++) {
              if ((text[i].label).indexOf(textBoxContent) !== -1) {
              //  textInput = (text[i].label).split(' ').join('-');
                textInput = text[i].randomId.toString();
                console.log(textInput);
                suggestion = suggestion + "<div id= " + textInput + " class=\"d-pop auto-suggest-pro\"> <span class=\"auto_reply auto-suggest\"> " + "/" + text[i].label + "</span> <br/> <span class=\"auto_suggestion auto-suggest\">" + text[i].value + "</span> </div>\n";
              }
            }
          }
          else {
            dBox.style.display = 'none';
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

  setCursorToEnd: function (textBox){
    var range = document.createRange();
    var sel = window.getSelection();
    var endValue = textBox.childNodes[0].length;
    range.setStart(textBox.childNodes[0], endValue);
    range.collapse(true);
  //  sel.removeAllRanges();
    sel.empty();
    sel.addRange(range);
  },

  getQuickReplies: function (){
  let quickReplyIndex = [];
  let userSession = CommonUtils.getUserSession();
  const autoSuggestUrl = getConfig().kommunicateApi.autoSuggest + '/' + userSession.application.applicationId;
  getSuggestionsByAppId(userSession.application.applicationId,'shortcut')
    .then(function(autoSuggestions_data) {
      for (var i=0 ; i < autoSuggestions_data.length;i++){
        var object = {
          label:autoSuggestions_data[i].category,
          value: autoSuggestions_data[i].content,
          randomId: autoSuggestions_data[i].id
        }
        quickReplyIndex[i]= object;
      }
      quickReply.edValueKeyPress(quickReplyIndex);
    });
  }

}
export default quickReply;
