import type { WorkletRuntime, IAudioAPIModule, IWorkletsModule } from './ModuleInterfaces';
declare class AudioAPIModule implements IAudioAPIModule {
    #private;
    supportedWorkletsVersion: string[];
    constructor();
    get workletsModule(): IWorkletsModule | null;
    /**
     * Indicates whether react-native-worklets are installed in matching version,
     * for usage with react-native-audio-api.
     */
    get canUseWorklets(): boolean;
    /** Returns the installed worklets version or 'unknown'. */
    get workletsVersion(): string;
    /**
     * Indicates whether react-native-worklets are installed, regardless of
     * version support. Useful for asserting compatibility.
     */
    get areWorkletsAvailable(): boolean;
    /**
     * Indicates whether the installed react-native-worklets version is supported.
     * Useful for asserting compatibility.
     */
    get isWorkletsVersionSupported(): boolean;
    createAudioRuntime(): WorkletRuntime | null;
}
declare const _default: AudioAPIModule;
export default _default;
//# sourceMappingURL=AudioAPIModule.d.ts.map