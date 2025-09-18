class Voice {
    _VOICE_PLATFORM_API_URL = 'https://api.elevenlabs.io';
    _VOICE_PLATFORM_API_KEY = kommunicate._globals.voiceChatApiKey;

    textToSpeechStream(
        text = '',
        {
            voiceId = 'pMsXgVXv3BLzUgSXRplE',
            modelId = 'eleven_turbo_v2',
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
        };

        const configuredModelId =
            (typeof kommunicate !== 'undefined' &&
                kommunicate._globals &&
                kommunicate._globals.voiceChatModel) ||
            modelId;

        payload.model_id = configuredModelId;

        if (voiceSettings) {
            payload.voice_settings = voiceSettings;
        }
        console.log(payload, 'calling stream', 'Test time');
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
                console.log(response, 'stream', 'Test time');
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
        console.log(requestOptions, 'calling stt', 'Test time');

        return fetch(apiUrl, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log(response, 'speechToText', 'Test time');
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
