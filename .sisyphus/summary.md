## Plan Generated: OpenClaw Android Companion

**Key Decisions Made:**
- **Architecture**: React Native App acting as a custom **OpenClaw Node** (WebSocket).
- **Wakeup Mechanism**: **Firebase Cloud Messaging (FCM)** (High Priority) to bypass NAT/Background limits.
- **Voice Stack**: **WebSocket Audio Streaming** + **Gemini Multimodal Live API** (Server relays audio).
- **Call Experience**: Full-screen "Incoming Call" intent (Android 12+ compliant).

**Scope:**
- **IN**: React Native App source, OpenClaw Server Skill (Node.js), FCM Config, 2-Way Audio logic.
- **OUT**: App Store deployment, iOS support, complex VoIP (SIP/WebRTC).

**Guardrails Applied:**
- **No Public IP Assumption**: App initiates all connections (outbound WS).
- **Latency**: Using WebSocket streaming (not HTTP polling) for voice to keep latency <2s.

**Auto-Resolved Defaults:**
- **Audio Format**: Defaulting to **PCM 16kHz** (standard for STT/TTS) unless Gemini requires otherwise.
- **Permissions**: Added `FOREGROUND_SERVICE` and `WAKE_LOCK` to manifest plan.

**Plan Location**: `.sisyphus/plans/openclaw-mobile.md`

Ready to build? Select an option below.