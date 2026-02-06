import LiveAudioStream from "react-native-live-audio-stream";
import PCMPlayer from "react-native-pcm-player";

let ws: WebSocket | null = null;

const inputOptions = {
	sampleRate: 16000,
	channels: 1,
	bitsPerSample: 16,
	audioSource: 6, // VOICE_RECOGNITION
	bufferSize: 4096,
};

export const startAudioSession = (serverUrl: string) => {
	console.log("Starting audio session with:", serverUrl);
	ws = new WebSocket(serverUrl);

	PCMPlayer.init({
		sampleRate: 24000,
		channelConfig: "MONO",
		audioFormat: "ENCODING_PCM_16BIT",
	});

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

	// 2. Server -> Speaker
	ws.onmessage = (event) => {
		try {
			const { type, payload } = JSON.parse(event.data);
			if (type === "audio") {
				PCMPlayer.play(payload);
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
	ws?.close();
	ws = null;
};
