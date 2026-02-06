"use strict";

import { AudioEventEmitter } from "../events/index.js";
import { NativeAudioAPIModule } from "../specs/index.js";
import { parseNativeError } from "./errors.js";
class AudioManager {
  constructor() {
    this.audioEventEmitter = new AudioEventEmitter(global.AudioEventEmitter);
  }
  getDevicePreferredSampleRate() {
    return NativeAudioAPIModule.getDevicePreferredSampleRate();
  }
  async setAudioSessionActivity(enabled) {
    try {
      const success = await NativeAudioAPIModule.setAudioSessionActivity(enabled);
      return success;
    } catch (error) {
      throw parseNativeError(error);
    }
  }
  setAudioSessionOptions(options) {
    NativeAudioAPIModule.setAudioSessionOptions(options.iosCategory ?? '', options.iosMode ?? '', options.iosOptions ?? [], options.iosAllowHaptics ?? false);
  }
  disableSessionManagement() {
    NativeAudioAPIModule.disableSessionManagement();
  }
  observeAudioInterruptions(enabled) {
    NativeAudioAPIModule.observeAudioInterruptions(enabled);
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
    NativeAudioAPIModule.activelyReclaimSession(enabled);
  }
  observeVolumeChanges(enabled) {
    NativeAudioAPIModule.observeVolumeChanges(enabled);
  }
  addSystemEventListener(name, callback) {
    return this.audioEventEmitter.addAudioEventListener(name, callback);
  }
  async requestRecordingPermissions() {
    return NativeAudioAPIModule.requestRecordingPermissions();
  }
  async checkRecordingPermissions() {
    return NativeAudioAPIModule.checkRecordingPermissions();
  }
  async requestNotificationPermissions() {
    return NativeAudioAPIModule.requestNotificationPermissions();
  }
  async checkNotificationPermissions() {
    return NativeAudioAPIModule.checkNotificationPermissions();
  }
  async getDevicesInfo() {
    return NativeAudioAPIModule.getDevicesInfo();
  }
  async setInputDevice(deviceId) {
    return NativeAudioAPIModule.setInputDevice(deviceId);
  }
}
export default new AudioManager();
//# sourceMappingURL=AudioManager.js.map