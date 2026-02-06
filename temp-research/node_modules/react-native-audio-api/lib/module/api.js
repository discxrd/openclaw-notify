"use strict";

import "./AudioAPIModule/index.js";
export { default as AnalyserNode } from "./core/AnalyserNode.js";
export { default as AudioBuffer } from "./core/AudioBuffer.js";
export { default as AudioBufferQueueSourceNode } from "./core/AudioBufferQueueSourceNode.js";
export { default as AudioBufferSourceNode } from "./core/AudioBufferSourceNode.js";
export { default as AudioContext } from "./core/AudioContext.js";
export { decodeAudioData, decodePCMInBase64 } from "./core/AudioDecoder.js";
export { default as AudioDestinationNode } from "./core/AudioDestinationNode.js";
export { default as AudioNode } from "./core/AudioNode.js";
export { default as AudioParam } from "./core/AudioParam.js";
export { default as AudioRecorder } from "./core/AudioRecorder.js";
export { default as AudioScheduledSourceNode } from "./core/AudioScheduledSourceNode.js";
export { default as changePlaybackSpeed } from "./core/AudioStretcher.js";
export { default as BaseAudioContext } from "./core/BaseAudioContext.js";
export { default as BiquadFilterNode } from "./core/BiquadFilterNode.js";
export { default as ConstantSourceNode } from "./core/ConstantSourceNode.js";
export { default as ConvolverNode } from "./core/ConvolverNode.js";
export { default as DelayNode } from "./core/DelayNode.js";
export { default as GainNode } from "./core/GainNode.js";
export { default as OfflineAudioContext } from "./core/OfflineAudioContext.js";
export { default as OscillatorNode } from "./core/OscillatorNode.js";
export { default as PeriodicWave } from "./core/PeriodicWave.js";
export { default as RecorderAdapterNode } from "./core/RecorderAdapterNode.js";
export { default as StereoPannerNode } from "./core/StereoPannerNode.js";
export { default as StreamerNode } from "./core/StreamerNode.js";
export { default as WaveShaperNode } from "./core/WaveShaperNode.js";
export { default as WorkletNode } from "./core/WorkletNode.js";
export { default as WorkletProcessingNode } from "./core/WorkletProcessingNode.js";
export { default as WorkletSourceNode } from "./core/WorkletSourceNode.js";
export { default as AudioManager } from "./system/index.js";
export * from "./errors/index.js";
export * from "./system/types.js";
export * from "./types.js";
export { default as FilePreset } from "./utils/filePresets.js";

// Notification System
export { PlaybackNotificationManager, RecordingNotificationManager } from "./system/notification/index.js";
export { NotificationManager, PlaybackControlName, PlaybackNotificationEventName, PlaybackNotificationInfo } from "./system/notification/index.js";
//# sourceMappingURL=api.js.map