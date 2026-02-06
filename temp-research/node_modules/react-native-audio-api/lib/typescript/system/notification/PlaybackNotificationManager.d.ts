import { AudioEventSubscription } from '../../events';
import type { NotificationEvents, NotificationManager, PlaybackControlName, PlaybackNotificationEventName, PlaybackNotificationInfo } from './types';
declare class PlaybackNotificationManager implements NotificationManager<PlaybackNotificationInfo, PlaybackNotificationEventName> {
    private notificationKey;
    private audioEventEmitter;
    constructor();
    /**
     * Show the notification with metadata or update if already visible.
     * Automatically creates the notification on first call.
     *
     * @param info - The info to be displayed.
     * @returns Promise that resolves after creating notification.
     */
    show(info: PlaybackNotificationInfo): Promise<void>;
    /**
     * Hide the notification.
     *
     * @returns Promise that resolves after hiding notification.
     */
    hide(): Promise<void>;
    /**
     * Enable or disable a specific playback control.
     *
     * @param control - The control to enable or disable on the notification.
     * @param enabled - Whether to enable (true) or disable (false) the control.
     * @returns Promise that resolves after showing modified notification.
     */
    enableControl(control: PlaybackControlName, enabled: boolean): Promise<void>;
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
     * @returns Class that represents the subscription.
     */
    addEventListener<T extends PlaybackNotificationEventName>(eventName: T, callback: (event: NotificationEvents[T]) => void): AudioEventSubscription;
}
declare const _default: PlaybackNotificationManager;
export default _default;
//# sourceMappingURL=PlaybackNotificationManager.d.ts.map