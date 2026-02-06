import type { IAudioManager, PermissionStatus } from '../system/types';
declare class AudioManager implements IAudioManager {
    getDevicePreferredSampleRate: () => number;
    setAudioSessionActivity: () => Promise<boolean>;
    setAudioSessionOptions: () => {};
    disableSessionManagement: () => {};
    observeAudioInterruptions: () => boolean;
    activelyReclaimSession: () => {};
    observeVolumeChanges: () => {};
    addSystemEventListener: () => undefined;
    requestRecordingPermissions: () => Promise<PermissionStatus>;
    checkRecordingPermissions: () => Promise<PermissionStatus>;
    requestNotificationPermissions: () => Promise<PermissionStatus>;
    checkNotificationPermissions: () => Promise<PermissionStatus>;
    setInputDevice: () => Promise<boolean>;
    getDevicesInfo: () => Promise<{
        availableInputs: never[];
        availableOutputs: never[];
        currentInputs: never[];
        currentOutputs: never[];
    }>;
}
declare const _default: AudioManager;
export default _default;
//# sourceMappingURL=AudioManager.d.ts.map