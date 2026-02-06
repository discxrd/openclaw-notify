# Plan: OpenClaw Android Companion (Notifications & Gemini Calls)

## Context

### Original Request
Build a Node.js + TypeScript Android app (React Native) that acts as an OpenClaw companion.
**Key Features**:
1.  **Notifications**: Receive alerts from OpenClaw (even when app is killed/backgrounded).
2.  **Calls**: 2-way voice conversation powered by Gemini Multimodal API.
3.  **Network**: Phone has no public IP (behind NAT).

### Architecture Strategy
To solve the "No Public IP" and "Background Wakeup" constraints:

1.  **Control Channel (Wakeup)**: **Firebase Cloud Messaging (FCM)**.
    *   OpenClaw server sends "Data Message" to FCM.
    *   Android System wakes up the app.
2.  **Audio Channel (Voice)**: **WebSocket (Socket.io)**.
    *   App initiates outbound connection to OpenClaw Server (bypasses NAT).
    *   Streams raw audio (PCM/Opus).
3.  **Intelligence**: **Gemini Multimodal Live API**.
    *   Server relays App Audio -> Gemini.
    *   Server relays Gemini Audio -> App.

### Scope Boundaries
-   **IN**:
    -   React Native App (TypeScript).
    -   OpenClaw Custom Skill (Server-side Node.js).
    -   FCM Configuration (Client & Server).
    -   Full Screen Incoming Call UI (Android 12+ compliant).
    -   2-Way Audio Streaming Logic.
-   **OUT**:
    -   App Store deployment (APK build only).
    -   iOS support (focus on Android per request).
    -   Complex VoIP Infrastructure (SIP/WebRTC) - using simplified WebSocket streaming.

---

## Work Objectives

### Core Objective
Create a seamless "AI Hotline" experience where OpenClaw can call the user's phone, and the user can talk naturally to the Gemini model.

### Definition of Done
-   [ ] `server`: Can send a shell command `notify("msg")` that appears on the phone.
-   [ ] `server`: Can send `call()` which opens the full-screen UI on the phone.
-   [ ] `app`: User can pick up the call and speak.
-   [ ] `app`: User hears Gemini's response with < 2s latency.
-   [ ] `app`: "Hang up" terminates the session on both ends.

### Must Have
-   **FCM High Priority**: Required to wake device from Doze mode.
-   **Foreground Service**: Required to keep microphone alive during call.
-   **Permissions Handling**: Explicit requests for Audio, Notifications, Overlay.

---

## Verification Strategy

**Test Infrastructure**:
-   **App**: Manual Verification (Device/Emulator required).
-   **Server**: Manual Trigger (Curl/Scripts).
-   **Reason**: Mobile hardware features (Mic, Push, Overlay) are hard to unit test in CI.

**Manual Verification Procedures**:
1.  **Notification**: Trigger script -> Verify phone vibrates/rings.
2.  **Call Wakeup**: Lock phone -> Trigger call -> Verify "Accept/Decline" screen appears.
3.  **Voice Loop**: Speak "Hello" -> Verify Gemini responds audibly.

---

## Task Flow

```
Phase 1: App Foundation & FCM
     ↓
Phase 2: Call UI & Permissions
     ↓
Phase 3: Server-side Skill & Gemini
     ↓
Phase 4: Audio Streaming & Integration
```

---

## TODOs

### Phase 0: Prerequisites & Infrastructure (Zero Cost Setup)

> **Constraint: FREE**. All selected services must be free tiers.
> - **Gemini**: Google AI Studio Free Tier (`gemini-2.0-flash-exp` or `gemini-1.5-flash`).
> - **Firebase**: Spark Plan (Free).
> - **Hosting**: Self-hosted on local PC.
> - **Tunneling**: **Cloudflare Tunnel** (Free) to expose local Bridge Server to the internet (for App connection).

- [ ] 1. Firebase Project Setup
    -   **Action**: Create new Firebase Project (Spark Plan).
    -   **Steps**:
        1.  Go to Firebase Console -> Add Project "OpenClawMobile".
        2.  Android App -> Register package `com.openclaw.mobile`.
        3.  Download `google-services.json` -> Place in `android/app/`.
        4.  Project Settings -> Cloud Messaging -> Enable.
        5.  Service Accounts -> Generate new private key (`serviceAccountKey.json`) -> Save for Server.
    -   **Verify**: `google-services.json` exists locally.

