Kommunicate.mediaService = {
    capitalizeFirstCharacter: function (str) {
        var firstCharRegex = /\S/;
        return str.replace(firstCharRegex, function (m) {
            return m.toUpperCase();
        });
    },
    processMicClickedEvent: function () {
        kmWidgetEvents.eventTracking(eventMapping.onVoiceIconClick);
        if (!('webkitSpeechRecognition' in window)) {
            alert('browser do not support speech recogization');
        } else {
            var recognition = new webkitSpeechRecognition();
            var appOptions =
                KommunicateUtils.getDataFromKmSession('appOptions') ||
                applozic._globals;
            recognition.continuous = false; // The default value for continuous is false, meaning that when the user stops talking, speech recognition will end.
            recognition.interimResults = true; // The default value for interimResults is false, meaning that the only results returned by the recognizer are final and will not change. Set it to true so we get early, interim results that may change.
            finalTranscript = '';
            recognition.lang = appOptions.language || 'en-us';
            recognition.start();
            recognition.onstart = function () {
                // when recognition.start() method is called it begins capturing audio and calls the onstart event handler
                Kommunicate.typingAreaService.showMicRcordingAnimation();
            };
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
                Kommunicate.typingAreaService.populateText(
                    Kommunicate.mediaService.capitalizeFirstCharacter(
                        finalTranscript || interimTranscript
                    )
                );
            };
            recognition.onerror = function (err) {
                console.log('error while speech recognition', err);
            };
            recognition.onend = function () {
                // stop mic effect
                Kommunicate.typingAreaService.hideMiceRecordingAnimation();
                window.$applozic.fn.applozic('toggleMediaOptions');
            };
        }
    },
    voiceOutputIncomingMessage: function (message) {
        // get appoptions
        var appOptions =
            KommunicateUtils.getDataFromKmSession('appOptions') ||
            applozic._globals;
        // If the message isn't part of the UI, it's not included
        // in voiceoutput either
        if (!appOptions || !Kommunicate.visibleMessage(message)) return;

        // if voiceoutput is enabled and browser supports it
        if (appOptions.voiceOutput && 'speechSynthesis' in window) {
            var textToSpeak = '';
            if (message.hasOwnProperty('fileMeta')) {
                textToSpeak += MCK_LABELS['voice.output'].attachment;
                textToSpeak += message.fileMeta.name;
            } else if (
                message.contentType ==
                KommunicateConstants.MESSAGE_CONTENT_TYPE.LOCATION
            ) {
                coord = JSON.parse(message.message);
                textToSpeak += MCK_LABELS['voice.output'].location.init;
                textToSpeak +=
                    MCK_LABELS['voice.output'].location.lat +
                    Math.round(coord.lat * 100) / 100;
                textToSpeak +=
                    MCK_LABELS['voice.output'].location.lon +
                    Math.round(coord.lon * 100) / 100;
            } else if (
                message.message &&
                message.contentType ==
                    KommunicateConstants.MESSAGE_CONTENT_TYPE.DEFAULT
            ) {
                textToSpeak += message.message;
            }
            if (textToSpeak) {
                var utterance = new SpeechSynthesisUtterance(textToSpeak);
                utterance.lang = appOptions.language || 'en-US';
                utterance.rate = appOptions.voiceRate || 1;
                var skipForEach = false;
                if (appOptions.voiceName) {
                    AVAILABLE_VOICES_FOR_TTS.forEach(function (voice) {
                        if (skipForEach) {
                            return;
                        }
                        if (voice.name == appOptions.voiceName) {
                            utterance.voice = voice;
                            skipForEach = true;
                        }
                    });
                }
                utterance.onerror = function (event) {
                    if (event.error !== 'not-allowed') {
                        throw new Error(
                            'Error while converting the message to voice.',
                            event.error
                        );
                    }
                };
                speechSynthesis.speak(utterance);
            }
        }
    },
};
