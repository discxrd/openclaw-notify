import type { IAudioAPIModule, IWorkletsModule } from './ModuleInterfaces';
declare class AudioAPIModule implements IAudioAPIModule {
    supportedWorkletsVersion: never[];
    workletsModule: IWorkletsModule | null;
    canUseWorklets: boolean;
    workletsVersion: string;
    areWorkletsAvailable: boolean;
    isWorkletsVersionSupported: boolean;
    createAudioRuntime(): null;
}
declare const _default: AudioAPIModule;
export default _default;
//# sourceMappingURL=AudioAPIModule.web.d.ts.map