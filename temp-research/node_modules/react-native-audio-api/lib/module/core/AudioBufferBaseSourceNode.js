"use strict";

import AudioParam from "./AudioParam.js";
import AudioScheduledSourceNode from "./AudioScheduledSourceNode.js";
export default class AudioBufferBaseSourceNode extends AudioScheduledSourceNode {
  constructor(context, node) {
    super(context, node);
    this.detune = new AudioParam(node.detune, context);
    this.playbackRate = new AudioParam(node.playbackRate, context);
  }
  get onPositionChanged() {
    return this.onPositionChangedCallback;
  }
  set onPositionChanged(callback) {
    if (!callback) {
      this.node.onPositionChanged = '0';
      this.onPositionChangedSubscription?.remove();
      this.onPositionChangedSubscription = undefined;
      this.onPositionChangedCallback = undefined;
      return;
    }
    this.onPositionChangedCallback = callback;
    this.onPositionChangedSubscription = this.audioEventEmitter.addAudioEventListener('positionChanged', callback);
    this.node.onPositionChanged = this.onPositionChangedSubscription.subscriptionId;
  }
  get onPositionChangedInterval() {
    return this.node.onPositionChangedInterval;
  }
  set onPositionChangedInterval(value) {
    this.node.onPositionChangedInterval = value;
  }
  getLatency() {
    return this.node.getOutputLatency() + this.node.getInputLatency() * this.node.playbackRate.value;
  }
}
//# sourceMappingURL=AudioBufferBaseSourceNode.js.map