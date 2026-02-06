import RNIncomingCall from "react-native-full-screen-notification-incoming-call";
import { DeviceEventEmitter } from "react-native";
import { startAudioSession, stopAudioSession } from "./AudioController";
import { startCallForeground, stopCallForeground } from "./ForegroundService";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Cast to any to avoid missing type definition errors
const IncomingCall = RNIncomingCall as any;

export const displayIncomingCall = (
	uuid: string,
	name: string,
	extraData: any = {},
) => {
	IncomingCall.display({
		uuid,
		name,
		avatar: "https://via.placeholder.com/100",
		info: "OpenClaw Agent",
		timeout: 30000,
		...extraData,
	});
};

// Listen for actions
IncomingCall.addEventListener("answer", async (payload: any) => {
	console.log("Call answered", payload);
	IncomingCall.dismiss();

	// Start Foreground Service (Mic Safety)
	startCallForeground();

	// Connect to Bridge
	let serverUrl = payload?.serverUrl;

	if (!serverUrl) {
		try {
			const storedUrl = await AsyncStorage.getItem("server_url");
			if (storedUrl) {
				// Convert http/https to ws/wss
				serverUrl = storedUrl
					.replace(/^http:/, "ws:")
					.replace(/^https:/, "wss:");
			}
		} catch (error) {
			console.error("Failed to retrieve server URL:", error);
		}
	}

	// Fallback
	if (!serverUrl) {
		serverUrl = "ws://10.0.2.2:3000";
	}

	console.log("Connecting to Audio Bridge:", serverUrl);
	startAudioSession(serverUrl);

	DeviceEventEmitter.emit("call_answered", payload);
});

IncomingCall.addEventListener("endCall", () => {
	console.log("Call ended");
	stopAudioSession();
	stopCallForeground();
	IncomingCall.dismiss();
	DeviceEventEmitter.emit("call_ended");
});
