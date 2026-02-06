"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _AudioAPIModule = _interopRequireDefault(require("../AudioAPIModule"));
var _errors = require("../errors");
var _system = _interopRequireDefault(require("../system"));
var _BaseAudioContext = _interopRequireDefault(require("./BaseAudioContext"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class AudioContext extends _BaseAudioContext.default {
  constructor(options) {
    if (options && options.sampleRate && (options.sampleRate < 8000 || options.sampleRate > 96000)) {
      throw new _errors.NotSupportedError(`The provided sampleRate is not supported: ${options.sampleRate}`);
    }
    const audioRuntime = _AudioAPIModule.default.createAudioRuntime();
    super(global.createAudioContext(options?.sampleRate || _system.default.getDevicePreferredSampleRate(), audioRuntime));
  }
  async close() {
    return this.context.close();
  }
  async resume() {
    return this.context.resume();
  }
  async suspend() {
    return this.context.suspend();
  }
}
exports.default = AudioContext;
//# sourceMappingURL=AudioContext.js.map