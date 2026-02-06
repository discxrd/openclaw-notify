import { AudioContextOptions } from '../types';
import BaseAudioContext from './BaseAudioContext';
export default class AudioContext extends BaseAudioContext {
    constructor(options?: AudioContextOptions);
    close(): Promise<void>;
    resume(): Promise<boolean>;
    suspend(): Promise<boolean>;
}
//# sourceMappingURL=AudioContext.d.ts.map