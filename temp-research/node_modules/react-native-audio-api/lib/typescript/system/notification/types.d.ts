import type { AudioEventSubscription } from '../../events';
import { EventEmptyType, EventTypeWithValue } from '../../events/types';
export interface NotificationManager<TShowOptions, TEventName extends NotificationEventName> {
    show(options: TShowOptions): Promise<void>;
    hide(): Promise<void>;
    isActive(): Promise<boolean>;
    addEventListener<T extends TEventName>(eventName: T, callback: NotificationCallback<T>): AudioEventSubscription | undefined;
}
export interface PlaybackNotificationInfo {
    title?: string;
    artist?: string;
    album?: string;
    artwork?: string | {
        uri: string;
    };
    androidSmallIcon?: string | {
        uri: string;
    };
    duration?: number;
    elapsedTime?: number;
    speed?: number;
    state?: 'playing' | 'paused';
}
export type PlaybackControlName = 'play' | 'pause' | 'next' | 'previous' | 'skipForward' | 'skipBackward' | 'seekTo';
interface PlaybackNotificationEvent {
    playbackNotificationPlay: EventEmptyType;
    playbackNotificationPause: EventEmptyType;
    playbackNotificationNext: EventEmptyType;
    playbackNotificationPrevious: EventEmptyType;
    playbackNotificationSkipForward: EventTypeWithValue;
    playbackNotificationSkipBackward: EventTypeWithValue;
    playbackNotificationSeekTo: EventTypeWithValue;
    playbackNotificationDismissed: EventEmptyType;
}
export interface RecordingNotificationInfo {
    title?: string;
    contentText?: string;
    paused?: boolean;
    smallIconResourceName?: string;
    largeIconResourceName?: string;
    pauseIconResourceName?: string;
    resumeIconResourceName?: string;
    color?: number;
}
export interface RecordingNotificationEvent {
    recordingNotificationPause: EventEmptyType;
    recordingNotificationResume: EventEmptyType;
}
export type PlaybackNotificationEventName = keyof PlaybackNotificationEvent;
export type RecordingNotificationEventName = keyof RecordingNotificationEvent;
export type NotificationEvents = PlaybackNotificationEvent & RecordingNotificationEvent;
export type NotificationEventName = keyof NotificationEvents;
export type NotificationCallback<Name extends NotificationEventName> = (event: NotificationEvents[Name]) => void;
export {};
//# sourceMappingURL=types.d.ts.map