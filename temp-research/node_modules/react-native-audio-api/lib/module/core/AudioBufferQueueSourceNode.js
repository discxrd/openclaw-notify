"use strict";

import AudioBufferBaseSourceNode from "./AudioBufferBaseSourceNode.js";
import { RangeError } from "../errors/index.js";
export default class AudioBufferQueueSourceNode extends AudioBufferBaseSourceNode {
  enqueueBuffer(buffer) {
    return this.node.enqueueBuffer(buffer.buffer);
  }
  dequeueBuffer(bufferId) {
    const id = parseInt(bufferId, 10);
    if (isNaN(id) || id < 0) {
      throw new RangeError(`bufferId must be a non-negative integer: ${bufferId}`);
    }
    this.node.dequeueBuffer(id);
  }
  clearBuffers() {
    this.node.clearBuffers();
  }
  start(when = 0, offset) {
    if (when < 0) {
      throw new RangeError(`when must be a finite non-negative number: ${when}`);
    }
    if (offset && offset < 0) {
      throw new RangeError(`offset must be a finite non-negative number: ${offset}`);
    }
    this.node.start(when, offset);
  }
  stop(when = 0) {
    if (when < 0) {
      throw new RangeError(`when must be a finite non-negative number: ${when}`);
    }
    this.node.stop(when);
  }
  pause() {
    this.node.pause();
  }
}
//# sourceMappingURL=AudioBufferQueueSourceNode.js.map