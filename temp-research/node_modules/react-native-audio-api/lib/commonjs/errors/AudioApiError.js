"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class AudioApiError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AudioApiError';
  }
}
var _default = exports.default = AudioApiError;
//# sourceMappingURL=AudioApiError.js.map