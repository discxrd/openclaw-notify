"use strict";

import { BitDepth, FlacCompressionLevel, IOSAudioQuality } from "../types.js";
const LowQuality = {
  sampleRate: 22050,
  bitRate: 48000,
  bitDepth: BitDepth.Bit16,
  flacCompressionLevel: FlacCompressionLevel.L0,
  iosQuality: IOSAudioQuality.Low
};
const MediumQuality = {
  sampleRate: 44100,
  bitRate: 128000,
  bitDepth: BitDepth.Bit16,
  flacCompressionLevel: FlacCompressionLevel.L3,
  iosQuality: IOSAudioQuality.Medium
};
const HighQuality = {
  sampleRate: 48000,
  bitRate: 192000,
  bitDepth: BitDepth.Bit24,
  flacCompressionLevel: FlacCompressionLevel.L5,
  iosQuality: IOSAudioQuality.High
};
const LosslessQuality = {
  sampleRate: 48000,
  bitRate: 320000,
  bitDepth: BitDepth.Bit24,
  flacCompressionLevel: FlacCompressionLevel.L8,
  iosQuality: IOSAudioQuality.High
};
const FilePreset = {
  Low: LowQuality,
  Medium: MediumQuality,
  High: HighQuality,
  Lossless: LosslessQuality
};
export default FilePreset;
//# sourceMappingURL=filePresets.js.map