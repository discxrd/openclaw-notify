"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _types = require("../types");
const LowQuality = {
  sampleRate: 22050,
  bitRate: 48000,
  bitDepth: _types.BitDepth.Bit16,
  flacCompressionLevel: _types.FlacCompressionLevel.L0,
  iosQuality: _types.IOSAudioQuality.Low
};
const MediumQuality = {
  sampleRate: 44100,
  bitRate: 128000,
  bitDepth: _types.BitDepth.Bit16,
  flacCompressionLevel: _types.FlacCompressionLevel.L3,
  iosQuality: _types.IOSAudioQuality.Medium
};
const HighQuality = {
  sampleRate: 48000,
  bitRate: 192000,
  bitDepth: _types.BitDepth.Bit24,
  flacCompressionLevel: _types.FlacCompressionLevel.L5,
  iosQuality: _types.IOSAudioQuality.High
};
const LosslessQuality = {
  sampleRate: 48000,
  bitRate: 320000,
  bitDepth: _types.BitDepth.Bit24,
  flacCompressionLevel: _types.FlacCompressionLevel.L8,
  iosQuality: _types.IOSAudioQuality.High
};
const FilePreset = {
  Low: LowQuality,
  Medium: MediumQuality,
  High: HighQuality,
  Lossless: LosslessQuality
};
var _default = exports.default = FilePreset;
//# sourceMappingURL=filePresets.js.map