"use strict";

import AudioNode from "./AudioNode.js";
import { InvalidStateError } from "../errors/index.js";
export default class WaveShaperNode extends AudioNode {
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
        throw new InvalidStateError('The curve can only be set once and cannot be changed afterwards.');
      }
      if (curve.length < 2) {
        throw new InvalidStateError('The curve must have at least two values if not null.');
      }
      this.isCurveSet = true;
    }
    this.node.setCurve(curve);
  }
  set oversample(value) {
    this.node.oversample = value;
  }
}
//# sourceMappingURL=WaveShaperNode.js.map