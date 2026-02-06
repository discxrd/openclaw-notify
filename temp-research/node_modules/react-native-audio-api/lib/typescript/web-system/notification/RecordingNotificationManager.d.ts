import type { AudioEventSubscription } from '../../events';
import type { NotificationEvents, NotificationManager, RecordingNotificationEventName, RecordingNotificationInfo } from '../../system';
declare class RecordingNotificationManager implements NotificationManager<RecordingNotificationInfo, RecordingNotificationEventName> {
    private isRegistered_;
    private isShown_;
    constructor();
    show(info: RecordingNotificationInfo): Promise<void>;
    hide(): Promise<void>;
    isActive(): Promise<boolean>;
    isRegistered(): boolean;
    addEventListener<T extends RecordingNotificationEventName>(eventName: T, callback: (event: NotificationEvents[T]) => void): AudioEventSubscription;
}
declare const _default: RecordingNotificationManager;
export default _default;
//# sourceMappingURL=RecordingNotificationManager.d.ts.map