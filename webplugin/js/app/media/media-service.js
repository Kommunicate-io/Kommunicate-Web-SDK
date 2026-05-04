Kommunicate.mediaService = {
    browserLocale: window.navigator.language || window.navigator.userLanguage || 'en-US',
    appOptions: appOptionSession.getPropertyDataFromSession('appOptions') || applozic._globals,
    userInActiveSec: 0,
    fallbackVoiceInput: {
        recorder: null,
        stream: null,
        chunks: [],
        mimeType: 'audio/webm',
        stopTimer: null,
        stopping: false,
    },
    fallbackVoiceOutput: {
        audio: null,
        url: '',
        requestId: 0,
    },
    getFallbackVoiceClient: function () {
        return typeof kmVoice !== 'undefined' ? kmVoice : null;
    },
    getFallbackVoiceRecorderHelper: function () {
        return typeof mckVoice !== 'undefined' ? mckVoice : null;
    },
    getBoundFallbackMethod: function (fallbackClient, methodName) {
        return fallbackClient && fallbackClient[methodName]
            ? fallbackClient[methodName].bind(fallbackClient)
            : null;
    },
    getFallbackVoiceClientMethod: function (methodName) {
        return this.getBoundFallbackMethod(this.getFallbackVoiceClient(), methodName);
    },
    getFallbackVoiceRecorderHelperMethod: function (methodName) {
        return this.getBoundFallbackMethod(this.getFallbackVoiceRecorderHelper(), methodName);
    },
    getSpeechRecognition: function () {
        return window.SpeechRecognition || window.webkitSpeechRecognition || null;
    },
    getSpeechSynthesis: function () {
        return window.speechSynthesis || null;
    },
    supportsVoiceInput: function () {
        return Boolean(this.getSpeechRecognition() || this.canUseFallbackVoiceInput());
    },
    canUseFallbackVoiceInput: function () {
        return Boolean(
            this.getFallbackVoiceClientMethod('voiceToText') &&
                window.MediaRecorder &&
                navigator.mediaDevices &&
                navigator.mediaDevices.getUserMedia &&
                (window.AudioContext || window.webkitAudioContext) &&
                window.isSecureContext !== false
        );
    },
    canUseFallbackVoiceOutput: function () {
        return Boolean(this.getFallbackVoiceClientMethod('textToVoice'));
    },
    getFallbackVoiceInputConfig: function () {
        return (
            (kommunicate && kommunicate._globals && kommunicate._globals.voiceInputSettings) || {}
        );
    },
    getFallbackVoiceInputMaxDurationMs: function () {
        var appOptions = this.appOptions || {};
        var maxDurationMs = Number(appOptions.fallbackVoiceInputMaxDurationMs);
        if (!(maxDurationMs > 0)) {
            maxDurationMs = Number(appOptions.fallbackVoiceInputMaxDuration) * 1000;
        }
        return Math.max(maxDurationMs || 10000, 3000);
    },
    getFallbackVoiceInputConstraints: function () {
        var getAudioCaptureConstraints = this.getFallbackVoiceRecorderHelperMethod(
            'getAudioCaptureConstraints'
        );
        if (getAudioCaptureConstraints) {
            return getAudioCaptureConstraints();
        }
        return {
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                channelCount: 1,
            },
        };
    },
    createFallbackVoiceInputRecorder: function (stream) {
        var createMediaRecorder = this.getFallbackVoiceRecorderHelperMethod('createMediaRecorder');
        if (createMediaRecorder) {
            return createMediaRecorder(stream);
        }
        return new MediaRecorder(stream);
    },
    clearFallbackVoiceInputStopTimer: function () {
        if (this.fallbackVoiceInput.stopTimer) {
            clearTimeout(this.fallbackVoiceInput.stopTimer);
            this.fallbackVoiceInput.stopTimer = null;
        }
    },
    stopFallbackVoiceInputStream: function () {
        if (this.fallbackVoiceInput.stream) {
            this.fallbackVoiceInput.stream.getTracks().forEach(function (track) {
                track.stop();
            });
            this.fallbackVoiceInput.stream = null;
        }
    },
    resetFallbackVoiceInputState: function () {
        this.clearFallbackVoiceInputStopTimer();
        this.fallbackVoiceInput.recorder = null;
        this.fallbackVoiceInput.chunks = [];
        this.fallbackVoiceInput.mimeType = 'audio/webm';
        this.fallbackVoiceInput.stopping = false;
        this.stopFallbackVoiceInputStream();
        Kommunicate.typingAreaService.hideMiceRecordingAnimation();
    },
    stopFallbackVoiceInputRecording: function () {
        if (
            !this.fallbackVoiceInput.recorder ||
            this.fallbackVoiceInput.stopping ||
            this.fallbackVoiceInput.recorder.state === 'inactive'
        ) {
            return;
        }
        this.fallbackVoiceInput.stopping = true;
        this.clearFallbackVoiceInputStopTimer();
        this.fallbackVoiceInput.recorder.stop();
    },
    processFallbackVoiceInputTranscript: async function (audioBlob) {
        if (!audioBlob || !audioBlob.size) {
            return;
        }
        try {
            var voiceToText = this.getFallbackVoiceClientMethod('voiceToText');
            var voiceInputSettings = this.getFallbackVoiceInputConfig();
            var response = await voiceToText(audioBlob, {
                ucid: voiceInputSettings.ucid,
                sttMode: 'recognize',
            });
            var transcript =
                response && typeof response.text === 'string' ? response.text.trim() : '';
            if (transcript) {
                Kommunicate.typingAreaService.populateText(
                    this.capitalizeFirstCharacter(transcript)
                );
                window.$applozic.fn.applozic('toggleMediaOptions');
            }
        } catch (error) {
            if (error && error.code === 'SILENT_AUDIO') {
                return;
            }
            console.error('error while fallback speech recognition:', error);
            alert('Could not process voice input. Please try again.');
        }
    },
    startFallbackVoiceInputRecording: async function () {
        if (!this.canUseFallbackVoiceInput()) {
            alert('browser do not support speech recognition');
            return;
        }
        if (
            this.fallbackVoiceInput.recorder &&
            this.fallbackVoiceInput.recorder.state !== 'inactive'
        ) {
            this.stopFallbackVoiceInputRecording();
            return;
        }
        try {
            var constraints = this.getFallbackVoiceInputConstraints();
            var stream = await navigator.mediaDevices.getUserMedia(constraints);
            var recorder = this.createFallbackVoiceInputRecorder(stream);
            var that = this;
            // Fallback recording uses its own max-duration config; voiceInputTimeout remains the silence timeout for native STT.
            var maxRecordingDurationMs = that.getFallbackVoiceInputMaxDurationMs();

            that.fallbackVoiceInput.stream = stream;
            that.fallbackVoiceInput.recorder = recorder;
            that.fallbackVoiceInput.chunks = [];
            that.fallbackVoiceInput.mimeType = recorder.mimeType || 'audio/webm';
            that.fallbackVoiceInput.stopping = false;

            recorder.ondataavailable = function (event) {
                if (event.data && event.data.size > 0) {
                    that.fallbackVoiceInput.chunks.push(event.data);
                }
            };
            recorder.onerror = function (event) {
                console.error(
                    'fallback MediaRecorder error',
                    event && event.error ? event.error : event
                );
            };
            recorder.onstop = async function () {
                var audioBlob = new Blob(that.fallbackVoiceInput.chunks, {
                    type: that.fallbackVoiceInput.mimeType,
                });
                that.resetFallbackVoiceInputState();
                await that.processFallbackVoiceInputTranscript(audioBlob);
            };

            recorder.start(250);
            Kommunicate.typingAreaService.showMicRcordingAnimation();
            that.clearFallbackVoiceInputStopTimer();
            that.fallbackVoiceInput.stopTimer = setTimeout(function () {
                that.stopFallbackVoiceInputRecording();
            }, maxRecordingDurationMs);
        } catch (error) {
            this.resetFallbackVoiceInputState();
            console.error('error while starting fallback voice input:', error);
            alert(
                'Could not access your microphone. Please allow microphone access and try again.'
            );
        }
    },
    isAppleDevice: function () {
        var isIOSDevice = KommunicateUtils.isIOSDevice();
        var isMacSafari = KommunicateUtils.isSafariBrowser();
        return isIOSDevice || isMacSafari;
    },
    endSttExplicitly: function (params) {
        var that = this;
        var voiceInputTimeOut = that.appOptions.voiceInputTimeout || 10;
        var currentTime = new Date().getTime();
        var lastListeningEventTime = params.lastListeningEventTime;

        var isUserSilent = function () {
            //if user remains silent for atLeast voiceInputTimeOut sec
            if (lastListeningEventTime === 0) {
                return ++that.userInActiveSec === voiceInputTimeOut;
            }
            //else acc to condition we return true/false
            return (currentTime - params.lastListeningEventTime) / 1000 >= voiceInputTimeOut;
        };
        if (isUserSilent()) {
            params.lastListeningEventTime = 0;
            that.userInActiveSec = 0;
            params.recognition.stop();
            clearInterval(params.checkLastSpeech);
        }
    },
    capitalizeFirstCharacter: function (str) {
        var firstCharRegex = /\S/;
        return str.replace(firstCharRegex, function (m) {
            return m.toUpperCase();
        });
    },
    getVoiceOutputText: function (message) {
        var textToSpeak = '';
        if (message.hasOwnProperty('fileMeta')) {
            textToSpeak += MCK_LABELS['voice.output'].attachment;
            textToSpeak += message.fileMeta.name;
        } else if (message.contentType == KommunicateConstants.MESSAGE_CONTENT_TYPE.LOCATION) {
            var coord = JSON.parse(message.message);
            textToSpeak += MCK_LABELS['voice.output'].location.init;
            textToSpeak +=
                MCK_LABELS['voice.output'].location.lat + Math.round(coord.lat * 100) / 100;
            textToSpeak +=
                MCK_LABELS['voice.output'].location.lon + Math.round(coord.lon * 100) / 100;
        } else if (
            message.message &&
            message.contentType == KommunicateConstants.MESSAGE_CONTENT_TYPE.DEFAULT
        ) {
            textToSpeak += message.message;
        }
        return textToSpeak;
    },
    clearFallbackVoiceOutput: function () {
        if (this.fallbackVoiceOutput.audio) {
            this.fallbackVoiceOutput.audio.pause();
            this.fallbackVoiceOutput.audio.src = '';
            this.fallbackVoiceOutput.audio = null;
        }
        if (this.fallbackVoiceOutput.url) {
            URL.revokeObjectURL(this.fallbackVoiceOutput.url);
            this.fallbackVoiceOutput.url = '';
        }
    },
    isCurrentFallbackVoiceOutputRequest: function (requestId) {
        return this.fallbackVoiceOutput.requestId === requestId;
    },
    playFallbackVoiceOutput: function (audioBlob) {
        var that = this;
        var audio = new Audio();
        var objectUrl = URL.createObjectURL(audioBlob);
        that.fallbackVoiceOutput.audio = audio;
        that.fallbackVoiceOutput.url = objectUrl;
        audio.src = objectUrl;
        audio.onended = function () {
            that.stopVoiceOutput();
        };
        audio.onerror = function (error) {
            console.error('Error while converting the message to voice:', error);
            that.stopVoiceOutput();
        };
        audio.play().catch(function (error) {
            console.error('Error while playing voice output:', error);
            that.stopVoiceOutput();
        });
    },
    processVoiceInputClickedEvent: function () {
        var mediaService = Kommunicate.mediaService;
        var Recognition = mediaService.getSpeechRecognition();
        kmWidgetEvents.eventTracking(eventMapping.onVoiceIconClick);
        if (!Recognition) {
            if (mediaService.canUseFallbackVoiceInput()) {
                mediaService.startFallbackVoiceInputRecording();
                return;
            }
            alert('browser do not support speech recognition');
        } else {
            //As of April 2023, works only in chrome, edge and safari(limited support)
            var lastListeningEventTime = 0;
            var finalTranscript = '';
            var isAppleProduct = Kommunicate.mediaService.isAppleDevice();
            var appOptions = Kommunicate.mediaService.appOptions;

            var recognition = new Recognition();
            recognition.continuous = isAppleProduct; // DO NOT CHANGE, ELSE WILL BREAK IN SAFARI
            recognition.interimResults = true; // The default value for interimResults is false, meaning that the only results returned by the recognizer are final and will not change. Set it to true so we get early, interim results that may change.
            recognition.lang = appOptions.language || Kommunicate.mediaService.browserLocale;

            recognition.start();
            recognition.onstart = function (event) {
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

                if (isAppleProduct && interimTranscript) {
                    lastListeningEventTime = new Date().getTime();
                }
            };

            recognition.onend = function () {
                // stop mic effect
                recognition.stop();
                Kommunicate.typingAreaService.hideMiceRecordingAnimation();
                window.$applozic.fn.applozic('toggleMediaOptions');
            };
            recognition.onerror = function (event) {
                console.error('error while speech recognition:', event.error);
                recognition.abort();
            };

            //explicitly Stop the Mic recording only for Safari
            if (isAppleProduct) {
                var checkLastSpeech = setInterval(function () {
                    Kommunicate.mediaService.endSttExplicitly({
                        lastListeningEventTime,
                        recognition,
                        checkLastSpeech,
                    });
                }, 1000);
            }
        }
    },
    voiceOutputIncomingMessage: function (message, offSpeech) {
        var speechSynth = this.getSpeechSynthesis();
        var appOptions =
            appOptionSession.getPropertyDataFromSession('appOptions') || applozic._globals;
        var textToSpeak;

        if (offSpeech) {
            this.stopVoiceOutput();
            return;
        }

        if (!appOptions || !appOptions.voiceOutput || !Kommunicate.visibleMessage(message)) {
            return;
        }

        textToSpeak = this.getVoiceOutputText(message);
        if (!textToSpeak) {
            return;
        }

        if (speechSynth) {
            var skipForEach = false;
            var utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = appOptions.language || 'en-US';
            utterance.rate = appOptions.voiceRate || 1;
            utterance.text = textToSpeak;

            function updateVoiceName(voice) {
                utterance.voice = voice;
                skipForEach = true;
            }

            if (appOptions.voiceName) {
                AVAILABLE_VOICES_FOR_TTS.forEach(function (voice) {
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
                if (event.error === 'interrupted') {
                    console.debug(
                        'Speech was interrupted. This is expected if speech is canceled or a new utterance is started.'
                    );
                } else {
                    console.error('Error while converting the message to voice:', event.error);
                }
            };

            this.stopVoiceOutput();
            speechSynth.speak(utterance);
            return;
        }

        if (this.canUseFallbackVoiceOutput()) {
            var textToVoice = this.getFallbackVoiceClientMethod('textToVoice');
            var fallbackVoiceOutputRequestId;
            this.stopVoiceOutput();
            fallbackVoiceOutputRequestId = this.fallbackVoiceOutput.requestId;
            textToVoice(textToSpeak)
                .then(function (audioBlob) {
                    if (
                        Kommunicate.mediaService.isCurrentFallbackVoiceOutputRequest(
                            fallbackVoiceOutputRequestId
                        )
                    ) {
                        Kommunicate.mediaService.playFallbackVoiceOutput(audioBlob);
                    }
                })
                .catch(function (error) {
                    console.error('Error while converting the message to voice:', error);
                });
        }
    },
    stopVoiceOutput: function () {
        var speechSynth = this.getSpeechSynthesis();
        if (speechSynth) {
            speechSynth.cancel();
        }
        this.fallbackVoiceOutput.requestId += 1;
        this.clearFallbackVoiceOutput();
    },
    initRecorder: function () {
        const LIVE_OUTPUT = false; // a feature to live output the recording voice to the speaker
        const MAX_RECORD_TIME = 2 * 60 * 1000; // in milliseconds
        const TIMER_STATE = {
            EXPIRED: 0,
            RUNNING: 1,
            PAUSED: 2,
        };
        var START_TIME;
        var REMAINING_TIME;
        var pauseBtn = $applozic('#pause-btn');
        var playBtn = $applozic('#play-btn');
        var timeElapsedTimer = $applozic('#time-elapsed');
        var timeRemainingTimer = $applozic('#time-remaining');
        var playPausetimerState = TIMER_STATE.EXPIRED;
        var audioBlob;
        var wavAudioDuration;
        var playPauseInterval;
        var recorderInterval;
        var recorderAudio = document.querySelector('#recorder-audio');
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
                        var timeElapsed = (new Date().getTime() - START_TIME) / 1000;
                        var percent =
                            (Math.floor(timeElapsed) / Math.floor(wavAudioDuration)) * 100;
                        REMAINING_TIME = Math.floor(wavAudioDuration - timeElapsed);
                        var secondsElapsed = Math.floor(timeElapsed % 60);
                        var minutesElapsed = Math.floor((timeElapsed / 60) % 60);
                        timeRemainingTimer.text(
                            ('0' + minutesElapsed).slice(-2) +
                                ':' +
                                ('0' + secondsElapsed).slice(-2)
                        );
                        $applozic('#wave-front-progressBar').width(percent + '%');
                        if (REMAINING_TIME <= 0) {
                            clearTimeout(playPauseInterval);
                            playPausetimerState = TIMER_STATE.EXPIRED;
                            pauseBtn.addClass('n-vis');
                            playBtn.removeClass('n-vis');
                        }
                    } else if (playPausetimerState == TIMER_STATE.PAUSED) {
                        START_TIME += 1000;
                    }
                }, 1000);
                timeRemainingTimer.removeClass('n-vis');
            }
        }
        function startRecording() {
            Kommunicate.typingAreaService.showRecorder();
            // show
            kommunicateCommons.show('#delete-recording', '#mck-stop-recording', '#audiodiv');
            kommunicateCommons.hide('#play-btn', '#pause-btn', '#send-btn');
            timeElapsedTimer.removeClass('n-vis');
            timeRemainingTimer.removeClass('n-vis');

            Fr.voice.record(
                LIVE_OUTPUT,
                function () {
                    console.log('Recording started');
                    initTimer();
                },
                null,
                function (err) {
                    console.log('error', err);
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
                var minutesRemaining = Math.floor((timeRemaining / (1000 * 60)) % 60);
                timeElapsedTimer.text(
                    ('0' + minutesElapsed).slice(-2) + ':' + ('0' + secondsElapsed).slice(-2)
                );
                timeRemainingTimer.text(
                    ('0' + minutesRemaining).slice(-2) + ':' + ('0' + secondsRemaining).slice(-2)
                );
                $applozic('#wave-front-progressBar').width(percent + '%');
                if (timeRemaining <= 0) {
                    stopRecording();
                }
            }, 1000);
        }
        function stopRecording(e) {
            // show
            kommunicateCommons.show(
                '#delete-recording',
                '#play-btn',
                '#send-btn',
                '#time-remaining'
            );
            kommunicateCommons.hide('#pause-btn', '#mck-stop-recording', '#time-elapsed');
            clearInterval(recorderInterval);
            $applozic('#wave-front-progressBar').width('0%');
            timeRemainingTimer.text('00:00');
            Fr.voice.pause();
            Fr.voice.export(function (blob) {
                blob.name = 'voiceRecord-' + new Date().getTime() + '.wav';
                params.file = blob;
                params.callback = function () {
                    document.querySelector('#send-btn').classList.remove('disabled');
                };
                audioBlob = blob;
                $applozic.fn.applozic('audioAttach', params);
                var bloburl = URL.createObjectURL(audioBlob);
                $applozic('#recorder-audio').attr('src', bloburl);
            }, 'blob');
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
            recorderAudio.setAttribute('src', '');
            playPausetimerState = TIMER_STATE.EXPIRED;
            params = {};
            $applozic('#wave-front-progressBar').width('0%');
            timeElapsedTimer.text('00:00');
            timeRemainingTimer.text('02:00');
            document.querySelector('#send-btn').classList.add('disabled');

            // remove un-necessary eventListeners
            $applozic('#mck-conversation-back-btn').off('click', resetRecorder);
            $applozic('#km-faq').off('click', resetRecorder);
            $applozic('#km-popup-close-button').off('click', resetRecorder);
            $applozic('#km-chat-widget-close-button').off('click', resetRecorder);
        }
        function onPlayBtnClick(e) {
            var prevStateOfTimer = playPausetimerState;
            playPausetimerState = TIMER_STATE.RUNNING;
            playBtn.addClass('n-vis');
            pauseBtn.removeClass('n-vis');
            audioBlob && $applozic('#recorder-audio')[0].play();
            prevStateOfTimer == TIMER_STATE.EXPIRED && playPauseTimer();
        }
        function onPauseBtnClick(e) {
            $applozic('#recorder-audio')[0].pause();
            playPausetimerState = TIMER_STATE.PAUSED;
            pauseBtn.addClass('n-vis');
            playBtn.removeClass('n-vis');
        }

        document.querySelector('.mck-mic-animation-container .voiceNote').onclick = function () {
            startRecording();

            // on click of back button, close btn, and faq btn recording should end
            $applozic('#mck-conversation-back-btn').on('click', resetRecorder);
            $applozic('#km-faq').on('click', resetRecorder);
            $applozic('#km-popup-close-button').on('click', resetRecorder);
            $applozic('#km-chat-widget-close-button').on('click', resetRecorder);
        };
        document.getElementById('mck-stop-recording').onclick = stopRecording;
        document.getElementById('play-btn').onclick = onPlayBtnClick;
        document.getElementById('pause-btn').onclick = onPauseBtnClick;
        document.getElementById('delete-recording').onclick = function (e) {
            resetRecorder(e);
            document.querySelector('.mck-remove-file') &&
                document.querySelector('.mck-remove-file').click();
        };
        document.querySelector('#send-btn').onclick = function (e) {
            if (document.querySelector('#send-btn').classList.contains('disabled')) {
                return;
            }
            resetRecorder(e);
            document.querySelector('#mck-msg-sbmt') &&
                document.querySelector('#mck-msg-sbmt').click();
        };
    },
};
