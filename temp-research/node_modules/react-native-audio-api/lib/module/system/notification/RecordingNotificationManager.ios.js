"use strict";

import { AudioEventEmitter } from "../../events/index.js";
class RecordingNotificationManager {
  constructor() {
    this.audioEventEmitter = new AudioEventEmitter(global.AudioEventEmitter);
    console.warn('RecordingNotificationManager is not implemented on iOS. Any calls to it will be no-ops.');
  }

  /**
   * Show the notification with metadata or update if already visible.
   *
   * @param info - The info to be displayed.
   * @returns Promise that resolves after creating notification.
   */
  async show(_info) {}

  /**
   * Hide the notification.
   *
   * @returns Promise that resolves after hiding notification.
   */
  async hide() {}

  /**
   * Check if the notification is currently active.
   *
   * @returns Promise that resolves to whether notification is active.
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async isActive() {
    return false;
  }

  /**
   * Add an event listener for notification actions.
   *
   * @param eventName - The event name to listen for.
   * @param callback - The callback to invoke on event.
   * @returns Promise that resolves to whether notification is active.
   */
  addEventListener(eventName, callback) {
    return this.audioEventEmitter.addAudioEventListener(eventName, callback);
  }
}
export default new RecordingNotificationManager();
//# sourceMappingURL=RecordingNotificationManager.ios.js.map