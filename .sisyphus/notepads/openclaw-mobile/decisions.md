- Added `react-native-device-info` to get a unique stable ID for the device instead of hardcoding "android-main".
- Added `@react-native-async-storage/async-storage` to persist the Server URL, allowing the user to configure it once.
- Added `@react-native-clipboard/clipboard` for the "Generate Config" feature to facilitate easy setup.
- Added PUBLIC_URL=wss://localhost:3000 to .env for local development.

- Chose to use GitHub Secrets for GOOGLE_SERVICES_JSON to support CI/CD while keeping sensitive configuration out of version control.
### CI Dependency Management
- Added 'npm install' to the GitHub Actions workflow before Gradle build to ensure JS dependencies are available for React Native's bundling process.
### Trigger Utility Flexibility
- Modified trigger-call.js and trigger-notify.js to accept dynamic deviceId via process.argv[2] while defaulting to 'android-main' for stability.
- Compatibility: RN 0.83 requires patching older native modules that use deprecated ReactFragment.Builder patterns.
