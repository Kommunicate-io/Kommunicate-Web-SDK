class Voice {
    #VOICE_PLATFORM_API_URL = 'https://api.sws.speechify.com';
    #VOICE_PLATFORM_API_KEY = 'FTKfDBJNs57Oe1pGL67xJR-_m0YVs70BAP7QP-zWSm4=';
    constructor() {
        this.voices = [];
        this.hasMoreVoices = true;
        this.audioQueue = [];
    }

    getVoices(resetVoicePagination = false) {
        if (resetVoicePagination) {
            this.hasMoreVoices = true;
        }

        const apiURL = `${this.#VOICE_PLATFORM_API_URL}/v2/voices`;
        const headers = {
            'xi-api-key': `${this.#VOICE_PLATFORM_API_KEY}`,
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

    processMessagesAsAudio(msg) {
        this.audioQueue.push(msg);
        if (this.audioQueue.length > 1) {
            return;
        }
        this.streamTextToSpeech(msg.message);
    }
    streamTextToSpeech(text = '') {
        const apiUrl = `${this.#VOICE_PLATFORM_API_URL}/v1/audio/stream`;
        const headers = {
            'Authorization': `Bearer ${this.#VOICE_PLATFORM_API_KEY}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                input: text,
                voice_id: 'lisa',
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                return response;
                // return response.json();
            })
            .then((response) => {
                this.processAudio(response);
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    async processAudio(response) {
        try {
            const audioBlob = await response.blob();
            const audioBlobUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioBlobUrl);

            console.log('Audio length =>', audio.duration);
            console.log('Audio is muted =>', audio.muted);
            await audio.play();

            audio.onplay = () => {
                console.log('Playback started');
            };
            audio.onerror = (err) => {
                console.error('Playback failed', err);
            };
            audio.onended = () => {
                URL.revokeObjectURL(audioBlobUrl);
                console.log('Playback ended');
                this.audioQueue.shift();
                if (this.audioQueue.length > 0) {
                    this.streamTextToSpeech(this.audioQueue[0].message);
                }
            };
        } catch (error) {
            console.error('Playback failed:', error);
        }
    }

    textToSpeech(text = '', voiceId = 'kristy') {
        const apiUrl = `${this.#VOICE_PLATFORM_API_URL}/v1/audio/speech`;
        const headers = {
            'Authorization': `Bearer ${this.#VOICE_PLATFORM_API_KEY}`,
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
}

const kmVoices = new Voice();
