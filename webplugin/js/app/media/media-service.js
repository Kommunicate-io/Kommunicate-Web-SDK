Kommunicate.mediaService = {
    browserLocale: window.navigator.language || window.navigator.userLanguage || "en-US",
    isAppleDevice: /iPhone|iPad|iPod/i.test(navigator.userAgent),
    capitalizeFirstCharacter: function (str) {
        var firstCharRegex = /\S/;
        return str.replace(firstCharRegex, function (m) {
            return m.toUpperCase();
        });
    },
    processVoiceInputClickedEvent: function () {
        kmWidgetEvents.eventTracking(eventMapping.onVoiceIconClick);
        if (!('webkitSpeechRecognition' in window)) {
            alert('browser do not support speech recognition');
        } else {
            //As of April 2023, works only in chrome and edge
            var recognizingDone = false;
            var lastListeningEventTime = null;

            var recognition = new webkitSpeechRecognition();
            var appOptions =
                KommunicateUtils.getDataFromKmSession('appOptions') ||
                applozic._globals;
            recognition.continuous = false; // The default value for continuous is false, meaning that when the user stops talking, speech recognition will end.
            recognition.interimResults = true; // The default value for interimResults is false, meaning that the only results returned by the recognizer are final and will not change. Set it to true so we get early, interim results that may change.
            finalTranscript = '';
            recognition.lang =
                appOptions.language || Kommunicate.mediaService.browserLocale;
            recognition.start();
            recognition.onstart = function () {
                // when recognition.start() method is called it begins capturing audio and calls the onstart event handler
                recognizingDone = true;
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
                lastListeningEventTime = new Date().getTime();
            };
            recognition.onspeechend = function () {
                // stop speech recognition explicitly
                recognition.stop();
            };
            recognition.onend = function () {
                // stop mic effect'
                recognizingDone = false;

                Kommunicate.typingAreaService.hideMiceRecordingAnimation();
                window.$applozic.fn.applozic('toggleMediaOptions');
            };
            recognition.onerror = function (event) {
                console.log('error while speech recognition', event.error);
                recognition.abort();
            };

            //explicitly Stop the Mic recording only for IOS
            if (Kommunicate.mediaService.isAppleDevice) {
                const disableStt = () => {
                    const checkTimeSTT = 1000;
                    const customTimeSet = 2;
                    setInterval(function () {
                        const currentTime = new Date().getTime();
                        if (
                            lastListeningEventTime != null &&
                            (currentTime - lastListeningEventTime) /
                                checkTimeSTT >
                                customTimeSet
                        ) {
                            if (recognizingDone) {
                                recognition.stop();
                                lastListeningEventTime = null;
                                recognizingDone = false;
                            }
                        }
                    }, checkTimeSTT);
                };
                disableStt();
            }
        }
    },
    voiceOutputIncomingMessage: function (message, offSpeech) {
        if(offSpeech){
          window.speechSynthesis.cancel();
          return;
        }
        // get appOptions from widget script
        var timeOut;
        var appOptions =
            KommunicateUtils.getDataFromKmSession('appOptions') ||
            applozic._globals;
            function longTextSupport() {
                window.speechSynthesis.pause();
                window.speechSynthesis.resume();
                timeOut = setTimeout(longTextSupport, 10000);
            }
        // If the message isn't part of the UI, it's not included
        // in voiceoutput either
        if (!appOptions || !Kommunicate.visibleMessage(message)) return;

        // if voiceoutput is enabled and browser supports it
        if (appOptions.voiceOutput && 'speechSynthesis' in window) {
            var textToSpeak = '';
            var isChrome = !!window.chrome || navigator.userAgent.indexOf('Chrome')>-1;
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
                var skipForEach = false;
                var utterance = new SpeechSynthesisUtterance(textToSpeak);
                    utterance.lang =  appOptions.language || "en-US";
                    utterance.rate = appOptions.voiceRate || 1;
                    utterance.text = textToSpeak;

                function updateVoiceName(voice) {
                    utterance.voice = voice;
                    skipForEach = true;
                }

                if (appOptions.voiceName) {
                    AVAILABLE_VOICES_FOR_TTS.forEach(function(voice) {
                        if (skipForEach) return;
                        
                        if (Array.isArray(appOptions.voiceName)) {
                            appOptions.voiceName.forEach(function (voiceName) {
                                if (voice.name === voiceName.trim()) {
                                    updateVoiceName(voice);
                                }
                            });
                        } else if (voice.name === appOptions.voiceName.trim()) {
                            updateVoiceName(voice);
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
                if (isChrome) {
                    timeOut = setTimeout(longTextSupport, 10000);
                    utterance.onend = function () {
                        clearTimeout(timeOut);
                    };
                }
                speechSynthesis.speak(utterance);
            }
        }
    },
    initRecorder: function(){
        const LIVE_OUTPUT = false; // a feature to live output the recording voice to the speaker
        const MAX_RECORD_TIME = 2 * 60 * 1000; // in milliseconds
        const TIMER_STATE = {
            EXPIRED: 0,
            RUNNING: 1,
            PAUSED: 2,
        };
        var START_TIME;
        var REMAINING_TIME;
        var pauseBtn = $applozic("#pause-btn");
        var playBtn = $applozic("#play-btn");
        var timeElapsedTimer = $applozic("#time-elapsed");
        var timeRemainingTimer = $applozic("#time-remaining");
        var playPausetimerState = TIMER_STATE.EXPIRED;
        var audioBlob;
        var wavAudioDuration;
        var playPauseInterval;
        var recorderInterval;
        var recorderAudio = document.querySelector("#recorder-audio");
        var params = {};
        recorderAudio.onloadedmetadata = function () {
            wavAudioDuration = recorderAudio.duration;
            REMAINING_TIME = wavAudioDuration;
        };
        function playPauseTimer() {
            START_TIME = new Date().getTime();
            if (wavAudioDuration) {
                playPauseInterval = setInterval(function () {
                    if (playPausetimerState == TIMER_STATE.RUNNING) {
                        var timeElapsed =
                            (new Date().getTime() - START_TIME) / 1000;
                        var percent =
                            (Math.floor(timeElapsed) /
                                Math.floor(wavAudioDuration)) *
                            100;
                        REMAINING_TIME = Math.floor(wavAudioDuration - timeElapsed);
                        var secondsElapsed = Math.floor(timeElapsed % 60);
                        var minutesElapsed = Math.floor((timeElapsed / 60) % 60);
                        timeRemainingTimer.text(
                            ("0" + minutesElapsed).slice(-2) +
                                ":" +
                                ("0" + secondsElapsed).slice(-2)
                        );
                        $applozic("#wave-front-progressBar").width(percent + "%");
                        if (REMAINING_TIME <= 0) {
                            clearTimeout(playPauseInterval);
                            playPausetimerState = TIMER_STATE.EXPIRED;
                            pauseBtn.addClass("n-vis");
                            playBtn.removeClass("n-vis");
                        }
                    } else if (playPausetimerState == TIMER_STATE.PAUSED) {
                        START_TIME += 1000;
                    }
                }, 1000);
                timeRemainingTimer.removeClass("n-vis");
            }
        }
        function startRecording() {
            Kommunicate.typingAreaService.showRecorder();
            // show
            kommunicateCommons.modifyClassList(
                {
                    id: ["delete-recording", "mck-stop-recording", "audiodiv"],
                },
                "",
                "n-vis"
            );
    
            // hide
            kommunicateCommons.modifyClassList(
                {
                    id: ["play-btn", "pause-btn", "send-btn"],
                },
                "n-vis",
                ""
            );
            timeElapsedTimer.removeClass("n-vis");
            timeRemainingTimer.removeClass("n-vis");
    
            Fr.voice.record(
                LIVE_OUTPUT,
                function () {
                    console.log("Recording started");
                    initTimer();
                },
                null,
                function (err) {
                    console.log("error", err);
                    resetRecorder(null, true);
                }
            );
        }
        function initTimer() {
            var startTime = new Date().getTime();
            var endTime = startTime + MAX_RECORD_TIME;
            recorderInterval = setInterval(function () {
                var now = new Date().getTime();
                var timeElapsed = now - startTime;
                var timeRemaining = endTime - now;
                var percent = (timeElapsed / MAX_RECORD_TIME) * 100;
                var secondsElapsed = Math.floor((timeElapsed / 1000) % 60);
                var secondsRemaining = Math.floor((timeRemaining / 1000) % 60);
                var minutesElapsed = Math.floor((timeElapsed / (1000 * 60)) % 60);
                var minutesRemaining = Math.floor(
                    (timeRemaining / (1000 * 60)) % 60
                );
                timeElapsedTimer.text(
                    ("0" + minutesElapsed).slice(-2) +
                        ":" +
                        ("0" + secondsElapsed).slice(-2)
                );
                timeRemainingTimer.text(
                    ("0" + minutesRemaining).slice(-2) +
                        ":" +
                        ("0" + secondsRemaining).slice(-2)
                );
                $applozic("#wave-front-progressBar").width(percent + "%");
                if (timeRemaining <= 0) {
                    stopRecording();
                }
            }, 1000);
        }
        function stopRecording(e) {
            // show
            kommunicateCommons.modifyClassList(
                {
                    id: [
                        "delete-recording",
                        "play-btn",
                        "send-btn",
                        "time-remaining",
                    ],
                },
                "",
                "n-vis"
            );
    
            // hide
            kommunicateCommons.modifyClassList(
                {
                    id: ["pause-btn", "mck-stop-recording", "time-elapsed"],
                },
                "n-vis",
                ""
            );
            clearInterval(recorderInterval);
            $applozic("#wave-front-progressBar").width("0%");
            timeRemainingTimer.text("00:00");
            Fr.voice.pause();
            Fr.voice.export(function (blob) {
                blob.name = "voiceRecord-" + new Date().getTime() + ".wav";
                params.file = blob;
                params.callback = function () {
                    document
                        .querySelector("#send-btn")
                        .classList.remove("disabled");
                };
                audioBlob = blob;
                $applozic.fn.applozic("audioAttach", params);
                var bloburl = URL.createObjectURL(audioBlob);
                $applozic("#recorder-audio").attr("src", bloburl);
            }, "blob");
            Fr.voice.stop();
        }
        function resetRecorder(e, permissionDenied) {
            Kommunicate.typingAreaService.hideRecorder();
            !permissionDenied && Fr.voice.stop();
            clearInterval(recorderInterval);
            clearInterval(playPauseInterval);
            recorderInterval = null;
            audioBlob = null;
            wavAudioDuration = null;
            recorderAudio.setAttribute("src", "");
            playPausetimerState = TIMER_STATE.EXPIRED;
            params = {};
            $applozic("#wave-front-progressBar").width("0%");
            timeElapsedTimer.text("00:00");
            timeRemainingTimer.text("02:00");
            document.querySelector("#send-btn").classList.add("disabled");
    
            // remove un-necessary eventListeners
            $applozic("#mck-conversation-back-btn").off("click", resetRecorder);
            $applozic("#km-faq").off("click", resetRecorder);
            $applozic("#km-popup-close-button").off("click", resetRecorder);
            $applozic("#km-chat-widget-close-button").off("click", resetRecorder);
        }
        function onPlayBtnClick(e) {
            var prevStateOfTimer = playPausetimerState;
            playPausetimerState = TIMER_STATE.RUNNING;
            playBtn.addClass("n-vis");
            pauseBtn.removeClass("n-vis");
            audioBlob && $applozic("#recorder-audio")[0].play();
            prevStateOfTimer == TIMER_STATE.EXPIRED && playPauseTimer();
        }
        function onPauseBtnClick(e) {
            $applozic("#recorder-audio")[0].pause();
            playPausetimerState = TIMER_STATE.PAUSED;
            pauseBtn.addClass("n-vis");
            playBtn.removeClass("n-vis");
        }
    
        document.querySelector(".mck-mic-animation-container .voiceNote").onclick =
            function () {
                startRecording();
    
                // on click of back button, close btn, and faq btn recording should end
                $applozic("#mck-conversation-back-btn").on("click", resetRecorder);
                $applozic("#km-faq").on("click", resetRecorder);
                $applozic("#km-popup-close-button").on("click", resetRecorder);
                $applozic("#km-chat-widget-close-button").on(
                    "click",
                    resetRecorder
                );
            };
        document.getElementById("mck-stop-recording").onclick = stopRecording;
        document.getElementById("play-btn").onclick = onPlayBtnClick;
        document.getElementById("pause-btn").onclick = onPauseBtnClick;
        document.getElementById("delete-recording").onclick = function (e) {
            resetRecorder(e);
            document.querySelector(".mck-remove-file") &&
                document.querySelector(".mck-remove-file").click();
        };
        document.querySelector("#send-btn").onclick = function (e) {
            if (
                document.querySelector("#send-btn").classList.contains("disabled")
            ) {
                return;
            }
            resetRecorder(e);
            document.querySelector("#mck-msg-sbmt") &&
                document.querySelector("#mck-msg-sbmt").click();
        };
    },
};
