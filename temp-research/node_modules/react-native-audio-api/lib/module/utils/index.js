"use strict";

import AudioAPIModule from "../AudioAPIModule/index.js";
import { AudioApiError } from "../errors/index.js";
export function assertWorkletsEnabled() {
  if (!AudioAPIModule.areWorkletsAvailable) {
    throw new AudioApiError('[react-native-audio-api]: Worklets are not available. Please install react-native-worklets to use this feature.');
  }
  if (!AudioAPIModule.isWorkletsVersionSupported) {
    throw new AudioApiError(`[react-native-audio-api]: Worklets version ${AudioAPIModule.workletsVersion} is not supported.
      Please install react-native-worklets of one of the following versions: [${AudioAPIModule.supportedWorkletsVersion.join(', ')}] to use this feature.`);
  }
}
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
//# sourceMappingURL=index.js.map