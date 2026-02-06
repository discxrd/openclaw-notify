"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _errors = require("../errors");
var _events = require("../events");
var _types = require("../types");
var _filePresets = _interopRequireDefault(require("../utils/filePresets"));
var _AudioBuffer = _interopRequireDefault(require("./AudioBuffer"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Enforces default options, making sure that all properties are defined
// for the contract with native code.
function withDefaultOptions(inOptions) {
  return {
    directory: _types.FileDirectory.Cache,
    subDirectory: 'AudioAPI',
    fileNamePrefix: 'recording',
    channelCount: 2,
    format: _types.FileFormat.M4A,
    batchDurationSeconds: 0,
    preset: _filePresets.default.High,
    androidFlushIntervalMs: 500,
    ...inOptions
  };
}
class AudioRecorder {
  onAudioReadySubscription = null;
  onErrorSubscription = null;
  options_ = null;
  isFileOutputEnabled = false;
  audioEventEmitter = new _events.AudioEventEmitter(global.AudioEventEmitter);
  constructor() {
    this.recorder = global.createAudioRecorder();
  }
  enableFileOutput(
  // TODO: Re-enable 'batchDurationSeconds' once supported
  options) {
    this.options_ = options || {};
    const parsedOptions = withDefaultOptions(this.options_);
    const result = this.recorder.enableFileOutput(parsedOptions);
    this.isFileOutputEnabled = true;
    return result;
  }
  get options() {
    return this.options_;
  }
  disableFileOutput() {
    this.options_ = null;
    this.recorder.disableFileOutput();
    this.isFileOutputEnabled = false;
  }

  /** Starts the audio recording process with configured output options */
  start(options) {
    if (!this.isFileOutputEnabled) {
      this.recorder.start();
      return {
        status: 'success',
        path: ''
      };
    }
    return this.recorder.start(options?.fileNameOverride);
  }

  /** Stops the audio recording process and releases internal resources */
  stop() {
    return this.recorder.stop();
  }

  /** Pauses the audio recording process without tearing down anything */
  pause() {
    this.recorder.pause();
  }

  /** Resumes the audio recording process after being paused */
  resume() {
    this.recorder.resume();
  }

  /**
   * Connects a {@link RecorderAdapterNode} to the recorder’s audio graph.
   *
   * Each node can only be connected once. Attempting to connect a node multiple
   * times will throw an error.
   *
   * @param node - The adapter node to connect to the recorder.
   * @throws If the node has already been connected.
   */
  connect(node) {
    if (node.wasConnected) {
      throw new _errors.AudioApiError('RecorderAdapterNode cannot be connected more than once. Refer to the documentation for more details.');
    }
    node.wasConnected = true;
    this.recorder.connect(node.getNode());
  }

  /**
   * Disconnects the recorder from all connected adapter nodes.
   *
   * After calling this method, any connected {@link RecorderAdapterNode} will no
   * longer receive audio data until reconnected.
   */
  disconnect() {
    this.recorder.disconnect();
  }

  /**
   * Registers a callback to receive raw audio data during an active recording
   * session.
   *
   * The callback is periodically invoked with audio buffers that match the
   * preferred configuration provided in `options`. These parameters (sample
   * rate, buffer length, and channel count) guide how audio data is chunked and
   * delivered, though the exact values may vary depending on device
   * capabilities. Values may vary depending on device capabilities.
   *
   * @param options - Preferred configuration for the audio buffers delivered to
   *   the callback.
   * @param callback - Function invoked each time a new audio buffer is
   *   available. The callback receives an {@link OnAudioReadyEventType} object
   *   containing the audio data and associated metadata.
   */
  onAudioReady(options, callback) {
    if (this.onAudioReadySubscription) {
      this.recorder.clearOnAudioReady();
      this.onAudioReadySubscription.remove();
      this.onAudioReadySubscription = null;
    }
    this.onAudioReadySubscription = this.audioEventEmitter.addAudioEventListener('audioReady', event => {
      const audioBuffer = new _AudioBuffer.default(event.buffer);
      callback({
        ...event,
        buffer: audioBuffer
      });
    });
    return this.recorder.setOnAudioReady({
      sampleRate: options.sampleRate,
      bufferLength: options.bufferLength,
      channelCount: options.channelCount,
      callbackId: this.onAudioReadySubscription.subscriptionId
    });
  }

  /**
   * Removes the previously registered audio data callback, if any.
   *
   * This stops further `onAudioReady` events from being delivered during
   * recording. Calling this method is safe even if no callback is currently
   * registered.
   */
  clearOnAudioReady() {
    if (!this.onAudioReadySubscription) {
      return;
    }
    this.recorder.clearOnAudioReady();
    this.onAudioReadySubscription.remove();
    this.onAudioReadySubscription = null;
  }
  isRecording() {
    return this.recorder.isRecording();
  }
  isPaused() {
    return this.recorder.isPaused();
  }
  getCurrentDuration() {
    return this.recorder.getCurrentDuration();
  }
  onError(callback) {
    if (this.onErrorSubscription) {
      this.recorder.clearOnError();
      this.onErrorSubscription.remove();
      this.onErrorSubscription = null;
    }
    this.onErrorSubscription = this.audioEventEmitter.addAudioEventListener('recorderError', callback);
    this.recorder.setOnError({
      callbackId: this.onErrorSubscription.subscriptionId
    });
  }
  clearOnError() {
    if (!this.onErrorSubscription) {
      return;
    }
    this.recorder.clearOnError();
    this.onErrorSubscription.remove();
    this.onErrorSubscription = null;
  }
}
exports.default = AudioRecorder;
//# sourceMappingURL=AudioRecorder.js.map