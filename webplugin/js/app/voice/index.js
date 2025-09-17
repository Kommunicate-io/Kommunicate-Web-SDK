class Voice {
    _VOICE_PLATFORM_API_URL = 'https://api.elevenlabs.io';
    _VOICE_PLATFORM_API_KEY = kommunicate._globals.voiceChatApiKey;

    textToSpeechStream(
        text = '',
        {
            voiceId = 'pMsXgVXv3BLzUgSXRplE',
            outputFormat = 'mp3_22050_32',
            voiceSettings,
            signal,
        } = {}
    ) {
        const query = new URLSearchParams({
            output_format: outputFormat,
        }).toString();

        const apiUrl = `${this._VOICE_PLATFORM_API_URL}/v1/text-to-speech/${voiceId}/stream?${query}`;

        const headers = {
            'xi-api-key': `${this._VOICE_PLATFORM_API_KEY}`,
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
        };

        const payload = {
            text: text,
            model_id: 'eleven_flash_v2_5',
        };

        if (voiceSettings) {
            payload.voice_settings = voiceSettings;
        }

        return fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
            cache: 'no-store',
            signal,
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
