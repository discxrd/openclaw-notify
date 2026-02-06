"use strict";

import { RangeError, InvalidStateError } from "../errors/index.js";
export default class AudioParam {
  constructor(audioParam, context) {
    this.audioParam = audioParam;
    this.value = audioParam.value;
    this.defaultValue = audioParam.defaultValue;
    this.minValue = audioParam.minValue;
    this.maxValue = audioParam.maxValue;
    this.context = context;
  }
  get value() {
    return this.audioParam.value;
  }
  set value(value) {
    this.audioParam.value = value;
  }
  setValueAtTime(value, startTime) {
    if (startTime < 0) {
      throw new RangeError(`startTime must be a finite non-negative number: ${startTime}`);
    }
    const clampedTime = Math.max(startTime, this.context.currentTime);
    this.audioParam.setValueAtTime(value, clampedTime);
    return this;
  }
  linearRampToValueAtTime(value, endTime) {
    if (endTime < 0) {
      throw new RangeError(`endTime must be a finite non-negative number: ${endTime}`);
    }
    const clampedTime = Math.max(endTime, this.context.currentTime);
    this.audioParam.linearRampToValueAtTime(value, clampedTime);
    return this;
  }
  exponentialRampToValueAtTime(value, endTime) {
    if (endTime <= 0) {
      throw new RangeError(`endTime must be a finite non-negative number: ${endTime}`);
    }
    const clampedTime = Math.max(endTime, this.context.currentTime);
    this.audioParam.exponentialRampToValueAtTime(value, clampedTime);
    return this;
  }
  setTargetAtTime(target, startTime, timeConstant) {
    if (startTime < 0) {
      throw new RangeError(`startTime must be a finite non-negative number: ${startTime}`);
    }
    if (timeConstant < 0) {
      throw new RangeError(`timeConstant must be a finite non-negative number: ${timeConstant}`);
    }
    const clampedTime = Math.max(startTime, this.context.currentTime);
    this.audioParam.setTargetAtTime(target, clampedTime, timeConstant);
    return this;
  }
  setValueCurveAtTime(values, startTime, duration) {
    if (startTime < 0) {
      throw new RangeError(`startTime must be a finite non-negative number: ${startTime}`);
    }
    if (duration <= 0) {
      throw new RangeError(`duration must be a finite strictly-positive number: ${duration}`);
    }
    if (values.length < 2) {
      throw new InvalidStateError(`values must contain at least two values`);
    }
    const clampedTime = Math.max(startTime, this.context.currentTime);
    this.audioParam.setValueCurveAtTime(values, clampedTime, duration);
    return this;
  }
  cancelScheduledValues(cancelTime) {
    if (cancelTime < 0) {
      throw new RangeError(`cancelTime must be a finite non-negative number: ${cancelTime}`);
    }
    const clampedTime = Math.max(cancelTime, this.context.currentTime);
    this.audioParam.cancelScheduledValues(clampedTime);
    return this;
  }
  cancelAndHoldAtTime(cancelTime) {
    if (cancelTime < 0) {
      throw new RangeError(`cancelTime must be a finite non-negative number: ${cancelTime}`);
    }
    const clampedTime = Math.max(cancelTime, this.context.currentTime);
    this.audioParam.cancelAndHoldAtTime(clampedTime);
    return this;
  }
}
//# sourceMappingURL=AudioParam.js.map