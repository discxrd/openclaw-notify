"use strict";

import { AudioEventEmitter } from "../../events/index.js";
import { NativeAudioAPIModule } from "../../specs/index.js";
import { AudioApiError } from "../../errors/index.js";
class PlaybackNotificationManager {
  notificationKey = 'playback';
  constructor() {
    this.audioEventEmitter = new AudioEventEmitter(global.AudioEventEmitter);
  }

  /**
   * Show the notification with metadata or update if already visible.
   * Automatically creates the notification on first call.
   *
   * @param info - The info to be displayed.
   * @returns Promise that resolves after creating notification.
   */
  async show(info) {
    if (!NativeAudioAPIModule) {
      throw new AudioApiError('NativeAudioAPIModule is not available');
    }
    const result = await NativeAudioAPIModule.showNotification('playback', this.notificationKey, info);
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
   * Enable or disable a specific playback control.
   *
   * @param control - The control to enable or disable on the notification.
   * @param enabled - Whether to enable (true) or disable (false) the control.
   * @returns Promise that resolves after showing modified notification.
   */
  async enableControl(control, enabled) {
    if (!NativeAudioAPIModule) {
      throw new AudioApiError('NativeAudioAPIModule is not available');
    }
    const params = {
      control,
      enabled
    };
    const result = await NativeAudioAPIModule.showNotification('playback', this.notificationKey, params);
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
export default new PlaybackNotificationManager();
//# sourceMappingURL=PlaybackNotificationManager.js.map