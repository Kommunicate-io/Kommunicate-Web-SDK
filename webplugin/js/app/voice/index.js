class Voice {
    _VOICE_PLATFORM_API_URL = 'https://api.elevenlabs.io';
    _VOICE_PLATFORM_API_KEY = kommunicate._globals.voiceChatApiKey;

    get voiceChatConfig() {
        return (
            (typeof kommunicate !== 'undefined' &&
                kommunicate._globals &&
                kommunicate._globals.voiceChatSettings) ||
            {}
        );
    }

    get voiceId() {
        return this.voiceChatConfig.voiceId || 'pMsXgVXv3BLzUgSXRplE';
    }

    get voiceSettingsPayload() {
        const settings = {};
        const config = this.voiceChatConfig;
        if (config.stability !== undefined) {
            settings.stability = config.stability;
        }
        if (config.similarityBoost !== undefined) {
            settings.similarity_boost = config.similarityBoost;
        }
        if (config.style !== undefined) {
            settings.style = config.style;
        }
        if (config.useSpeakerBoost !== undefined) {
            settings.use_speaker_boost = config.useSpeakerBoost;
        }
        return Object.keys(settings).length ? settings : null;
    }

    textToSpeechStream(text = '') {
        const apiUrl = `${this._VOICE_PLATFORM_API_URL}/v1/text-to-speech/${this.voiceId}/stream`;
        const headers = {
            'xi-api-key': `${this._VOICE_PLATFORM_API_KEY}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        const payload = { text };
        const config = this.voiceChatConfig;
        if (config.speed !== undefined) {
            payload.speed = config.speed;
        }
        if (config.model) {
            payload.model = config.model;
        }
        const voiceSettings = this.voiceSettingsPayload;
        if (voiceSettings) {
            payload.voice_settings = voiceSettings;
        }

        return fetch(apiUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
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
