import LiveAudioStream from "react-native-live-audio-stream";
import { Audio } from "expo-av";

let ws: WebSocket | null = null;

const inputOptions = {
	sampleRate: 16000,
	channels: 1,
	bitsPerSample: 16,
	audioSource: 6, // VOICE_RECOGNITION
	bufferSize: 4096,
};

const createWavHeader = (dataLength: number): Uint8Array => {
	const header = new ArrayBuffer(44);
	const view = new DataView(header);

	// RIFF identifier
	view.setUint8(0, "R".charCodeAt(0));
	view.setUint8(1, "I".charCodeAt(0));
	view.setUint8(2, "F".charCodeAt(0));
	view.setUint8(3, "F".charCodeAt(0));
	// RIFF chunk length
	view.setUint32(4, 36 + dataLength, true);
	// RIFF type
	view.setUint8(8, "W".charCodeAt(0));
	view.setUint8(9, "A".charCodeAt(0));
	view.setUint8(10, "V".charCodeAt(0));
	view.setUint8(11, "E".charCodeAt(0));
	// format chunk identifier
	view.setUint8(12, "f".charCodeAt(0));
	view.setUint8(13, "m".charCodeAt(0));
	view.setUint8(14, "t".charCodeAt(0));
	view.setUint8(15, " ".charCodeAt(0));
	// format chunk length
	view.setUint32(16, 16, true);
	// sample format (1 is PCM)
	view.setUint16(20, 1, true);
	// channel count
	view.setUint16(22, 1, true);
	// sample rate
	view.setUint32(24, 24000, true);
	// byte rate (sample rate * block align)
	view.setUint32(28, 24000 * 2, true);
	// block align (channel count * bytes per sample)
	view.setUint16(32, 2, true);
	// bits per sample
	view.setUint16(34, 16, true);
	// data chunk identifier
	view.setUint8(36, "d".charCodeAt(0));
	view.setUint8(37, "a".charCodeAt(0));
	view.setUint8(38, "t".charCodeAt(0));
	view.setUint8(39, "a".charCodeAt(0));
	// data chunk length
	view.setUint32(40, dataLength, true);

	return new Uint8Array(header);
};

// Convert base64 to Uint8Array
const base64ToUint8Array = (base64: string): Uint8Array => {
	const binaryString = atob(base64);
	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}
	return bytes;
};

// Convert Uint8Array to base64
const uint8ArrayToBase64 = (array: Uint8Array): string => {
	let binary = "";
	const len = array.byteLength;
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(array[i]);
	}
	return btoa(binary);
};

export const startSession = async (serverUrl: string) => {
	console.log("Starting audio session with:", serverUrl);

	try {
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: true,
			playsInSilentModeIOS: true,
			staysActiveInBackground: true,
			shouldDuckAndroid: true,
			playThroughEarpieceAndroid: false,
		});
	} catch (e) {
		console.error("Error setting audio mode:", e);
	}

	ws = new WebSocket(serverUrl);

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

	// 2. Server -> Speaker (using expo-av)
	ws.onmessage = async (event) => {
		try {
			const { type, payload } = JSON.parse(event.data);
			if (type === "audio") {
				const pcmData = base64ToUint8Array(payload);
				const wavHeader = createWavHeader(pcmData.length);
				const wavData = new Uint8Array(wavHeader.length + pcmData.length);
				wavData.set(wavHeader);
				wavData.set(pcmData, wavHeader.length);

				const base64Wav = uint8ArrayToBase64(wavData);
				const uri = `data:audio/wav;base64,${base64Wav}`;

				const { sound } = await Audio.Sound.createAsync(
					{ uri },
					{ shouldPlay: true },
				);

				// Clean up sound after it finishes playing
				sound.setOnPlaybackStatusUpdate((status) => {
					if (status.isLoaded && status.didJustFinish) {
						sound.unloadAsync();
					}
				});
			} else if (type === "error") {
				console.error("Server error:", payload);
			}
		} catch (e) {
			console.error("Error parsing message from server:", e);
		}
	};

	ws.onclose = () => {
		console.log("WebSocket closed");
		stopSession();
	};
};

export const stopSession = () => {
	console.log("Stopping audio session");
	LiveAudioStream.stop();
	ws?.close();
	ws = null;
};
