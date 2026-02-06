"use strict";

import AudioNode from "./AudioNode.js";
import AudioParam from "./AudioParam.js";
export default class DelayNode extends AudioNode {
  constructor(context, delay) {
    super(context, delay);
    this.delayTime = new AudioParam(delay.delayTime, context);
  }
}
//# sourceMappingURL=DelayNode.js.map