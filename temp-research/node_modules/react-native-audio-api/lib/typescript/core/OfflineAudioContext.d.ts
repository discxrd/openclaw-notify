import { OfflineAudioContextOptions } from '../types';
import AudioBuffer from './AudioBuffer';
import BaseAudioContext from './BaseAudioContext';
export default class OfflineAudioContext extends BaseAudioContext {
    private isSuspended;
    private isRendering;
    private duration;
    constructor(options: OfflineAudioContextOptions);
    constructor(numberOfChannels: number, length: number, sampleRate: number);
    resume(): Promise<undefined>;
    suspend(suspendTime: number): Promise<undefined>;
    startRendering(): Promise<AudioBuffer>;
}
//# sourceMappingURL=OfflineAudioContext.d.ts.map