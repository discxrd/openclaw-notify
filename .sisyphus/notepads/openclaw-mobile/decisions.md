## Architectural Choices
- Chose  as entry point.
- Using  for environment variable management.
- Included  for developer onboarding.
## Architectural Choices
- Chose server.js as entry point.
- Using dotenv for environment variable management.
- Included .env.example for developer onboarding.

- Decided to allow `deviceId` to be passed in request bodies for `/register`, `/notify`, and `/call`, defaulting to `android-main` to maintain compatibility with the initial plan while allowing future flexibility.
- Used `admin.apps.length > 0` check to determine if Firebase Admin was successfully initialized before attempting to send real FCM messages.