- [ ] 2. Gemini API Setup (Free Tier)
    -   **Action**: Get Gemini API Key.
    -   **Steps**:
        1.  Go to Google AI Studio (aistudio.google.com).
        2.  Create API Key.
        3.  Ensure "Pay-as-you-go" is **OFF** (Stay in Free Tier).
        4.  Save as `GEMINI_API_KEY` in server `.env`.

- [ ] 2.1 Setup Cloudflare Tunnel (Free Public URL)
    -   **Reason**: App on 4G/5G cannot reach your Localhost/Home PC without a Public IP. Cloudflare Tunnel is free and persistent.
    -   **Action**: Install `cloudflared`.
    -   **Command**: `cloudflared tunnel --url http://localhost:3000` (Quick Tunnel) OR setup named tunnel.
    -   **Output**: Save the `https://....trycloudflare.com` URL. This will be the `serverUrl` sent to the App.


### Phase 1: App Foundation & FCM

- [ ] 3. Initialize React Native Project
    -   **Action**: Create `OpenClawMobile` with TypeScript template.
    -   **Config**: Setup `android/` build files (permissions, package name).
    -   **Output**: Running "Hello World" on Emulator/Device.
    -   **Command**: `npx react-native init OpenClawMobile --template react-native-template-typescript`

- [ ] 4. Configure Firebase Cloud Messaging (App)
    -   **Action**: Install `@react-native-firebase/app`, `@react-native-firebase/messaging`.
    -   **Config**: Apply `google-services.json`.
    -   **Code**:
        ```javascript
        // App.tsx
        import messaging from '@react-native-firebase/messaging';
        import { saveToken } from './api'; // See Task 5

        async function initFCM() {
          const authStatus = await messaging().requestPermission();
          if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
            const token = await messaging().getToken();
            console.log('FCM Token:', token);
            saveToken(token); // Register with server
          }
        }
        ```
    -   **Verify**: App launches and logs "FCM Token: [token]" in Metro bundler.

- [ ] 5. Implement Token Registration (Client)
    -   **Action**: Create API client to send token to server.
    -   **Code**:
        ```javascript
        // src/api.ts
        export const saveToken = async (token) => {
          // Replace with your server IP
          await fetch('http://10.0.2.2:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, deviceId: 'android-main' })
          });
        };
        ```
    -   **Verify**: Mock server receives POST /register with token.

- [ ] 6. Implement `system.notify` Handler
    -   **Action**: Install `@notifee/react-native`.
    -   **Code**:
        ```javascript
        // index.js
        import messaging from '@react-native-firebase/messaging';
        import notifee from '@notifee/react-native';

        // Background Handler
        messaging().setBackgroundMessageHandler(async remoteMessage => {
           const { type, title, body, uuid, callerName } = remoteMessage.data || {};
           
           if (type === 'notification') {
             await notifee.displayNotification({ title, body });
           } 
           else if (type === 'call') {
             // Wakes up the app with Full Screen UI
             // Requires 'uuid' and 'callerName' in payload
             const { displayIncomingCall } = require('./src/services/IncomingCallService');
             displayIncomingCall(uuid, callerName || 'OpenClaw Agent');
           }
        });
        ```
    -   **Verify**: Send test FCM payload via Firebase Console -> Notification appears.

### Phase 2: Call UI & Wakeup

- [ ] 7. Install Call UI & Permissions Dependencies
    -   **Libs**: `react-native-full-screen-notification-incoming-call`, `react-native-permissions`.
    -   **Manifest**: Add `USE_FULL_SCREEN_INTENT`, `FOREGROUND_SERVICE`, `WAKE_LOCK`.
    -   **Verify**: Build succeeds with new manifest entries.

- [ ] 8. Implement Incoming Call Screen
    -   **Action**: Create `src/services/IncomingCallService.ts`.
    -   **Code**:
        ```typescript
        import RNIncomingCall from 'react-native-full-screen-notification-incoming-call';
        import { DeviceEventEmitter } from 'react-native';

        export const displayIncomingCall = (uuid: string, name: string) => {
          RNIncomingCall.display({
            uuid,
            name,
            avatar: 'https://via.placeholder.com/100',
            info: 'OpenClaw Agent',
            timeout: 30000,
          });
        };

        // Listen for actions
        RNIncomingCall.addEventListener('answer', () => {
          RNIncomingCall.dismiss();
          DeviceEventEmitter.emit('call_answered');
        });
        
        RNIncomingCall.addEventListener('endCall', () => {
          RNIncomingCall.dismiss();
          DeviceEventEmitter.emit('call_ended');
        });
        ```
    -   **Verify**: Trigger `displayIncomingCall` -> Phone shows full screen UI -> Press "Answer" -> Event `call_answered` emitted.

