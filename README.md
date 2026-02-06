# OpenClaw Mobile & Bridge

A React Native Android companion app for OpenClaw, featuring FCM background wakeups and Gemini Multimodal Live (2-way voice).

## Prerequisites (User Action Required)

### 1. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a project.
3. Add an Android App with package name: `com.openclaw.mobile`.
4. Download `google-services.json` and place it in:
   `OpenClawMobile/android/app/google-services.json`
5. Go to Project Settings -> Service Accounts.
6. Generate a new private key.
7. Save the file as `serviceAccountKey.json` and place it in:
   `openclaw-bridge/serviceAccountKey.json`

### 2. Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Get a Free Tier API Key.
3. Create a `.env` file in `openclaw-bridge/`:
   ```env
   GEMINI_API_KEY=your_api_key_here
   PORT=3000
   # PUBLIC_URL will be set by Cloudflare or manually
   ```

### 3. Network Setup (Choose One)
Since your phone needs to communicate with the Bridge Server (often across different networks like 4G/5G), you need a public endpoint.

#### Option A: Local Development / Home Server (Cloudflare Tunnel)
Best for home setups without a public IP or port forwarding.
1. Install `cloudflared`.
2. Run: `cloudflared tunnel --url http://localhost:3000`
3. Copy the `https://....trycloudflare.com` URL.
4. You will use this URL for the app connection and trigger scripts.

#### Option B: Production / VPS Setup (Direct Connection)
Best for VPS (DigitalOcean, AWS, etc.) or servers with a Public IP.
1. **Expose Port**: Ensure port `3000` is open in your firewall (e.g., `ufw allow 3000`).
2. **Reverse Proxy (Recommended)**: Use Nginx or Caddy to map a domain to `localhost:3000` and handle SSL.
3. **SSL/HTTPS**: 
   - Android strongly prefers HTTPS/WSS for production traffic. 
   - If using a domain, set up Let's Encrypt.
   - Use `http://<your-vps-ip>:3000` for quick testing (Cleartext is enabled in the dev build).
4. **Server URL**: Your URL will be `http://<your-ip>:3000` or `https://<your-domain>`.

---

## How to Run

### 1. Start the Bridge Server
```bash
cd openclaw-bridge
npm install
node server.js
```

### 2. Run the Android App (Choose One)

#### Option A: Local Build (Requires Android SDK)
```bash
cd OpenClawMobile
npm install
npx react-native run-android
```

#### Option C: Cloud Build (No SDK Installed)
If you don't have the Android SDK installed locally, you can build the APK using GitHub Actions.
1. Push this code to a GitHub repository.
2. **Setup Firebase Secret**:
    - Go to GitHub Repo **Settings** -> **Secrets and variables** -> **Actions**.
    - Create a **"New repository secret"**.
    - Name: `GOOGLE_SERVICES_JSON`.
    - Value: Paste the content of your `google-services.json` file.
3. Go to the **"Actions"** tab.
4. Select the **"Build Android APK"** workflow.
5. Once finished, download the `app-debug` artifact.

### 3. Test the System
**To Pair the Device:**
1. Open the App on your Android device.
2. Enter your Bridge Server URL (e.g., `https://your-tunnel.trycloudflare.com` or `http://<vps-ip>:3000`).
3. Tap **"Register Device"** to auto-connect.
4. OR Tap **"Generate Config MD"** to copy a configuration snippet (useful for manual OpenClaw setup).

**To Trigger a Call:**
In a new terminal:
```bash
# Replace SERVER_URL with your Cloudflare URL (wss://...)
# If testing on Emulator, you can skip PUBLIC_URL and it defaults to mock
cd openclaw-bridge
node trigger-call.js
```

**To Send a Notification:**
```bash
cd openclaw-bridge
node trigger-notify.js
```

## Architecture
- **App**: React Native + `react-native-live-audio-stream` + `react-native-pcm-player`.
- **Bridge**: Node.js Express + WebSocket Proxy.
- **AI**: Gemini Multimodal Live API (`gemini-2.0-flash-exp`).
