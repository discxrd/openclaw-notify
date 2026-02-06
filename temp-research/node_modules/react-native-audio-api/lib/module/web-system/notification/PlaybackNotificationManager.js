"use strict";

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/require-await */

/// Mock Manager for playback notifications. Does nothing.
class PlaybackNotificationManager {
  isRegistered_ = false;
  isShown_ = false;
  constructor() {}
  async register() {}
  async show(info) {}
  async update(info) {}
  async hide() {}
  async unregister() {}
  async enableControl(control, enabled) {}
  async isActive() {
    return this.isShown_;
  }
  isRegistered() {
    return this.isRegistered_;
  }
  addEventListener(eventName, callback) {
    // dummy subscription object with a no-op remove method
    return {
      remove: () => {}
    };
  }
}
export default new PlaybackNotificationManager();
//# sourceMappingURL=PlaybackNotificationManager.js.map