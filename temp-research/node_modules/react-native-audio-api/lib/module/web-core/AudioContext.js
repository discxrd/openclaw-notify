"use strict";

import { InvalidAccessError, NotSupportedError } from "../errors/index.js";
import AnalyserNode from "./AnalyserNode.js";
import AudioBuffer from "./AudioBuffer.js";
import AudioBufferSourceNode from "./AudioBufferSourceNode.js";
import AudioDestinationNode from "./AudioDestinationNode.js";
import BiquadFilterNode from "./BiquadFilterNode.js";
import ConvolverNode from "./ConvolverNode.js";
import DelayNode from "./DelayNode.js";
import GainNode from "./GainNode.js";
import IIRFilterNode from "./IIRFilterNode.js";
import OscillatorNode from "./OscillatorNode.js";
import PeriodicWave from "./PeriodicWave.js";
import StereoPannerNode from "./StereoPannerNode.js";
import ConstantSourceNode from "./ConstantSourceNode.js";
import { globalTag, globalWasmPromise } from "./custom/LoadCustomWasm.js";
import WaveShaperNode from "./WaveShaperNode.js";
export default class AudioContext {
  constructor(options) {
    if (options && options.sampleRate && (options.sampleRate < 8000 || options.sampleRate > 96000)) {
      throw new NotSupportedError(`The provided sampleRate is not supported: ${options.sampleRate}`);
    }
    this.context = new window.AudioContext({
      sampleRate: options?.sampleRate
    });
    this.sampleRate = this.context.sampleRate;
    this.destination = new AudioDestinationNode(this, this.context.destination);
  }
  get currentTime() {
    return this.context.currentTime;
  }
  get state() {
    return this.context.state;
  }
  createOscillator() {
    return new OscillatorNode(this, this.context.createOscillator());
  }
  createConstantSource() {
    return new ConstantSourceNode(this, this.context.createConstantSource());
  }
  createGain() {
    return new GainNode(this, this.context.createGain());
  }
  createDelay(maxDelayTime) {
    return new DelayNode(this, this.context.createDelay(maxDelayTime));
  }
  createStereoPanner() {
    return new StereoPannerNode(this, this.context.createStereoPanner());
  }
  createBiquadFilter() {
    return new BiquadFilterNode(this, this.context.createBiquadFilter());
  }
  createIIRFilter(options) {
    return new IIRFilterNode(this, this.context.createIIRFilter(options.feedforward, options.feedback));
  }
  createConvolver(options) {
    if (options?.buffer) {
      const numberOfChannels = options.buffer.numberOfChannels;
      if (numberOfChannels !== 1 && numberOfChannels !== 2 && numberOfChannels !== 4) {
        throw new NotSupportedError(`The number of channels provided (${numberOfChannels}) in impulse response for ConvolverNode buffer must be 1 or 2 or 4.`);
      }
    }
    const buffer = options?.buffer ?? null;
    const disableNormalization = options?.disableNormalization ?? false;
    return new ConvolverNode(this, this.context.createConvolver(), buffer, disableNormalization);
  }
  async createBufferSource(options) {
    if (!options || !options.pitchCorrection) {
      return new AudioBufferSourceNode(this, this.context.createBufferSource(), false);
    }
    await globalWasmPromise;
    const wasmStretch = await window[globalTag](this.context);
    return new AudioBufferSourceNode(this, wasmStretch, true);
  }
  createBuffer(numOfChannels, length, sampleRate) {
    if (numOfChannels < 1 || numOfChannels >= 32) {
      throw new NotSupportedError(`The number of channels provided (${numOfChannels}) is outside the range [1, 32]`);
    }
    if (length <= 0) {
      throw new NotSupportedError(`The number of frames provided (${length}) is less than or equal to the minimum bound (0)`);
    }
    if (sampleRate < 8000 || sampleRate > 96000) {
      throw new NotSupportedError(`The sample rate provided (${sampleRate}) is outside the range [8000, 96000]`);
    }
    return new AudioBuffer(this.context.createBuffer(numOfChannels, length, sampleRate));
  }
  createPeriodicWave(real, imag, constraints) {
    if (real.length !== imag.length) {
      throw new InvalidAccessError(`The lengths of the real (${real.length}) and imaginary (${imag.length}) arrays must match.`);
    }
    return new PeriodicWave(this.context.createPeriodicWave(real, imag, constraints));
  }
  createAnalyser() {
    return new AnalyserNode(this, this.context.createAnalyser());
  }
  createWaveShaper() {
    return new WaveShaperNode(this, this.context.createWaveShaper());
  }
  async decodeAudioData(source, fetchOptions) {
    if (source instanceof ArrayBuffer) {
      const decodedData = await this.context.decodeAudioData(source);
      return new AudioBuffer(decodedData);
    }
    if (typeof source === 'string') {
      const response = await fetch(source, fetchOptions);
      if (!response.ok) {
        throw new InvalidAccessError(`Failed to fetch audio data from the provided source: ${source}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const decodedData = await this.context.decodeAudioData(arrayBuffer);
      return new AudioBuffer(decodedData);
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
//# sourceMappingURL=AudioContext.js.map