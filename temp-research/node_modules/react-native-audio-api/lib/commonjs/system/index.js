"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _AudioManager.default;
  }
});
var _AudioManager = _interopRequireDefault(require("./AudioManager"));
var _notification = require("./notification");
Object.keys(_notification).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _notification[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _notification[key];
    }
  });
});
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
//# sourceMappingURL=index.js.map