### Phase 3: OpenClaw Bridge Server

> **Architecture Note**: This Bridge Server acts as the "Phone Node". OpenClaw interacts with it via HTTP Webhooks.
> - **OpenClaw -> Bridge**: HTTP POST (to trigger calls/notifies).
> - **Bridge -> OpenClaw**: (Future) Webhook callbacks for status.

- [ ] 9. Create Bridge Server Structure
    -   **Action**: Create `openclaw-bridge/` (Node.js).
    -   **Deps**: `express` (API), `firebase-admin` (FCM), `ws` (Audio), `@google/generative-ai` (Gemini), `dotenv`.
    -   **Config**: Load `serviceAccountKey.json` and `.env` (GEMINI_API_KEY).
    -   **State**: Simple in-memory store `const devices = new Map();` for tokens.
    -   **Endpoints**:
        -   `POST /register`: Save `{ token, deviceId }` to map.
        -   `POST /notify`: Send FCM notification to registered device.
        -   `POST /call`: Send FCM "call" trigger.
    -   **Verify**: Start server -> `curl -X POST /register` works.

- [ ] 10. Implement `notify` and `call` Commands
    -   **Action**: Implement POST handlers.
    -   **Code**:
        ```javascript
        // Notify
        app.post('/notify', async (req, res) => {
          const { text } = req.body;
          const token = devices.get('android-main');
          if (!token) return res.status(404).send('No device');
          
          await admin.messaging().send({
            token,
            data: { type: 'notification', title: 'OpenClaw', body: text, priority: 'high' }
          });
          res.send('Sent');
        });

        // Call (The Wakeup Trigger)
        app.post('/call', async (req, res) => {
          const token = devices.get('android-main');
          if (!token) return res.status(404).send('No device');

          const uuid = require('crypto').randomUUID();
          // PUBLIC_URL must be the Cloudflare Tunnel URL (wss://...)
          const serverUrl = process.env.PUBLIC_URL || 'wss://your-tunnel-url.trycloudflare.com';

          await admin.messaging().send({
            token,
            data: { 
              type: 'call', 
              uuid, 
              callerName: 'OpenClaw AI', 
              priority: 'high',
              // App connects here
              serverUrl
            }
          });
          res.send({ status: 'Calling', uuid });
        });
        ```
    -   **Verify**: Register token -> Trigger `/call` -> Phone shows Incoming Call screen.

- [ ] 11. Implement Gemini Audio Bridge (Server)
    -   **Action**: Setup WebSocket Server (`ws`) that bridges App <-> Gemini.
    -   **Specs**:
        -   **Gemini URL**: `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`
        -   **Auth**: Header `x-goog-api-key: ${process.env.GEMINI_API_KEY}`.
        -   **Audio Format**: PCM 16kHz Mono (Input), PCM 24kHz (Output).
    -   **Code Pattern**:
        ```javascript
        const WebSocket = require('ws');
        const GEMINI_URL = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent';

        const wss = new WebSocket.Server({ server: httpServer });

        wss.on('connection', (appSocket) => {
          console.log('App connected for audio');

          // 1. Connect to Gemini (with Auth Header)
          const geminiWs = new WebSocket(GEMINI_URL, {
            headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY }
          });
          
          geminiWs.on('open', () => {
            // 2. Initial Setup (Model Config)
            const setupMsg = {
              setup: {
                model: "models/gemini-2.0-flash-exp",
                generationConfig: {
                  responseModalities: ["AUDIO"],
                  speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } } }
                }
              }
            };
            geminiWs.send(JSON.stringify(setupMsg));
          });

          // 3. Relay: App Audio -> Gemini
          appSocket.on('message', (data) => {
            const { type, payload } = JSON.parse(data);
            if (type === 'audio' && geminiWs.readyState === WebSocket.OPEN) {
              // Gemini expects "realtimeInput" with "mediaChunks"
              geminiWs.send(JSON.stringify({ 
                realtimeInput: { mediaChunks: [{ mimeType: "audio/pcm", data: payload }] } 
              }));
            }
          });

          // 4. Relay: Gemini Audio -> App
          geminiWs.on('message', (msg) => {
             const response = JSON.parse(msg);
             const audioData = response.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
             if (audioData) {
               appSocket.send(JSON.stringify({ type: 'audio', payload: audioData }));
             }
          });

          // Cleanup
          appSocket.on('close', () => geminiWs.close());
          geminiWs.on('close', () => appSocket.close());
        });
        ```
    -   **Verify**: Connect wscat -> Send "Hello" audio chunk -> Receive response audio chunk.

