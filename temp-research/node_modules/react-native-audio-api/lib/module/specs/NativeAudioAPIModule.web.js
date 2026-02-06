"use strict";

// copy of spec from NativeAudioAPIModule.ts

const mockAsync = value => () => Promise.resolve(value);
const mockSync = value => () => value;
const NativeAudioAPIModule = {
  install: mockSync(true),
  getDevicePreferredSampleRate: mockSync(0),
  setAudioSessionActivity: mockAsync(true),
  setAudioSessionOptions: mockSync({}),
  disableSessionManagement: mockSync({}),
  observeAudioInterruptions: mockSync({}),
  activelyReclaimSession: mockSync({}),
  observeVolumeChanges: mockSync({}),
  requestRecordingPermissions: mockAsync('Granted'),
  checkRecordingPermissions: mockAsync('Granted'),
  requestNotificationPermissions: mockAsync('Granted'),
  checkNotificationPermissions: mockAsync('Granted'),
  getDevicesInfo: mockAsync({
    availableInputs: [],
    availableOutputs: [],
    currentInputs: [],
    currentOutputs: []
  }),
  setInputDevice: mockAsync(true),
  showNotification: mockAsync({
    success: true
  }),
  hideNotification: mockAsync({
    success: true
  }),
  isNotificationActive: mockAsync(false)
};
export { NativeAudioAPIModule };
//# sourceMappingURL=NativeAudioAPIModule.web.js.map