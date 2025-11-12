var appOption = appOptionSession.getPropertyDataFromSession('appOptions') || applozic._globals;

Kommunicate.typingAreaService = {
    populateText: function (text) {
        $applozic('#mck-text-box').text(text);
        if (!kommunicateCommons.checkIfDeviceIsHandheld()) {
            $applozic('#mck-text-box').focus();
            this.setCursorAtTheEndOfInputString();
        }
    },
    setCursorAtTheEndOfInputString: function (el) {
        el = el || document.getElementById('mck-text-box');
        if (el.childNodes.length !== 0) {
            el.focus();
            if (
                typeof window.getSelection != 'undefined' &&
                typeof document.createRange != 'undefined'
            ) {
                var range = document.createRange();
                range.selectNodeContents(el);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (typeof document.body.createTextRange != 'undefined') {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(el);
                textRange.collapse(false);
                textRange.select();
            }
        } else {
            return false;
        }
    },
    showMicIfRequiredWebAPISupported: function () {
        if (appOption && appOption.voiceNote && !appOption.voiceInput) {
            if (!window.hasOwnProperty('MediaRecorder')) {
                console.log('browser does not support media recording');
                this.hideMicButton();
            } else {
                document
                    .querySelector('.mck-mic-animation-container svg#mck-mic-btn')
                    .classList.add('voiceNote');
                Kommunicate.mediaService.initRecorder();
                this.showMicButton();
            }
        } else if (appOption && appOption.voiceInput && !appOption.voiceNote) {
            if (!window.hasOwnProperty('webkitSpeechRecognition')) {
                console.log('browser do not support speech recognition');
                this.hideMicButton();
            } else {
                document
                    .querySelector('.mck-mic-animation-container svg#mck-mic-btn')
                    .classList.add('voiceInput');
                this.showMicButton();
            }
        } else if (appOption && appOption.voiceInput && appOption.voiceNote) {
            if (
                !window.hasOwnProperty('webkitSpeechRecognition') ||
                !window.hasOwnProperty('MediaRecorder')
            ) {
                console.log('browser do not support speech recognition or media recording');
                this.hideMicButton();
            } else {
                document
                    .querySelector('#mck-mic-animation-container')
                    .classList.add('mck-dropdown');
                document
                    .querySelector('#mck-mic-btn-container')
                    .classList.add('mck-dropdown-toggle');
                document.querySelector('#mck-mic-options-dropup').classList.remove('n-vis');
                document
                    .querySelector('.mck-mic-animation-container svg#mck-mic-btn')
                    .classList.add('availableOptions');
                Kommunicate.mediaService.initRecorder();
                this.showMicButton();
            }
        }
    },
    hideMicButton: function () {
        kommunicateCommons.hide('#mck-mic-animation-container');
    },
    showMicButton: function () {
        if (appOption && (appOption.voiceInput || appOption.voiceNote)) {
            kommunicateCommons.show('#mck-mic-animation-container');
        }
    },
    hideMiceRecordingAnimation: function () {
        kommunicateCommons.hide('#mck-animation-outer');
    },
    showMicRcordingAnimation: function () {
        kommunicateCommons.show('#mck-animation-outer');
    },
    showRecorder: function () {
        document.querySelector('#mck-textbox-container').classList.add('n-vis');
        document.querySelector('#km-voice-recorder').classList.remove('n-vis');
    },
    hideRecorder: function () {
        document.querySelector('#mck-textbox-container').classList.remove('n-vis');
        document.querySelector('#km-voice-recorder').classList.add('n-vis');
    },
};
