import notifee, {
	AndroidCategory,
	AndroidImportance,
	AndroidVisibility,
	EventType,
} from "@notifee/react-native";
import { DeviceEventEmitter } from "react-native";
import { startAudioSession, stopAudioSession } from "./AudioController";
import { startCallForeground, stopCallForeground } from "./ForegroundService";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Channel ID for incoming calls
const CALL_CHANNEL_ID = "incoming_call_channel";

// Store active call data
let activeCallData: { uuid: string; serverUrl?: string } | null = null;

// Initialize the notification channel
const initChannel = async () => {
	await notifee.createChannel({
		id: CALL_CHANNEL_ID,
		name: "Incoming Calls",
		importance: AndroidImportance.HIGH,
		visibility: AndroidVisibility.PUBLIC,
		sound: "ringtone",
		vibration: true,
	});
};

// Initialize channel on module load
initChannel();

export const displayIncomingCall = async (
	uuid: string,
	name: string,
	extraData: any = {},
) => {
	activeCallData = { uuid, serverUrl: extraData.serverUrl };

	await notifee.displayNotification({
		id: uuid,
		title: "Incoming Call",
		body: name,
		android: {
			channelId: CALL_CHANNEL_ID,
			category: AndroidCategory.CALL,
			importance: AndroidImportance.HIGH,
			visibility: AndroidVisibility.PUBLIC,
			fullScreenAction: {
				id: "default",
			},
			pressAction: {
				id: "default",
			},
			actions: [
				{
					title: "Answer",
					pressAction: { id: "answer" },
				},
				{
					title: "Decline",
					pressAction: { id: "decline" },
				},
			],
			ongoing: true,
			autoCancel: false,
			timeoutAfter: 30000,
		},
	});
};

// Handle notification events
notifee.onForegroundEvent(async ({ type, detail }) => {
	if (type === EventType.ACTION_PRESS) {
		await handleAction(detail.pressAction?.id, detail.notification?.id);
	}
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
	if (type === EventType.ACTION_PRESS) {
		await handleAction(detail.pressAction?.id, detail.notification?.id);
	}
});

const handleAction = async (
	actionId: string | undefined,
	notificationId: string | undefined,
) => {
	if (!actionId || !notificationId) return;

	if (actionId === "answer") {
		console.log("Call answered");

		// Dismiss the notification
		await notifee.cancelNotification(notificationId);

		// Start Foreground Service (Mic Safety)
		startCallForeground();

		// Get server URL
		let serverUrl = activeCallData?.serverUrl;

		if (!serverUrl) {
			try {
				const storedUrl = await AsyncStorage.getItem("server_url");
				if (storedUrl) {
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

		DeviceEventEmitter.emit("call_answered", { uuid: activeCallData?.uuid });
	} else if (actionId === "decline") {
		console.log("Call declined");
		await notifee.cancelNotification(notificationId);
		activeCallData = null;
		DeviceEventEmitter.emit("call_ended");
	}
};

// Export a function to end call programmatically
export const endCall = async () => {
	if (activeCallData?.uuid) {
		await notifee.cancelNotification(activeCallData.uuid);
	}
	stopAudioSession();
	stopCallForeground();
	activeCallData = null;
	DeviceEventEmitter.emit("call_ended");
};
