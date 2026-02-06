"use strict";

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
export default new AudioAPIModule();
//# sourceMappingURL=AudioAPIModule.web.js.map