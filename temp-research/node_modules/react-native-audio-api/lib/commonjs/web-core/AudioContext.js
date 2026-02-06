"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _errors = require("../errors");
var _AnalyserNode = _interopRequireDefault(require("./AnalyserNode"));
var _AudioBuffer = _interopRequireDefault(require("./AudioBuffer"));
var _AudioBufferSourceNode = _interopRequireDefault(require("./AudioBufferSourceNode"));
var _AudioDestinationNode = _interopRequireDefault(require("./AudioDestinationNode"));
var _BiquadFilterNode = _interopRequireDefault(require("./BiquadFilterNode"));
var _ConvolverNode = _interopRequireDefault(require("./ConvolverNode"));
var _DelayNode = _interopRequireDefault(require("./DelayNode"));
var _GainNode = _interopRequireDefault(require("./GainNode"));
var _IIRFilterNode = _interopRequireDefault(require("./IIRFilterNode"));
var _OscillatorNode = _interopRequireDefault(require("./OscillatorNode"));
var _PeriodicWave = _interopRequireDefault(require("./PeriodicWave"));
var _StereoPannerNode = _interopRequireDefault(require("./StereoPannerNode"));
var _ConstantSourceNode = _interopRequireDefault(require("./ConstantSourceNode"));
var _LoadCustomWasm = require("./custom/LoadCustomWasm");
var _WaveShaperNode = _interopRequireDefault(require("./WaveShaperNode"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class AudioContext {
  constructor(options) {
    if (options && options.sampleRate && (options.sampleRate < 8000 || options.sampleRate > 96000)) {
      throw new _errors.NotSupportedError(`The provided sampleRate is not supported: ${options.sampleRate}`);
    }
    this.context = new window.AudioContext({
      sampleRate: options?.sampleRate
    });
    this.sampleRate = this.context.sampleRate;
    this.destination = new _AudioDestinationNode.default(this, this.context.destination);
  }
  get currentTime() {
    return this.context.currentTime;
  }
  get state() {
    return this.context.state;
  }
  createOscillator() {
    return new _OscillatorNode.default(this, this.context.createOscillator());
  }
  createConstantSource() {
    return new _ConstantSourceNode.default(this, this.context.createConstantSource());
  }
  createGain() {
    return new _GainNode.default(this, this.context.createGain());
  }
  createDelay(maxDelayTime) {
    return new _DelayNode.default(this, this.context.createDelay(maxDelayTime));
  }
  createStereoPanner() {
    return new _StereoPannerNode.default(this, this.context.createStereoPanner());
  }
  createBiquadFilter() {
    return new _BiquadFilterNode.default(this, this.context.createBiquadFilter());
  }
  createIIRFilter(options) {
    return new _IIRFilterNode.default(this, this.context.createIIRFilter(options.feedforward, options.feedback));
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
    return new _ConvolverNode.default(this, this.context.createConvolver(), buffer, disableNormalization);
  }
  async createBufferSource(options) {
    if (!options || !options.pitchCorrection) {
      return new _AudioBufferSourceNode.default(this, this.context.createBufferSource(), false);
    }
    await _LoadCustomWasm.globalWasmPromise;
    const wasmStretch = await window[_LoadCustomWasm.globalTag](this.context);
    return new _AudioBufferSourceNode.default(this, wasmStretch, true);
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
    return new _PeriodicWave.default(this.context.createPeriodicWave(real, imag, constraints));
  }
  createAnalyser() {
    return new _AnalyserNode.default(this, this.context.createAnalyser());
  }
  createWaveShaper() {
    return new _WaveShaperNode.default(this, this.context.createWaveShaper());
  }
  async decodeAudioData(source, fetchOptions) {
    if (source instanceof ArrayBuffer) {
      const decodedData = await this.context.decodeAudioData(source);
      return new _AudioBuffer.default(decodedData);
    }
    if (typeof source === 'string') {
      const response = await fetch(source, fetchOptions);
      if (!response.ok) {
        throw new _errors.InvalidAccessError(`Failed to fetch audio data from the provided source: ${source}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const decodedData = await this.context.decodeAudioData(arrayBuffer);
      return new _AudioBuffer.default(decodedData);
    }
    throw new TypeError('Unsupported source for decodeAudioData: ' + source);
  }
  async close() {
    await this.context.close();
  }
  async resume() {
    await this.context.resume();
  }
  async suspend() {
    await this.context.suspend();
  }
}
exports.default = AudioContext;
//# sourceMappingURL=AudioContext.js.map