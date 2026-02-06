"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isBase64Source = isBase64Source;
exports.isDataBlobString = isDataBlobString;
exports.isRemoteSource = isRemoteSource;
function isRemoteSource(url) {
  return url.startsWith('http://') || url.startsWith('https://');
}
function isBase64Source(data) {
  return data.startsWith('data:audio/') && data.includes(';base64,');
}
function isDataBlobString(data) {
  return data.startsWith('blob:');
}
//# sourceMappingURL=paths.js.map