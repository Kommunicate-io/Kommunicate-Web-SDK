/**
 * "Connect via call" on handover: calls the human agent assigned to the conversation
 * from the browser through the Twilio Voice SDK (loaded together with this file).
 */
class KmWebCall {
    _ASSIGNEE_WAIT_MS = 15000;
    _ASSIGNEE_POLL_MS = 500;
    _END_MESSAGE_MS = 6000;
    _attempt = 0;
    _active = false;
    _answered = false;
    _device = null;
    _call = null;
    _timerId = null;
    _hideBarTimeoutId = null;

    constructor() {
        this.bar = document.getElementById('km-web-call-bar');
        this.statusText = document.getElementById('km-web-call-status');
        this.timer = document.getElementById('km-web-call-timer');
        this.muteButton = document.getElementById('km-web-call-mute');
        this.hangUpButton = document.getElementById('km-web-call-hangup');
        this.muteButton.addEventListener('click', () => this._call.mute(!this._call.isMuted()));
        this.hangUpButton.addEventListener('click', () => this.hangUp());
    }

    get labels() {
        return MCK_LABELS.webCall;
    }

    // botId: the bot the chat was with at the click ('' if already with an agent); Omni-Channel gives
    // the chat back to it when the agent does not answer.
    async start(groupId, botId) {
        if (this._active) {
            return;
        }
        this._active = true;
        const attempt = this._attempt;
        const isCancelled = () => attempt !== this._attempt;
        this.showBar(this.labels.connecting);

        if (!(await this.hasMicrophoneAccess())) {
            isCancelled() || this.end(this.labels.micDenied);
            return;
        }
        try {
            await this.waitForHumanAssignee(groupId, isCancelled);
            if (isCancelled()) {
                return;
            }
            const { token, applicationId, userId } = await this.fetchToken(groupId);
            if (isCancelled()) {
                return;
            }
            this._device = new Twilio.Device(token, { closeProtection: true });
            this._device.on('error', (error) => console.error('Web call device error', error));
            // Omni-Channel checks appId and userId against the token identity, so they are the token's own.
            const call = await this._device.connect({
                params: { appId: applicationId, userId, groupId: String(groupId), botId },
            });
            if (isCancelled()) {
                call.disconnect();
                return;
            }
            this._call = call;
            this.bindCallEvents(call);
        } catch (error) {
            console.error('Web call could not be connected', error);
            isCancelled() || this.end(this.labels.failed);
        }
    }

    hangUp() {
        this._active && this.end();
    }

    async hasMicrophoneAccess() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach((track) => track.stop());
            return true;
        } catch (error) {
            console.error('Microphone access for the web call failed', error);
            return false;
        }
    }

    isHumanAssigned(groupId) {
        return (
            CURRENT_GROUP_DATA.tabId == groupId &&
            !!CURRENT_GROUP_DATA.conversationAssignee &&
            !CURRENT_GROUP_DATA.isConversationAssigneeBot
        );
    }

    // The handover click is processed by the bot; updateAssigneeDetails marks the new human assignee.
    waitForHumanAssignee(groupId, isCancelled) {
        const deadline = Date.now() + this._ASSIGNEE_WAIT_MS;
        return new Promise((resolve, reject) => {
            const check = () => {
                if (isCancelled() || this.isHumanAssigned(groupId)) {
                    resolve();
                } else if (Date.now() >= deadline) {
                    reject(new Error('No human assignee for the web call'));
                } else {
                    setTimeout(check, this._ASSIGNEE_POLL_MS);
                }
            };
            check();
        });
    }

    fetchToken(groupId) {
        return new Promise((resolve, reject) => {
            mckUtils.ajax({
                url:
                    Kommunicate.getBaseUrl() +
                    '/rest/ws/voice/web-call-token?groupId=' +
                    encodeURIComponent(groupId),
                type: 'get',
                headers: {
                    'x-authorization': window.Applozic.ALApiService.AUTH_TOKEN,
                },
                skipEncryption: true,
                global: false,
                success: (response) => resolve(response.data),
                error: reject,
            });
        });
    }

    // With answerOnBridge, "accept" fires only when the agent accepts in the Dashboard.
    bindCallEvents(call) {
        const isCurrentCall = () => call === this._call;
        call.on('ringing', () => isCurrentCall() && this.setStatus(this.labels.ringing));
        call.on('accept', () => {
            if (!isCurrentCall()) {
                return;
            }
            this._answered = true;
            this.setStatus(this.labels.inCall);
            this.updateMuteButton(false);
            kommunicateCommons.show(this.muteButton, this.timer);
            this.startTimer();
        });
        call.on('mute', (muted) => isCurrentCall() && this.updateMuteButton(muted));
        call.on('disconnect', () => isCurrentCall() && this.endAfterCall());
        call.on('error', (error) => {
            console.error('Web call error', error);
            isCurrentCall() && this.endAfterCall();
        });
    }

    endAfterCall() {
        this.end(this._answered ? null : this.labels.failed);
    }

    end(message) {
        this._attempt++;
        this._active = false;
        this._answered = false;
        this._call = null;
        clearInterval(this._timerId);
        // destroy() disconnects the call too; its "disconnect" event is ignored as _call is cleared.
        this._device && this._device.destroy();
        this._device = null;
        if (message) {
            this.showEndMessage(message);
        } else {
            kommunicateCommons.hide(this.bar);
        }
    }

    showBar(status) {
        clearTimeout(this._hideBarTimeoutId);
        this.setStatus(status);
        this.hangUpButton.textContent = this.labels.hangUp;
        this.timer.textContent = this.formatDuration(0);
        kommunicateCommons.hide(this.muteButton, this.timer);
        kommunicateCommons.show(this.bar, this.hangUpButton);
    }

    showEndMessage(message) {
        this.setStatus(message);
        kommunicateCommons.hide(this.muteButton, this.timer, this.hangUpButton);
        this._hideBarTimeoutId = setTimeout(
            () => kommunicateCommons.hide(this.bar),
            this._END_MESSAGE_MS
        );
    }

    setStatus(status) {
        this.statusText.textContent = status;
    }

    updateMuteButton(muted) {
        this.muteButton.textContent = muted ? this.labels.unmute : this.labels.mute;
        this.muteButton.setAttribute('aria-pressed', String(muted));
    }

    startTimer() {
        const startedAt = Date.now();
        this._timerId = setInterval(() => {
            this.timer.textContent = this.formatDuration((Date.now() - startedAt) / 1000);
        }, 1000);
    }

    formatDuration(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    }
}

const kmWebCall = new KmWebCall();
