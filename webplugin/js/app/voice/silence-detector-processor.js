// silence-detector-processor.js
class SilenceDetectorProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.silenceThreshold = 0.05;
        this.isSilent = false;
        this.lastSilenceState = false;

        // Setup message port for communication with main thread
        this.port.onmessage = (event) => {
            if (event.data.silenceThreshold !== undefined) {
                this.silenceThreshold = event.data.silenceThreshold;
            }
        };
    }

    process(inputs, outputs) {
        // Get the first input channel
        const input = inputs[0];
        if (!input || !input.length) {
            return true;
        }

        const channel = input[0];

        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < channel.length; i++) {
            sum += Math.abs(channel[i]);
        }
        const average = sum / channel.length;

        // Determine if silent based on threshold
        this.isSilent = average < this.silenceThreshold;

        // Only send message when silence state changes
        if (this.isSilent !== this.lastSilenceState) {
            this.port.postMessage({
                isSilent: this.isSilent,
                volume: average,
            });
            this.lastSilenceState = this.isSilent;
        }

        // Return true to keep the node alive
        return true;
    }
}

registerProcessor('silence-detector-processor', SilenceDetectorProcessor);
