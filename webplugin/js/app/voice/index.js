class Voice {
    // Using _ instead of # for compatibility with build tools
    _VOICE_PLATFORM_API_URL = 'https://api.elevenlabs.io';
    _VOICE_PLATFORM_API_KEY = 'sk_7ba045de9adb822a311d047def576415659d9465f26e6b73';
    constructor() {
        this.voices = [];
        this.hasMoreVoices = true;
        this.audioQueue = [];
    }

    getVoices(resetVoicePagination = false) {
        if (resetVoicePagination) {
            this.hasMoreVoices = true;
        }

        const apiURL = `${this._VOICE_PLATFORM_API_URL}/v2/voices`;
        const headers = {
            'xi-api-key': `${this._VOICE_PLATFORM_API_KEY}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        fetch(apiURL, {
            method: 'GET',
            headers: headers,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                resetVoicePagination
                    ? (this.voices = data.voices)
                    : this.voices.push(...data.voices);
                this.hasMoreVoices = data.has_more;
                console.log(data);
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    streamTextToSpeech(text = '') {
        const apiUrl = `${this._VOICE_PLATFORM_API_URL}/v1/text-to-speech/pMsXgVXv3BLzUgSXRplE/stream`;

        const headers = {
            'xi-api-key': `${this._VOICE_PLATFORM_API_KEY}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        return fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                text: text,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                return response;
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
                throw error;
            });
    }

    textToSpeech(text = '', voiceId = 'kristy') {
        const apiUrl = `${this._VOICE_PLATFORM_API_URL}/v1/audio/speech`;
        const headers = {
            'Authorization': `Bearer ${this._VOICE_PLATFORM_API_KEY}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                input: text,
                voice_id: voiceId,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    speechToText(audioBlob) {
        const apiUrl = `${this._VOICE_PLATFORM_API_URL}/v1/speech-to-text`;

        const headers = {
            'xi-api-key': `${this._VOICE_PLATFORM_API_KEY}`,
            // 'Accept': 'application/json',
            // 'Content-Type': 'application/json',
        };

        const formdata = new FormData();
        formdata.append('model_id', 'scribe_v1');
        formdata.append('file', audioBlob, 'file');
        formdata.append('tag_audio_events', false);

        const requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: headers,
        };

        return fetch(apiUrl, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
                throw error;
            });
    }
}

const kmVoice = new Voice();
