"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _AudioBufferBaseSourceNode = _interopRequireDefault(require("./AudioBufferBaseSourceNode"));
var _errors = require("../errors");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class AudioBufferQueueSourceNode extends _AudioBufferBaseSourceNode.default {
  enqueueBuffer(buffer) {
    return this.node.enqueueBuffer(buffer.buffer);
  }
  dequeueBuffer(bufferId) {
    const id = parseInt(bufferId, 10);
    if (isNaN(id) || id < 0) {
      throw new _errors.RangeError(`bufferId must be a non-negative integer: ${bufferId}`);
    }
    this.node.dequeueBuffer(id);
  }
  clearBuffers() {
    this.node.clearBuffers();
  }
  start(when = 0, offset) {
    if (when < 0) {
      throw new _errors.RangeError(`when must be a finite non-negative number: ${when}`);
    }
    if (offset && offset < 0) {
      throw new _errors.RangeError(`offset must be a finite non-negative number: ${offset}`);
    }
    this.node.start(when, offset);
  }
  stop(when = 0) {
    if (when < 0) {
      throw new _errors.RangeError(`when must be a finite non-negative number: ${when}`);
    }
    this.node.stop(when);
  }
  pause() {
    this.node.pause();
  }
}
exports.default = AudioBufferQueueSourceNode;
//# sourceMappingURL=AudioBufferQueueSourceNode.js.map