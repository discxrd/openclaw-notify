"use strict";

import { AudioEventEmitter } from "../../events/index.js";
import { NativeAudioAPIModule } from "../../specs/index.js";
import { AudioApiError } from "../../errors/index.js";
class RecordingNotificationManager {
  notificationKey = 'react-native-audio-api-recording';
  constructor() {
    this.audioEventEmitter = new AudioEventEmitter(global.AudioEventEmitter);
  }

  /**
   * Show the notification with metadata or update if already visible.
   *
   * @param info - The info to be displayed.
   * @returns Promise that resolves after creating notification.
   */
  async show(info) {
    if (!NativeAudioAPIModule) {
      throw new AudioApiError('NativeAudioAPIModule is not available');
    }
    const result = await NativeAudioAPIModule.showNotification('recording', this.notificationKey, info);
    if (result.error) {
      throw new AudioApiError(result.error);
    }
  }

  /**
   * Hide the notification.
   *
   * @returns Promise that resolves after hiding notification.
   */
  async hide() {
    if (!NativeAudioAPIModule) {
      throw new AudioApiError('NativeAudioAPIModule is not available');
    }
    const result = await NativeAudioAPIModule.hideNotification(this.notificationKey);
    if (result.error) {
      throw new AudioApiError(result.error);
    }
  }

  /**
   * Check if the notification is currently active.
   *
   * @returns Promise that resolves to whether notification is active.
   */
  async isActive() {
    if (!NativeAudioAPIModule) {
      return false;
    }
    return await NativeAudioAPIModule.isNotificationActive(this.notificationKey);
  }

  /**
   * Add an event listener for notification actions.
   *
   * @param eventName - The event name to listen for.
   * @param callback - The callback to invoke on event.
   * @returns Class that represents the subscription.
   */
  addEventListener(eventName, callback) {
    return this.audioEventEmitter.addAudioEventListener(eventName, callback);
  }
}
export default new RecordingNotificationManager();
//# sourceMappingURL=RecordingNotificationManager.js.map