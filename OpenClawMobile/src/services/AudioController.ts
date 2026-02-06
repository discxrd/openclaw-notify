import LiveAudioStream from "react-native-live-audio-stream";
import { AudioContext } from "react-native-audio-api";

let ws: WebSocket | null = null;
let audioContext: AudioContext | null = null;

const inputOptions = {
	sampleRate: 16000,
	channels: 1,
	bitsPerSample: 16,
	audioSource: 6, // VOICE_RECOGNITION
	bufferSize: 4096,
};

// Decode base64 PCM to Float32Array
const decodeBase64PCM = (base64: string): Float32Array => {
	const binaryString = atob(base64);
	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}
	const int16Array = new Int16Array(bytes.buffer);
	const float32Array = new Float32Array(int16Array.length);
	for (let i = 0; i < int16Array.length; i++) {
		float32Array[i] = int16Array[i] / 32768.0;
	}
	return float32Array;
};

export const startAudioSession = (serverUrl: string) => {
	console.log("Starting audio session with:", serverUrl);
	ws = new WebSocket(serverUrl);

	// Initialize Web Audio API context
	audioContext = new AudioContext({ sampleRate: 24000 });

	LiveAudioStream.init(inputOptions);

	ws.onopen = () => {
		console.log("WebSocket connected, starting mic");
		LiveAudioStream.start();
	};

	ws.onerror = (e) => {
		console.error("WebSocket Error:", e);
	};

	// 1. Mic -> Server
	LiveAudioStream.on("data", (base64Audio: string) => {
		if (ws && ws.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify({ type: "audio", payload: base64Audio }));
		}
	});

	// 2. Server -> Speaker (using Web Audio API)
	ws.onmessage = (event) => {
		try {
			const { type, payload } = JSON.parse(event.data);
			if (type === "audio" && audioContext) {
				const pcmData = decodeBase64PCM(payload);
				const buffer = audioContext.createBuffer(1, pcmData.length, 24000);
				buffer.getChannelData(0).set(pcmData);

				const source = audioContext.createBufferSource();
				source.buffer = buffer;
				source.connect(audioContext.destination);
				source.start();
			} else if (type === "error") {
				console.error("Server error:", payload);
			}
		} catch (e) {
			console.error("Error parsing message from server:", e);
		}
	};

	ws.onclose = () => {
		console.log("WebSocket closed");
		stopAudioSession();
	};
};

export const stopAudioSession = () => {
	console.log("Stopping audio session");
	LiveAudioStream.stop();
	audioContext?.close();
	audioContext = null;
	ws?.close();
	ws = null;
};
