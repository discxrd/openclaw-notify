"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertWorkletsEnabled = assertWorkletsEnabled;
exports.clamp = clamp;
var _AudioAPIModule = _interopRequireDefault(require("../AudioAPIModule"));
var _errors = require("../errors");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function assertWorkletsEnabled() {
  if (!_AudioAPIModule.default.areWorkletsAvailable) {
    throw new _errors.AudioApiError('[react-native-audio-api]: Worklets are not available. Please install react-native-worklets to use this feature.');
  }
  if (!_AudioAPIModule.default.isWorkletsVersionSupported) {
    throw new _errors.AudioApiError(`[react-native-audio-api]: Worklets version ${_AudioAPIModule.default.workletsVersion} is not supported.
      Please install react-native-worklets of one of the following versions: [${_AudioAPIModule.default.supportedWorkletsVersion.join(', ')}] to use this feature.`);
  }
}
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
//# sourceMappingURL=index.js.map