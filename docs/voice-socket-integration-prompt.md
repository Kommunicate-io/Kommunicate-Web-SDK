Use this prompt with the Omnichannel/backend project team:

Implement `text_to_voice` over socket topics to match Kommunicate Web SDK contract.

Goal:

-   Serve `text_to_voice` responses over websocket request/response.
-   Use `requestId` correlation.
-   Do not change `voice_to_text`; frontend currently sends STT via HTTP.

Topic configuration expected by frontend:

-   requestTopic: `/topic/voice/requests`
-   responseTopic: `/topic/voice/responses/<user-or-session-id>`
-   If needed, same topic can be used for request + response.

Incoming request envelope from frontend:

```json
{
  "action": "text_to_voice",
  "requestId": "km-voice-<timestamp>-<seq>",
  "timestamp": 1739999999999,
  "payload": { ... },
  "context": {
    "conversationId": "..."
  }
}
```

Action payloads:

-   `text_to_voice` payload:

```json
{
    "text": "Hello",
    "source": "web",
    "sampleRate": 24000
}
```

Backend response envelope (success):

```json
{
  "requestId": "km-voice-...",
  "status": "success",
  "payload": { ...result... }
}
```

Backend response envelope (error):

```json
{
    "requestId": "km-voice-...",
    "status": "error",
    "error": { "message": "Failure reason" }
}
```

Result payload contract:

-   For `text_to_voice`:

```json
{
  "frames": [[...], [...]],
  "bitsPerSample": 16,
  "sampleRate": 24000,
  "channelCount": 1
}
```

Additional requirements:

-   Ensure idempotent correlation via `requestId` (or `correlationId`).
-   Send responses quickly; frontend timeout is 30s by default.
-   Preserve exact numeric/audio field names to avoid frontend parsing changes.
-   If socket is unavailable, frontend falls back to HTTP for `text_to_voice`.
