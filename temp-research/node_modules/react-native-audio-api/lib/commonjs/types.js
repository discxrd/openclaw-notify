"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IOSAudioQuality = exports.FlacCompressionLevel = exports.FileFormat = exports.FileDirectory = exports.BitDepth = void 0;
let FileDirectory = exports.FileDirectory = /*#__PURE__*/function (FileDirectory) {
  FileDirectory[FileDirectory["Document"] = 0] = "Document";
  FileDirectory[FileDirectory["Cache"] = 1] = "Cache";
  return FileDirectory;
}({});
let FileFormat = exports.FileFormat = /*#__PURE__*/function (FileFormat) {
  FileFormat[FileFormat["Wav"] = 0] = "Wav";
  FileFormat[FileFormat["Caf"] = 1] = "Caf";
  FileFormat[FileFormat["M4A"] = 2] = "M4A";
  FileFormat[FileFormat["Flac"] = 3] = "Flac";
  return FileFormat;
}({});
let IOSAudioQuality = exports.IOSAudioQuality = /*#__PURE__*/function (IOSAudioQuality) {
  IOSAudioQuality[IOSAudioQuality["Min"] = 0] = "Min";
  IOSAudioQuality[IOSAudioQuality["Low"] = 1] = "Low";
  IOSAudioQuality[IOSAudioQuality["Medium"] = 2] = "Medium";
  IOSAudioQuality[IOSAudioQuality["High"] = 3] = "High";
  IOSAudioQuality[IOSAudioQuality["Max"] = 4] = "Max";
  return IOSAudioQuality;
}({});
let BitDepth = exports.BitDepth = /*#__PURE__*/function (BitDepth) {
  BitDepth[BitDepth["Bit16"] = 0] = "Bit16";
  BitDepth[BitDepth["Bit24"] = 1] = "Bit24";
  BitDepth[BitDepth["Bit32"] = 2] = "Bit32";
  return BitDepth;
}({});
let FlacCompressionLevel = exports.FlacCompressionLevel = /*#__PURE__*/function (FlacCompressionLevel) {
  FlacCompressionLevel[FlacCompressionLevel["L0"] = 0] = "L0";
  FlacCompressionLevel[FlacCompressionLevel["L1"] = 1] = "L1";
  FlacCompressionLevel[FlacCompressionLevel["L2"] = 2] = "L2";
  FlacCompressionLevel[FlacCompressionLevel["L3"] = 3] = "L3";
  FlacCompressionLevel[FlacCompressionLevel["L4"] = 4] = "L4";
  FlacCompressionLevel[FlacCompressionLevel["L5"] = 5] = "L5";
  FlacCompressionLevel[FlacCompressionLevel["L6"] = 6] = "L6";
  FlacCompressionLevel[FlacCompressionLevel["L7"] = 7] = "L7";
  FlacCompressionLevel[FlacCompressionLevel["L8"] = 8] = "L8";
  return FlacCompressionLevel;
}({});
//# sourceMappingURL=types.js.map