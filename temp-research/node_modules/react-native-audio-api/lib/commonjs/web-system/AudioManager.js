"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const mockAsync = value => () => Promise.resolve(value);
const mockSync = value => () => value;
class AudioManager {
  getDevicePreferredSampleRate = mockSync(44100);
  setAudioSessionActivity = mockAsync(true);
  setAudioSessionOptions = mockSync({});
  disableSessionManagement = mockSync({});
  observeAudioInterruptions = mockSync(true);
  activelyReclaimSession = mockSync({});
  observeVolumeChanges = mockSync({});
  addSystemEventListener = mockSync(undefined);
  requestRecordingPermissions = mockAsync('Granted');
  checkRecordingPermissions = mockAsync('Granted');
  requestNotificationPermissions = mockAsync('Granted');
  checkNotificationPermissions = mockAsync('Granted');
  setInputDevice = mockAsync(true);
  getDevicesInfo = mockAsync({
    availableInputs: [],
    availableOutputs: [],
    currentInputs: [],
    currentOutputs: []
  });
}
var _default = exports.default = new AudioManager();
//# sourceMappingURL=AudioManager.js.map