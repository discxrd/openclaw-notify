"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  PlaybackNotificationManager: true,
  RecordingNotificationManager: true
};
Object.defineProperty(exports, "PlaybackNotificationManager", {
  enumerable: true,
  get: function () {
    return _PlaybackNotificationManager.default;
  }
});
Object.defineProperty(exports, "RecordingNotificationManager", {
  enumerable: true,
  get: function () {
    return _RecordingNotificationManager.default;
  }
});
var _PlaybackNotificationManager = _interopRequireDefault(require("./PlaybackNotificationManager"));
var _RecordingNotificationManager = _interopRequireDefault(require("./RecordingNotificationManager"));
var _types = require("./types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
//# sourceMappingURL=index.js.map