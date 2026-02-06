"use strict";

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/require-await */

/// Mock Manager for playback notifications. Does nothing.
class RecordingNotificationManager {
  isRegistered_ = false;
  isShown_ = false;
  constructor() {}
  async show(info) {}
  async hide() {}
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
export default new RecordingNotificationManager();
//# sourceMappingURL=RecordingNotificationManager.js.map