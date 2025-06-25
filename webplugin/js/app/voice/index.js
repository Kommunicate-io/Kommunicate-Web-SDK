class Voice {
    _VOICE_PLATFORM_API_URL = 'https://api.elevenlabs.io';
    _VOICE_PLATFORM_API_KEY = 'sk_5af5c862dd8c87860ece549378c67628233440a018ac2e12';

    textToSpeechStream(text = '') {
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

    speechToText(audioBlob) {
        const apiUrl = `${this._VOICE_PLATFORM_API_URL}/v1/speech-to-text`;

        const headers = {
            'xi-api-key': `${this._VOICE_PLATFORM_API_KEY}`,
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
