"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _events = require("../events");
var _specs = require("../specs");
var _errors = require("./errors");
class AudioManager {
  constructor() {
    this.audioEventEmitter = new _events.AudioEventEmitter(global.AudioEventEmitter);
  }
  getDevicePreferredSampleRate() {
    return _specs.NativeAudioAPIModule.getDevicePreferredSampleRate();
  }
  async setAudioSessionActivity(enabled) {
    try {
      const success = await _specs.NativeAudioAPIModule.setAudioSessionActivity(enabled);
      return success;
    } catch (error) {
      throw (0, _errors.parseNativeError)(error);
    }
  }
  setAudioSessionOptions(options) {
    _specs.NativeAudioAPIModule.setAudioSessionOptions(options.iosCategory ?? '', options.iosMode ?? '', options.iosOptions ?? [], options.iosAllowHaptics ?? false);
  }
  disableSessionManagement() {
    _specs.NativeAudioAPIModule.disableSessionManagement();
  }
  observeAudioInterruptions(enabled) {
    _specs.NativeAudioAPIModule.observeAudioInterruptions(enabled);
  }

  /**
   * @param enabled - Whether to actively reclaim the session or not
   * @experimental more aggressively try to reactivate the audio session during interruptions.
   * It is subject to change in the future and might be removed.
   *
   * In some cases (depends on app session settings and other apps using audio) system may never
   * send the `interruption ended` event. This method will check if any other audio is playing
   * and try to reactivate the audio session, as soon as there is "silence".
   * Although this might change the expected behavior.
   *
   * Internally method uses `AVAudioSessionSilenceSecondaryAudioHintNotification` as well as
   * interval polling to check if other audio is playing.
   */
  activelyReclaimSession(enabled) {
    _specs.NativeAudioAPIModule.activelyReclaimSession(enabled);
  }
  observeVolumeChanges(enabled) {
    _specs.NativeAudioAPIModule.observeVolumeChanges(enabled);
  }
  addSystemEventListener(name, callback) {
    return this.audioEventEmitter.addAudioEventListener(name, callback);
  }
  async requestRecordingPermissions() {
    return _specs.NativeAudioAPIModule.requestRecordingPermissions();
  }
  async checkRecordingPermissions() {
    return _specs.NativeAudioAPIModule.checkRecordingPermissions();
  }
  async requestNotificationPermissions() {
    return _specs.NativeAudioAPIModule.requestNotificationPermissions();
  }
  async checkNotificationPermissions() {
    return _specs.NativeAudioAPIModule.checkNotificationPermissions();
  }
  async getDevicesInfo() {
    return _specs.NativeAudioAPIModule.getDevicesInfo();
  }
  async setInputDevice(deviceId) {
    return _specs.NativeAudioAPIModule.setInputDevice(deviceId);
  }
}
var _default = exports.default = new AudioManager();
//# sourceMappingURL=AudioManager.js.map