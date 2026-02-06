"use strict";

import { NotSupportedError } from "../errors/index.js";
import AudioNode from "./AudioNode.js";
export default class IIRFilterNode extends AudioNode {
  getFrequencyResponse(frequencyArray, magResponseOutput, phaseResponseOutput) {
    if (frequencyArray.length !== magResponseOutput.length || frequencyArray.length !== phaseResponseOutput.length) {
      throw new NotSupportedError(`The lengths of the arrays are not the same frequencyArray: ${frequencyArray.length}, magResponseOutput: ${magResponseOutput.length}, phaseResponseOutput: ${phaseResponseOutput.length}`);
    }
    this.node.getFrequencyResponse(frequencyArray, magResponseOutput, phaseResponseOutput);
  }
}
//# sourceMappingURL=IIRFilterNode.js.map