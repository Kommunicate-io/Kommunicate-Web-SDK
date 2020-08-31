Kommunicate.mediaService = {
    capitalizeFirstCharacter: function (str) {
        var firstCharRegex = /\S/;
        return str.replace(firstCharRegex, function (m) {
            return m.toUpperCase();
        });
    },
    processMicClickedEvent: function () {
        if (!('webkitSpeechRecognition' in window)) {
            alert("browser do not support speech recogization");
        } else {
            var recognition = new webkitSpeechRecognition();
            recognition.continuous = false; // The default value for continuous is false, meaning that when the user stops talking, speech recognition will end. 
            recognition.interimResults = true; // The default value for interimResults is false, meaning that the only results returned by the recognizer are final and will not change. Set it to true so we get early, interim results that may change. 
            finalTranscript = '';
            recognition.lang = "en-us";
            recognition.start();
            recognition.onstart = function () {
                // when recognition.start() method is called it begins capturing audio and calls the onstart event handler
                Kommunicate.typingAreaService.showMicRcordingAnimation();
            }
            recognition.onresult = function (event) {
                //get called for each new set of results captured by recognizer 
                var interimTranscript = '';
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                Kommunicate.typingAreaService.populateText(Kommunicate.mediaService.capitalizeFirstCharacter(finalTranscript || interimTranscript));
            }
            recognition.onerror = function (err) {
                console.log("error while speech recognition", err);
            }
            recognition.onend = function () {
                // stop mic effect
                Kommunicate.typingAreaService.hideMiceRecordingAnimation();
                window.$applozic.fn.applozic('toggleMediaOptions');
;            }
        }
    },
voiceOutputIncomingMessage: function(resp){
    console.log(JSON.stringify(resp));
    var appOptions = KommunicateUtils.getDataFromKmSession("appOptions");

    if (appOptions.voiceOutput && "speechSynthesis" in window){
        console.log(appOptions.voiceOutput);
        if (resp.message) {
            var textToSpeak = "";
            if(resp.message.hasOwnProperty("fileMeta")){
                console.log("file");
                textToSpeak += "you have an attachment ";
                textToSpeak += resp.message.fileMeta.name;
            }
            else if (resp.message.contentType == KommunicateConstants.MESSAGE_CONTENT_TYPE.LOCATION){
                textToSpeak += "a location has been shared with you ";
                textToSpeak += resp.message.message;

            }
            else {
                textToSpeak += resp.message.message;

            }
        var utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.onerror = ev =>{
console.log(ev.error);
        };
        speechSynthesis.speak(utterance);
        }
    }
}
}