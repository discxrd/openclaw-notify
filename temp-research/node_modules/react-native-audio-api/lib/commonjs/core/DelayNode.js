"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _AudioNode = _interopRequireDefault(require("./AudioNode"));
var _AudioParam = _interopRequireDefault(require("./AudioParam"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class DelayNode extends _AudioNode.default {
  constructor(context, delay) {
    super(context, delay);
    this.delayTime = new _AudioParam.default(delay.delayTime, context);
  }
}
exports.default = DelayNode;
//# sourceMappingURL=DelayNode.js.map