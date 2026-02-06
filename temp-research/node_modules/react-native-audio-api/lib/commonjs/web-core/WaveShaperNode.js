"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _errors = require("../errors");
var _AudioNode = _interopRequireDefault(require("./AudioNode"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class WaveShaperNode extends _AudioNode.default {
  isCurveSet = false;
  get curve() {
    if (!this.isCurveSet) {
      return null;
    }
    return this.node.curve;
  }
  get oversample() {
    return this.node.oversample;
  }
  set curve(curve) {
    if (curve !== null) {
      if (this.isCurveSet) {
        throw new _errors.InvalidStateError('The curve can only be set once and cannot be changed afterwards.');
      }
      if (curve.length < 2) {
        throw new _errors.InvalidStateError('The curve must have at least two values if not null.');
      }
      this.isCurveSet = true;
    }
    this.node.curve = curve;
  }
  set oversample(value) {
    this.node.oversample = value;
  }
}
exports.default = WaveShaperNode;
//# sourceMappingURL=WaveShaperNode.js.map