Kommunicate.typingAreaService = {
    populateText: function (text) {
        $applozic('#mck-text-box').text(text);
        $applozic('#mck-text-box').focus();
        this.setCursorAtTheEndOfInputString();
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
    showMicIfSpeechRecognitionSupported: function () {
        if (!window.hasOwnProperty('webkitSpeechRecognition')) {
            console.log('browser do not support speech recognition');
            this.hideMicButton();
        } else {
            this.showMicButton();
        }
    },
    hideMicButton: function () {
        kommunicateCommons.modifyClassList(
            { id: ['mck-mic-animation-container'] },
            'n-vis',
            'vis'
        );
    },
    showMicButton: function () {
        var appOption =
            KommunicateUtils.getDataFromKmSession('appOptions') ||
            applozic._globals;
        if (appOption && appOption.voiceInput) {
            kommunicateCommons.modifyClassList(
                { id: ['mck-mic-animation-container'] },
                'vis',
                'n-vis'
            );
        }
    },
    hideMiceRecordingAnimation: function () {
        kommunicateCommons.modifyClassList(
            { id: ['mck-animation-outer'] },
            'n-vis',
            'vis'
        );
    },
    showMicRcordingAnimation: function () {
        kommunicateCommons.modifyClassList(
            { id: ['mck-animation-outer'] },
            'vis',
            'n-vis'
        );
    },
};
