class Voice {
    _VOICE_PLATFORM_API_URL = 'https://api.elevenlabs.io';
    _VOICE_PLATFORM_API_KEY = kommunicate._globals.voiceChatApiKey;
    _OMNICHANNEL_BASE_URL = 'https://omni-channel-test.kommunicate.io';
    _OMNICHANNEL_API_PREFIX = '/voice';
    _OMNICHANNEL_AUDIO_CONFIG = {
        bitsPerSample: 16,
        sampleRate: 8000,
        channelCount: 1,
    };

    get voiceChatConfig() {
        return (
            (typeof kommunicate !== 'undefined' &&
                kommunicate._globals &&
                kommunicate._globals.voiceChatSettings) ||
            {}
        );
    }

    get voiceInputConfig() {
        return (
            (typeof kommunicate !== 'undefined' &&
                kommunicate._globals &&
                kommunicate._globals.voiceInputSettings) ||
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

    get omnichannelConfig() {
        const globalConfig =
            (typeof kommunicate !== 'undefined' &&
                kommunicate._globals &&
                kommunicate._globals.omnichannelVoice) ||
            {};
        return this.voiceChatConfig.omnichannel || globalConfig;
    }

    getOmnichannelBaseUrl() {
        const config = this.omnichannelConfig || {};
        const pluginSettingsBaseUrl =
            typeof KM_PLUGIN_SETTINGS !== 'undefined' &&
            KM_PLUGIN_SETTINGS &&
            KM_PLUGIN_SETTINGS.omnichannelBaseUrl;
        return (config.baseUrl || pluginSettingsBaseUrl || this._OMNICHANNEL_BASE_URL).replace(
            /\/+$/,
            ''
        );
    }

    getOmnichannelApiUrl(path = '') {
        return `${this.getOmnichannelBaseUrl()}${this._OMNICHANNEL_API_PREFIX}${path}`;
    }

    getOmnichannelHeaders() {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        const config = this.omnichannelConfig || {};
        const authHeaderName = config.authHeaderName || 'Authorization';
        const authToken = config.authToken || config.token || null;
        if (authToken) {
            headers[authHeaderName] = authToken.startsWith('Bearer ')
                ? authToken
                : `Bearer ${authToken}`;
        }
        return headers;
    }

    textToSpeechStream(text = '') {
        const apiUrl = `${this._VOICE_PLATFORM_API_URL}/v1/text-to-speech/${this.voiceId}/stream`;
        const headers = {
            'xi-api-key': `${this._VOICE_PLATFORM_API_KEY}`,
            'Accept': 'audio/mpeg',
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

    textToVoice(text = '') {
        return fetch(this.getOmnichannelApiUrl('/text-to-voice'), {
            method: 'POST',
            headers: this.getOmnichannelHeaders(),
            body: JSON.stringify({ text }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
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

    async voiceToText(audioBlob, { ucid } = {}) {
        const samples = await this.extractPcmInt16Samples(audioBlob);
        const payload = {
            samples,
            bitsPerSample: this._OMNICHANNEL_AUDIO_CONFIG.bitsPerSample,
            sampleRate: this._OMNICHANNEL_AUDIO_CONFIG.sampleRate,
            channelCount: this._OMNICHANNEL_AUDIO_CONFIG.channelCount,
        };
        const resolvedUcid = ucid || this.voiceInputConfig.ucid || this.omnichannelConfig.ucid;
        if (resolvedUcid) {
            payload.ucid = resolvedUcid;
        }

        return fetch(this.getOmnichannelApiUrl('/voice-to-text'), {
            method: 'POST',
            headers: this.getOmnichannelHeaders(),
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
                throw error;
            });
    }

    async extractPcmInt16Samples(audioBlob) {
        const audioBuffer = await this.decodeAudioBlob(audioBlob);
        const mono = this.getMonoChannelData(audioBuffer);
        const downsampled = this.resampleToTargetRate(
            mono,
            audioBuffer.sampleRate,
            this._OMNICHANNEL_AUDIO_CONFIG.sampleRate
        );
        const int16Samples = this.float32ToInt16(downsampled);
        return Array.from(int16Samples);
    }

    async decodeAudioBlob(audioBlob) {
        const arrayBuffer = await audioBlob.arrayBuffer();
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
            throw new Error('AudioContext is not supported');
        }
        const audioContext = new AudioContextClass();
        try {
            return await audioContext.decodeAudioData(arrayBuffer.slice(0));
        } finally {
            if (typeof audioContext.close === 'function') {
                audioContext.close().catch(() => {});
            }
        }
    }

    getMonoChannelData(audioBuffer) {
        const channelCount = audioBuffer.numberOfChannels || 1;
        if (channelCount === 1) {
            return audioBuffer.getChannelData(0);
        }
        const frameCount = audioBuffer.length;
        const mono = new Float32Array(frameCount);
        for (let channel = 0; channel < channelCount; channel++) {
            const channelData = audioBuffer.getChannelData(channel);
            for (let i = 0; i < frameCount; i++) {
                mono[i] += channelData[i] / channelCount;
            }
        }
        return mono;
    }

    resampleToTargetRate(input, sourceRate, targetRate) {
        if (!input || !input.length || sourceRate === targetRate) {
            return input || new Float32Array(0);
        }
        const ratio = sourceRate / targetRate;
        const targetLength = Math.max(1, Math.round(input.length / ratio));
        const output = new Float32Array(targetLength);
        for (let i = 0; i < targetLength; i++) {
            const sourceIndex = i * ratio;
            const lower = Math.floor(sourceIndex);
            const upper = Math.min(lower + 1, input.length - 1);
            const weight = sourceIndex - lower;
            output[i] = input[lower] * (1 - weight) + input[upper] * weight;
        }
        return output;
    }

    float32ToInt16(floatData) {
        const buffer = new Int16Array(floatData.length);
        for (let i = 0; i < floatData.length; i++) {
            const sample = Math.max(-1, Math.min(1, floatData[i]));
            buffer[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        }
        return buffer;
    }

    createWavBlobFromOmnichannelFrames(payload = {}) {
        const frames = Array.isArray(payload.frames) ? payload.frames : [];
        const flattened = [];
        for (let i = 0; i < frames.length; i++) {
            const frame = frames[i];
            if (!Array.isArray(frame)) {
                continue;
            }
            for (let j = 0; j < frame.length; j++) {
                flattened.push(frame[j]);
            }
        }
        const pcmData = Int16Array.from(flattened);
        return this.createWavBlobFromPcmData(
            pcmData,
            payload.sampleRate || this._OMNICHANNEL_AUDIO_CONFIG.sampleRate,
            payload.channelCount || this._OMNICHANNEL_AUDIO_CONFIG.channelCount,
            payload.bitsPerSample || this._OMNICHANNEL_AUDIO_CONFIG.bitsPerSample
        );
    }

    createWavBlobFromPcmData(pcmData, sampleRate, channelCount, bitsPerSample) {
        const bytesPerSample = bitsPerSample / 8;
        const blockAlign = channelCount * bytesPerSample;
        const byteRate = sampleRate * blockAlign;
        const dataSize = pcmData.length * bytesPerSample;
        const buffer = new ArrayBuffer(44 + dataSize);
        const view = new DataView(buffer);

        this.writeAscii(view, 0, 'RIFF');
        view.setUint32(4, 36 + dataSize, true);
        this.writeAscii(view, 8, 'WAVE');
        this.writeAscii(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, channelCount, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, byteRate, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitsPerSample, true);
        this.writeAscii(view, 36, 'data');
        view.setUint32(40, dataSize, true);

        let offset = 44;
        for (let i = 0; i < pcmData.length; i++, offset += 2) {
            view.setInt16(offset, pcmData[i], true);
        }
        return new Blob([view], { type: 'audio/wav' });
    }

    writeAscii(view, offset, value) {
        for (let i = 0; i < value.length; i++) {
            view.setUint8(offset + i, value.charCodeAt(i));
        }
    }
}

const kmVoice = new Voice();
