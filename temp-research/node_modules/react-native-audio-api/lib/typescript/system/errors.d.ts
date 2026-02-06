import { AudioApiError } from '../errors';
export interface NativeActivationErrorMetadata {
    nativeDesc: string;
    nativeCode: number;
    nativeDomain: string;
}
export declare class SessionActivationError extends AudioApiError {
    nativeErrorInfo?: NativeActivationErrorMetadata;
    constructor(nativeErrorInfo?: NativeActivationErrorMetadata);
}
export declare function parseNativeError(error: unknown): SessionActivationError;
//# sourceMappingURL=errors.d.ts.map