### Phase 4: Integration & Audio

- [ ] 12. Implement App Audio Streaming (Client)
    -   **Libs**: `react-native-live-audio-stream` (Input), `react-native-pcm-player` (Output).
    -   **Config**:
        ```javascript
        // Input: 16kHz, Mono, 16-bit (Standard for STT)
        const inputOptions = { sampleRate: 16000, channels: 1, bitsPerSample: 16, audioSource: 6, bufferSize: 4096 };
        
        // Output: 24kHz (Matches Gemini Output)
        const outputSampleRate = 24000; 
        ```
    -   **Logic (AudioController.ts)**:
        ```javascript
        import LiveAudioStream from 'react-native-live-audio-stream';
        import PCMPlayer from 'react-native-pcm-player';
        
        let ws;

        export const startAudioSession = (serverUrl) => {
          ws = new WebSocket(serverUrl);
          PCMPlayer.init({ sampleRate: 24000, channelConfig: 'MONO', audioFormat: 'ENCODING_PCM_16BIT' });
          LiveAudioStream.init(inputOptions);

          ws.onopen = () => {
            LiveAudioStream.start(); // Start Mic
          };

          // 1. Mic -> Server
          LiveAudioStream.on('data', (base64Audio) => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'audio', payload: base64Audio }));
            }
          });

          // 2. Server -> Speaker
          ws.onmessage = (event) => {
             const { type, payload } = JSON.parse(event.data);
             if (type === 'audio') PCMPlayer.play(payload);
          };
        };

        export const stopAudioSession = () => {
          LiveAudioStream.stop();
          ws?.close();
        };
        ```
    -   **Verify**: Echo test (Server bounces audio back).

- [ ] 13. Connect Call UI to Audio (The "Glue")
    -   **Action**: Update `IncomingCallService.ts` to trigger audio.
    -   **Code**:
        ```typescript
        import { startAudioSession, stopAudioSession } from './AudioController';
        import { startCallForeground, stopCallForeground } from './ForegroundService'; // See Task 14

        // 1. Listen for Answer
        RNIncomingCall.addEventListener('answer', (payload) => {
          RNIncomingCall.dismiss();
          
          // Start Foreground Service (Mic Safety)
          startCallForeground();
          
          // Connect to Bridge (URL from FCM payload or config)
          const serverUrl = payload?.serverUrl || 'ws://10.0.2.2:3000';
          startAudioSession(serverUrl); 
        });

        // 2. Listen for End Call
        RNIncomingCall.addEventListener('endCall', () => {
           stopAudioSession();
           stopCallForeground();
           RNIncomingCall.dismiss();
        });
        ```
    -   **Verify**: Answer call -> WebSocket connection is attempted (log verification).

- [ ] 14. Implement Foreground Service (Mic Safety)
    -   **Action**: Ensure App stays alive during call.
    -   **Lib**: `@notifee/react-native`.
    -   **Code**:
        ```javascript
        import notifee from '@notifee/react-native';

        export async function startCallForeground() {
          // Channel required for Android 8+
          const channelId = await notifee.createChannel({
            id: 'call_channel',
            name: 'Ongoing Calls',
            importance: 4 // HIGH
          });

          await notifee.displayNotification({
            id: 'ongoing-call',
            title: 'Call in Progress',
            body: 'Connected to OpenClaw',
            android: {
              channelId,
              asForegroundService: true, // Critical for Mic
              ongoing: true,
              actions: [{ title: 'Hangup', pressAction: { id: 'hangup' } }]
            },
          });
        }

        export async function stopCallForeground() {
          await notifee.stopForegroundService();
        }
        ```
    -   **Verify**: Notification appears with "Foreground Service" active badge.

- [ ] 15. End-to-End Test
    -   **Action**:
        1.  Server triggers Call.
        2.  App wakes up.
        3.  User answers.
        4.  User says "Hello OpenClaw".
        5.  Gemini responds.
    -   **Success**: Voice conversation works.

---

## Success Criteria
- [ ] FCM Token is generated and logged.
- [ ] Notification appears on device.
- [ ] Incoming Call screen appears on locked device.
- [ ] Audio flows 2-way with acceptable latency (<2s).
