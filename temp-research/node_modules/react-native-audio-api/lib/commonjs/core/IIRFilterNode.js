"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _errors = require("../errors");
var _AudioNode = _interopRequireDefault(require("./AudioNode"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class IIRFilterNode extends _AudioNode.default {
  getFrequencyResponse(frequencyArray, magResponseOutput, phaseResponseOutput) {
    if (frequencyArray.length !== magResponseOutput.length || frequencyArray.length !== phaseResponseOutput.length) {
      throw new _errors.NotSupportedError(`The lengths of the arrays are not the same frequencyArray: ${frequencyArray.length}, magResponseOutput: ${magResponseOutput.length}, phaseResponseOutput: ${phaseResponseOutput.length}`);
    }
    this.node.getFrequencyResponse(frequencyArray, magResponseOutput, phaseResponseOutput);
  }
}
exports.default = IIRFilterNode;
//# sourceMappingURL=IIRFilterNode.js.map