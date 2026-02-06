"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _AudioAPIModule = _interopRequireDefault(require("../AudioAPIModule"));
var _errors = require("../errors");
var _utils = require("../utils");
var _AnalyserNode = _interopRequireDefault(require("./AnalyserNode"));
var _AudioBuffer = _interopRequireDefault(require("./AudioBuffer"));
var _AudioBufferQueueSourceNode = _interopRequireDefault(require("./AudioBufferQueueSourceNode"));
var _AudioBufferSourceNode = _interopRequireDefault(require("./AudioBufferSourceNode"));
var _AudioDecoder = require("./AudioDecoder");
var _AudioDestinationNode = _interopRequireDefault(require("./AudioDestinationNode"));
var _BiquadFilterNode = _interopRequireDefault(require("./BiquadFilterNode"));
var _ConstantSourceNode = _interopRequireDefault(require("./ConstantSourceNode"));
var _ConvolverNode = _interopRequireDefault(require("./ConvolverNode"));
var _DelayNode = _interopRequireDefault(require("./DelayNode"));
var _GainNode = _interopRequireDefault(require("./GainNode"));
var _IIRFilterNode = _interopRequireDefault(require("./IIRFilterNode"));
var _OscillatorNode = _interopRequireDefault(require("./OscillatorNode"));
var _PeriodicWave = _interopRequireDefault(require("./PeriodicWave"));
var _RecorderAdapterNode = _interopRequireDefault(require("./RecorderAdapterNode"));
var _StereoPannerNode = _interopRequireDefault(require("./StereoPannerNode"));
var _StreamerNode = _interopRequireDefault(require("./StreamerNode"));
var _WaveShaperNode = _interopRequireDefault(require("./WaveShaperNode"));
var _WorkletNode = _interopRequireDefault(require("./WorkletNode"));
var _WorkletProcessingNode = _interopRequireDefault(require("./WorkletProcessingNode"));
var _WorkletSourceNode = _interopRequireDefault(require("./WorkletSourceNode"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class BaseAudioContext {
  constructor(context) {
    this.context = context;
    this.destination = new _AudioDestinationNode.default(this, context.destination);
    this.sampleRate = context.sampleRate;
  }
  get currentTime() {
    return this.context.currentTime;
  }
  get state() {
    return this.context.state;
  }
  async decodeAudioData(input, fetchOptions) {
    return await (0, _AudioDecoder.decodeAudioData)(input, this.sampleRate, fetchOptions);
  }
  async decodePCMInBase64(base64String, inputSampleRate, inputChannelCount, isInterleaved = true) {
    return await (0, _AudioDecoder.decodePCMInBase64)(base64String, inputSampleRate, inputChannelCount, isInterleaved);
  }
  createWorkletNode(callback, bufferLength, inputChannelCount, workletRuntime = 'AudioRuntime') {
    if (inputChannelCount < 1 || inputChannelCount > 32) {
      throw new _errors.NotSupportedError(`The number of input channels provided (${inputChannelCount}) can not be less than 1 or greater than 32`);
    }
    if (bufferLength < 1) {
      throw new _errors.NotSupportedError(`The buffer length provided (${bufferLength}) can not be less than 1`);
    }
    (0, _utils.assertWorkletsEnabled)();
    const shareableWorklet = _AudioAPIModule.default.workletsModule.makeShareableCloneRecursive((audioBuffers, channelCount) => {
      'worklet';

      const floatAudioData = audioBuffers.map(buffer => new Float32Array(buffer));
      callback(floatAudioData, channelCount);
    });
    return new _WorkletNode.default(this, this.context.createWorkletNode(shareableWorklet, workletRuntime === 'UIRuntime', bufferLength, inputChannelCount));
  }
  createWorkletProcessingNode(callback, workletRuntime = 'AudioRuntime') {
    (0, _utils.assertWorkletsEnabled)();
    const shareableWorklet = _AudioAPIModule.default.workletsModule.makeShareableCloneRecursive((inputBuffers, outputBuffers, framesToProcess, currentTime) => {
      'worklet';

      const inputData = inputBuffers.map(buffer => new Float32Array(buffer, 0, framesToProcess));
      const outputData = outputBuffers.map(buffer => new Float32Array(buffer, 0, framesToProcess));
      callback(inputData, outputData, framesToProcess, currentTime);
    });
    return new _WorkletProcessingNode.default(this, this.context.createWorkletProcessingNode(shareableWorklet, workletRuntime === 'UIRuntime'));
  }
  createWorkletSourceNode(callback, workletRuntime = 'AudioRuntime') {
    (0, _utils.assertWorkletsEnabled)();
    const shareableWorklet = _AudioAPIModule.default.workletsModule.makeShareableCloneRecursive((audioBuffers, framesToProcess, currentTime, startOffset) => {
      'worklet';

      const floatAudioData = audioBuffers.map(buffer => new Float32Array(buffer));
      callback(floatAudioData, framesToProcess, currentTime, startOffset);
    });
    return new _WorkletSourceNode.default(this, this.context.createWorkletSourceNode(shareableWorklet, workletRuntime === 'UIRuntime'));
  }
  createRecorderAdapter() {
    return new _RecorderAdapterNode.default(this, this.context.createRecorderAdapter());
  }
  createOscillator() {
    return new _OscillatorNode.default(this, this.context.createOscillator());
  }
  createStreamer() {
    const streamer = this.context.createStreamer();
    if (!streamer) {
      throw new _errors.NotSupportedError('StreamerNode requires FFmpeg build');
    }
    return new _StreamerNode.default(this, streamer);
  }
  createConstantSource() {
    return new _ConstantSourceNode.default(this, this.context.createConstantSource());
  }
  createGain() {
    return new _GainNode.default(this, this.context.createGain());
  }
  createDelay(maxDelayTime) {
    const maxTime = maxDelayTime ?? 1.0;
    return new _DelayNode.default(this, this.context.createDelay(maxTime));
  }
  createStereoPanner() {
    return new _StereoPannerNode.default(this, this.context.createStereoPanner());
  }
  createBiquadFilter() {
    return new _BiquadFilterNode.default(this, this.context.createBiquadFilter());
  }
  createIIRFilter(options) {
    const feedforward = options.feedforward;
    const feedback = options.feedback;
    if (feedforward.length < 1 || feedforward.length > 20) {
      throw new _errors.NotSupportedError(`The provided feedforward array has length (${feedforward.length}) outside the range [1, 20]`);
    }
    if (feedback.length < 1 || feedback.length > 20) {
      throw new _errors.NotSupportedError(`The provided feedback array has length (${feedback.length}) outside the range [1, 20]`);
    }
    if (feedforward.every(value => value === 0)) {
      throw new _errors.InvalidStateError(`Feedforward array must contain at least one non-zero value`);
    }
    if (feedback[0] === 0) {
      throw new _errors.InvalidStateError(`First value of feedback array cannot be zero`);
    }
    return new _IIRFilterNode.default(this, this.context.createIIRFilter(feedforward, feedback));
  }
  createBufferSource(options) {
    const pitchCorrection = options?.pitchCorrection ?? false;
    return new _AudioBufferSourceNode.default(this, this.context.createBufferSource(pitchCorrection));
  }
  createBufferQueueSource(options) {
    const pitchCorrection = options?.pitchCorrection ?? false;
    return new _AudioBufferQueueSourceNode.default(this, this.context.createBufferQueueSource(pitchCorrection));
  }
  createBuffer(numOfChannels, length, sampleRate) {
    if (numOfChannels < 1 || numOfChannels >= 32) {
      throw new _errors.NotSupportedError(`The number of channels provided (${numOfChannels}) is outside the range [1, 32]`);
    }
    if (length <= 0) {
      throw new _errors.NotSupportedError(`The number of frames provided (${length}) is less than or equal to the minimum bound (0)`);
    }
    if (sampleRate < 8000 || sampleRate > 96000) {
      throw new _errors.NotSupportedError(`The sample rate provided (${sampleRate}) is outside the range [8000, 96000]`);
    }
    return new _AudioBuffer.default(this.context.createBuffer(numOfChannels, length, sampleRate));
  }
  createPeriodicWave(real, imag, constraints) {
    if (real.length !== imag.length) {
      throw new _errors.InvalidAccessError(`The lengths of the real (${real.length}) and imaginary (${imag.length}) arrays must match.`);
    }
    const disableNormalization = constraints?.disableNormalization ?? false;
    return new _PeriodicWave.default(this.context.createPeriodicWave(real, imag, disableNormalization));
  }
  createAnalyser() {
    return new _AnalyserNode.default(this, this.context.createAnalyser());
  }
  createConvolver(options) {
    if (options?.buffer) {
      const numberOfChannels = options.buffer.numberOfChannels;
      if (numberOfChannels !== 1 && numberOfChannels !== 2 && numberOfChannels !== 4) {
        throw new _errors.NotSupportedError(`The number of channels provided (${numberOfChannels}) in impulse response for ConvolverNode buffer must be 1 or 2 or 4.`);
      }
    }
    const buffer = options?.buffer ?? null;
    const disableNormalization = options?.disableNormalization ?? false;
    return new _ConvolverNode.default(this, this.context.createConvolver(buffer?.buffer, disableNormalization));
  }
  createWaveShaper() {
    return new _WaveShaperNode.default(this, this.context.createWaveShaper());
  }
}
exports.default = BaseAudioContext;
//# sourceMappingURL=BaseAudioContext.js.map