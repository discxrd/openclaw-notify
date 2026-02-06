import type { ShareableWorkletCallback } from '../interfaces';
export interface WorkletRuntime {
    __hostObjectWorkletRuntime: never;
    readonly name: string;
}
export interface IWorkletsModule {
    makeShareableCloneRecursive: (workletCallback: ShareableWorkletCallback) => ShareableWorkletCallback;
    createWorkletRuntime: (runtimeName: string) => WorkletRuntime;
}
export interface IAudioAPIModule {
    get workletsModule(): IWorkletsModule | null;
    get canUseWorklets(): boolean;
    get workletsVersion(): string;
    get areWorkletsAvailable(): boolean;
    get isWorkletsVersionSupported(): boolean;
    createAudioRuntime(): WorkletRuntime | null;
}
//# sourceMappingURL=ModuleInterfaces.d.ts.map