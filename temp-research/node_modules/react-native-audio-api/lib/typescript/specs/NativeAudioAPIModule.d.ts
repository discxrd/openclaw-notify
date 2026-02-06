import type { TurboModule } from 'react-native';
import { AudioDevicesInfo, PermissionStatus } from '../system/types';
type OptionsMap = {
    [key: string]: string | boolean | number | undefined;
};
type NotificationOpResponse = {
    success: boolean;
    error?: string;
};
type NotificationType = 'playback' | 'recording' | 'simple';
interface Spec extends TurboModule {
    install(): boolean;
    getDevicePreferredSampleRate(): number;
    setAudioSessionActivity(enabled: boolean): Promise<boolean>;
    setAudioSessionOptions(category: string, mode: string, options: Array<string>, allowHaptics: boolean): void;
    disableSessionManagement(): void;
    observeAudioInterruptions(enabled: boolean): void;
    activelyReclaimSession(enabled: boolean): void;
    observeVolumeChanges(enabled: boolean): void;
    requestRecordingPermissions(): Promise<PermissionStatus>;
    checkRecordingPermissions(): Promise<PermissionStatus>;
    requestNotificationPermissions(): Promise<PermissionStatus>;
    checkNotificationPermissions(): Promise<PermissionStatus>;
    getDevicesInfo(): Promise<AudioDevicesInfo>;
    setInputDevice(deviceId: string): Promise<boolean>;
    showNotification(type: NotificationType, key: string, options: OptionsMap): Promise<NotificationOpResponse>;
    hideNotification(key: string): Promise<NotificationOpResponse>;
    isNotificationActive(key: string): Promise<boolean>;
}
declare const NativeAudioAPIModule: Spec;
export { NativeAudioAPIModule };
//# sourceMappingURL=NativeAudioAPIModule.d.ts.map