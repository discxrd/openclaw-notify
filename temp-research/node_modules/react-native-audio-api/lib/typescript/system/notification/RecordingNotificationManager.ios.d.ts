import { AudioEventSubscription } from '../../events';
import type { NotificationManager, RecordingNotificationEvent, RecordingNotificationEventName, RecordingNotificationInfo } from './types';
declare class RecordingNotificationManager implements NotificationManager<RecordingNotificationInfo, RecordingNotificationEventName> {
    private audioEventEmitter;
    constructor();
    /**
     * Show the notification with metadata or update if already visible.
     *
     * @param info - The info to be displayed.
     * @returns Promise that resolves after creating notification.
     */
    show(_info: RecordingNotificationInfo): Promise<void>;
    /**
     * Hide the notification.
     *
     * @returns Promise that resolves after hiding notification.
     */
    hide(): Promise<void>;
    /**
     * Check if the notification is currently active.
     *
     * @returns Promise that resolves to whether notification is active.
     */
    isActive(): Promise<boolean>;
    /**
     * Add an event listener for notification actions.
     *
     * @param eventName - The event name to listen for.
     * @param callback - The callback to invoke on event.
     * @returns Promise that resolves to whether notification is active.
     */
    addEventListener<T extends RecordingNotificationEventName>(eventName: T, callback: (event: RecordingNotificationEvent[T]) => void): AudioEventSubscription;
}
declare const _default: RecordingNotificationManager;
export default _default;
//# sourceMappingURL=RecordingNotificationManager.ios.d.ts.map