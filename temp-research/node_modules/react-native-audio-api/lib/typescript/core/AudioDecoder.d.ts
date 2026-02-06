import { DecodeDataInput } from '../types';
import AudioBuffer from './AudioBuffer';
export declare function decodeAudioData(input: DecodeDataInput, sampleRate?: number, fetchOptions?: RequestInit): Promise<AudioBuffer>;
export declare function decodePCMInBase64(base64String: string, inputSampleRate: number, inputChannelCount: number, isInterleaved?: boolean): Promise<AudioBuffer>;
//# sourceMappingURL=AudioDecoder.d.ts.map