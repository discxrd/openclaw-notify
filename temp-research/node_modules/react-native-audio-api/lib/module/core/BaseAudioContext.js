"use strict";

import AudioAPIModule from "../AudioAPIModule/index.js";
import { InvalidAccessError, InvalidStateError, NotSupportedError } from "../errors/index.js";
import { assertWorkletsEnabled } from "../utils/index.js";
import AnalyserNode from "./AnalyserNode.js";
import AudioBuffer from "./AudioBuffer.js";
import AudioBufferQueueSourceNode from "./AudioBufferQueueSourceNode.js";
import AudioBufferSourceNode from "./AudioBufferSourceNode.js";
import { decodeAudioData, decodePCMInBase64 } from "./AudioDecoder.js";
import AudioDestinationNode from "./AudioDestinationNode.js";
import BiquadFilterNode from "./BiquadFilterNode.js";
import ConstantSourceNode from "./ConstantSourceNode.js";
import ConvolverNode from "./ConvolverNode.js";
import DelayNode from "./DelayNode.js";
import GainNode from "./GainNode.js";
import IIRFilterNode from "./IIRFilterNode.js";
import OscillatorNode from "./OscillatorNode.js";
import PeriodicWave from "./PeriodicWave.js";
import RecorderAdapterNode from "./RecorderAdapterNode.js";
import StereoPannerNode from "./StereoPannerNode.js";
import StreamerNode from "./StreamerNode.js";
import WaveShaperNode from "./WaveShaperNode.js";
import WorkletNode from "./WorkletNode.js";
import WorkletProcessingNode from "./WorkletProcessingNode.js";
import WorkletSourceNode from "./WorkletSourceNode.js";
export default class BaseAudioContext {
  constructor(context) {
    this.context = context;
    this.destination = new AudioDestinationNode(this, context.destination);
    this.sampleRate = context.sampleRate;
  }
  get currentTime() {
    return this.context.currentTime;
  }
  get state() {
    return this.context.state;
  }
  async decodeAudioData(input, fetchOptions) {
    return await decodeAudioData(input, this.sampleRate, fetchOptions);
  }
  async decodePCMInBase64(base64String, inputSampleRate, inputChannelCount, isInterleaved = true) {
    return await decodePCMInBase64(base64String, inputSampleRate, inputChannelCount, isInterleaved);
  }
  createWorkletNode(callback, bufferLength, inputChannelCount, workletRuntime = 'AudioRuntime') {
    if (inputChannelCount < 1 || inputChannelCount > 32) {
      throw new NotSupportedError(`The number of input channels provided (${inputChannelCount}) can not be less than 1 or greater than 32`);
    }
    if (bufferLength < 1) {
      throw new NotSupportedError(`The buffer length provided (${bufferLength}) can not be less than 1`);
    }
    assertWorkletsEnabled();
    const shareableWorklet = AudioAPIModule.workletsModule.makeShareableCloneRecursive((audioBuffers, channelCount) => {
      'worklet';

      const floatAudioData = audioBuffers.map(buffer => new Float32Array(buffer));
      callback(floatAudioData, channelCount);
    });
    return new WorkletNode(this, this.context.createWorkletNode(shareableWorklet, workletRuntime === 'UIRuntime', bufferLength, inputChannelCount));
  }
  createWorkletProcessingNode(callback, workletRuntime = 'AudioRuntime') {
    assertWorkletsEnabled();
    const shareableWorklet = AudioAPIModule.workletsModule.makeShareableCloneRecursive((inputBuffers, outputBuffers, framesToProcess, currentTime) => {
      'worklet';

      const inputData = inputBuffers.map(buffer => new Float32Array(buffer, 0, framesToProcess));
      const outputData = outputBuffers.map(buffer => new Float32Array(buffer, 0, framesToProcess));
      callback(inputData, outputData, framesToProcess, currentTime);
    });
    return new WorkletProcessingNode(this, this.context.createWorkletProcessingNode(shareableWorklet, workletRuntime === 'UIRuntime'));
  }
  createWorkletSourceNode(callback, workletRuntime = 'AudioRuntime') {
    assertWorkletsEnabled();
    const shareableWorklet = AudioAPIModule.workletsModule.makeShareableCloneRecursive((audioBuffers, framesToProcess, currentTime, startOffset) => {
      'worklet';

      const floatAudioData = audioBuffers.map(buffer => new Float32Array(buffer));
      callback(floatAudioData, framesToProcess, currentTime, startOffset);
    });
    return new WorkletSourceNode(this, this.context.createWorkletSourceNode(shareableWorklet, workletRuntime === 'UIRuntime'));
  }
  createRecorderAdapter() {
    return new RecorderAdapterNode(this, this.context.createRecorderAdapter());
  }
  createOscillator() {
    return new OscillatorNode(this, this.context.createOscillator());
  }
  createStreamer() {
    const streamer = this.context.createStreamer();
    if (!streamer) {
      throw new NotSupportedError('StreamerNode requires FFmpeg build');
    }
    return new StreamerNode(this, streamer);
  }
  createConstantSource() {
    return new ConstantSourceNode(this, this.context.createConstantSource());
  }
  createGain() {
    return new GainNode(this, this.context.createGain());
  }
  createDelay(maxDelayTime) {
    const maxTime = maxDelayTime ?? 1.0;
    return new DelayNode(this, this.context.createDelay(maxTime));
  }
  createStereoPanner() {
    return new StereoPannerNode(this, this.context.createStereoPanner());
  }
  createBiquadFilter() {
    return new BiquadFilterNode(this, this.context.createBiquadFilter());
  }
  createIIRFilter(options) {
    const feedforward = options.feedforward;
    const feedback = options.feedback;
    if (feedforward.length < 1 || feedforward.length > 20) {
      throw new NotSupportedError(`The provided feedforward array has length (${feedforward.length}) outside the range [1, 20]`);
    }
    if (feedback.length < 1 || feedback.length > 20) {
      throw new NotSupportedError(`The provided feedback array has length (${feedback.length}) outside the range [1, 20]`);
    }
    if (feedforward.every(value => value === 0)) {
      throw new InvalidStateError(`Feedforward array must contain at least one non-zero value`);
    }
    if (feedback[0] === 0) {
      throw new InvalidStateError(`First value of feedback array cannot be zero`);
    }
    return new IIRFilterNode(this, this.context.createIIRFilter(feedforward, feedback));
  }
  createBufferSource(options) {
    const pitchCorrection = options?.pitchCorrection ?? false;
    return new AudioBufferSourceNode(this, this.context.createBufferSource(pitchCorrection));
  }
  createBufferQueueSource(options) {
    const pitchCorrection = options?.pitchCorrection ?? false;
    return new AudioBufferQueueSourceNode(this, this.context.createBufferQueueSource(pitchCorrection));
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
    const disableNormalization = constraints?.disableNormalization ?? false;
    return new PeriodicWave(this.context.createPeriodicWave(real, imag, disableNormalization));
  }
  createAnalyser() {
    return new AnalyserNode(this, this.context.createAnalyser());
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
    return new ConvolverNode(this, this.context.createConvolver(buffer?.buffer, disableNormalization));
  }
  createWaveShaper() {
    return new WaveShaperNode(this, this.context.createWaveShaper());
  }
}
//# sourceMappingURL=BaseAudioContext.js.map