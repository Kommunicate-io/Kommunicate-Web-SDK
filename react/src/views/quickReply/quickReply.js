import {getConfig} from '../../config/config';
import CommonUtils from '../../utils/CommonUtils';
import './quickReply.css';
import { getAllSuggestions, getSuggestionsByAppId} from '../../utils/kommunicateClient';
const quickReply = {

  edValueKeyPress: function(quickReplyIndex) {
    console.log(quickReplyIndex.length);
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
          for (var i = 0; i < text.length; i++) {
            if ((text[i].label).indexOf(textBoxContent) !== -1) {
              textInput = (text[i].label).split(' ').join('-');
              console.log(textInput);
              suggestion = suggestion + "<div id= " + textInput + " class=\"d-pop auto-suggest\"> <span class=\"auto_reply auto-suggest\"> " + "/" + text[i].label + "</span> <br/> <span class=\"auto_suggestion auto-suggest\">" + text[i].value + "</span> </div>\n";
            }
          }
          var hasClass = function(el, className) {
            return (' ' + el.className + ' ').indexOf(' ' + className + ' ') > -1;
          }
          document.addEventListener('click', function(e) {
            if (hasClass(e.target, 'auto-suggest')) {
              e.preventDefault();
              var data = (e.target.id).split('-').join(' ');
              for (var i = 0; i < text.length; i++) {
                if ((text[i].label).indexOf(data) !== -1) {
                  textBox.focus();
                  textBox.textContent = "";
                  textBox.textContent = (text[i].value);
                  dBox.style.display = 'none'; // hide dropup
                  console.log((text[i].value));
                }
              }
            }
          });
          if (suggestion !== undefined)
            dBox.innerHTML = suggestion;
          console.log(autoCompleteFlag);
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

  getQuickReplies: function (){
  let quickReplyIndex = [];
  let userSession = CommonUtils.getUserSession();
  const autoSuggestUrl = getConfig().kommunicateApi.autoSuggest + '/' + userSession.application.applicationId

  getSuggestionsByAppId(userSession.application.applicationId,'shortcut')
    .then(function(autoSuggestions_data) {
      for (var i=0 ; i < autoSuggestions_data.length;i++){
        var object = {
          label:autoSuggestions_data[i].category,
          value: autoSuggestions_data[i].content
        }
        quickReplyIndex[i]= object;
      }
      quickReply.edValueKeyPress(quickReplyIndex);
    });
  }

}
export default quickReply;
