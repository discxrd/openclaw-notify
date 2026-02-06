"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const mockGetter = value => value;
class AudioAPIModule {
  supportedWorkletsVersion = [];
  workletsModule = mockGetter(null);
  canUseWorklets = mockGetter(false);
  workletsVersion = mockGetter('unknown');
  areWorkletsAvailable = mockGetter(false);
  isWorkletsVersionSupported = mockGetter(false);
  createAudioRuntime() {
    return null;
  }
}
var _default = exports.default = new AudioAPIModule();
//# sourceMappingURL=AudioAPIModule.web.js.map