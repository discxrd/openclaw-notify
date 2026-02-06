"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeAudioData = decodeAudioData;
exports.decodePCMInBase64 = decodePCMInBase64;
var _reactNative = require("react-native");
var _errors = require("../errors");
var _paths = require("../utils/paths");
var _AudioBuffer = _interopRequireDefault(require("./AudioBuffer"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class AudioDecoder {
  static instance = null;
  constructor() {
    this.decoder = global.createAudioDecoder();
  }
  async decodeAudioDataImplementation(input, sampleRate, fetchOptions) {
    if (input instanceof ArrayBuffer) {
      const buffer = await this.decoder.decodeWithMemoryBlock(new Uint8Array(input), sampleRate ?? 0);
      return new _AudioBuffer.default(buffer);
    }
    const stringSource = typeof input === 'number' ? _reactNative.Image.resolveAssetSource(input).uri : input;

    // input is data:audio/...;base64,...
    if ((0, _paths.isBase64Source)(stringSource)) {
      throw new _errors.AudioApiError('Base64 source decoding is not currently supported, to decode raw PCM base64 strings use decodePCMInBase64 method.');
    }

    // input is blob:...
    if ((0, _paths.isDataBlobString)(stringSource)) {
      throw new _errors.AudioApiError('Data Blob string decoding is not currently supported.');
    }

    // input is http(s)://...
    if ((0, _paths.isRemoteSource)(stringSource)) {
      const arrayBuffer = await fetch(stringSource, fetchOptions).then(res => res.arrayBuffer());
      const buffer = await this.decoder.decodeWithMemoryBlock(new Uint8Array(arrayBuffer), sampleRate ?? 0);
      return new _AudioBuffer.default(buffer);
    }
    if (!(typeof stringSource === 'string')) {
      throw new TypeError('Input must be a module, uri or ArrayBuffer');
    }

    // Local file path
    const filePath = stringSource.startsWith('file://') ? stringSource.replace('file://', '') : stringSource;
    const buffer = await this.decoder.decodeWithFilePath(filePath, sampleRate ?? 0);
    return new _AudioBuffer.default(buffer);
  }
  static getInstance() {
    if (!AudioDecoder.instance) {
      AudioDecoder.instance = new AudioDecoder();
    }
    return AudioDecoder.instance;
  }
  async decodeAudioDataInstance(input, sampleRate, fetchOptions) {
    const audioBuffer = await this.decodeAudioDataImplementation(input, sampleRate, fetchOptions);
    if (!audioBuffer) {
      throw new _errors.AudioApiError('Failed to decode audio data.');
    }
    return audioBuffer;
  }
  async decodePCMInBase64Instance(base64String, inputSampleRate, inputChannelCount, interleaved) {
    const buffer = await this.decoder.decodeWithPCMInBase64(base64String, inputSampleRate, inputChannelCount, interleaved);
    return new _AudioBuffer.default(buffer);
  }
}
async function decodeAudioData(input, sampleRate, fetchOptions) {
  return AudioDecoder.getInstance().decodeAudioDataInstance(input, sampleRate, fetchOptions);
}
async function decodePCMInBase64(base64String, inputSampleRate, inputChannelCount, isInterleaved = true) {
  return AudioDecoder.getInstance().decodePCMInBase64Instance(base64String, inputSampleRate, inputChannelCount, isInterleaved);
}
//# sourceMappingURL=AudioDecoder.js.map