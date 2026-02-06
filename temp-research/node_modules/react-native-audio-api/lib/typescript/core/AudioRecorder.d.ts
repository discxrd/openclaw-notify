import { AudioEventEmitter, AudioEventSubscription } from '../events';
import { OnAudioReadyEventType, OnRecorderErrorEventType } from '../events/types';
import { IAudioRecorder } from '../interfaces';
import { AudioRecorderCallbackOptions, AudioRecorderFileOptions, AudioRecorderStartOptions, FileInfo, Result } from '../types';
import RecorderAdapterNode from './RecorderAdapterNode';
export default class AudioRecorder {
    protected onAudioReadySubscription: AudioEventSubscription | null;
    protected onErrorSubscription: AudioEventSubscription | null;
    protected readonly recorder: IAudioRecorder;
    protected options_: AudioRecorderFileOptions | null;
    private isFileOutputEnabled;
    protected readonly audioEventEmitter: AudioEventEmitter;
    constructor();
    enableFileOutput(options?: Omit<AudioRecorderFileOptions, 'batchDurationSeconds'>): Result<{
        path: string;
    }>;
    get options(): AudioRecorderFileOptions | null;
    disableFileOutput(): void;
    /** Starts the audio recording process with configured output options */
    start(options?: AudioRecorderStartOptions): Result<{
        path: string;
    }>;
    /** Stops the audio recording process and releases internal resources */
    stop(): Result<FileInfo>;
    /** Pauses the audio recording process without tearing down anything */
    pause(): void;
    /** Resumes the audio recording process after being paused */
    resume(): void;
    /**
     * Connects a {@link RecorderAdapterNode} to the recorder’s audio graph.
     *
     * Each node can only be connected once. Attempting to connect a node multiple
     * times will throw an error.
     *
     * @param node - The adapter node to connect to the recorder.
     * @throws If the node has already been connected.
     */
    connect(node: RecorderAdapterNode): void;
    /**
     * Disconnects the recorder from all connected adapter nodes.
     *
     * After calling this method, any connected {@link RecorderAdapterNode} will no
     * longer receive audio data until reconnected.
     */
    disconnect(): void;
    /**
     * Registers a callback to receive raw audio data during an active recording
     * session.
     *
     * The callback is periodically invoked with audio buffers that match the
     * preferred configuration provided in `options`. These parameters (sample
     * rate, buffer length, and channel count) guide how audio data is chunked and
     * delivered, though the exact values may vary depending on device
     * capabilities. Values may vary depending on device capabilities.
     *
     * @param options - Preferred configuration for the audio buffers delivered to
     *   the callback.
     * @param callback - Function invoked each time a new audio buffer is
     *   available. The callback receives an {@link OnAudioReadyEventType} object
     *   containing the audio data and associated metadata.
     */
    onAudioReady(options: AudioRecorderCallbackOptions, callback: (event: OnAudioReadyEventType) => void): Result<void>;
    /**
     * Removes the previously registered audio data callback, if any.
     *
     * This stops further `onAudioReady` events from being delivered during
     * recording. Calling this method is safe even if no callback is currently
     * registered.
     */
    clearOnAudioReady(): void;
    isRecording(): boolean;
    isPaused(): boolean;
    getCurrentDuration(): number;
    onError(callback: (error: OnRecorderErrorEventType) => void): void;
    clearOnError(): void;
}
//# sourceMappingURL=AudioRecorder.d.ts.map