"use strict";

export function isRemoteSource(url) {
  return url.startsWith('http://') || url.startsWith('https://');
}
export function isBase64Source(data) {
  return data.startsWith('data:audio/') && data.includes(';base64,');
}
export function isDataBlobString(data) {
  return data.startsWith('blob:');
}
//# sourceMappingURL=paths.js.map