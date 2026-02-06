"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SessionActivationError = void 0;
exports.parseNativeError = parseNativeError;
var _errors = require("../errors");
function parseNativeCode(code) {
  switch (code) {
    case 0:
      return 'NoError';
    case -50:
      return 'BadParam';
    case 1836282486:
      return 'MediaServicesFailed';
    case 560030580:
      return 'IsBusy';
    case 560161140:
      return 'IncompatibleCategory';
    case 560557684:
      return 'CannotInterruptOthers';
    case 1701737535:
      return 'MissingEntitlement';
    case 1936290409:
      return 'SiriIsRecording';
    case 561015905:
      return 'CannotStartPlaying';
    case 561145187:
      return 'CannotStartRecording';
    case 561017449:
      return 'InsufficientPriority';
    case 561145203:
      return 'ResourceNotAvailable';
    case 2003329396:
      return 'Unspecified';
    case 561210739:
      return 'ExpiredSession';
    case 1768841571:
      return 'SessionNotActive';
    default:
      return 'NoError';
  }
}
class SessionActivationError extends _errors.AudioApiError {
  constructor(nativeErrorInfo) {
    if (!nativeErrorInfo) {
      super('Failed to activate audio session with unknown error');
      this.name = 'SessionActivationError';
      return;
    }
    const codeName = parseNativeCode(nativeErrorInfo.nativeCode);
    super(`[${codeName}] Failed to activate audio session, code: ${nativeErrorInfo.nativeCode}`);
    this.name = 'SessionActivationError';
    this.nativeErrorInfo = nativeErrorInfo;
  }
}
exports.SessionActivationError = SessionActivationError;
function parseNativeError(error) {
  const errorMeta = error?.userInfo?.meta ?? error?.nativeError?.userInfo?.meta ?? error?.details?.meta;
  console.log('Parsed error meta:', errorMeta);
  if (!errorMeta || typeof errorMeta !== 'object') {
    return new SessionActivationError();
  }
  const {
    nativeCode,
    nativeDesc,
    nativeDomain
  } = errorMeta;
  if (isNaN(nativeCode) || !nativeDesc || !nativeDomain) {
    return new SessionActivationError();
  }
  return new SessionActivationError({
    nativeCode,
    nativeDesc,
    nativeDomain
  });
}
//# sourceMappingURL=errors.js.map