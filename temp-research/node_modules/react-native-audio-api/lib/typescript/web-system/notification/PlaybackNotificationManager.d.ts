import type { AudioEventSubscription } from '../../events';
import type { NotificationEvents, NotificationManager, PlaybackControlName, PlaybackNotificationEventName, PlaybackNotificationInfo } from '../../system';
declare class PlaybackNotificationManager implements NotificationManager<PlaybackNotificationInfo, PlaybackNotificationEventName> {
    private isRegistered_;
    private isShown_;
    constructor();
    register(): Promise<void>;
    show(info: PlaybackNotificationInfo): Promise<void>;
    update(info: PlaybackNotificationInfo): Promise<void>;
    hide(): Promise<void>;
    unregister(): Promise<void>;
    enableControl(control: PlaybackControlName, enabled: boolean): Promise<void>;
    isActive(): Promise<boolean>;
    isRegistered(): boolean;
    addEventListener<T extends PlaybackNotificationEventName>(eventName: T, callback: (event: NotificationEvents[T]) => void): AudioEventSubscription;
}
declare const _default: PlaybackNotificationManager;
export default _default;
//# sourceMappingURL=PlaybackNotificationManager.d.ts.map