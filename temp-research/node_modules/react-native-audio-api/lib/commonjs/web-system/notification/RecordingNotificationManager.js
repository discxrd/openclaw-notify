"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
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
var _default = exports.default = new RecordingNotificationManager();
//# sourceMappingURL=RecordingNotificationManager.js.map